import { useState, useCallback } from 'react';

const API_BASE = '/api/story';

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = useCallback(async (prompt) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Image generation failed');
      }

      const { image } = await response.json();
      setIsGenerating(false);
      return image;
    } catch (err) {
      console.error('Image generation error:', err);
      setError(err.message || 'Image generation failed');
      setIsGenerating(false);
      return null;
    }
  }, []);

  return { generateImage, isGenerating, error, setError };
}

// Hook for generating multiple images sequentially
export function useStoryImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: '' });
  const [error, setError] = useState(null);

  const generateStoryImages = useCallback(async (pages, storySpec, characterDesign) => {
    setIsGenerating(true);
    setError(null);
    setProgress({ current: 0, total: pages.length, status: 'Starting...' });

    const results = [];

    try {
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        setProgress({
          current: i,
          total: pages.length,
          status: `Painting page ${i + 1} of ${pages.length}...`,
        });

        const finalPrompt = buildFinalImagePrompt(
          page.imagePrompt,
          storySpec,
          characterDesign
        );

        let imageSrc = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (!imageSrc && attempts < maxAttempts) {
          try {
            const response = await fetch(`${API_BASE}/generate-image`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: finalPrompt }),
            });

            if (!response.ok) {
              throw new Error('Image generation failed');
            }

            const { image } = await response.json();
            imageSrc = image;
          } catch (err) {
            attempts++;
            console.warn(`Page ${page.pageNumber} attempt ${attempts} failed:`, err);
            if (attempts >= maxAttempts) {
              imageSrc = null;
            }
          }
        }

        results.push({
          pageNumber: page.pageNumber,
          imageSrc,
          prompt: finalPrompt,
          failed: !imageSrc,
        });

        // Small delay between generations to avoid rate limits
        if (i < pages.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      setProgress({
        current: pages.length,
        total: pages.length,
        status: 'All done!',
      });
      setIsGenerating(false);
      return results;
    } catch (err) {
      console.error('Story image generation error:', err);
      setError(err.message || 'Failed to generate images');
      setIsGenerating(false);
      return results;
    }
  }, []);

  const regenerateImage = useCallback(async (page, storySpec, characterDesign) => {
    const finalPrompt = buildFinalImagePrompt(
      page.imagePrompt,
      storySpec,
      characterDesign
    );

    try {
      const response = await fetch(`${API_BASE}/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      if (!response.ok) {
        throw new Error('Image regeneration failed');
      }

      const { image } = await response.json();
      return { ...page, imageSrc: image, failed: false };
    } catch (err) {
      console.error('Image regeneration failed:', err);
      throw err;
    }
  }, []);

  return {
    generateStoryImages,
    regenerateImage,
    isGenerating,
    progress,
    error,
  };
}

// Build the final image prompt with style directives
function buildFinalImagePrompt(rawPrompt, storySpec, characterDesign) {
  const styleDirectives = {
    watercolor:
      "soft watercolor children's book illustration, gentle brushstrokes, delicate washes of color, dreamy and ethereal",
    cartoon:
      "bright bold cartoon illustration for children, clean lines, vibrant flat colors, playful and energetic",
    storybook:
      "classic warm painterly children's book illustration in the style of a Golden Book, rich textures, nostalgic and cozy",
    collage:
      "paper cutout collage style children's illustration, textured layers, mixed media, playful and tactile",
    pencil:
      'colored pencil illustration with visible hand-drawn texture, soft shading, warm and personal feel',
    pixel:
      'charming pixel art illustration, retro game aesthetic, bright colors, cute and blocky',
  };

  const colorDirectives = {
    bright:
      'bright sunny color palette with warm yellows, sky blues, and fresh greens',
    magical:
      'magical sparkly palette with rich purples, soft pinks, and shimmering golds',
    cool: 'cool calm palette with ocean blues, soft teals, and gentle grays',
    warm: 'warm cozy palette with burnt oranges, deep reds, and earthy browns',
    dark: 'mysterious palette with deep midnight blues, forest greens, and soft charcoal',
    rainbow: 'full vibrant rainbow color palette with every color represented joyfully',
  };

  const parts = [
    rawPrompt,
    `Style: ${styleDirectives[storySpec.artStyle] || styleDirectives.storybook}`,
    `Colors: ${colorDirectives[storySpec.colorPalette] || colorDirectives.bright}`,
  ];

  if (characterDesign) {
    parts.push(`Character appearance: ${characterDesign}`);
  }

  parts.push(
    "Children's book illustration, landscape format, clear focal point, appealing to young children.",
    'No text, no words, no letters, no watermarks, no scary imagery — keep everything stylized and child-friendly.'
  );

  return parts.join('\n');
}

// Generate a consistent seed from character name (for future use)
export function getCharacterSeed(characterName) {
  let hash = 0;
  for (let i = 0; i < characterName.length; i++) {
    const char = characterName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

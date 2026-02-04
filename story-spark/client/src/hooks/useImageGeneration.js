import { useState, useCallback } from 'react';

// Model fallback chain for reliability
const MODEL_FALLBACK_CHAIN = [
  { model: 'dall-e-3', quality: 'hd' },
  { model: 'gpt-image-1', quality: 'high' },
  { model: 'stabilityai/stable-diffusion-3-medium', steps: 30 },
  { model: 'black-forest-labs/FLUX.1-schnell' },
];

export function useImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const generateImage = useCallback(async (prompt, options = {}) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Check if puter is available
      if (typeof puter === 'undefined' || !puter.ai) {
        throw new Error('Puter.js not loaded. Please refresh the page.');
      }

      const imageSrc = await generateWithFallback(prompt, options);
      setIsGenerating(false);
      return imageSrc;
    } catch (err) {
      console.error('Image generation error:', err);
      setError(err.message || 'Image generation failed');
      setIsGenerating(false);
      return null;
    }
  }, []);

  return { generateImage, isGenerating, error, setError };
}

async function generateWithFallback(prompt, options = {}) {
  // If specific model is requested, try it first
  if (options.model) {
    try {
      const img = await puter.ai.txt2img(prompt, options);
      return img.src;
    } catch (err) {
      console.warn(`Requested model ${options.model} failed:`, err);
    }
  }

  // Try fallback chain
  for (const fallback of MODEL_FALLBACK_CHAIN) {
    try {
      const mergedOptions = { ...fallback, ...options };
      delete mergedOptions.model; // Remove to use fallback model
      const img = await puter.ai.txt2img(prompt, { ...fallback });
      return img.src;
    } catch (err) {
      console.warn(`Model ${fallback.model} failed, trying next...`, err);
      continue;
    }
  }

  throw new Error('All image generation models unavailable. Please try again.');
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

        const modelConfig = getModelConfig(storySpec.artStyle);
        let imageSrc = null;
        let attempts = 0;
        const maxAttempts = 3;

        while (!imageSrc && attempts < maxAttempts) {
          try {
            imageSrc = await generateWithFallback(finalPrompt, modelConfig);
          } catch (err) {
            attempts++;
            console.warn(`Page ${page.pageNumber} attempt ${attempts} failed:`, err);
            if (attempts >= maxAttempts) {
              // Use placeholder for failed images
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

        // Small delay between generations
        if (i < pages.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
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
    const modelConfig = getModelConfig(storySpec.artStyle);

    try {
      const imageSrc = await generateWithFallback(finalPrompt, modelConfig);
      return { ...page, imageSrc, failed: false };
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
    `[STYLE: ${styleDirectives[storySpec.artStyle] || styleDirectives.storybook}]`,
    `[COLORS: ${colorDirectives[storySpec.colorPalette] || colorDirectives.bright}]`,
  ];

  if (characterDesign) {
    parts.push(`[CHARACTER: ${characterDesign}]`);
  }

  parts.push(
    "[COMPOSITION: children's book illustration, landscape format, clear focal point, appealing to young children]",
    'No text, no words, no letters, no watermarks, no scary imagery, no realistic human faces — keep everything stylized and child-friendly.'
  );

  return parts.join('\n');
}

// Get model configuration based on art style
function getModelConfig(artStyle) {
  // Stable Diffusion gives more control for consistent style
  if (['watercolor', 'pencil', 'storybook'].includes(artStyle)) {
    return {
      model: 'stabilityai/stable-diffusion-3-medium',
      width: 1024,
      height: 768,
      steps: 30,
      negative_prompt:
        'scary, dark, violent, text, watermark, blurry, low quality, distorted, realistic human faces, extra limbs, bad anatomy',
    };
  }

  // DALL-E 3 excels at cartoon and collage styles
  if (['cartoon', 'collage'].includes(artStyle)) {
    return {
      model: 'dall-e-3',
      quality: 'hd',
    };
  }

  // Pixel art works well with Flux
  if (artStyle === 'pixel') {
    return {
      model: 'black-forest-labs/FLUX.1-schnell',
    };
  }

  // Default
  return { model: 'dall-e-3', quality: 'hd' };
}

// Generate a consistent seed from character name
export function getCharacterSeed(characterName) {
  let hash = 0;
  for (let i = 0; i < characterName.length; i++) {
    const char = characterName.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

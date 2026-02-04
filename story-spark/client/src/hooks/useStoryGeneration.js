import { useState, useCallback } from 'react';

const API_BASE = '/api/story';

export function useStoryGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ step: '', current: 0, total: 3 });
  const [error, setError] = useState(null);

  const generateStory = useCallback(async (storySpec) => {
    setIsGenerating(true);
    setError(null);
    setProgress({ step: 'Preparing your story...', current: 0, total: 3 });

    try {
      // Step 1: Generate character design
      setProgress({ step: 'Designing your character...', current: 1, total: 3 });
      const characterDesignRes = await fetch(`${API_BASE}/character-design`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storySpec }),
      });

      if (!characterDesignRes.ok) {
        const err = await characterDesignRes.json();
        throw new Error(err.error || 'Failed to design character');
      }

      const { characterDesign } = await characterDesignRes.json();

      // Step 2: Generate story outline
      setProgress({ step: 'Writing your story outline...', current: 2, total: 3 });
      const outlineRes = await fetch(`${API_BASE}/outline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storySpec }),
      });

      if (!outlineRes.ok) {
        const err = await outlineRes.json();
        throw new Error(err.error || 'Failed to create story outline');
      }

      const { outline } = await outlineRes.json();

      // Step 3: Generate full story text
      setProgress({ step: 'Writing the full story...', current: 3, total: 3 });
      const fullTextRes = await fetch(`${API_BASE}/full-text`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storySpec, outline }),
      });

      if (!fullTextRes.ok) {
        const err = await fullTextRes.json();
        throw new Error(err.error || 'Failed to write story');
      }

      const { story, warnings } = await fullTextRes.json();

      setIsGenerating(false);
      return {
        characterDesign,
        story,
        warnings: warnings || [],
      };
    } catch (err) {
      console.error('Story generation error:', err);
      setError(err.message || 'Something went wrong creating your story');
      setIsGenerating(false);
      return null;
    }
  }, []);

  return {
    generateStory,
    isGenerating,
    progress,
    error,
    setError,
  };
}

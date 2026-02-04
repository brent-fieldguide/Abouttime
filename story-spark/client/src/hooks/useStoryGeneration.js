import { useState, useCallback } from 'react';
import { getOutlinePrompt } from '../prompts/outlinePrompt';
import { getFullTextPrompt } from '../prompts/fullTextPrompt';
import { getCharacterDesignPrompt } from '../prompts/characterDesignPrompt';

export function useStoryGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ step: '', current: 0, total: 3 });
  const [error, setError] = useState(null);

  const generateStory = useCallback(async (storySpec) => {
    setIsGenerating(true);
    setError(null);
    setProgress({ step: 'Preparing your story...', current: 0, total: 3 });

    try {
      // Check if puter is available
      if (typeof puter === 'undefined' || !puter.ai) {
        throw new Error('Puter.js not loaded. Please refresh the page.');
      }

      // Step 1: Generate character design
      setProgress({ step: 'Designing your character...', current: 1, total: 3 });
      const characterDesignPrompt = getCharacterDesignPrompt(storySpec);
      const characterDesignResponse = await puter.ai.chat(characterDesignPrompt);
      const characterDesign = characterDesignResponse.toString().trim();

      // Step 2: Generate story outline
      setProgress({ step: 'Writing your story outline...', current: 2, total: 3 });
      const outlinePrompt = getOutlinePrompt(storySpec);
      const outlineResponse = await puter.ai.chat(outlinePrompt);
      const outlineText = outlineResponse.toString();

      // Extract JSON from the response
      const outlineMatch = outlineText.match(/\{[\s\S]*\}/);
      if (!outlineMatch) {
        throw new Error('Failed to parse story outline');
      }
      const outline = JSON.parse(outlineMatch[0]);

      // Step 3: Generate full story text
      setProgress({ step: 'Writing the full story...', current: 3, total: 3 });
      const fullTextPrompt = getFullTextPrompt(storySpec, outline);
      const fullTextResponse = await puter.ai.chat(fullTextPrompt);
      const fullText = fullTextResponse.toString();

      // Extract JSON from the response
      const storyMatch = fullText.match(/\{[\s\S]*\}/);
      if (!storyMatch) {
        throw new Error('Failed to parse story');
      }
      const story = JSON.parse(storyMatch[0]);

      setIsGenerating(false);
      return {
        characterDesign,
        story,
        warnings: [],
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

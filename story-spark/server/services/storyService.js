import Anthropic from '@anthropic-ai/sdk';
import { getOutlinePrompt } from '../prompts/outlinePrompt.js';
import { getFullTextPrompt } from '../prompts/fullTextPrompt.js';
import { getCharacterDesignPrompt } from '../prompts/characterDesignPrompt.js';

const anthropic = new Anthropic();

const MODEL = 'claude-sonnet-4-5-20250929';

export async function generateCharacterDesign(storySpec) {
  const prompt = getCharacterDesignPrompt(storySpec);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return response.content[0].text.trim();
}

export async function generateStoryOutline(storySpec, feedback = null) {
  const prompt = getOutlinePrompt(storySpec, feedback);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const text = response.content[0].text;

  // Extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse story outline JSON');
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error('Invalid JSON in story outline response');
  }
}

export async function generateFullStory(storySpec, outline, feedback = null) {
  const prompt = getFullTextPrompt(storySpec, outline, feedback);

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 3000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const text = response.content[0].text;

  // Extract JSON from the response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse full story JSON');
  }

  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    throw new Error('Invalid JSON in full story response');
  }
}

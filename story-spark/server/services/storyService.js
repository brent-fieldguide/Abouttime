import OpenAI from 'openai';
import { getOutlinePrompt } from '../prompts/outlinePrompt.js';
import { getFullTextPrompt } from '../prompts/fullTextPrompt.js';
import { getCharacterDesignPrompt } from '../prompts/characterDesignPrompt.js';

// Lazy initialization to allow dotenv to load first
let openai = null;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI();
  }
  return openai;
}

const MODEL = 'gpt-4o';

export async function generateCharacterDesign(storySpec) {
  const prompt = getCharacterDesignPrompt(storySpec);

  const response = await getOpenAI().chat.completions.create({
    model: MODEL,
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return response.choices[0].message.content.trim();
}

export async function generateStoryOutline(storySpec, feedback = null) {
  const prompt = getOutlinePrompt(storySpec, feedback);

  const response = await getOpenAI().chat.completions.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const text = response.choices[0].message.content;

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

  const response = await getOpenAI().chat.completions.create({
    model: MODEL,
    max_tokens: 3000,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const text = response.choices[0].message.content;

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

// Generate image using DALL-E 3
export async function generateImage(prompt) {
  const response = await getOpenAI().images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1792x1024', // Landscape for storybook
    quality: 'standard',
    response_format: 'b64_json',
  });

  return response.data[0].b64_json;
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getOutlinePrompt } from '../prompts/outlinePrompt.js';
import { getFullTextPrompt } from '../prompts/fullTextPrompt.js';
import { getCharacterDesignPrompt } from '../prompts/characterDesignPrompt.js';

// Lazy initialization to allow dotenv to load first
let genAI = null;
let model = null;

function getModel() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }
  return model;
}

function getImageModel() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp-image-generation' });
}

export async function generateCharacterDesign(storySpec) {
  const prompt = getCharacterDesignPrompt(storySpec);
  const result = await getModel().generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

export async function generateStoryOutline(storySpec, feedback = null) {
  const prompt = getOutlinePrompt(storySpec, feedback);
  const result = await getModel().generateContent(prompt);
  const response = await result.response;
  const text = response.text();

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
  const result = await getModel().generateContent(prompt);
  const response = await result.response;
  const text = response.text();

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

// Generate image using Gemini Imagen
export async function generateImage(prompt) {
  const imageModel = getImageModel();

  const imagePrompt = `Generate a children's book illustration: ${prompt}

Important: Create a colorful, friendly, child-appropriate illustration. No text, words, or letters in the image.`;

  try {
    const result = await imageModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: imagePrompt }] }],
      generationConfig: {
        responseModalities: ['image', 'text'],
      },
    });

    const response = await result.response;

    // Find image part in response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data; // Base64 image data
      }
    }

    throw new Error('No image in response');
  } catch (error) {
    console.error('Gemini image generation error:', error);
    throw error;
  }
}

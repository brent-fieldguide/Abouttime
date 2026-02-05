import { GoogleGenerativeAI } from '@google/generative-ai';
import { getOutlinePrompt } from '../prompts/outlinePrompt.js';
import { getFullTextPrompt } from '../prompts/fullTextPrompt.js';
import { getCharacterDesignPrompt } from '../prompts/characterDesignPrompt.js';

// Lazy initialization to allow dotenv to load first
let genAI = null;
let model = null;

// Helper to sleep for a given number of milliseconds
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry wrapper for handling rate limits (429 errors)
async function withRetry(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Check if it's a rate limit error (429)
      if (error.status === 429 && attempt < maxRetries) {
        // Extract retry delay from error if available, otherwise use exponential backoff
        let retryDelay = 15000 * (attempt + 1); // 15s, 30s, 45s

        // Try to parse the retry delay from the error
        if (error.errorDetails) {
          const retryInfo = error.errorDetails.find(d => d['@type']?.includes('RetryInfo'));
          if (retryInfo?.retryDelay) {
            const seconds = parseInt(retryInfo.retryDelay);
            if (!isNaN(seconds)) {
              retryDelay = (seconds + 2) * 1000; // Add 2 second buffer
            }
          }
        }

        console.log(`Rate limited. Waiting ${retryDelay/1000}s before retry ${attempt + 1}/${maxRetries}...`);
        await sleep(retryDelay);
        continue;
      }
      throw error;
    }
  }
}

function getModel() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
  return model;
}

function getImageModel() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI.getGenerativeModel({ model: 'imagen-3.0-generate-002' });
}

export async function generateCharacterDesign(storySpec) {
  return withRetry(async () => {
    const prompt = getCharacterDesignPrompt(storySpec);
    const result = await getModel().generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  });
}

export async function generateStoryOutline(storySpec, feedback = null) {
  return withRetry(async () => {
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
  });
}

export async function generateFullStory(storySpec, outline, feedback = null) {
  return withRetry(async () => {
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
  });
}

// Generate image using Gemini with Imagen
export async function generateImage(prompt) {
  return withRetry(async () => {
    const imagePrompt = `Children's book illustration: ${prompt}. Colorful, friendly, child-appropriate, no text or words in the image.`;

    // Use the Gemini model that supports image generation
    const imageModel = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseModalities: ['Text', 'Image']
      }
    });

    const result = await imageModel.generateContent(imagePrompt);
    const response = await result.response;

    // Find image part in response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data; // Base64 image data
      }
    }

    throw new Error('No image in response');
  });
}

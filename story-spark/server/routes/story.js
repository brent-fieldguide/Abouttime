import express from 'express';
import { generateStoryOutline, generateFullStory, generateCharacterDesign, generateImage } from '../services/storyService.js';
import { validateStorySpec, validateOutline, validateFullStory } from '../validation/storyValidator.js';

const router = express.Router();

// Generate a single image using DALL-E 3
router.post('/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing image prompt' });
    }

    const imageBase64 = await generateImage(prompt);
    res.json({ image: `data:image/png;base64,${imageBase64}` });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

// Generate character design spec for image consistency
router.post('/character-design', async (req, res) => {
  try {
    const { storySpec } = req.body;

    if (!storySpec?.mainCharacter) {
      return res.status(400).json({ error: 'Missing character information' });
    }

    const characterDesign = await generateCharacterDesign(storySpec);
    res.json({ characterDesign });
  } catch (error) {
    console.error('Character design error:', error);
    res.status(500).json({ error: 'Failed to generate character design' });
  }
});

// Generate story outline (Pass 1)
router.post('/outline', async (req, res) => {
  try {
    const { storySpec } = req.body;

    const specValidation = validateStorySpec(storySpec);
    if (!specValidation.valid) {
      return res.status(400).json({ error: specValidation.error });
    }

    const outline = await generateStoryOutline(storySpec);
    const outlineValidation = validateOutline(outline, storySpec);

    if (!outlineValidation.valid) {
      // Try to regenerate with feedback
      const retryOutline = await generateStoryOutline(storySpec, outlineValidation.feedback);
      const retryValidation = validateOutline(retryOutline, storySpec);

      if (!retryValidation.valid) {
        return res.status(422).json({
          error: 'Story outline validation failed',
          details: retryValidation.feedback,
        });
      }

      return res.json({ outline: retryOutline });
    }

    res.json({ outline });
  } catch (error) {
    console.error('Outline generation error:', error);
    res.status(500).json({ error: 'Failed to generate story outline' });
  }
});

// Generate full story text (Pass 2)
router.post('/full-text', async (req, res) => {
  try {
    const { storySpec, outline } = req.body;

    if (!outline?.pages?.length) {
      return res.status(400).json({ error: 'Missing story outline' });
    }

    const fullStory = await generateFullStory(storySpec, outline);
    const storyValidation = validateFullStory(fullStory, storySpec);

    if (!storyValidation.valid) {
      // Try to regenerate with feedback
      const retryStory = await generateFullStory(storySpec, outline, storyValidation.feedback);
      const retryValidation = validateFullStory(retryStory, storySpec);

      if (!retryValidation.valid) {
        // Return anyway with warnings - don't block the child
        return res.json({
          story: retryStory,
          warnings: retryValidation.warnings,
        });
      }

      return res.json({ story: retryStory });
    }

    res.json({ story: fullStory });
  } catch (error) {
    console.error('Full story generation error:', error);
    res.status(500).json({ error: 'Failed to generate story text' });
  }
});

// Combined endpoint - generate complete story in one request
router.post('/generate', async (req, res) => {
  try {
    const { storySpec } = req.body;

    const specValidation = validateStorySpec(storySpec);
    if (!specValidation.valid) {
      return res.status(400).json({ error: specValidation.error });
    }

    // Step 1: Generate character design
    const characterDesign = await generateCharacterDesign(storySpec);

    // Step 2: Generate outline
    let outline = await generateStoryOutline(storySpec);
    let outlineValidation = validateOutline(outline, storySpec);

    if (!outlineValidation.valid) {
      outline = await generateStoryOutline(storySpec, outlineValidation.feedback);
    }

    // Step 3: Generate full story
    let fullStory = await generateFullStory(storySpec, outline);
    const storyValidation = validateFullStory(fullStory, storySpec);

    if (!storyValidation.valid) {
      fullStory = await generateFullStory(storySpec, outline, storyValidation.feedback);
    }

    res.json({
      characterDesign,
      story: fullStory,
      warnings: storyValidation.warnings || [],
    });
  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
});

export default router;

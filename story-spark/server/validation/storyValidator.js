export function validateStorySpec(storySpec) {
  if (!storySpec) {
    return { valid: false, error: 'Missing story specification' };
  }

  const required = ['mainCharacter', 'setting', 'theme', 'conflict', 'endingMood', 'artStyle', 'colorPalette', 'pageCount'];

  for (const field of required) {
    if (!storySpec[field]) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  if (!storySpec.mainCharacter.name || !storySpec.mainCharacter.type) {
    return { valid: false, error: 'Main character must have a name and type' };
  }

  if (!storySpec.mainCharacter.traits?.length) {
    return { valid: false, error: 'Main character must have at least one trait' };
  }

  if (![5, 8, 12].includes(storySpec.pageCount)) {
    return { valid: false, error: 'Page count must be 5, 8, or 12' };
  }

  return { valid: true };
}

export function validateOutline(outline, storySpec) {
  const feedback = [];

  if (!outline?.title) {
    feedback.push('Story must have a title');
  }

  if (!outline?.pages || !Array.isArray(outline.pages)) {
    return {
      valid: false,
      feedback: 'Outline must contain a pages array',
    };
  }

  if (outline.pages.length !== storySpec.pageCount) {
    feedback.push(`Expected ${storySpec.pageCount} pages but got ${outline.pages.length}`);
  }

  // Check each page has required fields
  for (const page of outline.pages) {
    if (!page.summary || !page.imagePrompt) {
      feedback.push(`Page ${page.pageNumber} is missing summary or image prompt`);
    }
  }

  // Check story structure
  const hasConflictIntroduction = outline.pages.slice(0, 2).some(p =>
    p.summary?.toLowerCase().includes('but') ||
    p.summary?.toLowerCase().includes('problem') ||
    p.summary?.toLowerCase().includes('challenge') ||
    p.summary?.toLowerCase().includes('lost') ||
    p.summary?.toLowerCase().includes('need')
  );

  if (!hasConflictIntroduction) {
    feedback.push('The conflict should be introduced in the first two pages');
  }

  // Check for resolution in final pages
  const lastPages = outline.pages.slice(-2);
  const hasResolution = lastPages.some(p =>
    p.summary?.toLowerCase().includes('finally') ||
    p.summary?.toLowerCase().includes('succeed') ||
    p.summary?.toLowerCase().includes('happy') ||
    p.summary?.toLowerCase().includes('found') ||
    p.summary?.toLowerCase().includes('solved') ||
    p.summary?.toLowerCase().includes('home') ||
    p.emotion?.toLowerCase().includes('happy') ||
    p.emotion?.toLowerCase().includes('proud') ||
    p.emotion?.toLowerCase().includes('joy')
  );

  if (!hasResolution) {
    feedback.push('The story should have a clear resolution in the final pages');
  }

  return {
    valid: feedback.length === 0,
    feedback: feedback.join('\n'),
  };
}

export function validateFullStory(story, storySpec) {
  const warnings = [];

  if (!story?.title) {
    warnings.push('Story is missing a title');
  }

  if (!story?.pages || !Array.isArray(story.pages)) {
    return {
      valid: false,
      feedback: 'Story must contain a pages array',
      warnings,
    };
  }

  if (story.pages.length !== storySpec.pageCount) {
    warnings.push(`Expected ${storySpec.pageCount} pages but got ${story.pages.length}`);
  }

  // Check sentence count per page
  for (const page of story.pages) {
    if (!page.text) {
      warnings.push(`Page ${page.pageNumber} has no text`);
      continue;
    }

    const sentences = page.text.split(/[.!?]+/).filter(s => s.trim());
    if (sentences.length > 6) {
      warnings.push(`Page ${page.pageNumber} has ${sentences.length} sentences (max 6)`);
    }
  }

  // Check character name usage
  const characterName = storySpec.mainCharacter.name.toLowerCase();
  const firstPageHasName = story.pages[0]?.text?.toLowerCase().includes(characterName);

  if (!firstPageHasName) {
    warnings.push('Character name should appear on the first page');
  }

  // Check total word count
  const totalWords = story.pages.reduce((count, page) => {
    return count + (page.text?.split(/\s+/).length || 0);
  }, 0);

  const wordRanges = {
    5: [100, 350],
    8: [200, 550],
    12: [350, 800],
  };

  const [minWords, maxWords] = wordRanges[storySpec.pageCount] || [100, 800];

  if (totalWords < minWords) {
    warnings.push(`Story is too short (${totalWords} words, minimum ${minWords})`);
  } else if (totalWords > maxWords) {
    warnings.push(`Story is quite long (${totalWords} words)`);
  }

  // Check for inappropriate content (basic check)
  const inappropriateWords = ['die', 'kill', 'dead', 'blood', 'hate', 'stupid', 'ugly'];
  const allText = story.pages.map(p => p.text).join(' ').toLowerCase();

  for (const word of inappropriateWords) {
    if (allText.includes(word)) {
      warnings.push(`Story may contain inappropriate content: "${word}"`);
    }
  }

  return {
    valid: warnings.length === 0,
    warnings,
    feedback: warnings.join('\n'),
  };
}

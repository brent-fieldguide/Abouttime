export function getFullTextPrompt(storySpec, outline, feedback = null) {
  const {
    mainCharacter,
    sidekick,
    endingMood,
    pageCount,
  } = storySpec;

  const moodDescriptions = {
    proud: 'happy and proud',
    silly: 'laughing and silly',
    cozy: 'cozy and safe',
    excited: 'excited for the next adventure',
    loved: 'warm and loved',
  };

  let prompt = `You are a world-class children's book author. Using the outline below, write the full story text for a ${pageCount}-page illustrated children's book.

TITLE: ${outline.title}
RECURRING PHRASE: "${outline.recurringPhrase}"

CHARACTER: ${mainCharacter.name} is a ${mainCharacter.type} who is ${mainCharacter.traits.join(' and ')}.
${sidekick ? `SIDEKICK: ${sidekick.name}, a ${sidekick.type}.` : ''}

STORY OUTLINE:
${outline.pages.map(p => `Page ${p.pageNumber}: ${p.summary} (Emotion: ${p.emotion})`).join('\n')}

WRITING RULES:
1. Write 2-5 SHORT sentences per page (max 6 sentences)
2. Use simple words a 5-year-old can understand
3. Include dialogue naturally — at least one line every 2-3 pages
4. Show emotions through actions and dialogue, not narration
5. Weave in the recurring phrase "${outline.recurringPhrase}" at least 2-3 times
6. ${mainCharacter.name}'s personality (${mainCharacter.traits.join(', ')}) should show in how they act and speak
7. The final page MUST leave readers feeling ${moodDescriptions[endingMood] || endingMood}
8. NEVER include anything scary, violent, unkind, or inappropriate for young children
9. Use ${mainCharacter.name}'s name on the first page and at least every other page
10. Keep sentences under 15 words each

WORD COUNT TARGETS:
- 5 pages: 150-300 total words
- 8 pages: 250-500 total words
- 12 pages: 400-750 total words`;

  if (feedback) {
    prompt += `\n\nPREVIOUS ATTEMPT FEEDBACK - Please fix these issues:\n${feedback}`;
  }

  prompt += `\n\nWrite the complete story. Output valid JSON in this exact format:
{
  "title": "${outline.title}",
  "pages": [
    {
      "pageNumber": 1,
      "text": "The story text for this page.",
      "imagePrompt": "Copy and enhance the image prompt from the outline, adding specific details about this exact moment"
    }
  ]
}`;

  return prompt;
}

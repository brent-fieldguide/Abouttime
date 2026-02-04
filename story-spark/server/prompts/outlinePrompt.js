export function getOutlinePrompt(storySpec, feedback = null) {
  const {
    mainCharacter,
    sidekick,
    setting,
    theme,
    conflict,
    endingMood,
    pageCount,
  } = storySpec;

  const themeDescriptions = {
    journey: 'going on a big journey',
    friendship: 'making a new friend',
    mystery: 'solving a mystery',
    learning: 'learning something new',
    fear: 'overcoming a fear',
    helping: 'helping someone in trouble',
    magic: 'discovering a magical power',
    silly: 'having the silliest day ever',
  };

  const moodDescriptions = {
    proud: 'happy and proud',
    silly: 'laughing and silly',
    cozy: 'cozy and safe',
    excited: 'excited for the next adventure',
    loved: 'warm and loved',
  };

  const eraDescriptions = {
    fairytale: 'a long, long time ago (fairy tale setting)',
    present: 'right now, in modern times',
    future: 'in the future (sci-fi setting)',
    fantasy: 'once upon a dream (timeless fantasy)',
  };

  let prompt = `You are a world-class children's book author creating a ${pageCount}-page illustrated storybook outline.

CHARACTER: ${mainCharacter.name} is a ${mainCharacter.type} who is ${mainCharacter.traits.join(' and ')}.
${mainCharacter.description ? `Additional details: ${mainCharacter.description}` : ''}
${sidekick ? `SIDEKICK: Their best friend is ${sidekick.name}, a ${sidekick.type}.` : 'This is a solo adventure.'}

SETTING: ${setting.location} — ${eraDescriptions[setting.era] || setting.era}

ADVENTURE: The story is about ${themeDescriptions[theme] || theme}.

CHALLENGE: ${conflict}

ENDING: The story should end with ${mainCharacter.name} feeling ${moodDescriptions[endingMood] || endingMood}.

STRUCTURE REQUIREMENTS:
- Create exactly ${pageCount} pages
- Pages 1-${Math.ceil(pageCount * 0.2)}: Beginning — introduce ${mainCharacter.name} and the world
- Pages ${Math.ceil(pageCount * 0.2) + 1}-${Math.ceil(pageCount * 0.8)}: Middle — the adventure and conflict
- Pages ${Math.ceil(pageCount * 0.8) + 1}-${pageCount}: End — resolution and happy ending

- Each page should be ONE clear scene or moment
- The conflict must be introduced by page 2
- The conflict must be clearly resolved before the final page
- The final page should leave readers feeling ${moodDescriptions[endingMood] || endingMood}
- Include a recurring phrase or gentle repetition for rhythm
- Keep everything child-friendly — no scary, violent, or unkind content`;

  if (feedback) {
    prompt += `\n\nPREVIOUS ATTEMPT FEEDBACK - Please fix these issues:\n${feedback}`;
  }

  prompt += `\n\nCreate a story outline with a title and for each page provide:
1. A one-sentence summary of what happens
2. The key action or event
3. The emotional beat
4. A detailed image prompt describing the illustration (include character appearance, setting details, action, mood, and composition)

Output valid JSON in this exact format:
{
  "title": "Story Title",
  "recurringPhrase": "A phrase that appears multiple times in the story",
  "pages": [
    {
      "pageNumber": 1,
      "summary": "Brief summary of this page",
      "action": "The key action",
      "emotion": "The emotional beat",
      "imagePrompt": "Detailed illustration prompt including character, setting, action, mood"
    }
  ]
}`;

  return prompt;
}

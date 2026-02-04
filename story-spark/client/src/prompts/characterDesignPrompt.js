export function getCharacterDesignPrompt(storySpec) {
  const { mainCharacter, artStyle } = storySpec;

  const styleDescriptions = {
    watercolor: 'soft watercolor illustration style with gentle brushstrokes',
    cartoon: 'bright bold cartoon style with clean lines and vibrant colors',
    storybook: 'classic warm painterly style like a Golden Book illustration',
    collage: 'paper cutout collage style with textured layers',
    pencil: 'colored pencil illustration with visible hand-drawn texture',
    pixel: 'charming pixel art style with retro game aesthetic',
  };

  return `Based on this character, write a detailed visual description I can use in every image prompt to keep the character looking consistent across multiple illustrations.

Character: ${mainCharacter.name}
Type: ${mainCharacter.type}
${mainCharacter.description ? `Description: ${mainCharacter.description}` : ''}
Personality traits: ${mainCharacter.traits.join(', ')}
Art style: ${styleDescriptions[artStyle] || artStyle}

Write a single detailed paragraph describing: species/type, approximate size (small, medium, child-sized, etc.), color scheme (use exact color names like "cornflower blue" or "honey gold" not just "blue" or "yellow"), clothing or accessories if applicable, distinguishing features, facial expression tendency based on personality, and any recurring visual motifs. Be very specific and consistent so the character can be recognized across all illustrations.

Important: Make the character appealing and friendly for a children's book. Avoid any scary or intimidating features.`;
}

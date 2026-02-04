import { useState } from 'react';
import { useStoryStore } from '../../context/StoryContext';
import QuestionLayout, { EncouragementBubble } from '../common/QuestionLayout';
import { CardGrid, SelectionCard } from '../common/CardGrid';
import VoiceInput from '../common/VoiceInput';

// Conflicts organized by theme
const CONFLICT_OPTIONS = {
  journey: [
    { value: 'lost', icon: '🧭', label: 'Gets lost and needs to find the way home' },
    { value: 'treasure', icon: '💎', label: 'Needs to find a hidden treasure' },
    { value: 'bridge', icon: '🌉', label: 'Has to cross a scary bridge' },
    { value: 'storm', icon: '⛈️', label: 'A storm blocks the path' },
  ],
  friendship: [
    { value: 'shy', icon: '🙈', label: 'Too shy to say hello' },
    { value: 'misunderstanding', icon: '😕', label: 'A big misunderstanding' },
    { value: 'lonely', icon: '💔', label: 'Feeling lonely and left out' },
    { value: 'different', icon: '🌈', label: 'Someone who seems very different' },
  ],
  mystery: [
    { value: 'missing', icon: '❓', label: 'Something important goes missing' },
    { value: 'strange', icon: '👻', label: 'Strange things keep happening' },
    { value: 'secret', icon: '🔐', label: 'A secret needs to be uncovered' },
    { value: 'puzzle', icon: '🧩', label: 'A tricky puzzle to solve' },
  ],
  learning: [
    { value: 'hard', icon: '😤', label: 'Something is really hard to learn' },
    { value: 'mistake', icon: '🙊', label: 'Makes a big mistake' },
    { value: 'give-up', icon: '😔', label: 'Wants to give up' },
    { value: 'different-way', icon: '💡', label: 'Needs to find a different way' },
  ],
  fear: [
    { value: 'dark', icon: '🌙', label: 'Scared of the dark' },
    { value: 'alone', icon: '😟', label: 'Afraid to be alone' },
    { value: 'new', icon: '😰', label: 'Scared of something new' },
    { value: 'big', icon: '😨', label: 'Facing something really big' },
  ],
  helping: [
    { value: 'stuck', icon: '🪤', label: 'Someone is stuck and needs help' },
    { value: 'sick', icon: '🤒', label: 'A friend is feeling sick' },
    { value: 'sad', icon: '😢', label: 'Someone is very sad' },
    { value: 'danger', icon: '⚠️', label: 'Someone is in a tricky situation' },
  ],
  magic: [
    { value: 'control', icon: '🌀', label: 'Can\'t control the new power' },
    { value: 'believe', icon: '🤔', label: 'No one believes it\'s real' },
    { value: 'responsibility', icon: '⚖️', label: 'Has to use the power wisely' },
    { value: 'protect', icon: '🛡️', label: 'Needs to protect something special' },
  ],
  silly: [
    { value: 'backwards', icon: '🔄', label: 'Everything goes backwards' },
    { value: 'mix-up', icon: '🎭', label: 'A hilarious mix-up' },
    { value: 'wishes', icon: '⭐', label: 'Wishes come true in funny ways' },
    { value: 'animals', icon: '🐾', label: 'Animals start acting weird' },
  ],
};

// Fallback conflicts for any theme
const DEFAULT_CONFLICTS = [
  { value: 'obstacle', icon: '🚧', label: 'Faces a big obstacle' },
  { value: 'choice', icon: '🤷', label: 'Has to make a difficult choice' },
  { value: 'lost-item', icon: '🔍', label: 'Loses something important' },
  { value: 'custom', icon: '✨', label: 'Something else!' },
];

export default function ConflictPicker() {
  const { storySpec, updateStorySpec, nextPhase, prevPhase } = useStoryStore();
  const [showCustomInput, setShowCustomInput] = useState(storySpec.conflict === 'custom');
  const [customConflict, setCustomConflict] = useState(
    storySpec.conflict === 'custom' ? storySpec.conflictDescription || '' : ''
  );

  const characterName = storySpec.mainCharacter.name;
  const theme = storySpec.theme;
  const selectedConflict = storySpec.conflict;

  // Get conflicts for current theme, with fallbacks
  const themeConflicts = CONFLICT_OPTIONS[theme] || [];
  const conflicts = [...themeConflicts, ...DEFAULT_CONFLICTS.slice(0, 4 - themeConflicts.length % 4)];

  const handleSelect = (conflict) => {
    if (conflict === 'custom') {
      setShowCustomInput(true);
      updateStorySpec({ conflict: 'custom' });
    } else {
      setShowCustomInput(false);
      updateStorySpec({ conflict, conflictDescription: '' });
    }
  };

  const handleCustomInput = (text) => {
    setCustomConflict(text);
    updateStorySpec({ conflictDescription: text });
  };

  const handleVoiceResult = (transcript) => {
    setCustomConflict(transcript);
    updateStorySpec({ conflictDescription: transcript });
  };

  const canContinue = selectedConflict && (selectedConflict !== 'custom' || customConflict.trim());

  const getConflictLabel = () => {
    if (selectedConflict === 'custom') return customConflict;
    const conflict = conflicts.find((c) => c.value === selectedConflict);
    return conflict?.label?.toLowerCase() || '';
  };

  return (
    <QuestionLayout
      title="Every great story has a problem!"
      subtitle={`What challenge does ${characterName} face?`}
      onNext={nextPhase}
      onBack={prevPhase}
      canContinue={canContinue}
    >
      {selectedConflict && (
        <EncouragementBubble
          message={`${characterName} ${getConflictLabel()}!`}
        />
      )}

      <CardGrid columns={2}>
        {conflicts.map((conflict) => (
          <SelectionCard
            key={conflict.value}
            icon={conflict.icon}
            label={conflict.label}
            selected={selectedConflict === conflict.value}
            onClick={() => handleSelect(conflict.value)}
            className="py-4"
          />
        ))}
      </CardGrid>

      {showCustomInput && (
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg max-w-lg mx-auto">
          <label className="block text-lg font-medium text-gray-700 mb-3">
            What problem does {characterName} face?
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={customConflict}
              onChange={(e) => handleCustomInput(e.target.value)}
              placeholder="Has to find a lost puppy..."
              className="flex-1 px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-spark-400 focus:outline-none"
              autoFocus
            />
            <VoiceInput onResult={handleVoiceResult} />
          </div>
        </div>
      )}
    </QuestionLayout>
  );
}

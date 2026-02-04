import { useState } from 'react';
import { useStoryStore } from '../../context/StoryContext';
import QuestionLayout, { EncouragementBubble } from '../common/QuestionLayout';
import { CardGrid, SelectionCard } from '../common/CardGrid';
import VoiceInput from '../common/VoiceInput';

const CHARACTER_OPTIONS = [
  { type: 'kid-boy', icon: '👦', label: 'A Boy' },
  { type: 'kid-girl', icon: '👧', label: 'A Girl' },
  { type: 'kid-nonbinary', icon: '🧒', label: 'A Kid' },
  { type: 'cat', icon: '🐱', label: 'A Cat' },
  { type: 'dog', icon: '🐕', label: 'A Dog' },
  { type: 'bunny', icon: '🐰', label: 'A Bunny' },
  { type: 'dragon', icon: '🐉', label: 'A Dragon' },
  { type: 'bear', icon: '🐻', label: 'A Bear' },
  { type: 'owl', icon: '🦉', label: 'An Owl' },
  { type: 'fox', icon: '🦊', label: 'A Fox' },
  { type: 'unicorn', icon: '🦄', label: 'A Unicorn' },
  { type: 'fairy', icon: '🧚', label: 'A Fairy' },
  { type: 'robot', icon: '🤖', label: 'A Robot' },
  { type: 'monster', icon: '👾', label: 'A Monster' },
  { type: 'mermaid', icon: '🧜', label: 'A Mermaid' },
  { type: 'custom', icon: '✨', label: 'Something else!' },
];

export default function CharacterPicker() {
  const { storySpec, updateMainCharacter, nextPhase, prevPhase } = useStoryStore();
  const [showCustomInput, setShowCustomInput] = useState(storySpec.mainCharacter.type === 'custom');
  const [customDescription, setCustomDescription] = useState(storySpec.mainCharacter.description || '');

  const selectedType = storySpec.mainCharacter.type;

  const handleSelect = (type) => {
    if (type === 'custom') {
      setShowCustomInput(true);
      updateMainCharacter({ type: 'custom' });
    } else {
      setShowCustomInput(false);
      updateMainCharacter({ type, description: '' });
    }
  };

  const handleCustomInput = (text) => {
    setCustomDescription(text);
    updateMainCharacter({ description: text });
  };

  const handleVoiceResult = (transcript) => {
    setCustomDescription(transcript);
    updateMainCharacter({ description: transcript });
  };

  const canContinue = selectedType && (selectedType !== 'custom' || customDescription.trim());

  const getEncouragement = () => {
    if (!selectedType) return null;
    const messages = [
      'Great choice!',
      'Ooh, that sounds fun!',
      'What a wonderful character!',
      'I love it!',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  return (
    <QuestionLayout
      title="Who is your story about?"
      subtitle="Pick a friend for your adventure!"
      onNext={nextPhase}
      onBack={prevPhase}
      showBack={false}
      canContinue={canContinue}
    >
      {selectedType && !showCustomInput && (
        <EncouragementBubble message={getEncouragement()} />
      )}

      <CardGrid columns={4}>
        {CHARACTER_OPTIONS.map((char) => (
          <SelectionCard
            key={char.type}
            icon={char.icon}
            label={char.label}
            selected={selectedType === char.type}
            onClick={() => handleSelect(char.type)}
          />
        ))}
      </CardGrid>

      {showCustomInput && (
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-lg">
          <label className="block text-lg font-medium text-gray-700 mb-3">
            Tell me about your character!
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={customDescription}
              onChange={(e) => handleCustomInput(e.target.value)}
              placeholder="A purple dinosaur who loves to dance..."
              className="flex-1 px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-spark-400 focus:outline-none"
              autoFocus
            />
            <VoiceInput onResult={handleVoiceResult} />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Describe what kind of character you imagine!
          </p>
        </div>
      )}
    </QuestionLayout>
  );
}

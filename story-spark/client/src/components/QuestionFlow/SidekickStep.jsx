import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStoryStore } from '../../context/StoryContext';
import QuestionLayout from '../common/QuestionLayout';
import { CardGrid, SelectionCard } from '../common/CardGrid';
import VoiceInput from '../common/VoiceInput';

const SIDEKICK_OPTIONS = [
  { type: 'cat', icon: '🐱', label: 'A Cat' },
  { type: 'dog', icon: '🐕', label: 'A Dog' },
  { type: 'bunny', icon: '🐰', label: 'A Bunny' },
  { type: 'bird', icon: '🐦', label: 'A Bird' },
  { type: 'dragon', icon: '🐉', label: 'A Dragon' },
  { type: 'fairy', icon: '🧚', label: 'A Fairy' },
  { type: 'robot', icon: '🤖', label: 'A Robot' },
  { type: 'bear', icon: '🐻', label: 'A Bear' },
];

export default function SidekickStep() {
  const { storySpec, updateSidekick, nextPhase, prevPhase } = useStoryStore();
  const [wantsSidekick, setWantsSidekick] = useState(storySpec.sidekick !== null ? true : null);
  const [sidekickType, setSidekickType] = useState(storySpec.sidekick?.type || null);
  const [sidekickName, setSidekickName] = useState(storySpec.sidekick?.name || '');

  const mainCharName = storySpec.mainCharacter.name;

  const handleChoice = (wants) => {
    setWantsSidekick(wants);
    if (!wants) {
      updateSidekick(null);
    }
  };

  const handleTypeSelect = (type) => {
    setSidekickType(type);
    updateSidekick({ type, name: sidekickName });
  };

  const handleNameChange = (name) => {
    setSidekickName(name);
    updateSidekick({ type: sidekickType, name });
  };

  const handleVoiceResult = (transcript) => {
    const formatted = transcript.charAt(0).toUpperCase() + transcript.slice(1).toLowerCase();
    handleNameChange(formatted);
  };

  const canContinue =
    wantsSidekick === false || (wantsSidekick === true && sidekickType && sidekickName.trim());

  // Initial choice screen
  if (wantsSidekick === null) {
    return (
      <QuestionLayout
        title={`Does ${mainCharName} have a best friend?`}
        subtitle="Every hero can use a sidekick... or go solo!"
        onNext={nextPhase}
        onBack={prevPhase}
        canContinue={false}
      >
        <div className="flex flex-col md:flex-row gap-4 justify-center max-w-2xl mx-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleChoice(true)}
            className="flex-1 p-8 bg-white rounded-2xl shadow-lg border-3 border-transparent hover:border-spark-300 transition-all"
          >
            <span className="text-5xl block mb-4">👫</span>
            <span className="text-xl font-bold text-gray-800">Yes! Add a friend!</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleChoice(false)}
            className="flex-1 p-8 bg-white rounded-2xl shadow-lg border-3 border-transparent hover:border-spark-300 transition-all"
          >
            <span className="text-5xl block mb-4">🦸</span>
            <span className="text-xl font-bold text-gray-800">
              Nope, just {mainCharName}!
            </span>
          </motion.button>
        </div>
      </QuestionLayout>
    );
  }

  // No sidekick - just show confirmation and move forward
  if (wantsSidekick === false) {
    return (
      <QuestionLayout
        title={`${mainCharName} goes solo!`}
        subtitle="A brave adventure awaits!"
        onNext={nextPhase}
        onBack={() => setWantsSidekick(null)}
        canContinue={true}
      >
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
            className="text-8xl mb-6"
          >
            🦸
          </motion.div>
          <p className="text-xl text-gray-600">
            {mainCharName} is ready for an adventure!
          </p>
        </div>
      </QuestionLayout>
    );
  }

  // Sidekick selection
  return (
    <QuestionLayout
      title={`Who is ${mainCharName}'s best friend?`}
      subtitle="Pick a sidekick and give them a name!"
      onNext={nextPhase}
      onBack={() => setWantsSidekick(null)}
      canContinue={canContinue}
    >
      <CardGrid columns={4}>
        {SIDEKICK_OPTIONS.map((opt) => (
          <SelectionCard
            key={opt.type}
            icon={opt.icon}
            label={opt.label}
            selected={sidekickType === opt.type}
            onClick={() => handleTypeSelect(opt.type)}
          />
        ))}
      </CardGrid>

      {sidekickType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white rounded-2xl p-6 shadow-lg max-w-md mx-auto"
        >
          <label className="block text-lg font-medium text-gray-700 mb-3 text-center">
            What's the sidekick's name?
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={sidekickName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Type a name..."
              className="flex-1 px-4 py-3 text-xl font-bold text-center border-2 border-gray-200 rounded-xl focus:border-spark-400 focus:outline-none"
              autoFocus
              maxLength={20}
            />
            <VoiceInput onResult={handleVoiceResult} />
          </div>
        </motion.div>
      )}
    </QuestionLayout>
  );
}

import { motion } from 'framer-motion';
import { useStoryStore } from '../../context/StoryContext';
import QuestionLayout, { EncouragementBubble } from '../common/QuestionLayout';
import { CardGrid, SelectionCard } from '../common/CardGrid';

const ENDING_OPTIONS = [
  {
    value: 'proud',
    icon: '🏆',
    emoji: '😊',
    label: 'Happy and proud',
    sublabel: 'Accomplished something great!',
  },
  {
    value: 'silly',
    icon: '😂',
    emoji: '🤣',
    label: 'Laughing and silly',
    sublabel: 'So much fun!',
  },
  {
    value: 'cozy',
    icon: '🏠',
    emoji: '😌',
    label: 'Cozy and safe',
    sublabel: 'Home sweet home',
  },
  {
    value: 'excited',
    icon: '🌟',
    emoji: '🤩',
    label: 'Excited for more',
    sublabel: 'Ready for the next adventure!',
  },
  {
    value: 'loved',
    icon: '💕',
    emoji: '🥰',
    label: 'Warm and loved',
    sublabel: 'Surrounded by friends',
  },
];

export default function EndingPicker() {
  const { storySpec, updateStorySpec, nextPhase, prevPhase } = useStoryStore();
  const selectedMood = storySpec.endingMood;
  const characterName = storySpec.mainCharacter.name;

  const handleSelect = (mood) => {
    updateStorySpec({ endingMood: mood });
  };

  const canContinue = !!selectedMood;

  const getMoodMessage = () => {
    const mood = ENDING_OPTIONS.find((m) => m.value === selectedMood);
    if (!mood) return null;
    return `${characterName} will feel ${mood.label.toLowerCase()}!`;
  };

  return (
    <QuestionLayout
      title="How should the story end?"
      subtitle={`How will ${characterName} feel at the end?`}
      onNext={nextPhase}
      onBack={prevPhase}
      canContinue={canContinue}
    >
      {selectedMood && <EncouragementBubble message={getMoodMessage()} />}

      <div className="max-w-3xl mx-auto">
        <CardGrid columns={3}>
          {ENDING_OPTIONS.map((mood) => (
            <motion.button
              key={mood.value}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(mood.value)}
              className={`
                relative p-6 rounded-2xl bg-white
                border-3 transition-all duration-200
                flex flex-col items-center gap-3
                ${
                  selectedMood === mood.value
                    ? 'border-spark-400 ring-4 ring-spark-100'
                    : 'border-gray-100 hover:border-spark-200'
                }
              `}
            >
              {selectedMood === mood.value && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-6 h-6 bg-spark-400 rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}

              {/* Big emoji face */}
              <motion.span
                className="text-6xl"
                animate={
                  selectedMood === mood.value
                    ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                {mood.emoji}
              </motion.span>

              <span className="text-lg font-bold text-gray-800">{mood.label}</span>
              <span className="text-sm text-gray-500">{mood.sublabel}</span>
            </motion.button>
          ))}
        </CardGrid>
      </div>
    </QuestionLayout>
  );
}

import { motion } from 'framer-motion';
import { useStoryStore } from '../../context/StoryContext';
import QuestionLayout, { EncouragementBubble } from '../common/QuestionLayout';

const LENGTH_OPTIONS = [
  {
    value: 5,
    label: 'A Little Story',
    sublabel: '5 pages',
    description: 'Quick and sweet',
    icon: '📄',
    bookSize: 'small',
  },
  {
    value: 8,
    label: 'A Medium Story',
    sublabel: '8 pages',
    description: 'Just right!',
    icon: '📕',
    bookSize: 'medium',
  },
  {
    value: 12,
    label: 'A Big Adventure',
    sublabel: '12 pages',
    description: 'Lots to explore!',
    icon: '📚',
    bookSize: 'large',
  },
];

export default function LengthPicker() {
  const { storySpec, updateStorySpec, nextPhase, prevPhase } = useStoryStore();
  const selectedLength = storySpec.pageCount;

  const handleSelect = (length) => {
    updateStorySpec({ pageCount: length });
  };

  const canContinue = !!selectedLength;

  const getLengthMessage = () => {
    const length = LENGTH_OPTIONS.find((l) => l.value === selectedLength);
    if (!length) return null;
    return `${length.label} with ${length.value} pages!`;
  };

  return (
    <QuestionLayout
      title="How long should your story be?"
      subtitle="Pick the size of your adventure!"
      onNext={nextPhase}
      onBack={prevPhase}
      canContinue={canContinue}
    >
      {selectedLength && <EncouragementBubble message={getLengthMessage()} />}

      <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch max-w-4xl mx-auto">
        {LENGTH_OPTIONS.map((option) => (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(option.value)}
            className={`
              relative flex-1 p-6 rounded-2xl bg-white
              border-3 transition-all duration-200
              flex flex-col items-center gap-4
              min-h-[200px]
              ${
                selectedLength === option.value
                  ? 'border-spark-400 ring-4 ring-spark-100'
                  : 'border-gray-100 hover:border-spark-200'
              }
            `}
          >
            {/* Book icon with size variation */}
            <motion.div
              className="relative"
              animate={
                selectedLength === option.value
                  ? { rotate: [0, -5, 5, 0] }
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
              <span
                className={`
                  ${option.bookSize === 'small' ? 'text-5xl' : ''}
                  ${option.bookSize === 'medium' ? 'text-6xl' : ''}
                  ${option.bookSize === 'large' ? 'text-7xl' : ''}
                `}
              >
                {option.icon}
              </span>
            </motion.div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-800">{option.label}</h3>
              <p className="text-lg text-spark-500 font-medium">{option.sublabel}</p>
              <p className="text-sm text-gray-500 mt-1">{option.description}</p>
            </div>

            {/* Page indicators */}
            <div className="flex gap-1">
              {Array.from({ length: Math.min(option.value, 6) }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`
                    w-2 h-4 rounded-sm
                    ${selectedLength === option.value ? 'bg-spark-400' : 'bg-gray-200'}
                  `}
                />
              ))}
              {option.value > 6 && (
                <span className="text-xs text-gray-400 ml-1">
                  +{option.value - 6}
                </span>
              )}
            </div>

            {/* Selection indicator */}
            {selectedLength === option.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-8 h-8 bg-spark-400 rounded-full flex items-center justify-center shadow-lg"
              >
                <svg
                  className="w-5 h-5 text-white"
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
          </motion.button>
        ))}
      </div>
    </QuestionLayout>
  );
}

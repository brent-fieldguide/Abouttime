import { motion } from 'framer-motion';
import { useStoryStore } from '../../context/StoryContext';
import QuestionLayout, { EncouragementBubble } from '../common/QuestionLayout';

const COLOR_PALETTES = [
  {
    value: 'bright',
    label: 'Bright & Sunny',
    sublabel: 'Happy and energetic',
    colors: ['#FFD93D', '#6BCB77', '#4D96FF', '#FF6B6B'],
  },
  {
    value: 'magical',
    label: 'Magical & Sparkly',
    sublabel: 'Enchanting and special',
    colors: ['#C77DFF', '#E0AAFF', '#FFD6A5', '#FFE66D'],
  },
  {
    value: 'cool',
    label: 'Cool & Calm',
    sublabel: 'Peaceful and serene',
    colors: ['#48CAE4', '#90E0EF', '#ADE8F4', '#CAF0F8'],
  },
  {
    value: 'warm',
    label: 'Warm & Cozy',
    sublabel: 'Comforting and friendly',
    colors: ['#FF9F1C', '#FFBF69', '#CBF3F0', '#2EC4B6'],
  },
  {
    value: 'dark',
    label: 'Dark & Mysterious',
    sublabel: 'Adventurous and exciting',
    colors: ['#2D3047', '#419D78', '#E0A458', '#93748A'],
  },
  {
    value: 'rainbow',
    label: 'Rainbow!',
    sublabel: 'All the colors!',
    colors: ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93'],
  },
];

export default function ColorPicker() {
  const { storySpec, updateStorySpec, nextPhase, prevPhase } = useStoryStore();
  const selectedPalette = storySpec.colorPalette;

  const handleSelect = (palette) => {
    updateStorySpec({ colorPalette: palette });
  };

  const canContinue = !!selectedPalette;

  const getPaletteMessage = () => {
    const palette = COLOR_PALETTES.find((p) => p.value === selectedPalette);
    if (!palette) return null;
    return `${palette.label} colors - ${palette.sublabel}!`;
  };

  return (
    <QuestionLayout
      title="Pick the colors for your story!"
      subtitle="What mood should the pictures have?"
      onNext={nextPhase}
      onBack={prevPhase}
      canContinue={canContinue}
    >
      {selectedPalette && <EncouragementBubble message={getPaletteMessage()} />}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {COLOR_PALETTES.map((palette) => (
          <motion.button
            key={palette.value}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(palette.value)}
            className={`
              relative overflow-hidden rounded-2xl bg-white
              border-3 transition-all duration-200
              ${
                selectedPalette === palette.value
                  ? 'border-spark-400 ring-4 ring-spark-100'
                  : 'border-gray-100 hover:border-spark-200'
              }
            `}
          >
            {/* Color swatches */}
            <div className="flex h-24">
              {palette.colors.map((color, i) => (
                <div
                  key={i}
                  className="flex-1"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            {/* Label area */}
            <div className="p-4">
              <h3 className="font-bold text-gray-800">{palette.label}</h3>
              <p className="text-sm text-gray-500">{palette.sublabel}</p>
            </div>

            {/* Selection indicator */}
            {selectedPalette === palette.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
              >
                <svg
                  className="w-5 h-5 text-spark-500"
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

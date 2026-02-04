import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useStoryStore } from '../../context/StoryContext';
import QuestionLayout, { EncouragementBubble } from '../common/QuestionLayout';

const ART_STYLES = [
  {
    value: 'watercolor',
    label: 'Watercolor',
    sublabel: 'Soft and dreamy',
    description: 'Gentle brushstrokes and flowing colors',
    gradient: 'from-blue-200 via-pink-200 to-yellow-100',
  },
  {
    value: 'cartoon',
    label: 'Cartoon',
    sublabel: 'Bright and fun',
    description: 'Bold colors and clean lines',
    gradient: 'from-yellow-400 via-red-400 to-pink-400',
  },
  {
    value: 'storybook',
    label: 'Classic Storybook',
    sublabel: 'Warm and cozy',
    description: 'Like a golden book from long ago',
    gradient: 'from-amber-200 via-orange-200 to-rose-200',
  },
  {
    value: 'collage',
    label: 'Paper Collage',
    sublabel: 'Crafty and playful',
    description: 'Cut paper textures and layers',
    gradient: 'from-green-200 via-teal-200 to-cyan-200',
  },
  {
    value: 'pencil',
    label: 'Colored Pencil',
    sublabel: 'Hand-drawn feel',
    description: 'Sketchy and personal',
    gradient: 'from-purple-200 via-indigo-200 to-blue-200',
  },
  {
    value: 'pixel',
    label: 'Pixel Art',
    sublabel: 'Retro game style',
    description: 'Cute and blocky',
    gradient: 'from-fuchsia-400 via-violet-400 to-indigo-400',
  },
];

export default function ArtStylePicker() {
  const { storySpec, updateStorySpec, nextPhase, prevPhase } = useStoryStore();
  const selectedStyle = storySpec.artStyle;

  const handleSelect = (style) => {
    updateStorySpec({ artStyle: style });
  };

  const canContinue = !!selectedStyle;

  const getStyleMessage = () => {
    const style = ART_STYLES.find((s) => s.value === selectedStyle);
    if (!style) return null;
    return `${style.label} style - ${style.description}!`;
  };

  return (
    <QuestionLayout
      title="What should the pictures look like?"
      subtitle="Pick an art style for your story!"
      onNext={nextPhase}
      onBack={prevPhase}
      canContinue={canContinue}
    >
      {selectedStyle && <EncouragementBubble message={getStyleMessage()} />}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {ART_STYLES.map((style) => (
          <motion.button
            key={style.value}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(style.value)}
            className={`
              relative overflow-hidden rounded-2xl
              border-3 transition-all duration-200
              ${
                selectedStyle === style.value
                  ? 'border-spark-400 ring-4 ring-spark-100'
                  : 'border-gray-100 hover:border-spark-200'
              }
            `}
          >
            {/* Gradient preview background */}
            <div
              className={`
                h-32 bg-gradient-to-br ${style.gradient}
                flex items-center justify-center
              `}
            >
              {/* Sample illustration placeholder */}
              <div className="text-5xl opacity-80">
                {style.value === 'watercolor' && '🎨'}
                {style.value === 'cartoon' && '🌈'}
                {style.value === 'storybook' && '📖'}
                {style.value === 'collage' && '✂️'}
                {style.value === 'pencil' && '✏️'}
                {style.value === 'pixel' && '👾'}
              </div>
            </div>

            {/* Label area */}
            <div className="bg-white p-4">
              <h3 className="font-bold text-gray-800">{style.label}</h3>
              <p className="text-sm text-gray-500">{style.sublabel}</p>
            </div>

            {/* Selection indicator */}
            {selectedStyle === style.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-8 h-8 bg-spark-400 rounded-full flex items-center justify-center shadow-lg"
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

      <p className="text-center text-sm text-gray-500 mt-6">
        Each style creates a unique look for your storybook!
      </p>
    </QuestionLayout>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore, PHASES } from '../../context/StoryContext';

const TIPS = {
  [PHASES.CHARACTER_TYPE]: {
    title: 'Choosing a Character',
    tip: 'Let your child lead! If they want to pick something not in the list, use "Something else" to type it in. Any character they imagine can be the star.',
  },
  [PHASES.CHARACTER_NAME]: {
    title: 'Naming the Character',
    tip: 'Names can be silly, made-up, or meaningful. If your child is stuck, try asking: "What name makes you smile?"',
  },
  [PHASES.CHARACTER_TRAITS]: {
    title: 'Personality Traits',
    tip: 'These traits will influence how the character acts in the story. Choosing 2 traits creates more interesting characters!',
  },
  [PHASES.SIDEKICK]: {
    title: 'Adding a Friend',
    tip: 'A sidekick can make the story more fun with dialogue. But solo adventures are great too - there\'s no wrong choice!',
  },
  [PHASES.LOCATION]: {
    title: 'Story Setting',
    tip: 'Help your child imagine where the adventure happens. Ask: "What does it look like there? What can you see?"',
  },
  [PHASES.TIME_ERA]: {
    title: 'When It Happens',
    tip: '"Once upon a dream" is perfect if your child wants a magical, timeless feel without worrying about when.',
  },
  [PHASES.THEME]: {
    title: 'Story Theme',
    tip: 'This determines what kind of adventure it is. Each theme leads to different story possibilities!',
  },
  [PHASES.CONFLICT]: {
    title: 'The Challenge',
    tip: 'Every good story needs a problem to solve. These are gentle challenges appropriate for young children.',
  },
  [PHASES.ENDING_MOOD]: {
    title: 'How It Ends',
    tip: 'All our endings are positive! This just sets the emotional tone for the final pages.',
  },
  [PHASES.ART_STYLE]: {
    title: 'Art Style',
    tip: 'The preview images show real AI-generated samples in each style. What appeals to your child visually?',
  },
  [PHASES.COLOR_PALETTE]: {
    title: 'Colors',
    tip: 'Colors set the mood! Bright colors feel energetic, while cooler colors feel calmer.',
  },
  [PHASES.STORY_LENGTH]: {
    title: 'Story Length',
    tip: '5 pages is perfect for shorter attention spans. 12 pages creates a fuller adventure.',
  },
  [PHASES.REVIEW]: {
    title: 'Review Choices',
    tip: 'Double-check everything looks right. You can go back and change any choice before creating the story.',
  },
};

export default function ParentPanel({ isOpen }) {
  const { phase, toggleParentMode, storySpec, updateMainCharacter, updateSidekick } = useStoryStore();

  const currentTip = TIPS[phase];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Parent Helper</h2>
              <button
                onClick={toggleParentMode}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close panel"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Current step tip */}
            {currentTip && (
              <div className="bg-spark-50 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-spark-700 mb-2">{currentTip.title}</h3>
                <p className="text-sm text-gray-700">{currentTip.tip}</p>
              </div>
            )}

            {/* Quick input helpers */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-700">Quick Actions</h3>

              {/* Character name override */}
              {phase === PHASES.CHARACTER_NAME && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Type name for child:
                  </label>
                  <input
                    type="text"
                    value={storySpec.mainCharacter.name}
                    onChange={(e) => updateMainCharacter({ name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-base"
                    placeholder="Character name"
                  />
                </div>
              )}

              {/* Custom description */}
              {phase === PHASES.CHARACTER_TYPE && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Describe custom character:
                  </label>
                  <textarea
                    value={storySpec.mainCharacter.description}
                    onChange={(e) => updateMainCharacter({ description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm resize-none"
                    rows={3}
                    placeholder="A purple dinosaur who loves to dance..."
                  />
                </div>
              )}
            </div>

            {/* General tips */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-bold text-gray-700 mb-3">General Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-spark-400">•</span>
                  Let your child make choices - there are no wrong answers!
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-spark-400">•</span>
                  You can help read the questions aloud.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-spark-400">•</span>
                  Use the voice button for text input if your child prefers speaking.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-spark-400">•</span>
                  The first image generation may ask you to sign into Puter (it's free!).
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

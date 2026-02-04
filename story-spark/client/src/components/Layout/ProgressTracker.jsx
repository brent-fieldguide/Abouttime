import { motion } from 'framer-motion';
import { useStoryStore, PHASE_ORDER, PHASES } from '../../context/StoryContext';

const PHASE_GROUPS = [
  { label: 'Character', phases: [PHASES.CHARACTER_TYPE, PHASES.CHARACTER_NAME, PHASES.CHARACTER_TRAITS, PHASES.SIDEKICK] },
  { label: 'Setting', phases: [PHASES.LOCATION, PHASES.TIME_ERA] },
  { label: 'Story', phases: [PHASES.THEME, PHASES.CONFLICT, PHASES.ENDING_MOOD] },
  { label: 'Style', phases: [PHASES.ART_STYLE, PHASES.COLOR_PALETTE, PHASES.STORY_LENGTH] },
  { label: 'Review', phases: [PHASES.REVIEW] },
];

export default function ProgressTracker() {
  const { phase, toggleParentMode } = useStoryStore();
  const currentIndex = PHASE_ORDER.indexOf(phase);

  // Find which group the current phase belongs to
  const getCurrentGroup = () => {
    for (let i = 0; i < PHASE_GROUPS.length; i++) {
      if (PHASE_GROUPS[i].phases.includes(phase)) {
        return i;
      }
    }
    return 0;
  };

  const currentGroup = getCurrentGroup();

  return (
    <div className="flex items-center justify-between">
      {/* Progress stars */}
      <div className="flex items-center gap-1 md:gap-2 flex-1">
        {PHASE_GROUPS.map((group, index) => {
          const isComplete = index < currentGroup;
          const isCurrent = index === currentGroup;

          return (
            <div key={group.label} className="flex items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                }}
                className="flex flex-col items-center"
              >
                <div
                  className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${isComplete ? 'bg-gradient-to-r from-spark-400 to-spark-500 text-white' : ''}
                    ${isCurrent ? 'bg-gradient-to-r from-magic-400 to-magic-500 text-white ring-4 ring-magic-100' : ''}
                    ${!isComplete && !isCurrent ? 'bg-gray-200 text-gray-400' : ''}
                  `}
                >
                  {isComplete ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-sm font-bold">{index + 1}</span>
                  )}
                </div>
                <span
                  className={`
                    hidden md:block text-xs mt-1 font-medium
                    ${isCurrent ? 'text-magic-600' : isComplete ? 'text-spark-600' : 'text-gray-400'}
                  `}
                >
                  {group.label}
                </span>
              </motion.div>

              {/* Connector line */}
              {index < PHASE_GROUPS.length - 1 && (
                <div
                  className={`
                    w-4 md:w-8 h-1 mx-1
                    ${index < currentGroup ? 'bg-spark-400' : 'bg-gray-200'}
                    rounded-full transition-colors duration-300
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Parent mode toggle */}
      <button
        onClick={toggleParentMode}
        className="ml-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle parent helper"
        title="Parent helper"
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
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </div>
  );
}

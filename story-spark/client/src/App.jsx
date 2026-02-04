import { useStoryStore, PHASES } from './context/StoryContext';
import { AnimatePresence, motion } from 'framer-motion';

// Layout components
import ProgressTracker from './components/Layout/ProgressTracker';
import ParentPanel from './components/Layout/ParentPanel';

// Question flow components
import WelcomeScreen from './components/QuestionFlow/WelcomeScreen';
import CharacterPicker from './components/QuestionFlow/CharacterPicker';
import NameInput from './components/QuestionFlow/NameInput';
import TraitPicker from './components/QuestionFlow/TraitPicker';
import SidekickStep from './components/QuestionFlow/SidekickStep';
import LocationPicker from './components/QuestionFlow/LocationPicker';
import TimePicker from './components/QuestionFlow/TimePicker';
import ThemePicker from './components/QuestionFlow/ThemePicker';
import ConflictPicker from './components/QuestionFlow/ConflictPicker';
import EndingPicker from './components/QuestionFlow/EndingPicker';
import ArtStylePicker from './components/QuestionFlow/ArtStylePicker';
import ColorPicker from './components/QuestionFlow/ColorPicker';
import LengthPicker from './components/QuestionFlow/LengthPicker';
import ReviewCard from './components/QuestionFlow/ReviewCard';

// Generation components
import GeneratingScreen from './components/Generation/GeneratingScreen';
import ApprovalScreen from './components/Generation/ApprovalScreen';

// Story viewer components
import StoryViewer from './components/StoryViewer/StoryViewer';
import ExportScreen from './components/StoryViewer/ExportScreen';

const pageVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

function App() {
  const { phase, parentModeActive } = useStoryStore();

  const renderPhase = () => {
    switch (phase) {
      case PHASES.WELCOME:
        return <WelcomeScreen />;
      case PHASES.CHARACTER_TYPE:
        return <CharacterPicker />;
      case PHASES.CHARACTER_NAME:
        return <NameInput />;
      case PHASES.CHARACTER_TRAITS:
        return <TraitPicker />;
      case PHASES.SIDEKICK:
        return <SidekickStep />;
      case PHASES.LOCATION:
        return <LocationPicker />;
      case PHASES.TIME_ERA:
        return <TimePicker />;
      case PHASES.THEME:
        return <ThemePicker />;
      case PHASES.CONFLICT:
        return <ConflictPicker />;
      case PHASES.ENDING_MOOD:
        return <EndingPicker />;
      case PHASES.ART_STYLE:
        return <ArtStylePicker />;
      case PHASES.COLOR_PALETTE:
        return <ColorPicker />;
      case PHASES.STORY_LENGTH:
        return <LengthPicker />;
      case PHASES.REVIEW:
        return <ReviewCard />;
      case PHASES.GENERATING:
        return <GeneratingScreen />;
      case PHASES.APPROVAL:
        return <ApprovalScreen />;
      case PHASES.VIEWING:
        return <StoryViewer />;
      case PHASES.EXPORT:
        return <ExportScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  const showProgress = ![
    PHASES.WELCOME,
    PHASES.GENERATING,
    PHASES.APPROVAL,
    PHASES.VIEWING,
    PHASES.EXPORT,
  ].includes(phase);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with progress */}
      {showProgress && (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3">
            <ProgressTracker />
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={phase}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {renderPhase()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Parent panel */}
      <ParentPanel isOpen={parentModeActive} />

      {/* Footer attribution */}
      {phase === PHASES.WELCOME && (
        <footer className="text-center py-4 text-sm text-gray-500">
          Made with love for young storytellers
        </footer>
      )}
    </div>
  );
}

export default App;

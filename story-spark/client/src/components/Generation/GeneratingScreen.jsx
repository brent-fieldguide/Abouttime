import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore, PHASES } from '../../context/StoryContext';
import { useStoryGeneration } from '../../hooks/useStoryGeneration';
import { useStoryImageGeneration } from '../../hooks/useImageGeneration';
import { SparkleLoader, ProgressLoader } from '../common/LoadingAnimation';
import BigButton from '../common/BigButton';

const GENERATING_MESSAGES = [
  'The story elves are getting creative...',
  'Mixing magical words together...',
  'Adding a sprinkle of imagination...',
  'Painting wonderful pictures...',
  'Making sure everything is just right...',
  'Almost there, keep watching...',
];

export default function GeneratingScreen() {
  const {
    storySpec,
    setPhase,
    setCharacterDesign,
    setGeneratedStory,
    setGeneratedImages,
    setGenerationError,
  } = useStoryStore();

  const { generateStory, isGenerating: isGeneratingText, error: textError } = useStoryGeneration();
  const {
    generateStoryImages,
    isGenerating: isGeneratingImages,
    progress: imageProgress,
    error: imageError,
  } = useStoryImageGeneration();

  const [stage, setStage] = useState('text'); // 'text' | 'images' | 'done' | 'error'
  const [messageIndex, setMessageIndex] = useState(0);
  const [storyResult, setStoryResult] = useState(null);

  // Cycle through fun messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % GENERATING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Start generation on mount
  useEffect(() => {
    let cancelled = false;

    async function generate() {
      // Step 1: Generate story text
      setStage('text');
      const result = await generateStory(storySpec);

      if (cancelled) return;

      if (!result) {
        setStage('error');
        setGenerationError(textError || 'Failed to generate story');
        return;
      }

      setStoryResult(result);
      setCharacterDesign(result.characterDesign);
      setGeneratedStory(result.story);

      // Step 2: Generate images
      setStage('images');
      const images = await generateStoryImages(
        result.story.pages,
        storySpec,
        result.characterDesign
      );

      if (cancelled) return;

      if (images.length === 0) {
        setStage('error');
        setGenerationError(imageError || 'Failed to generate images');
        return;
      }

      setGeneratedImages(images);
      setStage('done');

      // Move to approval after short delay
      setTimeout(() => {
        if (!cancelled) {
          setPhase(PHASES.APPROVAL);
        }
      }, 1500);
    }

    generate();

    return () => {
      cancelled = true;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetry = () => {
    setStage('text');
    setStoryResult(null);
    // Re-trigger by remounting (simple approach)
    setPhase(PHASES.REVIEW);
    setTimeout(() => setPhase(PHASES.GENERATING), 100);
  };

  if (stage === 'error') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl mb-6"
        >
          😔
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Oops! The story elves need a moment.
        </h1>
        <p className="text-gray-600 mb-8 max-w-md">
          Something didn't work quite right, but don't worry! Let's try again.
        </p>
        <BigButton variant="primary" onClick={handleRetry}>
          Try Again!
        </BigButton>
      </div>
    );
  }

  if (stage === 'done') {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
          className="text-7xl mb-6"
        >
          🎉
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-4"
        >
          Your story is ready!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600"
        >
          Let's take a look...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
      >
        Creating Your Story
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-lg text-gray-600 mb-8"
      >
        for {storySpec.mainCharacter.name}
      </motion.p>

      {/* Progress indicator */}
      {stage === 'text' && (
        <SparkleLoader message={GENERATING_MESSAGES[messageIndex]} />
      )}

      {stage === 'images' && (
        <ProgressLoader
          message={imageProgress.status || 'Painting the pictures...'}
          current={imageProgress.current}
          total={imageProgress.total}
        />
      )}

      {/* Stage indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex gap-4 mt-8"
      >
        <StageIndicator
          label="Writing"
          icon="✍️"
          status={stage === 'text' ? 'active' : 'done'}
        />
        <StageIndicator
          label="Painting"
          icon="🎨"
          status={
            stage === 'images' ? 'active' : stage === 'text' ? 'pending' : 'done'
          }
        />
        <StageIndicator
          label="Done"
          icon="✨"
          status={stage === 'done' ? 'active' : 'pending'}
        />
      </motion.div>

      {/* Fun facts while waiting */}
      <AnimatePresence mode="wait">
        <motion.div
          key={messageIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-12 text-sm text-gray-500 max-w-md"
        >
          {stage === 'text' && (
            <p>
              Did you know? The best stories have a beginning, middle, and end!
            </p>
          )}
          {stage === 'images' && (
            <p>
              Each picture is painted just for your story. No two are exactly alike!
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function StageIndicator({ label, icon, status }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        animate={
          status === 'active'
            ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
            : {}
        }
        transition={{ duration: 1, repeat: status === 'active' ? Infinity : 0 }}
        className={`
          w-12 h-12 rounded-full flex items-center justify-center text-xl
          ${status === 'done' ? 'bg-green-100' : ''}
          ${status === 'active' ? 'bg-spark-100 ring-4 ring-spark-200' : ''}
          ${status === 'pending' ? 'bg-gray-100' : ''}
        `}
      >
        {status === 'done' ? '✓' : icon}
      </motion.div>
      <span
        className={`text-sm font-medium ${
          status === 'active' ? 'text-spark-600' : 'text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  );
}

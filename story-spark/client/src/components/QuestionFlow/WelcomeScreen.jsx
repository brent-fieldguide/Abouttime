import { motion } from 'framer-motion';
import { useStoryStore, PHASES } from '../../context/StoryContext';
import BigButton from '../common/BigButton';

export default function WelcomeScreen() {
  const { setPhase } = useStoryStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Animated logo/title */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="text-7xl md:text-8xl mb-4"
        >
          📚✨
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-spark-500 via-magic-500 to-spark-500 bg-clip-text text-transparent">
          Story Spark
        </h1>
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl md:text-2xl text-gray-600 mb-12 max-w-md"
      >
        Let's create a magical storybook together!
      </motion.p>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex flex-wrap justify-center gap-4 mb-12"
      >
        {[
          { icon: '🎨', text: 'Beautiful pictures' },
          { icon: '📖', text: 'Your own story' },
          { icon: '🌟', text: 'Made by you!' },
        ].map((feature, i) => (
          <motion.div
            key={feature.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + i * 0.1 }}
            className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm"
          >
            <span className="text-2xl">{feature.icon}</span>
            <span className="font-medium text-gray-700">{feature.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Start button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <BigButton
          variant="magic"
          size="large"
          onClick={() => setPhase(PHASES.CHARACTER_TYPE)}
          className="px-12"
        >
          Start My Story!
        </BigButton>
      </motion.div>

      {/* Decorative elements */}
      <motion.div
        className="absolute top-10 left-10 text-4xl opacity-20"
        animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        ⭐
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-4xl opacity-20"
        animate={{ y: [0, 10, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
      >
        🌙
      </motion.div>
      <motion.div
        className="absolute top-1/4 right-20 text-3xl opacity-20"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      >
        ✨
      </motion.div>
    </div>
  );
}

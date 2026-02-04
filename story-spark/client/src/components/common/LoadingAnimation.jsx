import { motion } from 'framer-motion';

export default function LoadingAnimation({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 rounded-full bg-gradient-to-r from-spark-400 to-magic-400"
            animate={{
              y: [0, -12, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      <p className="text-lg text-gray-600 font-medium">{message}</p>
    </div>
  );
}

export function SparkleLoader({ message }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="relative w-24 h-24">
        {/* Central sparkle */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <span className="text-5xl">✨</span>
        </motion.div>

        {/* Orbiting sparkles */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
            }}
            animate={{
              x: [0, 40, 0, -40, 0],
              y: [-40, 0, 40, 0, -40],
              scale: [1, 0.8, 1, 0.8, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.75,
            }}
          >
            <span className="text-2xl">⭐</span>
          </motion.div>
        ))}
      </div>

      <motion.p
        className="text-xl text-gray-700 font-medium text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
}

export function ProgressLoader({ message, current, total }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8 w-full max-w-md mx-auto">
      <SparkleLoader message={message} />

      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-spark-400 via-magic-400 to-spark-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <p className="text-sm text-gray-500">
        {current} of {total} complete
      </p>
    </div>
  );
}

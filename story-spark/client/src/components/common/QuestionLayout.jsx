import { motion } from 'framer-motion';
import BigButton from './BigButton';

export default function QuestionLayout({
  title,
  subtitle,
  children,
  onNext,
  onBack,
  nextLabel = 'Next',
  backLabel = 'Back',
  canContinue = true,
  showBack = true,
  centerContent = false,
}) {
  return (
    <div className="flex flex-col min-h-[70vh]">
      {/* Question header */}
      <div className="text-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            {subtitle}
          </motion.p>
        )}
      </div>

      {/* Content area */}
      <div
        className={`flex-1 ${
          centerContent ? 'flex items-center justify-center' : ''
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </div>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-4 mt-8 justify-center"
      >
        {showBack && (
          <BigButton variant="secondary" onClick={onBack} size="medium">
            {backLabel}
          </BigButton>
        )}
        <BigButton
          variant="primary"
          onClick={onNext}
          disabled={!canContinue}
          size="medium"
        >
          {nextLabel}
        </BigButton>
      </motion.div>
    </div>
  );
}

export function EncouragementBubble({ message }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-r from-spark-100 to-magic-100 rounded-2xl px-6 py-3 text-center mb-6"
    >
      <p className="text-lg font-medium text-gray-700">{message}</p>
    </motion.div>
  );
}

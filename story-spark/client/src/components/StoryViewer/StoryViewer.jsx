import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore, PHASES } from '../../context/StoryContext';
import PageSpread from './PageSpread';
import ReadAloudButton from './ReadAloudButton';
import BigButton from '../common/BigButton';

export default function StoryViewer() {
  const { generatedStory, generatedImages, setPhase, resetStory } = useStoryStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const pages = generatedStory?.pages || [];
  const title = generatedStory?.title || 'Your Story';

  // Show confetti when reaching the end
  useEffect(() => {
    if (currentPage === pages.length - 1) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [currentPage, pages.length]);

  const getImageForPage = (pageNumber) => {
    const img = generatedImages.find((i) => i.pageNumber === pageNumber);
    return img?.imageSrc;
  };

  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(0, p - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(pages.length - 1, p + 1));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrevPage();
    if (e.key === 'ArrowRight') handleNextPage();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExport = () => {
    setPhase(PHASES.EXPORT);
  };

  const handleNewStory = () => {
    if (window.confirm('Start a brand new story? Your current story will be saved in the PDF first!')) {
      setPhase(PHASES.EXPORT);
    }
  };

  const isLastPage = currentPage === pages.length - 1;
  const isFirstPage = currentPage === 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 py-6 px-4">
      {/* Confetti effect */}
      {showConfetti && <Confetti />}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 font-story">
            {title}
          </h1>
        </div>

        {/* Book container */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, rotateY: -10 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 10 }}
              transition={{ duration: 0.3 }}
            >
              <PageSpread
                page={pages[currentPage]}
                imageSrc={getImageForPage(pages[currentPage]?.pageNumber)}
                pageNumber={currentPage + 1}
                totalPages={pages.length}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <button
            onClick={handlePrevPage}
            disabled={isFirstPage}
            className={`
              absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12
              w-12 h-12 rounded-full bg-white shadow-lg
              flex items-center justify-center
              transition-all duration-200
              ${isFirstPage ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 hover:bg-spark-50'}
            `}
            aria-label="Previous page"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNextPage}
            disabled={isLastPage}
            className={`
              absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12
              w-12 h-12 rounded-full bg-white shadow-lg
              flex items-center justify-center
              transition-all duration-200
              ${isLastPage ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 hover:bg-spark-50'}
            `}
            aria-label="Next page"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Page indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {pages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              className={`
                w-3 h-3 rounded-full transition-all duration-200
                ${currentPage === index ? 'bg-spark-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'}
              `}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          <ReadAloudButton
            text={pages[currentPage]?.text}
            isReading={isReading}
            onReadingChange={setIsReading}
          />

          <BigButton variant="secondary" size="medium" onClick={handleExport}>
            <span className="mr-2">📥</span>
            Download PDF
          </BigButton>

          <BigButton variant="secondary" size="medium" onClick={handleNewStory}>
            <span className="mr-2">✨</span>
            New Story
          </BigButton>
        </div>

        {/* End message */}
        {isLastPage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8 p-6 bg-white/80 rounded-2xl"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-2">The End!</h2>
            <p className="text-gray-600">
              What a wonderful story! Don't forget to download your PDF to keep forever.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Confetti() {
  const colors = ['#FFD93D', '#FF6B6B', '#4D96FF', '#6BCB77', '#C77DFF'];
  const confettiPieces = Array.from({ length: 50 });

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confettiPieces.map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: window.innerHeight + 20,
            rotate: Math.random() * 720,
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.5,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

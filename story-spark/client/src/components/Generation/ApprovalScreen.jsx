import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore, PHASES } from '../../context/StoryContext';
import { useStoryImageGeneration } from '../../hooks/useImageGeneration';
import BigButton from '../common/BigButton';
import { SparkleLoader } from '../common/LoadingAnimation';

export default function ApprovalScreen() {
  const {
    storySpec,
    generatedStory,
    generatedImages,
    characterDesign,
    updateGeneratedImage,
    setPhase,
  } = useStoryStore();

  const { regenerateImage } = useStoryImageGeneration();
  const [regeneratingPage, setRegeneratingPage] = useState(null);
  const [currentPreview, setCurrentPreview] = useState(0);

  const pages = generatedStory?.pages || [];

  const handleRegenerate = async (pageIndex) => {
    const page = pages[pageIndex];
    setRegeneratingPage(pageIndex);

    try {
      const newImage = await regenerateImage(page, storySpec, characterDesign);
      updateGeneratedImage(page.pageNumber, newImage.imageSrc);
    } catch (err) {
      console.error('Failed to regenerate image:', err);
    }

    setRegeneratingPage(null);
  };

  const handleApprove = () => {
    setPhase(PHASES.VIEWING);
  };

  const handleBack = () => {
    setPhase(PHASES.REVIEW);
  };

  const getImageForPage = (pageNumber) => {
    const img = generatedImages.find((i) => i.pageNumber === pageNumber);
    return img?.imageSrc;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
          >
            {generatedStory?.title || 'Your Story'}
          </motion.h1>
          <p className="text-gray-600">
            Review the pictures before reading your story
          </p>
          <p className="text-sm text-spark-600 mt-2">
            Parent tip: You can regenerate any picture you'd like to change
          </p>
        </div>

        {/* Page thumbnails grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {pages.map((page, index) => {
            const imageSrc = getImageForPage(page.pageNumber);
            const isRegenerating = regeneratingPage === index;

            return (
              <motion.div
                key={page.pageNumber}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative bg-white rounded-xl overflow-hidden shadow-lg
                  border-2 transition-all cursor-pointer
                  ${currentPreview === index ? 'border-spark-400 ring-4 ring-spark-100' : 'border-gray-100'}
                `}
                onClick={() => setCurrentPreview(index)}
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-gray-100 relative">
                  {isRegenerating ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                      <SparkleLoader message="Painting..." />
                    </div>
                  ) : imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={`Page ${page.pageNumber}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <span className="text-4xl">🖼️</span>
                    </div>
                  )}
                </div>

                {/* Page info */}
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Page {page.pageNumber}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRegenerate(index);
                      }}
                      disabled={isRegenerating}
                      className="text-xs text-spark-500 hover:text-spark-600 font-medium disabled:opacity-50"
                    >
                      {isRegenerating ? 'Working...' : 'Regenerate'}
                    </button>
                  </div>
                </div>

                {/* Selection indicator */}
                {currentPreview === index && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-spark-400 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Large preview of selected page */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPreview}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-2xl shadow-xl p-6 mb-8"
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Image preview */}
              <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden">
                {getImageForPage(pages[currentPreview]?.pageNumber) ? (
                  <img
                    src={getImageForPage(pages[currentPreview]?.pageNumber)}
                    alt={`Page ${currentPreview + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-6xl">🖼️</span>
                  </div>
                )}
              </div>

              {/* Text preview */}
              <div className="flex flex-col justify-center">
                <h2 className="text-lg font-bold text-gray-600 mb-2">
                  Page {pages[currentPreview]?.pageNumber}
                </h2>
                <p className="text-xl text-gray-800 font-story leading-relaxed">
                  {pages[currentPreview]?.text}
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setCurrentPreview(Math.max(0, currentPreview - 1))}
                    disabled={currentPreview === 0}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPreview(Math.min(pages.length - 1, currentPreview + 1))
                    }
                    disabled={currentPreview === pages.length - 1}
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Action buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <BigButton variant="secondary" onClick={handleBack}>
            Go Back
          </BigButton>
          <BigButton variant="magic" onClick={handleApprove}>
            <span className="mr-2">📖</span>
            Read My Story!
          </BigButton>
        </div>
      </div>
    </div>
  );
}

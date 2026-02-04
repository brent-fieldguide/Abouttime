import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStoryStore, PHASES } from '../../context/StoryContext';
import BigButton from '../common/BigButton';
import { SparkleLoader } from '../common/LoadingAnimation';
import { generateStoryPDF } from '../../services/pdfExport';

export default function ExportScreen() {
  const { storySpec, generatedStory, generatedImages, authorName, setAuthorName, setPhase, resetStory } =
    useStoryStore();

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [localAuthorName, setLocalAuthorName] = useState(authorName || '');

  const handleExport = async () => {
    setIsExporting(true);
    setExportError(null);

    try {
      // Save author name
      setAuthorName(localAuthorName);

      await generateStoryPDF({
        story: generatedStory,
        images: generatedImages,
        authorName: localAuthorName,
        characterName: storySpec.mainCharacter.name,
      });

      setIsExporting(false);
    } catch (err) {
      console.error('PDF export failed:', err);
      setExportError('Failed to create PDF. Please try again.');
      setIsExporting(false);
    }
  };

  const handleBackToStory = () => {
    setPhase(PHASES.VIEWING);
  };

  const handleNewStory = () => {
    resetStory();
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-6xl mb-4"
            >
              📚
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Download Your Storybook
            </h1>
            <p className="text-gray-600">
              Save your story as a PDF to print or share!
            </p>
          </div>

          {/* Author name input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author's Name
            </label>
            <input
              type="text"
              value={localAuthorName}
              onChange={(e) => setLocalAuthorName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-spark-400 focus:outline-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              This will appear on the cover: "Written by {localAuthorName || '...'}"
            </p>
          </div>

          {/* Preview info */}
          <div className="bg-spark-50 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Your storybook includes:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✓ Beautiful cover with title</li>
              <li>✓ {generatedStory?.pages?.length || 0} illustrated pages</li>
              <li>✓ "The End" page with your character</li>
              <li>✓ Ready to print!</li>
            </ul>
          </div>

          {/* Error message */}
          {exportError && (
            <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-6 text-center">
              {exportError}
            </div>
          )}

          {/* Export button */}
          {isExporting ? (
            <div className="py-8">
              <SparkleLoader message="Creating your PDF..." />
            </div>
          ) : (
            <div className="space-y-4">
              <BigButton
                variant="magic"
                size="large"
                onClick={handleExport}
                className="w-full"
              >
                <span className="mr-2">📥</span>
                Download PDF
              </BigButton>

              <div className="flex gap-3">
                <BigButton
                  variant="secondary"
                  size="medium"
                  onClick={handleBackToStory}
                  className="flex-1"
                >
                  Back to Story
                </BigButton>
                <BigButton
                  variant="secondary"
                  size="medium"
                  onClick={handleNewStory}
                  className="flex-1"
                >
                  New Story
                </BigButton>
              </div>
            </div>
          )}
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-gray-500"
        >
          <p>Tip: Print on good paper for the best results!</p>
        </motion.div>
      </div>
    </div>
  );
}

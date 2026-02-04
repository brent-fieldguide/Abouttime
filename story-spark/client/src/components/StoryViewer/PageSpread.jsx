import { motion } from 'framer-motion';

export default function PageSpread({ page, imageSrc, pageNumber, totalPages }) {
  if (!page) return null;

  return (
    <div className="story-page bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Image area */}
      <div className="aspect-[16/10] md:aspect-[16/9] bg-gray-100 relative overflow-hidden">
        {imageSrc ? (
          <motion.img
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={imageSrc}
            alt={`Illustration for page ${pageNumber}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <span className="text-6xl block mb-2">🖼️</span>
              <span>Illustration</span>
            </div>
          </div>
        )}

        {/* Page number badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
          <span className="text-sm font-medium text-gray-600">
            {pageNumber} / {totalPages}
          </span>
        </div>
      </div>

      {/* Text area */}
      <div className="p-6 md:p-8 lg:p-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl lg:text-3xl text-gray-800 font-story leading-relaxed text-center"
        >
          {page.text}
        </motion.p>
      </div>

      {/* Decorative page curl */}
      <div className="absolute bottom-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
        <div
          className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-gray-200 to-transparent transform rotate-45 translate-x-8 translate-y-8"
          style={{ boxShadow: '-2px -2px 5px rgba(0,0,0,0.1)' }}
        />
      </div>
    </div>
  );
}

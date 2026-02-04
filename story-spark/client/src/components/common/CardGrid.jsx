import { motion } from 'framer-motion';

export function CardGrid({ children, columns = 3, className = '' }) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {children}
    </div>
  );
}

export function SelectionCard({
  children,
  onClick,
  selected = false,
  disabled = false,
  icon,
  label,
  sublabel,
  image,
  className = '',
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -2 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative p-4 rounded-2xl
        bg-white
        border-3 transition-all duration-200
        ${
          selected
            ? 'border-spark-400 ring-4 ring-spark-100 card-shadow-hover'
            : 'border-gray-100 hover:border-spark-200 card-shadow'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        flex flex-col items-center justify-center gap-2
        min-h-[120px] touch-target
        ${className}
      `}
    >
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2 right-2 w-6 h-6 bg-spark-400 rounded-full flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      )}

      {image && (
        <div className="w-16 h-16 rounded-xl overflow-hidden mb-1">
          <img src={image} alt={label} className="w-full h-full object-cover" />
        </div>
      )}

      {icon && !image && (
        <span className="text-4xl mb-1" role="img" aria-label={label}>
          {icon}
        </span>
      )}

      {label && (
        <span className="text-base font-bold text-gray-800 text-center leading-tight">
          {label}
        </span>
      )}

      {sublabel && (
        <span className="text-sm text-gray-500 text-center">{sublabel}</span>
      )}

      {children}
    </motion.button>
  );
}

export function MultiSelectCard({
  onClick,
  selected = false,
  icon,
  label,
  maxReached = false,
}) {
  const isDisabled = !selected && maxReached;

  return (
    <SelectionCard
      onClick={onClick}
      selected={selected}
      disabled={isDisabled}
      icon={icon}
      label={label}
      className={isDisabled ? 'opacity-40' : ''}
    />
  );
}

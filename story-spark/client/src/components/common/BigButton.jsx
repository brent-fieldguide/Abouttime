import { motion } from 'framer-motion';

export default function BigButton({
  children,
  onClick,
  variant = 'primary',
  size = 'large',
  disabled = false,
  className = '',
  icon,
  ...props
}) {
  const variants = {
    primary:
      'bg-gradient-to-r from-spark-400 to-spark-500 hover:from-spark-500 hover:to-spark-600 text-white shadow-lg hover:shadow-xl',
    secondary:
      'bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-spark-300',
    magic:
      'bg-gradient-to-r from-magic-400 to-magic-500 hover:from-magic-500 hover:to-magic-600 text-white shadow-lg hover:shadow-xl',
    ghost:
      'bg-transparent hover:bg-gray-100 text-gray-600',
  };

  const sizes = {
    small: 'px-4 py-2 text-base min-h-[48px]',
    medium: 'px-6 py-3 text-lg min-h-[56px]',
    large: 'px-8 py-4 text-xl min-h-[64px]',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-2xl font-bold
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-3
        touch-target
        ${className}
      `}
      {...props}
    >
      {icon && <span className="text-2xl">{icon}</span>}
      {children}
    </motion.button>
  );
}

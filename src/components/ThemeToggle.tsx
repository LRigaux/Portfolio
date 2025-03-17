'use client';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={`
        relative w-12 h-12 rounded-full 
        ${theme === 'dark' 
          ? 'bg-shadow-primary shadow-lg shadow-shadow-glow/50' 
          : 'bg-light-primary shadow-lg shadow-light-primary/50'}
        transition-all duration-500
      `}
    >
      {theme === 'dark' ? (
        // Icône Shadow Monarch
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-white">
            {/* Icône personnalisée Shadow Monarch */}
          </svg>
        </motion.div>
      ) : (
        // Icône Cha Hae-In
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="text-shadow-secondary">
            {/* Icône personnalisée Cha Hae-In */}
          </svg>
        </motion.div>
      )}
    </motion.button>
  );
} 
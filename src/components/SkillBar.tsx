'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface SkillBarProps {
  name: string;
  level: number;
  rank: 'S' | 'A' | 'B' | 'C';
  index: number;
}

const SkillBar = ({ name, level, rank, index }: SkillBarProps) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const getRankColor = (rank: string) => {
    if (theme === 'light') {
      switch (rank) {
        case 'S': return 'text-light-red-DEFAULT';
        case 'A': return 'text-light-red-light';
        case 'B': return 'text-light-gold-DEFAULT';
        default: return 'text-light-muted';
      }
    }
    if (theme === 'dark') {
      switch (rank) {
        case 'S': return 'text-shadow-crimson';
        case 'A': return 'text-shadow-red';
        case 'B': return 'text-shadow-purple';
        default: return 'text-shadow-muted';
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="mb-6"
    >
      {/* En-tête de la compétence */}
      <div className="flex justify-between items-center mb-2">
        <span className={`
          text-lg font-semibold
          ${theme === 'light' 
            ? 'text-light-text' 
            : 'text-shadow-text'}
        `}>
          {name}
        </span>
        <motion.span
          className={`
            text-xl font-bold ${getRankColor(rank)}
            transition-all duration-300
          `}
          whileHover={{ scale: 1.1 }}
        >
          {rank}
        </motion.span>
      </div>

      {/* Conteneur de la barre de progression */}
      <div className={`
        relative h-3 rounded-full overflow-hidden
        ${theme === 'light' 
          ? 'bg-light-surface shadow-inner' 
          : 'bg-shadow-surface'}
      `}>
        {/* Effet de brillance de base */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundImage: theme === 'light'
              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
        />

        {/* Barre de progression */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`
            h-full relative
            ${theme === 'light'
              ? isHovered 
                ? 'bg-hover-gradient-light' 
                : 'bg-skill-gradient-light'
              : isHovered 
                ? 'bg-hover-gradient' 
                : 'bg-skill-gradient'}
            transition-all duration-300
          `}
        >
          {/* Effet de brillance au survol */}
          <motion.div
            className="absolute inset-0"
            animate={{
              opacity: isHovered ? [0.3, 0.5, 0.3] : 0.3,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: theme === 'light'
                ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            }}
          />
        </motion.div>
      </div>

      {/* Niveau numérique */}
      <div className="flex justify-end mt-1">
        <motion.span
          animate={{
            color: theme === 'light'
              ? isHovered ? '#9E2A2B' : '#FDB813'
              : isHovered ? '#D32F2F' : '#9C27B0'
          }}
          className="text-sm font-medium"
        >
          Niveau {level}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default SkillBar;
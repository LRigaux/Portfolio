'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface SkillBarProps {
  name: string;
  level: number;
  rank: 'S' | 'A' | 'B' | 'C';
  index: number;
}

export default function SkillBar({ name, level, rank, index }: SkillBarProps) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === 'dark';
  
  // Déterminer la couleur en fonction du rang
  const getRankColor = () => {
    switch (rank) {
      case 'S': return 'bg-red-600 border-red-400';
      case 'A': return 'bg-purple-600 border-purple-400';
      case 'B': return 'bg-blue-600 border-blue-400';
      case 'C': return 'bg-green-600 border-green-400';
      default: return 'bg-green-600 border-green-400';
    }
  };
  
  // Déterminer la couleur du texte en fonction du rang
  const getTextColor = () => {
    switch (rank) {
      case 'S': return 'text-red-400';
      case 'A': return 'text-purple-400';
      case 'B': return 'text-blue-400';
      case 'C': return 'text-green-400';
      default: return 'text-green-400';
    }
  };
  
  // Déterminer la couleur du gradient pour la barre
  const getGradientColor = () => {
    switch (rank) {
      case 'S': return 'from-red-700 to-red-500';
      case 'A': return 'from-purple-700 to-purple-500';
      case 'B': return 'from-blue-700 to-blue-500';
      case 'C': return 'from-green-700 to-green-500';
      default: return 'from-green-700 to-green-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`
        p-4 rounded-lg
        bg-shadow-secondary border border-shadow-system/30
        transform transition-all duration-300
        hover:shadow-lg
      `}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.02,
        boxShadow: '0 0 12px rgba(150, 100, 255, 0.25)' 
      }}
    >
      {/* En-tête avec nom et rang */}
      <div className="flex justify-between items-center mb-3">
        <h3 className={`
          font-semibold text-base
          text-shadow-text
          ${isHovered ? 'text-shadow-blue' : ''}
          transition-colors duration-300
        `}>
          {name}
        </h3>
        <div className={`
          w-7 h-7 flex items-center justify-center rounded-full
          text-white text-sm font-bold
          ${getRankColor()}
          ${isHovered ? 'scale-110' : 'scale-100'}
          transition-transform duration-300
        `}>
          {rank}
        </div>
      </div>
      
      {/* Barre de progression */}
      <div className="relative h-5 rounded-md overflow-hidden bg-gray-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`
            absolute top-0 left-0 h-full
            bg-gradient-to-r ${getGradientColor()}
          `}
        />
        
        {/* Effet de brillance sur la barre */}
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={{
            opacity: isHovered ? [0, 0.4, 0] : 0,
            left: isHovered ? ['0%', '100%'] : '0%'
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'loop'
          }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(155, 114, 233, 0.3), transparent)'
          }}
        />
        
        {/* Affichage du pourcentage */}
        <div className="absolute inset-0 flex items-center justify-end px-3">
          <span className="text-xs font-bold text-white">
            {level}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Technology } from '@/types';
import Image from 'next/image';

interface TechnologyCardProps {
  technology: Technology;
  index: number;
  onClick: () => void;
}

export default function TechnologyCard({ technology, index, onClick }: TechnologyCardProps) {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const isDark = theme === 'dark';
  
  // Déterminer la couleur en fonction du rang et du thème
  const getRankColor = () => {
    if (!technology.rank) return isDark ? 'bg-gray-600 border-gray-400' : 'bg-gray-500 border-gray-300';
    
    if (isDark) {
      switch (technology.rank) {
        case 'S': return 'bg-purple-600 border-purple-400';
        case 'A': return 'bg-red-600 border-red-400';
        case 'B': return 'bg-blue-600 border-blue-400';
        default: return 'bg-green-600 border-green-400';
      }
    } else {
      switch (technology.rank) {
        case 'S': return 'bg-yellow-500 border-yellow-300';
        case 'A': return 'bg-orange-500 border-orange-300';
        case 'B': return 'bg-blue-500 border-blue-300';
        default: return 'bg-green-500 border-green-300';
      }
    }
  };
  
  // Déterminer la couleur du gradient pour la barre
  const getGradientColor = () => {
    if (!technology.rank) return isDark ? 'from-gray-700 to-gray-500' : 'from-gray-600 to-gray-400';
    
    if (isDark) {
      switch (technology.rank) {
        case 'S': return 'from-purple-700 to-purple-500';
        case 'A': return 'from-red-700 to-red-500';
        case 'B': return 'from-blue-700 to-blue-500';
        default: return 'from-green-700 to-green-500';
      }
    } else {
      switch (technology.rank) {
        case 'S': return 'from-yellow-600 to-yellow-400';
        case 'A': return 'from-orange-600 to-orange-400';
        case 'B': return 'from-blue-600 to-blue-400';
        default: return 'from-green-600 to-green-400';
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`
        w-72 p-5 rounded-lg cursor-pointer
        ${isDark 
          ? 'bg-shadow-secondary border-2 border-shadow-system/30' 
          : 'bg-light-secondary border-2 border-light-gold-DEFAULT/30'}
        transform transition-all duration-300
        hover:shadow-lg
      `}
      layoutId={`tech-card-${technology.id}`}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.03,
        boxShadow: isDark 
          ? '0 0 15px rgba(150, 100, 255, 0.3)' 
          : '0 0 15px rgba(255, 215, 0, 0.3)' 
      }}
    >
      {/* En-tête avec logo et rang */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center">
          {technology.imageUrl && (
            <div className={`
              w-10 h-10 relative rounded-md overflow-hidden mr-3 
              ${isDark ? 'bg-shadow-surface' : 'bg-light-surface'}
              flex items-center justify-center
            `}>
              <Image 
                src={technology.imageUrl} 
                alt={technology.name}
                width={32} 
                height={32}
                className="object-contain"
              />
            </div>
          )}
          <h3 className={`
            font-bold text-lg
            ${isDark ? 'text-shadow-text' : 'text-light-text'}
            ${isHovered ? isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT' : ''}
            transition-colors duration-300
          `}>
            {technology.name}
          </h3>
        </div>
        
        {technology.rank && (
          <div className={`
            w-8 h-8 flex items-center justify-center rounded-full
            text-white text-sm font-bold
            ${getRankColor()}
            ${isHovered ? 'scale-110' : 'scale-100'}
            transition-transform duration-300
          `}>
            {technology.rank}
          </div>
        )}
      </div>
      
      {/* Description courte */}
      <p className={`
        mb-4 text-sm line-clamp-2
        ${isDark ? 'text-shadow-text/80' : 'text-light-text/80'}
      `}>
        {technology.description?.substring(0, 100) || `Maîtrise avancée de ${technology.name}.`}
        {technology.description && technology.description.length > 100 ? '...' : ''}
      </p>
      
      {/* Barre de niveau (si disponible) */}
      {technology.level !== undefined && (
        <div className="my-4">
          <div className="relative h-5 rounded-md overflow-hidden bg-gray-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${technology.level}%` }}
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
                background: isDark
                  ? 'linear-gradient(90deg, transparent, rgba(155, 114, 233, 0.3), transparent)'
                  : 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)'
              }}
            />
            
            {/* Affichage du pourcentage */}
            <div className="absolute inset-0 flex items-center justify-end px-3">
              <span className="text-xs font-bold text-white">
                {technology.level}%
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Catégorie de la technologie */}
      {technology.category && (
        <div className={`
          inline-block px-3 py-1 rounded-full text-xs font-medium mt-2
          ${isDark 
            ? 'bg-shadow-surface text-shadow-accent' 
            : 'bg-light-surface text-light-gold-DEFAULT'}
        `}>
          {technology.category}
        </div>
      )}
      
      {/* Indication de projets */}
      {technology.relatedProjects && technology.relatedProjects.length > 0 && (
        <div className="mt-3 flex items-center">
          <span className={`
            text-xs 
            ${isDark ? 'text-shadow-blue/80' : 'text-light-gold-DEFAULT/80'}
          `}>
            {technology.relatedProjects.length} {technology.relatedProjects.length > 1 ? 'projets associés' : 'projet associé'}
          </span>
        </div>
      )}
      
      {/* Indicateur de clic pour plus d'infos */}
      <div className={`
        text-right text-xs mt-2
        ${isDark ? 'text-shadow-blue/70' : 'text-light-gold-DEFAULT/70'}
      `}>
        Cliquer pour plus d'infos
      </div>
    </motion.div>
  );
} 
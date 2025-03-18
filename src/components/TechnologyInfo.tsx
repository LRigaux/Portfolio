'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { Technology } from '@/types';
import Image from 'next/image';

interface TechnologyInfoProps {
  technology: Technology;
  onClose: () => void;
  isVisible: boolean;
}

export default function TechnologyInfo({ technology, onClose, isVisible }: TechnologyInfoProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Déterminer la couleur du gradient pour la barre en fonction du rang
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
  
  // Déterminer la couleur du badge de rang
  const getRankBadgeColor = () => {
    if (!technology.rank) return isDark ? 'bg-gray-600 text-white' : 'bg-gray-500 text-white';
    
    if (isDark) {
      switch (technology.rank) {
        case 'S': return 'bg-purple-600 text-white';
        case 'A': return 'bg-red-600 text-white';
        case 'B': return 'bg-blue-600 text-white';
        default: return 'bg-green-600 text-white';
      }
    } else {
      switch (technology.rank) {
        case 'S': return 'bg-yellow-500 text-shadow-dark';
        case 'A': return 'bg-orange-500 text-shadow-dark';
        case 'B': return 'bg-blue-500 text-shadow-dark';
        default: return 'bg-green-500 text-shadow-dark';
      }
    }
  };
  
  // Déterminer la couleur du badge de rang de projet
  const getProjectRankBadgeColor = (rank: string) => {
    if (isDark) {
      switch (rank) {
        case 'S': return 'bg-purple-600 text-white';
        case 'A': return 'bg-red-600 text-white';
        case 'B': return 'bg-blue-600 text-white';
        default: return 'bg-green-600 text-white';
      }
    } else {
      switch (rank) {
        case 'S': return 'bg-yellow-500 text-shadow-dark';
        case 'A': return 'bg-orange-500 text-shadow-dark';
        case 'B': return 'bg-blue-500 text-shadow-dark';
        default: return 'bg-green-500 text-shadow-dark';
      }
    }
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
          onClick={onClose}
        >
          {/* Contenu */}
          <motion.div 
            className={`
              relative w-full max-w-2xl rounded-lg overflow-hidden z-10
              ${isDark 
                ? 'bg-shadow-secondary border-2 border-shadow-system' 
                : 'bg-light-secondary border-2 border-light-gold-DEFAULT'}
              shadow-2xl
            `}
            layoutId={`tech-card-${technology.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* En-tête du système */}
            <div className={`
              px-4 py-3 flex items-center justify-between
              ${isDark ? 'bg-shadow-system' : 'bg-light-gold-DEFAULT'}
            `}>
              <div className="flex items-center">
                {technology.imageUrl && (
                  <div className="w-8 h-8 relative rounded overflow-hidden mr-3 flex items-center justify-center bg-white/10">
                    <Image 
                      src={technology.imageUrl} 
                      alt={technology.name} 
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                )}
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-shadow-dark'}`}>
                  {technology.name}
                </h3>
              </div>
              {technology.rank && (
                <div className={`
                  px-3 py-1 rounded text-sm font-bold
                  ${getRankBadgeColor()}
                `}>
                  Rang {technology.rank}
                </div>
              )}
            </div>
            
            {/* Corps */}
            <div className="p-6">
              {/* Description */}
              <div className="mb-6">
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}`}>
                  Description
                </h4>
                <p className={`text-sm ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                  {technology.description || `Maîtrise avancée de ${technology.name}.`}
                </p>
              </div>
              
              {/* Niveau */}
              {technology.level !== undefined && (
                <div className="mb-6">
                  <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}`}>
                    Niveau de maîtrise
                  </h4>
                  <div className="relative h-6 rounded-lg overflow-hidden bg-gray-800">
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
                        opacity: [0, 0.4, 0],
                        left: ['0%', '100%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: 'loop'
                      }}
                      style={{
                        background: isDark
                          ? 'linear-gradient(90deg, transparent, rgba(155, 114, 233, 0.3), transparent)'
                          : 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)'
                      }}
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-end px-3">
                      <span className="text-xs font-bold text-white">
                        {technology.level}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Projets associés */}
              <div>
                <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}`}>
                  Projets associés
                </h4>
                {technology.relatedProjects && technology.relatedProjects.length > 0 ? (
                  <div className="space-y-4">
                    {technology.relatedProjects.map((project, index) => (
                      <div 
                        key={index}
                        className={`
                          p-3 rounded-lg 
                          ${isDark 
                            ? 'bg-shadow-surface hover:bg-shadow-surface/80' 
                            : 'bg-light-surface hover:bg-light-surface/80'}
                          transition-colors
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <h5 className={`font-semibold ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                            {project.title}
                          </h5>
                          <span className={`
                            px-2 py-0.5 text-xs rounded font-medium
                            ${getProjectRankBadgeColor(project.rank)}
                          `}>
                            Rang {project.rank}
                          </span>
                        </div>
                        <a 
                          href={`/projects/${project.slug}`} 
                          className={`
                            mt-3 text-xs px-3 py-1 rounded-full inline-block
                            ${isDark 
                              ? 'bg-shadow-system text-white hover:bg-shadow-blue' 
                              : 'bg-light-gold-DEFAULT text-shadow-dark hover:bg-light-gold-light'}
                            transition-colors
                          `}
                        >
                          Voir le projet
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`
                    p-4 rounded-lg text-center
                    ${isDark ? 'bg-shadow-surface' : 'bg-light-surface'}
                  `}>
                    <p className={`text-sm ${isDark ? 'text-shadow-text/70' : 'text-light-text/70'}`}>
                      Aucun projet associé pour le moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Pied du modal */}
            <div className={`
              px-4 py-3 flex justify-end
              ${isDark ? 'bg-shadow-surface' : 'bg-light-surface'}
            `}>
              <button
                onClick={onClose}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium
                  ${isDark 
                    ? 'bg-shadow-secondary hover:bg-shadow-primary text-shadow-text' 
                    : 'bg-light-secondary hover:bg-light-primary text-light-text'}
                  transition-colors
                `}
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 
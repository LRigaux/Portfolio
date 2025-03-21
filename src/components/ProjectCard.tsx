'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Project } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { normalizeImagePath } from '@/lib/utils';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  liveLink?: string | null;
  githubUrl?: string | null;
  index: number;
  rank?: string;
  featured?: boolean;
}

const ProjectCard = ({ id, title, description, image, tags, link, liveLink, githubUrl, index, rank, featured }: ProjectCardProps) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDark = theme === 'dark';

  // Obtenir la couleur du rang selon le thème
  const getRankColor = () => {
    switch (rank) {
      case 'S': return 'bg-red-600';
      case 'A': return 'bg-purple-600';
      case 'B': return 'bg-blue-600';
      case 'C': return 'bg-green-600';
      default: return 'bg-green-600';
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className={`
          rounded-xl overflow-hidden shadow-lg h-[450px] flex flex-col
          ${isDark 
            ? 'bg-shadow-secondary border border-shadow-primary/30 hover:shadow-shadow-primary/20' 
            : 'bg-light-secondary border border-light-primary/30 hover:shadow-light-primary/20'}
          transition-all duration-300 hover:scale-105
        `}
      >
        <div className="relative h-48 w-full cursor-pointer" onClick={openModal}>
        <Image
            src={normalizeImagePath(image) || '/projects/fallback.jpg'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
            onError={(e) => {
              // Fallback to default image if loading fails
              const target = e.target as HTMLImageElement;
              target.onerror = null; // Prevent infinite loop
              target.src = '/projects/fallback.jpg';
            }}
        />
        {featured && (
          <div className={`
            absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold
            ${isDark ? 'bg-shadow-blue text-white' : 'bg-light-gold-DEFAULT text-shadow-dark'}
          `}>
            Featured
          </div>
        )}
        {rank && (
          <div className={`
            absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center
            ${getRankColor()}
            text-white font-bold
          `}>
            {rank}
          </div>
        )}
        </div>
        
        <div className="px-6 py-4 flex-grow flex flex-col">
          <h3 className={`font-bold text-xl mb-2 ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
            {title}
          </h3>
          <p className={`text-sm flex-grow ${isDark ? 'text-shadow-text/80' : 'text-light-text/80'}`}>
            {description}
          </p>
          
          <div className="mt-auto">
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-4">
                {tags.slice(0, 4).map((tag, index) => (
                  <span 
                    key={index}
                    className={`
                      inline-block px-2 py-1 rounded text-xs
                      ${isDark ? 'bg-shadow-surface text-shadow-blue' : 'bg-light-surface text-light-gold-DEFAULT'}
                    `}
                  >
                    {tag}
                  </span>
                ))}
                {tags.length > 4 && (
                  <span className={`
                    inline-block px-2 py-1 rounded text-xs
                    ${isDark ? 'bg-shadow-surface text-shadow-blue' : 'bg-light-surface text-light-gold-DEFAULT'}
                  `}>
                    +{tags.length - 4}
                  </span>
                )}
              </div>
            )}
            
            <div className="flex justify-between mt-4">
              <div className="flex space-x-2">
                {githubUrl && (
                  <Link 
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      flex items-center justify-center w-9 h-9 rounded-full
                      ${isDark 
                        ? 'bg-shadow-surface hover:bg-shadow-system text-shadow-blue' 
                        : 'bg-light-surface hover:bg-light-gold-DEFAULT/70 text-light-gold-DEFAULT'}
                      transition-all
                    `}
                    title="Voir sur GitHub"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                    </svg>
                  </Link>
                )}
                {liveLink && (
                  <Link 
                    href={liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      flex items-center justify-center w-9 h-9 rounded-full
                      ${isDark 
                        ? 'bg-shadow-surface hover:bg-shadow-system text-shadow-blue' 
                        : 'bg-light-surface hover:bg-light-gold-DEFAULT/70 text-light-gold-DEFAULT'}
                      transition-all
                    `}
                    title="Voir la démo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                      <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                    </svg>
                  </Link>
                )}
              </div>
              
              <button
                onClick={openModal}
                className={`
                  px-3 py-1 rounded-md text-sm font-medium
                  ${isDark 
                    ? 'bg-shadow-system text-white hover:bg-shadow-monarch' 
                    : 'bg-light-gold-DEFAULT text-shadow-dark hover:bg-light-gold-light'}
                  transition-colors
                `}
              >
                Plus d'infos
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal dans le style du système Solo Leveling */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className={`
                relative max-w-2xl w-full rounded-lg overflow-hidden shadow-2xl
                ${isDark 
                  ? 'bg-shadow-secondary border-2 border-shadow-system' 
                  : 'bg-light-secondary border-2 border-light-gold-DEFAULT'}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* En-tête du système */}
              <div className={`
                px-4 py-3 flex items-center justify-between
                ${isDark ? 'bg-shadow-system' : 'bg-light-gold-DEFAULT'}
              `}>
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-shadow-dark'}`}>
                  {title}
                </h3>
                {rank && (
                  <div className={`
                    px-3 py-1 rounded text-sm font-bold
                    ${isDark 
                      ? rank === 'S' ? 'bg-purple-600 text-white' 
                      : rank === 'A' ? 'bg-blue-600 text-white' 
                      : rank === 'B' ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-white'
                      : rank === 'S' ? 'bg-yellow-500 text-shadow-dark' 
                      : rank === 'A' ? 'bg-orange-500 text-shadow-dark' 
                      : rank === 'B' ? 'bg-blue-500 text-shadow-dark' 
                      : 'bg-green-500 text-shadow-dark'
                    }
                  `}>
                    Rang {rank}
                  </div>
                )}
              </div>
              
              {/* Corps du modal */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={normalizeImagePath(image) || '/projects/fallback.jpg'}
                        alt={title}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          // Fallback to default image if loading fails
                          const target = e.target as HTMLImageElement;
                          target.onerror = null; // Prevent infinite loop
                          target.src = '/projects/fallback.jpg';
                        }}
                      />
                    </div>
                    
                    {tags && tags.length > 0 && (
                      <div>
                        <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}`}>
                          Technologies utilisées:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag, index) => (
                            <span 
                              key={index}
                              className={`
                                inline-block px-2 py-1 rounded text-xs
                                ${isDark ? 'bg-shadow-surface text-shadow-blue' : 'bg-light-surface text-light-gold-DEFAULT'}
                              `}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}`}>
                      Description:
                    </h4>
                    <p className={`text-sm mb-4 ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                      {description}
                    </p>
                    
                    <div className="flex gap-3 mt-6">
                      {githubUrl && (
                        <Link 
                          href={githubUrl}
                          className={`
                            px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2
                            ${isDark 
                              ? 'bg-shadow-surface text-shadow-blue hover:bg-shadow-system' 
                              : 'bg-light-surface text-light-gold-DEFAULT hover:bg-light-gold-DEFAULT/70'}
                            transition-colors
                          `}
                          target="_blank"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                          </svg>
                          Voir le code
                        </Link>
                      )}
                      {liveLink && (
                        <Link 
                          href={liveLink}
                          className={`
                            px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2
                            ${isDark 
                              ? 'bg-shadow-blue text-white hover:bg-shadow-accent' 
                              : 'bg-light-primary text-white hover:bg-light-accent'}
                            transition-colors
                          `}
                          target="_blank"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                            <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                          </svg>
                          Voir le site
                        </Link>
                      )}
                      {link && !githubUrl && !liveLink && (
                        <Link 
                          href={link}
                          className={`
                            px-4 py-2 rounded-md text-sm font-medium
                            ${isDark 
                              ? 'bg-shadow-system text-white hover:bg-shadow-monarch' 
                              : 'bg-light-gold-DEFAULT text-shadow-dark hover:bg-light-gold-light'}
                            transition-colors
                          `}
                          target="_blank"
                        >
                          Voir les détails
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pied du modal */}
              <div className={`
                px-4 py-3 flex justify-end
                ${isDark ? 'bg-shadow-surface' : 'bg-light-surface'}
              `}>
                <button
                  onClick={closeModal}
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
    </>
  );
};

export default ProjectCard; 
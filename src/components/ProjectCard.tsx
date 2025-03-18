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
  index: number;
  rank?: string;
  featured?: boolean;
}

const ProjectCard = ({ id, title, description, image, tags, link, liveLink, index, rank, featured }: ProjectCardProps) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDark = theme === 'dark';

  // Obtenir la couleur du rang selon le thème
  const getRankColor = () => {
    if (isDark) {
      switch (rank) {
        case 'S': return 'bg-purple-600';
        case 'A': return 'bg-red-600';
        case 'B': return 'bg-blue-600';
        default: return 'bg-green-600';
      }
    } else {
      switch (rank) {
        case 'S': return 'bg-yellow-500';
        case 'A': return 'bg-orange-500';
        case 'B': return 'bg-blue-500';
        default: return 'bg-green-500';
      }
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
            src={normalizeImagePath(image)}
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
              absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded
              ${isDark ? 'bg-shadow-accent text-white' : 'bg-light-gold-DEFAULT text-shadow-dark'}
            `}>
            Featured
          </div>
        )}
        {rank && (
            <div className={`
              absolute top-2 left-2 text-white text-xs font-bold px-2 py-1 rounded
              ${getRankColor()}
            `}>
              Rang {rank}
          </div>
        )}
          
          {/* Overlay au survol */}
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`
              p-2 rounded-full
              ${isDark 
                ? 'bg-shadow-primary hover:bg-shadow-accent' 
                : 'bg-light-primary hover:bg-light-accent'}
              transition-colors
            `}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </motion.div>
      </div>
        
        <div className="p-6 flex-grow flex flex-col">
          <h3 
            className={`
              text-xl font-bold mb-2 cursor-pointer hover:underline
              ${isDark ? 'text-shadow-text' : 'text-light-text'}
            `}
            onClick={openModal}
          >
            {title}
          </h3>
          
          <p className={`
            text-sm mb-4 line-clamp-3
            ${isDark ? 'text-shadow-text/70' : 'text-light-text/70'}
          `}>
            {description}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-auto mb-4">
            {tags.slice(0, 4).map((tag, idx) => (
            <span 
                key={idx}
                className={`
                  text-xs px-2 py-1 rounded-full
                  ${isDark 
                    ? 'bg-shadow-system text-shadow-text' 
                    : 'bg-light-surface text-light-text'}
                `}
            >
              {tag}
            </span>
          ))}
            {tags.length > 4 && (
              <span 
                className={`
                  text-xs px-2 py-1 rounded-full
                  ${isDark 
                    ? 'bg-shadow-accent/20 text-shadow-accent' 
                    : 'bg-light-accent/20 text-light-accent'}
                `}
              >
                +{tags.length - 4}
              </span>
            )}
        </div>
        
          <div className="flex gap-2">
          {link && (
              <a 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
                className={`
                  px-3 py-1 text-sm rounded flex items-center gap-1
                  ${isDark 
                    ? 'bg-shadow-primary text-white hover:bg-shadow-accent' 
                    : 'bg-light-primary text-white hover:bg-light-accent'}
                  transition-colors
                `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Code
              </a>
          )}
          
          {liveLink && (
              <a 
              href={liveLink} 
              target="_blank" 
              rel="noopener noreferrer"
                className={`
                  px-3 py-1 text-sm rounded flex items-center gap-1
                  ${isDark 
                    ? 'bg-shadow-surface text-shadow-text hover:bg-shadow-system/80' 
                    : 'bg-light-surface text-light-text hover:bg-light-surface/80'}
                  transition-colors
                `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Demo
              </a>
            )}
            
            <button 
              onClick={openModal}
              className={`
                px-3 py-1 text-sm rounded flex items-center gap-1 ml-auto
                ${isDark 
                  ? 'bg-shadow-surface text-shadow-text hover:bg-shadow-system/80' 
                  : 'bg-light-surface text-light-text hover:bg-light-surface/80'}
                transition-colors
              `}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Détails
            </button>
          </div>
        </div>
      </motion.div>
      
      {/* Modal détaillé du projet */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className={`
                relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl
                ${isDark 
                  ? 'bg-shadow-secondary border-2 border-shadow-primary' 
                  : 'bg-light-secondary border-2 border-light-primary'}
              `}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Bannière et image du projet */}
              <div className="relative h-64 md:h-80">
                <Image
                  src={normalizeImagePath(image)}
                  alt={title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
                  className="object-cover"
                  onError={(e) => {
                    // Fallback to default image if loading fails
                    const target = e.target as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop
                    target.src = '/projects/fallback.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {rank && (
                        <div className={`
                          text-white text-sm font-bold px-2 py-1 rounded
                          ${getRankColor()}
                        `}>
                          Rang {rank}
                        </div>
                      )}
                      {featured && (
                        <div className={`
                          text-sm font-bold px-2 py-1 rounded
                          ${isDark ? 'bg-shadow-accent text-white' : 'bg-light-gold-DEFAULT text-shadow-dark'}
                        `}>
                          Featured
                        </div>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
                  </div>
                </div>
                <button 
                  className={`
                    absolute top-4 right-4 p-2 rounded-full
                    ${isDark ? 'bg-shadow-dark/70' : 'bg-light-dark/70'}
                    hover:bg-opacity-100 transition-colors
                  `}
                  onClick={closeModal}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Contenu du projet */}
              <div className="p-6 md:p-8">
                <div className={`mb-6 ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                  <h3 className="text-xl font-bold mb-2">Description</h3>
                  <p className="whitespace-pre-line">{description}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                    Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, idx) => (
                      <span 
                        key={idx}
                        className={`
                          text-sm px-3 py-1 rounded-full
                          ${isDark 
                            ? 'bg-shadow-system text-shadow-text' 
                            : 'bg-light-surface text-light-text'}
                        `}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-8">
                  {link && (
                    <a 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`
                        px-4 py-2 rounded flex items-center gap-2
                        ${isDark 
                          ? 'bg-shadow-primary text-white hover:bg-shadow-accent' 
                          : 'bg-light-primary text-white hover:bg-light-accent'}
                        transition-colors
                      `}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                      Voir le code
                    </a>
                  )}
                  
                  {liveLink && (
                    <a 
                      href={liveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`
                        px-4 py-2 rounded flex items-center gap-2
                        ${isDark 
                          ? 'bg-shadow-blue text-white hover:opacity-90' 
                          : 'bg-light-gold-DEFAULT text-shadow-dark hover:opacity-90'}
                        transition-colors
                      `}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      Voir la démo
                    </a>
                  )}
        </div>
      </div>
    </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default ProjectCard; 
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Project } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

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

  return (
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
      <div className="relative h-48 w-full">
        <Image
          src={image || '/projects/default.jpg'}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
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
        <h3 className={`
          text-xl font-bold mb-2
          ${isDark ? 'text-shadow-text' : 'text-light-text'}
        `}>
          {title}
        </h3>
        
        <p className={`
          mb-4 flex-grow
          ${isDark ? 'text-shadow-text/80' : 'text-light-text/80'}
        `}>
          {description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 4).map((tag, i) => (
            <span 
              key={i} 
              className={`
                text-xs px-2 py-1 rounded
                ${isDark 
                  ? 'bg-shadow-surface text-shadow-blue' 
                  : 'bg-light-surface text-light-primary'}
              `}
            >
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className={`
              text-xs px-2 py-1 rounded
              ${isDark 
                ? 'bg-shadow-surface text-shadow-text' 
                : 'bg-light-surface text-light-text'}
            `}>
              +{tags.length - 4}
            </span>
          )}
        </div>
        
        <div className="flex justify-between">
          {link && (
            <Link 
              href={link} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`
                text-sm font-medium flex items-center
                ${isDark ? 'text-shadow-blue hover:text-shadow-accent' : 'text-light-primary hover:text-light-accent'}
                transition-colors
              `}
            >
              Code <span className="ml-1">→</span>
            </Link>
          )}
          
          {liveLink && (
            <Link 
              href={liveLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`
                text-sm font-medium flex items-center
                ${isDark ? 'text-shadow-accent hover:text-shadow-blue' : 'text-light-gold-DEFAULT hover:text-light-primary'}
                transition-colors
              `}
            >
              Demo <span className="ml-1">→</span>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 
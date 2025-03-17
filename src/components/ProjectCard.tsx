'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Extraire les technologies du projet ou utiliser un tableau vide si undefined
  const tags = project.technologies || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`rounded-lg overflow-hidden shadow-lg ${
        theme === 'light' ? 'bg-light-surface' : 'bg-shadow-surface'
      }`}
    >
      {project.imageUrl && (
        <div className="relative overflow-hidden h-48">
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-white ${
            project.rank === 'S'
              ? theme === 'light' ? 'bg-light-red-DEFAULT' : 'bg-shadow-primary'
              : project.rank === 'A'
              ? theme === 'light' ? 'bg-light-gold-DEFAULT' : 'bg-shadow-accent'
              : theme === 'light' ? 'bg-light-muted' : 'bg-shadow-muted'
          }`}>
            Rang {project.rank}
          </div>
        </div>
      )}
      
      <div className="p-6">
        <h3 className={`text-xl font-bold mb-2 ${
          theme === 'light' ? 'text-light-text' : 'text-shadow-text'
        }`}>
          {project.title}
        </h3>
        
        <p className={`mb-4 ${
          theme === 'light' ? 'text-light-text' : 'text-shadow-text'
        }`}>
          {project.description}
        </p>
        
        {/* Tags avec effet de pulse */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, i) => (
            <motion.span
              key={i}
              className={`
                px-2 py-1 text-xs rounded-full
                ${theme === 'light' 
                  ? 'bg-light-gold-light/20 text-light-gold-dark' 
                  : 'bg-shadow-primary/20 text-shadow-accent'}
              `}
              whileHover={{
                scale: 1.05,
                backgroundColor: theme === 'light' 
                  ? 'rgba(223, 195, 147, 0.3)' 
                  : 'rgba(156, 39, 176, 0.3)'
              }}
            >
              {tag}
            </motion.span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          {/* Liens */}
          <div className="flex space-x-2">
            {project.githubUrl && (
              <a 
                href={project.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${
                  theme === 'light' 
                    ? 'hover:bg-light-surface' 
                    : 'hover:bg-shadow-surface'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={theme === 'light' ? 'text-light-text' : 'text-shadow-text'}>
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            )}
            
            {project.liveUrl && (
              <a 
                href={project.liveUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-full ${
                  theme === 'light' 
                    ? 'hover:bg-light-surface' 
                    : 'hover:bg-shadow-surface'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={theme === 'light' ? 'text-light-text' : 'text-shadow-text'}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            )}
          </div>
          
          {/* Bouton Voir plus */}
          <a
            href={`/projects/${project.slug}`}
            className={`px-4 py-2 rounded ${
              theme === 'light'
                ? 'bg-light-primary text-white hover:bg-light-primary/80'
                : 'bg-shadow-primary text-white hover:bg-shadow-primary/80'
            } transition-colors`}
          >
            Voir plus
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard; 
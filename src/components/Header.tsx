'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();

  const navigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <header className={`
      fixed w-full top-0 z-50 backdrop-blur-lg
      ${theme === 'dark' 
        ? 'bg-shadow-secondary/80 border-b border-shadow-primary/20' 
        : 'bg-light-secondary/80 border-b border-light-primary/20'}
      transition-colors duration-500
    `}>
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection('hero')}
            className="cursor-pointer flex items-center"
          >
            <div className={`text-left`}>
              <div className={`
                text-2xl font-bold 
                ${theme === 'dark'
                  ? 'text-shadow-primary shadow-text-glow' 
                  : 'text-light-primary'}
              `}>
                Louis Rigaux
              </div>
              <div className={`
                text-sm font-medium -mt-1
                ${theme === 'dark'
                  ? 'text-shadow-blue' 
                  : 'text-light-gold-DEFAULT'}
              `}>
                Rang S en Data Science & IA
              </div>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center space-x-6">
            {[
              { name: 'Dashboard', section: 'hero' },
              { name: 'Projets', section: 'projects' },
              { name: 'Compétences', section: 'skills' },
              { name: 'Contact', section: 'contact' }
            ].map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.1 }}
                className={`
                  relative group px-4 py-2
                  ${theme === 'dark' 
                    ? 'text-shadow-text hover:text-shadow-accent' 
                    : 'text-light-text hover:text-light-primary'}
                `}
                onClick={() => scrollToSection(item.section)}
              >
                {item.name}
                <motion.span
                  className={`
                    absolute bottom-0 left-0 w-full h-0.5 transform scale-x-0 
                    group-hover:scale-x-100 transition-transform
                    ${theme === 'dark' 
                      ? 'bg-shadow-accent' 
                      : 'bg-light-primary'}
                  `}
                  layoutId="underline"
                />
              </motion.button>
            ))}

            {/* Social Media Links */}
            <div className="flex items-center space-x-3">
              <motion.a
                href="https://github.com/louis-rigaux" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                className={`
                  p-2 rounded-full 
                  ${theme === 'dark' ? 'text-shadow-text hover:text-shadow-accent' : 'text-light-text hover:text-light-primary'}
                  transition-colors
                `}
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
              
              <motion.a
                href="https://linkedin.com/in/louis-rigaux" 
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: -5 }}
                className={`
                  p-2 rounded-full 
                  ${theme === 'dark' ? 'text-shadow-text hover:text-shadow-accent' : 'text-light-text hover:text-light-primary'}
                  transition-colors
                `}
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </motion.a>
              
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className={`
          md:hidden border-t 
          ${theme === 'dark' 
            ? 'bg-shadow-secondary border-shadow-primary/20 text-shadow-text' 
            : 'bg-light-secondary border-light-primary/20 text-light-text'}
        `}>
          <div className="px-4 py-2 space-y-1">
            {[
              { name: 'Dashboard', section: 'hero' },
              { name: 'Projets', section: 'projects' },
              { name: 'Compétences', section: 'skills' },
              { name: 'Contact', section: 'contact' }
            ].map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.section)}
                className={`
                  block w-full text-left px-4 py-2 font-medium
                  ${theme === 'dark' 
                    ? 'hover:bg-shadow-primary/10 hover:text-shadow-accent' 
                    : 'hover:bg-light-primary/10 hover:text-light-primary'}
                `}
              >
                {item.name}
              </button>
            ))}
            
            {/* Social Media Links - Mobile */}
            <div className="flex items-center space-x-4 px-4 py-2">
              <a 
                href="https://github.com/louis-rigaux" 
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  p-2 rounded-full 
                  ${theme === 'dark' ? 'text-shadow-text hover:text-shadow-accent' : 'text-light-text hover:text-light-primary'}
                `}
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              
              <a 
                href="https://linkedin.com/in/louis-rigaux" 
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  p-2 rounded-full 
                  ${theme === 'dark' ? 'text-shadow-text hover:text-shadow-accent' : 'text-light-text hover:text-light-primary'}
                `}
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 
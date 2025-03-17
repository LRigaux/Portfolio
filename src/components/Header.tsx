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
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
            className={`
              text-2xl font-bold 
              ${theme === 'dark'
                ? 'text-shadow-primary shadow-text-glow' 
                : 'text-light-primary'}
            `}
          >
            Portfolio
          </motion.button>

          <div className="hidden md:flex items-center space-x-8">
            {['Dashboard', 'Projets', 'Compétences', 'Contact'].map((item) => (
              <motion.button
                key={item}
                whileHover={{ scale: 1.1 }}
                className={`
                  relative group px-4 py-2
                  ${theme === 'dark' 
                    ? 'text-shadow-text hover:text-shadow-accent' 
                    : 'text-light-text hover:text-light-primary'}
                `}
                onClick={() => navigate(`/${item.toLowerCase()}`)}
              >
                {item}
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
            <ThemeToggle />
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
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {['Dashboard', 'Projets', 'Compétences', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => navigate(`/${item.toLowerCase()}`)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-strava-orange font-medium"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Detect scroll to apply different styles and track active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 10);

      // Find the current active section based on scroll position
      const sections = ['hero', 'projects', 'skills', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
      setActiveSection(sectionId);
    }
  };

  // Animation variants
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: 0.05 * i,
      }
    })
  };

  const logoVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    hover: { 
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  // Navigation items
  const navItems = [
    { name: 'Dashboard', section: 'hero' },
    { name: 'Projets', section: 'projects' },
    { name: 'Compétences', section: 'skills' },
    { name: 'Contact', section: 'contact' }
  ];

  return (
    <header className={`
      fixed w-full top-0 z-50 backdrop-blur-lg transition-all duration-300
      ${scrolled ? 'py-2' : 'py-4'}
      ${isDark 
        ? `bg-shadow-secondary/90 border-b border-shadow-system/30 ${scrolled ? 'shadow-lg shadow-shadow-blue/10' : ''}` 
        : `bg-light-secondary/90 border-b border-light-gold-DEFAULT/30 ${scrolled ? 'shadow-lg shadow-light-gold-DEFAULT/10' : ''}`}
    `}>
      <div className="container mx-auto px-6">
        <nav className="relative flex items-center justify-between">
          {/* Magic particles effect for header */}
          <AnimatePresence>
            {isDark && (
              <>
                <motion.div 
                  className="absolute -top-1 left-1/4 w-2 h-2 rounded-full bg-shadow-blue/30 blur-sm"
                  animate={{
                    y: [0, -15, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="absolute -bottom-2 right-1/3 w-2 h-2 rounded-full bg-shadow-monarch/30 blur-sm"
                  animate={{
                    y: [0, -10, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 1,
                    ease: "easeInOut"
                  }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Logo */}
          <motion.div
            initial="initial"
            animate="animate"
            whileHover="hover"
            variants={logoVariants}
            onClick={() => scrollToSection('hero')}
            className="cursor-pointer flex items-center"
          >
            <div className="relative text-left">
              <div className={`
                text-2xl font-bold 
                ${isDark
                  ? 'text-shadow-primary' 
                  : 'text-light-primary'}
              `}>
                <span className="relative inline-block">
                  Louis Rigaux
                  {isDark && (
                    <motion.span 
                      className="absolute -inset-1 rounded-lg opacity-30 bg-shadow-primary/20 blur-md"
                      animate={{
                        opacity: [0.1, 0.3, 0.1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </span>
              </div>
              <div className={`
                text-sm font-medium -mt-1 flex items-center
                ${isDark
                  ? 'text-shadow-blue' 
                  : 'text-light-gold-DEFAULT'}
              `}>
                <span className={`
                  inline-block w-2 h-2 rounded-full mr-2 
                  ${isDark ? 'bg-shadow-blue' : 'bg-light-gold-DEFAULT'} 
                  animate-pulse
                `}></span>
                Rang S en Data Science & IA
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <motion.div 
              initial="hidden"
              animate="visible"
              className="flex items-center space-x-1"
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  custom={index}
                  variants={navItemVariants}
                  className={`
                    relative group px-4 py-2 rounded-lg transition-all
                    ${activeSection === item.section
                      ? isDark 
                        ? 'bg-shadow-system/40 text-shadow-blue' 
                        : 'bg-light-gold-DEFAULT/20 text-light-gold-DEFAULT'
                      : isDark 
                        ? 'text-shadow-text hover:text-shadow-blue hover:bg-shadow-system/20' 
                        : 'text-light-text hover:text-light-gold-DEFAULT hover:bg-light-gold-DEFAULT/10'
                    }
                  `}
                  onClick={() => scrollToSection(item.section)}
                >
                  <span className="relative z-10">{item.name}</span>
                  {activeSection === item.section && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className={`
                        absolute bottom-0 left-0 w-full h-0.5 
                        ${isDark ? 'bg-shadow-blue' : 'bg-light-gold-DEFAULT'}
                      `}
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </motion.div>

            {/* Social Media Links */}
            <div className="flex items-center space-x-2 ml-4">
              <motion.a
                href="https://github.com/louis-rigaux" 
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 5,
                  boxShadow: isDark
                    ? '0 0 10px rgba(120, 100, 255, 0.5)'
                    : '0 0 10px rgba(255, 215, 0, 0.5)'
                }}
                className={`
                  p-2 rounded-full 
                  ${isDark 
                    ? 'text-shadow-text hover:text-shadow-blue bg-shadow-system/30' 
                    : 'text-light-text hover:text-light-gold-DEFAULT bg-light-gold-DEFAULT/10'
                  }
                  transition-all duration-300
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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: -5,
                  boxShadow: isDark
                    ? '0 0 10px rgba(120, 100, 255, 0.5)'
                    : '0 0 10px rgba(255, 215, 0, 0.5)'
                }}
                className={`
                  p-2 rounded-full 
                  ${isDark 
                    ? 'text-shadow-text hover:text-shadow-blue bg-shadow-system/30' 
                    : 'text-light-text hover:text-light-gold-DEFAULT bg-light-gold-DEFAULT/10'
                  }
                  transition-all duration-300
                `}
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </motion.a>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <ThemeToggle />
              </motion.div>
            </div>
          </div>

          {/* Mobile menu button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileTap={{ scale: 0.9 }}
            className={`
              md:hidden p-2 rounded-lg
              ${isDark 
                ? 'bg-shadow-system/30 text-shadow-text' 
                : 'bg-light-gold-DEFAULT/20 text-light-text'}
            `}
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
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
          </motion.button>
        </nav>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 30
            }}
            className={`
              md:hidden border-t overflow-hidden
              ${isDark 
                ? 'bg-shadow-system/90 border-shadow-blue/30 text-shadow-text' 
                : 'bg-light-secondary/95 border-light-gold-DEFAULT/30 text-light-text'}
            `}
          >
            <div className="px-6 py-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.section)}
                  className={`
                    block w-full text-left px-4 py-3 font-medium rounded-lg
                    ${activeSection === item.section
                      ? isDark 
                        ? 'bg-shadow-blue/20 text-shadow-blue' 
                        : 'bg-light-gold-DEFAULT/20 text-light-gold-DEFAULT'
                      : ''
                    }
                    ${isDark 
                      ? 'hover:bg-shadow-primary/20 hover:text-shadow-blue' 
                      : 'hover:bg-light-gold-DEFAULT/10 hover:text-light-gold-DEFAULT'}
                  `}
                >
                  {item.name}
                </motion.button>
              ))}
              
              {/* Social Media Links - Mobile */}
              <div className="flex items-center space-x-4 px-4 py-2 mt-2">
                <motion.a 
                  href="https://github.com/louis-rigaux" 
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.1 }}
                  className={`
                    p-2 rounded-full 
                    ${isDark 
                      ? 'bg-shadow-system/50 text-shadow-text hover:text-shadow-blue' 
                      : 'bg-light-gold-DEFAULT/30 text-light-text hover:text-light-gold-DEFAULT'}
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  whileHover={{ scale: 1.1 }}
                  className={`
                    p-2 rounded-full 
                    ${isDark 
                      ? 'bg-shadow-system/50 text-shadow-text hover:text-shadow-blue' 
                      : 'bg-light-gold-DEFAULT/30 text-light-text hover:text-light-gold-DEFAULT'}
                  `}
                  aria-label="LinkedIn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </motion.a>
                
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <ThemeToggle />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 
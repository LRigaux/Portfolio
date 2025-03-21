'use client';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

const Header = () => {
  const { theme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const headerRef = useRef<HTMLElement>(null);
  
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [0, 1]);
  const translateY = useTransform(scrollY, [0, 100], [0, -10]);
  
  // Pour le suivi des sections actives
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      
      // Déterminer la section active basée sur la position de scroll
      const sections = ['hero', 'projects', 'skills', 'contact'];
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Animation des éléments de navigation
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    })
  };
  
  // Animation du logo
  const logoVariants = {
    normal: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    },
    tap: { scale: 0.95 }
  };
  
  // Fermer le menu mobile après sélection d'une section
  const handleNavClick = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      setIsMobileMenuOpen(false);
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Effet de particules magiques
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 2
  }));
  
  return (
    <header 
      ref={headerRef}
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrollPosition > 50 
          ? 'bg-shadow-dark/95 backdrop-blur-sm shadow-lg shadow-shadow-blue/10' 
          : 'bg-transparent'}
      `}
    >
      {/* Particules magiques */}
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className={`
            absolute rounded-full z-10 
            ${particle.id % 3 === 0 
              ? 'bg-shadow-blue' 
              : particle.id % 3 === 1 
                ? 'bg-shadow-monarch' 
                : 'bg-shadow-primary'}
          `}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: scrollPosition > 50 ? 0.7 : 0.3
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 3,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-2"
          variants={logoVariants}
          initial="normal"
          whileHover="hover"
          whileTap="tap"
        >
          <a 
            href="#hero" 
            className="text-2xl font-bold text-shadow-blue tracking-wider flex items-center"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('hero');
            }}
          >
            <motion.span
              className="relative"
              animate={{ 
                textShadow: ['0 0 5px rgba(149, 127, 239, 0.3)', '0 0 15px rgba(149, 127, 239, 0.6)', '0 0 5px rgba(149, 127, 239, 0.3)'] 
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="mr-1">Louis</span>Rigaux
              <motion.span 
                className="absolute -bottom-1 left-0 h-0.5 w-full bg-shadow-blue" 
                animate={{ 
                  opacity: [0.3, 0.8, 0.3],
                  width: ['0%', '100%', '0%']
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.span>
          </a>
        </motion.div>
        
        {/* Navigation desktop */}
        <nav className="hidden md:flex items-center space-x-6">
          {['hero', 'projects', 'skills', 'contact'].map((item, i) => (
            <motion.div
              key={item}
              custom={i}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <a
                href={`#${item}`}
                className={`
                  relative text-sm font-medium px-1 py-2 transition-colors group
                  ${activeSection === item 
                    ? 'text-shadow-blue' 
                    : 'text-shadow-text hover:text-shadow-blue'}
                `}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item);
                }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
                <span 
                  className={`
                    absolute -bottom-0.5 left-0 w-full h-0.5 transform origin-left transition-transform
                    ${activeSection === item 
                      ? 'bg-shadow-blue scale-x-100' 
                      : 'bg-shadow-blue scale-x-0 group-hover:scale-x-100'}
                  `}
                />
              </a>
            </motion.div>
          ))}
          
          {/* Réseaux sociaux */}
          <div className="flex items-center space-x-3">
            <motion.a
              href="https://github.com/louis-rigaux"
              target="_blank"
              rel="noopener noreferrer"
              className="text-shadow-text hover:text-shadow-blue transition-colors"
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/louis-rigaux"
              target="_blank"
              rel="noopener noreferrer"
              className="text-shadow-text hover:text-shadow-blue transition-colors"
              whileHover={{ scale: 1.2, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </motion.a>
          </div>
        </nav>
        
        {/* Bouton menu mobile */}
        <motion.button
          className="md:hidden text-shadow-primary focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </motion.button>
      </div>
      
      {/* Menu mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25,
              opacity: { duration: 0.2 }
            }}
          >
            <nav className="container mx-auto px-4 py-3 space-y-3 bg-shadow-dark/90 backdrop-blur-sm border-t border-shadow-primary/20">
              {['hero', 'projects', 'skills', 'contact'].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <a
                    href={`#${item}`}
                    className={`
                      block py-2 px-3 rounded-md transition-all
                      ${activeSection === item 
                        ? 'bg-shadow-system text-shadow-blue' 
                        : 'text-shadow-text hover:bg-shadow-system/50 hover:text-shadow-blue'}
                    `}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(item);
                    }}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </a>
                </motion.div>
              ))}
              
              {/* Réseaux sociaux version mobile */}
              <div className="flex items-center space-x-3 py-2 px-3">
                <motion.a
                  href="https://github.com/lrigaux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-shadow-text hover:text-shadow-blue transition-colors p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/louis-rigaux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-shadow-text hover:text-shadow-blue transition-colors p-2"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </motion.a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Effet de bord bas avec animation */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-shadow-blue to-transparent"
        style={{ opacity }}
        animate={{
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </header>
  );
};

export default Header; 
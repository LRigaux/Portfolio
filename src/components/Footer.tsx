'use client';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect, useRef } from 'react';

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const footerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const [isHovered, setIsHovered] = useState(false);
  const [particlesCount, setParticlesCount] = useState(10);

  // Responsive particle count based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width > 1280) {
        setParticlesCount(20);
      } else if (width > 768) {
        setParticlesCount(15);
      } else {
        setParticlesCount(10);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animation pour les liens
  const linkAnimation = {
    hover: {
      scale: 1.1,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: { scale: 0.95 }
  };

  // Effet de particules magiques amélioré
  const particles = Array.from({ length: particlesCount }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 3
  }));

  // Faire apparaître le footer avec un effet lorsqu'il est visible
  const opacity = useTransform(scrollYProgress, [0.7, 0.9], [0, 1]);

  // Statistiques provenant de la "base de données"
  const stats = [
    { label: 'Projets', value: '25+' },
    { label: 'Clients', value: '15+' },
    { label: 'Rang', value: 'S' }
  ];

  // Ajout de l'effet du cercle magique qui suit la souris
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (footerRef.current) {
      const rect = footerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  return (
    <footer 
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden z-10
        ${isDark 
          ? 'bg-shadow-secondary border-t border-shadow-system/30' 
          : 'bg-light-secondary border-t border-light-gold-DEFAULT/30'}
      `}
    >
      {/* Effet de suivi de souris */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isDark ? 0.07 : 0.05, 
              scale: 1,
              x: mousePosition.x - 100,
              y: mousePosition.y - 100
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            className={`
              absolute w-[200px] h-[200px] rounded-full blur-3xl pointer-events-none
              ${isDark ? 'bg-shadow-blue' : 'bg-light-gold-DEFAULT'}
            `}
          />
        )}
      </AnimatePresence>

      {/* Particules magiques améliorées */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`
            absolute rounded-full z-10
            ${isDark 
              ? particle.id % 3 === 0 
                ? 'bg-shadow-blue' 
                : particle.id % 3 === 1 
                  ? 'bg-shadow-monarch' 
                  : 'bg-shadow-primary' 
              : particle.id % 3 === 0 
                ? 'bg-light-gold-DEFAULT' 
                : particle.id % 3 === 1 
                  ? 'bg-light-gold-light' 
                  : 'bg-light-primary'
            }
          `}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.id % 2 === 0 ? 10 : -10, 0],
            opacity: [0, 0.8, 0],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Décoration de contour */}
      <div className="absolute top-0 left-0 w-full h-1">
        <motion.div
          className={`
            h-full 
            ${isDark 
              ? 'bg-gradient-to-r from-shadow-system/0 via-shadow-blue/60 to-shadow-system/0' 
              : 'bg-gradient-to-r from-light-gold-DEFAULT/0 via-light-gold-DEFAULT/60 to-light-gold-DEFAULT/0'}
          `}
          animate={{
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <motion.div 
        className="container mx-auto px-6 py-12"
        style={{ opacity }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo et description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2"
          >
            <div className="flex flex-col space-y-1">
              <h3 className={`
                relative text-2xl font-bold group
                ${isDark 
                  ? 'text-shadow-primary' 
                  : 'text-light-primary'}
              `}>
                <span className="inline-block relative">
                  Louis Rigaux
                  <motion.span 
                    className={`
                      absolute -bottom-2 left-0 h-0.5 w-0 
                      ${isDark ? 'bg-shadow-blue' : 'bg-light-gold-DEFAULT'}
                    `}
                    animate={{ width: ['0%', '100%', '0%'] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </span>
              </h3>
              <p className={`
                text-sm font-medium mb-4 flex items-center
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
              </p>
            </div>
            <p className={`
              mb-6
              ${isDark 
                ? 'text-shadow-text/80' 
                : 'text-light-text/80'}
            `}>
              Transformez vos données en pouvoir avec des solutions d'IA avancées.
              Ensemble, élevons votre projet au rang S.
            </p>
            
            {/* Stats rapides avec effet */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{
                    y: -5,
                    boxShadow: isDark 
                      ? '0 10px 20px -10px rgba(120, 100, 255, 0.3)' 
                      : '0 10px 20px -10px rgba(255, 215, 0, 0.3)'
                  }}
                  className={`
                    text-center p-3 rounded-lg
                    ${isDark 
                      ? 'bg-shadow-system/20' 
                      : 'bg-light-gold-DEFAULT/10'}
                    transition-all duration-300
                  `}
                >
                  <motion.div 
                    className={`
                      text-xl font-bold mb-1
                      ${isDark 
                        ? 'text-shadow-blue' 
                        : 'text-light-gold-DEFAULT'}
                    `}
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 400,
                      damping: 10
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className={`
                    text-sm
                    ${isDark 
                      ? 'text-shadow-text/70' 
                      : 'text-light-text/70'}
                  `}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Navigation rapide avec animations améliorées */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`
              relative p-4 rounded-lg
              ${isDark 
                ? 'bg-shadow-system/10' 
                : 'bg-light-gold-DEFAULT/5'}
            `}
          >
            <h4 className={`
              text-lg font-semibold mb-4 flex items-center
              ${isDark 
                ? 'text-shadow-blue' 
                : 'text-light-gold-DEFAULT'}
            `}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Navigation
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Accueil', id: 'hero' },
                { name: 'Projets', id: 'projects' },
                { name: 'Compétences', id: 'skills' },
                { name: 'Technologies', id: 'technologies' },
                { name: 'Contact', id: 'contact' }
              ].map((item, index) => (
                <motion.li 
                  key={index} 
                  variants={linkAnimation} 
                  whileHover="hover" 
                  whileTap="tap"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (index * 0.1) }}
                >
                  <a
                    href={`#${item.id}`}
                    className={`
                      block py-1.5 px-3 rounded-md transition-all duration-300
                      ${isDark
                        ? 'text-shadow-text/80 hover:text-shadow-blue hover:bg-shadow-system/20' 
                        : 'text-light-text/80 hover:text-light-gold-DEFAULT hover:bg-light-gold-DEFAULT/10'}
                    `}
                  >
                    <span className="flex items-center">
                      <span className={`
                        inline-block w-1.5 h-1.5 rounded-full mr-2 opacity-70
                        ${isDark ? 'bg-shadow-blue' : 'bg-light-gold-DEFAULT'}
                      `}></span>
                      {item.name}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Réseaux sociaux avec effet de niveau */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`
              relative p-4 rounded-lg
              ${isDark 
                ? 'bg-shadow-system/10' 
                : 'bg-light-gold-DEFAULT/5'}
            `}
          >
            <h4 className={`
              text-lg font-semibold mb-4 flex items-center
              ${isDark 
                ? 'text-shadow-blue' 
                : 'text-light-gold-DEFAULT'}
            `}>
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Réseaux
            </h4>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com/louis-rigaux"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{
                  scale: 1.2,
                  rotate: 5,
                  boxShadow: isDark
                    ? '0 0 15px rgba(100, 100, 255, 0.6)'
                    : '0 0 15px rgba(255, 215, 0, 0.6)'
                }}
                className={`
                  relative w-12 h-12 flex items-center justify-center rounded-lg
                  ${isDark
                    ? 'bg-shadow-system hover:bg-shadow-blue/90'
                    : 'bg-light-gold-DEFAULT/20 hover:bg-light-gold-DEFAULT/90'}
                  transition-all duration-300
                `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={isDark ? "white" : "#111"}>
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                <motion.span
                  className={`
                    absolute -top-2 -right-2 px-1.5 text-xs font-bold rounded
                    ${isDark 
                      ? 'bg-shadow-blue text-shadow-dark' 
                      : 'bg-light-gold-DEFAULT text-white'}
                  `}
                >
                  S
                </motion.span>
              </motion.a>
              
              <motion.a
                href="https://linkedin.com/in/louis-rigaux"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
                whileHover={{
                  scale: 1.2,
                  rotate: -5,
                  boxShadow: isDark
                    ? '0 0 15px rgba(155, 114, 233, 0.6)'
                    : '0 0 15px rgba(255, 215, 0, 0.6)'
                }}
                className={`
                  relative w-12 h-12 flex items-center justify-center rounded-lg
                  ${isDark
                    ? 'bg-shadow-system hover:bg-shadow-monarch/90'
                    : 'bg-light-gold-DEFAULT/20 hover:bg-light-gold-DEFAULT/90'}
                  transition-all duration-300
                `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill={isDark ? "white" : "#111"}>
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                <motion.span
                  className={`
                    absolute -top-2 -right-2 px-1.5 text-xs font-bold rounded
                    ${isDark 
                      ? 'bg-shadow-monarch text-white' 
                      : 'bg-light-rank text-white'}
                  `}
                >
                  A
                </motion.span>
              </motion.a>
              
              <motion.a
                href="mailto:contact@louisrigaux.com"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                whileHover={{
                  scale: 1.2,
                  rotate: 5,
                  boxShadow: isDark
                    ? '0 0 15px rgba(100, 80, 155, 0.6)'
                    : '0 0 15px rgba(255, 215, 0, 0.6)'
                }}
                className={`
                  relative w-12 h-12 flex items-center justify-center rounded-lg
                  ${isDark
                    ? 'bg-shadow-system hover:bg-shadow-accent/90'
                    : 'bg-light-gold-DEFAULT/20 hover:bg-light-primary/90'}
                  transition-all duration-300
                `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={isDark ? "white" : "#111"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <motion.span
                  className={`
                    absolute -top-2 -right-2 px-1.5 text-xs font-bold rounded
                    ${isDark 
                      ? 'bg-shadow-accent text-white' 
                      : 'bg-light-primary text-white'}
                  `}
                >
                  B
                </motion.span>
              </motion.a>
            </div>
            
            {/* Call to action */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: isDark
                  ? '0 0 15px rgba(120, 100, 255, 0.4)'
                  : '0 0 15px rgba(255, 215, 0, 0.4)'
              }}
              onClick={() => {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                  contactSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`
                w-full mt-4 px-4 py-2 rounded-lg flex items-center justify-center space-x-2
                ${isDark 
                  ? 'bg-shadow-system text-shadow-blue border border-shadow-blue/30 hover:bg-shadow-system/80' 
                  : 'bg-light-gold-DEFAULT/10 text-light-gold-DEFAULT border border-light-gold-DEFAULT/30 hover:bg-light-gold-DEFAULT/20'}
                transition-all duration-300
              `}
            >
              <span>Contactez-moi</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.button>
          </motion.div>
        </div>

        {/* Ligne de séparation avec effet magique */}
        <motion.div
          className={`
            my-8 h-px relative overflow-hidden
            ${isDark
              ? 'bg-shadow-system/30'
              : 'bg-light-gold-DEFAULT/30'}
          `}
        >
          <motion.div
            className={`
              absolute top-0 left-0 h-full w-[50%]
              ${isDark
                ? 'bg-shadow-blue'
                : 'bg-light-gold-DEFAULT'}
            `}
            animate={{
              x: ['-100%', '200%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>

        {/* Copyright avec effet */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className={`
            text-sm
            ${isDark 
              ? 'text-shadow-text/70' 
              : 'text-light-text/70'}
          `}>
            © {new Date().getFullYear()} Louis Rigaux. Tous droits réservés.
            <br />
            <span className={`
              font-medium
              ${isDark 
                ? 'text-shadow-blue' 
                : 'text-light-gold-DEFAULT'}
            `}>
              <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 animate-pulse align-middle"
                style={{
                  background: isDark ? 'rgb(149, 127, 239)' : 'rgb(255, 215, 0)'
                }}
              ></span>
              Rang S en Data Science & IA
            </span>
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer; 
'use client';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect, useRef } from 'react';

const Footer = () => {
  const { theme } = useTheme();
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
      className="relative overflow-hidden z-10 bg-shadow-secondary border-t border-shadow-system/30"
    >
      {/* Effet de suivi de souris */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 0.07, 
              scale: 1,
              x: mousePosition.x - 100,
              y: mousePosition.y - 100
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute w-[200px] h-[200px] rounded-full blur-3xl pointer-events-none bg-shadow-blue"
          />
        )}
      </AnimatePresence>

      {/* Particules magiques améliorées */}
      {particles.map((particle) => (
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
          className="h-full bg-gradient-to-r from-shadow-system/0 via-shadow-blue/60 to-shadow-system/0"
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
        <div className="center">
          {/* Réseaux sociaux avec effet de niveau */}
            <div className="flex justify-center space-x-4">
              <motion.a
                href="https://github.com/lrigaux"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                whileHover={{
                  scale: 1.2,
                  rotate: 5,
                  boxShadow: '0 0 15px rgba(100, 100, 255, 0.6)'
                }}
                className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-shadow-system hover:bg-shadow-blue/90 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
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
                  boxShadow: '0 0 15px rgba(155, 114, 233, 0.6)'
                }}
                className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-shadow-system hover:bg-shadow-monarch/90 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
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
                  boxShadow: '0 0 15px rgba(100, 80, 155, 0.6)'
                }}
                className="relative w-8 h-8 flex items-center justify-center rounded-lg bg-shadow-system hover:bg-shadow-accent/90 transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </motion.a>
            </div>
        </div>

        {/* Copyright avec effet */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-sm text-shadow-text/70">
            <br />
            © {new Date().getFullYear()} Louis Rigaux. Tous droits réservés.
            <br />
            <span className="font-medium text-shadow-blue">
              <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 animate-pulse align-middle"
                style={{
                  background: 'rgb(149, 127, 239)'
                }}
              ></span>
            </span>
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer; 
'use client';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();

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

  // Effet de particules magiques
  const particles = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2
  }));

  // Statistiques provenant de la "base de données"
  const stats = [
    { label: 'Projets', value: '25+' },
    { label: 'Clients', value: '15+' },
    { label: 'Rang', value: 'S' }
  ];

  return (
    <footer className={`
      relative overflow-hidden
      ${theme === 'dark' 
        ? 'bg-shadow-secondary border-t border-shadow-primary/30' 
        : 'bg-light-secondary border-t border-light-primary/30'}
    `}>
      {/* Particules magiques */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`
            absolute w-1 h-1 rounded-full
            ${theme === 'dark' ? 'bg-shadow-primary' : 'bg-light-primary'}
          `}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          animate={{
            y: [-20, 0, -20],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo et description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="col-span-1 md:col-span-2"
          >
            <div className="flex flex-col space-y-1">
              <h3 className={`
                text-2xl font-bold
                ${theme === 'dark' 
                  ? 'text-shadow-primary' 
                  : 'text-light-primary'}
              `}>
                Louis Rigaux
              </h3>
              <p className={`
                text-sm font-medium mb-4
                ${theme === 'dark' 
                  ? 'text-shadow-blue' 
                  : 'text-light-gold-DEFAULT'}
              `}>
                Rang S en Data Science & IA
              </p>
            </div>
            <p className={`
              mb-6
              ${theme === 'dark' 
                ? 'text-shadow-text/80' 
                : 'text-light-text/80'}
            `}>
              Transformez vos données en pouvoir avec des solutions d'IA avancées.
              Ensemble, élevons votre projet au rang S.
            </p>
            
            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover="hover"
                  variants={{
                    hover: {
                      y: -5,
                      transition: { duration: 0.2 }
                    }
                  }}
                  className="text-center"
                >
                  <div className={`
                    text-xl font-bold mb-1
                    ${theme === 'dark' 
                      ? 'text-shadow-primary' 
                      : 'text-light-primary'}
                  `}>
                    {stat.value}
                  </div>
                  <div className={`
                    text-sm
                    ${theme === 'dark' 
                      ? 'text-shadow-text/60' 
                      : 'text-light-text/60'}
                  `}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Navigation rapide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className={`
              text-lg font-semibold mb-4
              ${theme === 'dark' 
                ? 'text-shadow-text' 
                : 'text-light-text'}
            `}>
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
                <motion.li key={index} variants={linkAnimation} whileHover="hover" whileTap="tap">
                  <a
                    href={`#${item.id}`}
                    className={`
                      block py-1 transition-colors
                      ${theme === 'dark'
                        ? 'text-shadow-text/80 hover:text-shadow-primary'
                        : 'text-light-text/80 hover:text-light-primary'}
                    `}
                  >
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Réseaux sociaux */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className={`
              text-lg font-semibold mb-4
              ${theme === 'dark' 
                ? 'text-shadow-text' 
                : 'text-light-text'}
            `}>
              Réseaux
            </h4>
            <div className="flex space-x-4">
              <motion.a
                href="https://github.com/louis-rigaux"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.2,
                  rotate: 5,
                  boxShadow: theme === 'dark'
                    ? '0 0 15px rgba(155, 114, 233, 0.5)'
                    : '0 0 15px rgba(255, 215, 0, 0.5)'
                }}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-full
                  ${theme === 'dark'
                    ? 'bg-shadow-primary hover:bg-shadow-accent'
                    : 'bg-light-primary hover:bg-light-accent'}
                  transition-colors duration-300
                `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </motion.a>
              
              <motion.a
                href="https://linkedin.com/in/louis-rigaux"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.2,
                  rotate: -5,
                  boxShadow: theme === 'dark'
                    ? '0 0 15px rgba(155, 114, 233, 0.5)'
                    : '0 0 15px rgba(255, 215, 0, 0.5)'
                }}
                className={`
                  w-10 h-10 flex items-center justify-center rounded-full
                  ${theme === 'dark'
                    ? 'bg-shadow-primary hover:bg-shadow-accent'
                    : 'bg-light-primary hover:bg-light-accent'}
                  transition-colors duration-300
                `}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Ligne de séparation avec effet magique */}
        <motion.div
          className={`
            my-8 h-px
            ${theme === 'dark'
              ? 'bg-gradient-to-r from-transparent via-shadow-primary to-transparent'
              : 'bg-gradient-to-r from-transparent via-light-primary to-transparent'}
          `}
          animate={{
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Copyright */}
        <div className="text-center">
          <p className={`
            text-sm
            ${theme === 'dark' 
              ? 'text-shadow-text/60' 
              : 'text-light-text/60'}
          `}>
            © {new Date().getFullYear()} Louis Rigaux. Tous droits réservés.
            <br />
            <span className={`
              ${theme === 'dark' 
                ? 'text-shadow-primary' 
                : 'text-light-primary'}
            `}>
              Rang S en Data Science & IA
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
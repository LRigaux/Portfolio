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
            <h3 className={`
              text-2xl font-bold mb-4
              ${theme === 'dark' 
                ? 'text-shadow-primary' 
                : 'text-light-primary'}
            `}>
              Data Science & AI
            </h3>
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
              {[
                { label: 'Projets', value: '15+' },
                { label: 'Clients', value: '20+' },
                { label: 'Rang', value: 'S' }
              ].map((stat, index) => (
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
              {['Accueil', 'Projets', 'Compétences', 'Contact'].map((item, index) => (
                <motion.li key={index} variants={linkAnimation} whileHover="hover" whileTap="tap">
                  <a
                    href={`#${item.toLowerCase()}`}
                    className={`
                      block py-1 transition-colors
                      ${theme === 'dark'
                        ? 'text-shadow-text/80 hover:text-shadow-primary'
                        : 'text-light-text/80 hover:text-light-primary'}
                    `}
                  >
                    {item}
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
              {[
                { icon: '🐦', platform: 'Twitter' },
                { icon: '💼', platform: 'LinkedIn' },
                { icon: '🐱', platform: 'GitHub' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
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
                  <span className="text-lg">{social.icon}</span>
                </motion.a>
              ))}
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
            © {new Date().getFullYear()} Votre Nom. Tous droits réservés.
            <br />
            <span className={`
              ${theme === 'dark' 
                ? 'text-shadow-primary' 
                : 'text-light-primary'}
            `}>
              Rang S en Data Science
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
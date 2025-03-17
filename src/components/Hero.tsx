'use client';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import ParticlesBackground from './ParticlesBackground';

const Hero = () => {
  const { theme } = useTheme();

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className={`
      relative min-h-screen flex items-center justify-center
      ${theme === 'dark' 
        ? 'bg-shadow-secondary' 
        : 'bg-light-secondary'}
      overflow-hidden
    `}>
      <ParticlesBackground />
      
      {/* Effet de glitch/lumière en arrière-plan */}
      <div className={`
        absolute inset-0 opacity-30
        ${theme === 'dark'
          ? 'bg-shadow-pattern animate-shadow-pulse'
          : 'bg-light-pattern animate-glow-pulse'}
      `} />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          <div className="space-y-8">
            <motion.h1 
              variants={textVariants}
              className={`
                text-5xl md:text-6xl lg:text-7xl font-bold
                ${theme === 'dark'
                  ? 'text-shadow-text shadow-text-glow'
                  : 'text-light-text'}
              `}
            >
              Data Science
              <span className={`
                block
                ${theme === 'dark'
                  ? 'text-shadow-primary'
                  : 'text-light-primary'}
              `}>
                & AI Engineer
              </span>
            </motion.h1>

            <motion.p
              variants={textVariants}
              className={`
                text-xl
                ${theme === 'dark'
                  ? 'text-shadow-text/80'
                  : 'text-light-text/80'}
              `}
            >
              Transformez vos données en solutions innovantes avec des modèles 
              d'intelligence artificielle de pointe.
            </motion.p>

            <motion.div
              variants={textVariants}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-8 py-3 rounded-lg font-medium
                  ${theme === 'dark'
                    ? 'bg-shadow-primary text-white shadow-lg shadow-shadow-primary/50'
                    : 'bg-light-primary text-shadow-secondary shadow-lg shadow-light-primary/50'}
                  transition-all duration-300
                `}
              >
                Voir mes projets
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  px-8 py-3 rounded-lg font-medium border-2
                  ${theme === 'dark'
                    ? 'border-shadow-primary text-shadow-primary hover:bg-shadow-primary/10'
                    : 'border-light-primary text-light-primary hover:bg-light-primary/10'}
                  transition-all duration-300
                `}
              >
                Me contacter
              </motion.button>
            </motion.div>
          </div>

          {/* Section droite avec animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className={`
              relative w-full h-[600px] rounded-lg overflow-hidden
              ${theme === 'dark'
                ? 'bg-shadow-primary/10'
                : 'bg-light-primary/10'}
            `}>
              {/* Ajoutez ici une image ou une animation 3D */}
              <div className={`
                absolute inset-0
                ${theme === 'dark'
                  ? 'animate-shadow-pulse'
                  : 'animate-glow-pulse'}
              `} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero; 
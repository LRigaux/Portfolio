'use client';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect } from 'react';
import ParticlesBackground from './ParticlesBackground';

const Hero = () => {
  const { theme } = useTheme();
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  // Phrases pour l'effet de typing, orientées Data Science / IA
  const phrases = [
    'Data Scientist',
    'Machine Learning Engineer',
    'AI Specialist',
    'Deep Learning Expert',
    'NLP Developer'
  ];

  // Scroll to section function
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Effet de typing
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typewriterTimeout = setTimeout(() => {
      if (!isDeleting && typedText === currentPhrase) {
        // Attendre avant de commencer à effacer
        setTypingSpeed(2000);
        setIsDeleting(true);
      } else if (isDeleting && typedText === '') {
        // Passer à la phrase suivante
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        setTypingSpeed(150);
      } else if (isDeleting) {
        // Effacer un caractère
        setTypedText((prev) => prev.slice(0, -1));
        setTypingSpeed(30);
      } else {
        // Taper un caractère
        setTypedText((prev) => currentPhrase.slice(0, prev.length + 1));
        setTypingSpeed(100);
      }
    }, typingSpeed);

    return () => clearTimeout(typewriterTimeout);
  }, [typedText, currentPhraseIndex, isDeleting, typingSpeed, phrases]);

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

  const statsVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        delay: 1.2,
        duration: 0.8
      }
    }
  };

  const isDark = theme === 'dark';

  return (
    <div id="hero" className={`
      relative min-h-screen flex items-center justify-center
      ${isDark 
        ? 'bg-shadow-secondary' 
        : 'bg-light-secondary'}
    `}>
      {/* Particles Background */}
      <ParticlesBackground />
      
      {/* Effet lumineux de système Solo Leveling */}
      <div className="absolute inset-0 z-0">
        <div className={`
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          w-[200%] h-[200%] opacity-10 rounded-full
          ${isDark 
            ? 'bg-monarch-aura animate-monarch-emerge' 
            : 'bg-gradient-radial from-light-gold-light to-transparent animate-glow-pulse'}
        `}></div>
      </div>
      
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
                ${isDark 
                  ? 'text-shadow-text shadow-text-glow' 
                  : 'text-light-text'}
              `}
            >
              <div className="h-24 mb-4">
                <span className={`
                  ${isDark 
                    ? 'text-shadow-blue' 
                    : 'text-light-gold-DEFAULT'}
                `}>
                  {typedText}
                </span>
                <span className={`animate-flicker ${
                  isDark ? 'text-shadow-primary' : 'text-light-primary'
                }`}>_</span>
              </div>
              <span className={`
                block
                ${isDark 
                  ? 'text-shadow-monarch bg-clip-text text-transparent bg-double-awakening' 
                  : 'text-light-rank'}
              `}>
                Double-Éveil
              </span>
            </motion.h1>

            <motion.p
              variants={textVariants}
              className={`
                text-xl
                ${isDark 
                  ? 'text-shadow-text/80' 
                  : 'text-light-text/80'}
              `}
            >
              Je transforme les données en connaissances, en modèles prédictifs et en solutions 
              d&apos;intelligence artificielle de pointe. Comme Jin-Woo, mon niveau ne cesse d&apos;augmenter.
            </motion.p>

            <motion.div
              variants={textVariants}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('projects')}
                className={`
                  px-8 py-3 rounded-lg font-medium
                  ${isDark 
                    ? 'bg-shadow-blue text-white shadow-lg shadow-shadow-blue/50' 
                    : 'bg-light-gold-DEFAULT text-shadow-dark shadow-lg shadow-light-gold-DEFAULT/50'}
                  transition-all duration-300
                `}
              >
                Voir mes projets
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className={`
                  px-8 py-3 rounded-lg font-medium border-2
                  ${isDark 
                    ? 'border-shadow-blue text-shadow-blue hover:bg-shadow-blue/10' 
                    : 'border-light-gold-DEFAULT text-light-gold-DEFAULT hover:bg-light-gold-DEFAULT/10'}
                  transition-all duration-300
                `}
              >
                Me contacter
              </motion.button>
            </motion.div>
          </div>

          {/* Section droite avec stats de personnage */}
          <motion.div
            variants={statsVariants}
            className="relative hidden lg:block"
          >
            <div className={`
              relative w-full max-w-md mx-auto rounded-lg overflow-hidden
              ${isDark 
                ? 'bg-shadow-dark border-2 border-shadow-system' 
                : 'bg-light-surface border-2 border-light-gold-dark'}
              shadow-2xl p-6
            `}>
              {/* En-tête du système Solo Leveling */}
              <div className={`
                absolute top-0 left-0 right-0 
                ${isDark ? 'bg-shadow-system' : 'bg-light-gold-DEFAULT'} 
                px-4 py-2 flex items-center justify-between
              `}>
                <h3 className={`font-bold ${isDark ? 'text-white' : 'text-shadow-dark'}`}>
                  Analyse Système
                </h3>
                <div className={`text-xs px-2 py-1 rounded ${
                  isDark 
                    ? 'bg-shadow-blue text-white' 
                    : 'bg-light-gold-light text-shadow-dark'}
                `}>
                  Rang S
                </div>
              </div>
              
              {/* Contenu du système */}
              <div className="mt-8 space-y-6">
                {/* Statistiques */}
                <div className="space-y-3">
                  <h4 className={`font-semibold ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                    Statistiques principales
                  </h4>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Intelligence</span>
                      <span className={`${isDark ? 'text-shadow-blue' : 'text-light-gold-light'}`}>98</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className={`h-full rounded-full ${
                        isDark ? 'bg-shadow-blue' : 'bg-light-gold-light'
                      }`} style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Créativité</span>
                      <span className={`${isDark ? 'text-shadow-blue' : 'text-light-gold-light'}`}>92</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className={`h-full rounded-full ${
                        isDark ? 'bg-shadow-blue' : 'bg-light-gold-light'
                      }`} style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Agilité</span>
                      <span className={`${isDark ? 'text-shadow-monarch' : 'text-light-rank'}`}>85</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className={`h-full rounded-full ${
                        isDark ? 'bg-shadow-monarch' : 'bg-light-rank'
                      }`} style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Persévérance</span>
                      <span className={`${isDark ? 'text-shadow-blue' : 'text-light-gold-light'}`}>95</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div className={`h-full rounded-full ${
                        isDark ? 'bg-shadow-blue' : 'bg-light-gold-light'
                      }`} style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
                
                {/* Compétences spéciales */}
                <div className="space-y-3">
                  <h4 className={`font-semibold ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                    Capacités spéciales
                  </h4>
                  
                  <div className={`p-2 rounded border ${
                    isDark ? 'border-shadow-blue bg-shadow-blue/10' : 'border-light-gold-DEFAULT bg-light-gold-DEFAULT/10'
                  }`}>
                    <div className="flex justify-between">
                      <span className={`font-bold ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}`}>Double-Éveil</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-shadow-blue text-white' : 'bg-light-gold-light text-shadow-dark'
                      }`}>Actif</span>
                    </div>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Capacité à maîtriser à la fois les modèles de ML classiques et les architectures de deep learning avancées.
                    </p>
                  </div>
                  
                  <div className={`p-2 rounded border ${
                    isDark ? 'border-shadow-monarch bg-shadow-monarch/10' : 'border-light-rank bg-light-rank/10'
                  }`}>
                    <div className="flex justify-between">
                      <span className={`font-bold ${isDark ? 'text-shadow-monarch' : 'text-light-rank'}`}>Extraction de Données</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-shadow-monarch text-white' : 'bg-light-rank text-white'
                      }`}>Niveau 4</span>
                    </div>
                    <p className={`text-sm mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Comme Jin-Woo extrait les ombres, je sais extraire les informations précieuses des données brutes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero; 
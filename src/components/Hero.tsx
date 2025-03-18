'use client';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import ParticlesBackground from './ParticlesBackground';

export default function Hero() {
  const { theme } = useTheme();
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const isDark = theme === 'dark';
  const statContainerRef = useRef<HTMLDivElement>(null);

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

  // Animer le glow en continu
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setGlowIntensity(prev => {
        const newValue = prev + 0.02;
        return newValue > 1 ? 0 : newValue;
      });
    }, 50);
    
    return () => clearInterval(glowInterval);
  }, []);

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

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 100,
        delay: i * 0.15,
      }
    })
  };

  const statsItems = [
    { name: 'Intelligence', value: 98, color: isDark ? 'bg-shadow-blue' : 'bg-light-gold-light' },
    { name: 'Créativité', value: 92, color: isDark ? 'bg-shadow-blue' : 'bg-light-gold-light' },
    { name: 'Agilité', value: 85, color: isDark ? 'bg-shadow-monarch' : 'bg-light-rank' },
    { name: 'Persévérance', value: 95, color: isDark ? 'bg-shadow-blue' : 'bg-light-gold-light' },
  ];

  const specialAbilities = [
    {
      name: 'Double-Éveil',
      description: 'Capacité à maîtriser à la fois les modèles de ML classiques et les architectures de deep learning avancées.',
      active: true
    },
    {
      name: 'Émergence de Motifs',
      description: 'Talent pour détecter des motifs complexes dans les données que d\'autres ne peuvent pas voir.',
      active: true
    }
  ];

  return (
    <section 
      id="hero" 
      className={`
        relative min-h-screen flex items-center py-20 lg:py-0
        ${isDark ? 'bg-shadow-secondary' : 'bg-light-secondary'}
      `}
    >
      {/* Particles Background */}
      <div className="absolute inset-0 z-0">
        <ParticlesBackground />
      </div>
      
      {/* Effet lumineux dynamique */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div 
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            w-[200%] h-[200%] rounded-full opacity-15
            ${isDark 
              ? 'bg-monarch-aura' 
              : 'bg-gradient-radial from-light-gold-light to-transparent'}
          `}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.12, 0.05]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className={`
            absolute top-1/3 right-1/5 w-64 h-64 rounded-full blur-3xl
            ${isDark ? 'bg-shadow-blue' : 'bg-light-gold-DEFAULT'}
          `}
          animate={{
            opacity: [0.03, 0.12, 0.03],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className={`
            absolute bottom-1/4 left-1/4 w-48 h-48 rounded-full blur-3xl
            ${isDark ? 'bg-shadow-monarch' : 'bg-light-rank'}
          `}
          animate={{
            opacity: [0.03, 0.1, 0.03],
            scale: [1, 1.3, 1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Colonne de gauche - Texte */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div 
              className="space-y-2"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              {/* Badge de statut */}
              <motion.div 
                variants={fadeInUpVariants}
                custom={0}
                className={`
                  inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4
                  ${isDark 
                    ? 'bg-shadow-system border border-shadow-blue text-shadow-blue' 
                    : 'bg-light-surface border border-light-gold-DEFAULT text-light-gold-DEFAULT'}
                `}
              >
                <div className="flex items-center">
                  <span className={`
                    inline-block w-2 h-2 rounded-full mr-2 
                    ${isDark ? 'bg-shadow-blue' : 'bg-light-gold-DEFAULT'} 
                    animate-pulse
                  `}></span>
                  Statut: Rang S
                </div>
              </motion.div>

              {/* Titre principal */}
              <motion.h1 
                variants={fadeInUpVariants}
                custom={1}
                className={`
                  text-5xl md:text-6xl lg:text-7xl font-bold
                  ${isDark 
                    ? 'text-shadow-text' 
                    : 'text-light-text'}
                `}
              >
                <div className="h-24 mb-1 flex items-center">
                  <span className={`
                    ${isDark 
                      ? 'text-shadow-blue' 
                      : 'text-light-gold-DEFAULT'}
                  `}>
                    {typedText}
                  </span>
                  <span className={`ml-1 animate-blink ${
                    isDark ? 'text-shadow-primary' : 'text-light-primary'
                  }`}>|</span>
                </div>
                <span className={`
                  relative inline-block
                  ${isDark 
                    ? 'text-shadow-monarch' 
                    : 'text-light-rank'}
                `}>
                  Double-Éveil
                  <motion.span 
                    className={`
                      absolute -inset-1 rounded-lg opacity-${Math.floor(glowIntensity * 30)}
                      ${isDark ? 'bg-shadow-monarch/20' : 'bg-light-rank/20'} 
                      blur-md
                    `}
                    animate={{
                      opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={fadeInUpVariants}
                custom={2}
                className={`
                  text-xl max-w-3xl
                  ${isDark 
                    ? 'text-shadow-text/90'
                    : 'text-light-text/90'}
                `}
              >
                Je transforme les données en connaissances, en créant des modèles d&apos;intelligence 
                artificielle qui révèlent des informations cachées. Ma puissance s&apos;accroît avec chaque projet.
              </motion.p>
            </motion.div>

            {/* Boutons d'action */}
            <motion.div
              variants={fadeInUpVariants}
              custom={3}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-5"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: isDark
                    ? '0 0 20px rgba(150, 100, 255, 0.5)'
                    : '0 0 20px rgba(255, 215, 0, 0.5)'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('projects')}
                className={`
                  px-8 py-3.5 rounded-lg font-medium flex items-center
                  ${isDark 
                    ? 'bg-shadow-system text-white border border-shadow-blue/50' 
                    : 'bg-light-gold-DEFAULT text-shadow-dark'}
                  transition-all duration-300
                `}
              >
                <span>Explorer mes projets</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 ml-2" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: isDark
                    ? '0 0 15px rgba(150, 100, 255, 0.3)'
                    : '0 0 15px rgba(255, 215, 0, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className={`
                  px-8 py-3.5 rounded-lg font-medium border flex items-center
                  ${isDark 
                    ? 'border-shadow-system text-shadow-blue hover:bg-shadow-system/10' 
                    : 'border-light-gold-DEFAULT text-light-gold-DEFAULT hover:bg-light-gold-DEFAULT/10'}
                  transition-all duration-300
                `}
              >
                <span>Établir contact</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Colonne de droite - Interface Système */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 100, 
              damping: 20,
              delay: 0.6 
            }}
          >
            <div 
              ref={statContainerRef}
              className={`
                relative rounded-lg overflow-hidden
                ${isDark 
                  ? 'bg-shadow-secondary border-2 border-shadow-system shadow-lg shadow-shadow-blue/10' 
                  : 'bg-light-surface border-2 border-light-gold-DEFAULT/70 shadow-lg shadow-light-gold-DEFAULT/10'}
              `}
            >
              {/* En-tête du système Solo Leveling */}
              <div className={`
                px-4 py-3 flex items-center justify-between
                ${isDark ? 'bg-shadow-system' : 'bg-light-gold-DEFAULT'} 
              `}>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" className={`w-5 h-5 mr-2 ${isDark ? 'text-white' : 'text-shadow-dark'}`}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-shadow-dark'}`}>
                    Interface Système
                  </h3>
                </div>
                <div className={`
                  px-2 py-1 rounded text-xs font-bold flex items-center
                  ${isDark 
                    ? 'bg-shadow-blue text-white' 
                    : 'bg-light-gold-light text-shadow-dark'}
                `}>
                  <span className="inline-block w-2 h-2 rounded-full bg-white mr-1.5 animate-pulse"></span>
                  ACTIF
                </div>
              </div>
              
              {/* Corps du système */}
              <div className="p-5 space-y-6">
                {/* Niveau et titre */}
                <div className="text-center py-2">
                  <div className={`
                    text-lg font-semibold mb-1
                    ${isDark ? 'text-shadow-text' : 'text-light-text'}
                  `}>
                    Louis Rigaux
                  </div>
                  <div className="flex justify-center items-center">
                    <div className={`
                      text-3xl font-bold 
                      ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}
                    `}>
                      Niveau 52
                    </div>
                    <div className={`
                      ml-2 px-2 py-0.5 rounded text-xs font-bold 
                      ${isDark 
                        ? 'bg-shadow-blue/20 text-shadow-blue' 
                        : 'bg-light-gold-DEFAULT/20 text-light-gold-DEFAULT'}
                    `}>
                      Rang S
                    </div>
                  </div>
                  <div className={`
                    text-sm mt-1
                    ${isDark ? 'text-shadow-text/70' : 'text-light-text/70'}
                  `}>
                    Data Scientist avec Double-Éveil
                  </div>
                </div>

                {/* Barre d'expérience */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className={isDark ? 'text-shadow-text/70' : 'text-light-text/70'}>XP</span>
                    <span className={isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}>14,560 / 15,000</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full ${isDark ? 'bg-shadow-blue' : 'bg-light-gold-DEFAULT'}`}
                      style={{ width: '97%' }}
                      initial={{ width: '0%' }}
                      animate={{ width: '97%' }}
                      transition={{ duration: 1.5, delay: 0.7 }}
                    />
                  </div>
                </div>

                {/* Statistiques */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className={`text-sm font-bold ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}`}>
                      Statistiques
                    </h4>
                    <div className={`
                      text-xs px-1.5 py-0.5 rounded-sm
                      ${isDark 
                        ? 'bg-shadow-surface text-shadow-text/80' 
                        : 'bg-light-surface text-light-text/80'}
                    `}>
                      4/4
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {statsItems.map((stat, index) => (
                      <motion.div 
                        key={stat.name}
                        className="space-y-1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + (index * 0.15) }}
                      >
                        <div className="flex justify-between">
                          <span className={`text-sm ${isDark ? 'text-shadow-text/80' : 'text-light-text/80'}`}>
                            {stat.name}
                          </span>
                          <span className={`text-sm font-medium ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}`}>
                            {stat.value}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full ${stat.color}`}
                            initial={{ width: '0%' }}
                            animate={{ width: `${stat.value}%` }}
                            transition={{ duration: 1.2, delay: 1 + (index * 0.15) }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Capacités spéciales */}
                <div className="space-y-3">
                  <h4 className={`text-sm font-bold ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}`}>
                    Capacités spéciales
                  </h4>
                  
                  {specialAbilities.map((ability, index) => (
                    <motion.div 
                      key={ability.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.5 + (index * 0.2) }}
                      className={`
                        p-3 rounded-lg border
                        ${isDark
                          ? 'bg-shadow-surface/50 border-shadow-system'
                          : 'bg-light-surface/80 border-light-gold-DEFAULT/30'}
                      `}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`font-medium ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}`}>
                          {ability.name}
                        </span>
                        {ability.active && (
                          <span className={`
                            text-xs px-1.5 py-0.5 rounded-sm
                            ${isDark 
                              ? 'bg-shadow-blue/20 text-shadow-blue' 
                              : 'bg-light-gold-DEFAULT/20 text-light-gold-DEFAULT'}
                          `}>
                            Actif
                          </span>
                        )}
                      </div>
                      <p className={`
                        text-xs mt-1
                        ${isDark ? 'text-shadow-text/70' : 'text-light-text/70'}
                      `}>
                        {ability.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
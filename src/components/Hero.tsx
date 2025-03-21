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

  // Animation variants
  const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  // Phrases pour l'effet de typing, orientées Data Science / IA
  const phrases = [
    'Data Scientist',
    'ML Engineer',
    'AI Specialist',
    'AI Engineer',
    'NLP Developer'
  ];

  // Statistiques
  const statsItems = [
    { name: 'Intelligence', value: 98, color: 'bg-shadow-blue' },
    { name: 'Créativité', value: 92, color: 'bg-shadow-blue' },
    { name: 'Agilité', value: 85, color: 'bg-shadow-monarch' },
    { name: 'Persévérance', value: 95, color: 'bg-shadow-blue' },
  ];

  // Capacités spéciales
  const abilities = [
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
        setTypingSpeed(2500);
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
        setTypingSpeed(300);
      }
    }, typingSpeed);

    return () => clearTimeout(typewriterTimeout);
  }, [typedText, currentPhraseIndex, isDeleting, typingSpeed, phrases]);

  return (
    <section id="hero" className="min-h-screen py-20 relative overflow-hidden">
      <ParticlesBackground />
      <div className="container mx-auto relative z-10">
        <div className="bg-shadow-secondary rounded-2xl shadow-2xl overflow-hidden border border-shadow-system/30">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Colonne de gauche - Texte */}
            <div className="lg:col-span-7 p-8 lg:p-12">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fadeIn}>
                  <span
                    className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4
                    bg-shadow-system border border-shadow-blue text-shadow-blue"
                  >
                    <span className="animate-glow-pulse">⦿</span> Shadow Monarch
                  </span>
                </motion.div>
                <motion.h1 
                  variants={fadeIn}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold text-shadow-text"
                >
                  <div className="h-24 mb-1 flex items-center">
                    <span className="text-shadow-blue">
                      {typedText}
                    </span>
                    <span className="animate-pulse">|</span>
                  </div>
                  Passionné par <span className="text-shadow-primary">l'IA</span> et <br className="hidden md:block" />
                  <span className="relative inline-block text-shadow-monarch">
                    Double-Éveil
                    <motion.div
                      className="absolute -z-10 bottom-0 left-0 w-full bg-shadow-monarch/20"
                      style={{ height: '35%' }}
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
                <motion.p 
                  variants={fadeIn}
                  className="text-xl max-w-3xl text-shadow-text/90 mt-6"
                >
                  Je transforme des données complexes en insights actionnables et modèles intelligents.
                </motion.p>
                <motion.div 
                  variants={fadeIn}
                  className="flex flex-wrap gap-4 mt-8"
                >
                  <motion.button
                    onClick={() => scrollToSection('projects')}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 0 20px rgba(107, 75, 177, 0.3)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3.5 rounded-lg font-medium flex items-center
                    bg-shadow-system text-white border border-shadow-blue/50
                    transition-all duration-300"
                  >
                    Voir mes projets
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 ml-2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </motion.button>
                  <motion.button
                    onClick={() => scrollToSection('contact')}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 0 15px rgba(107, 75, 177, 0.2)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3.5 rounded-lg font-medium border flex items-center
                    border-shadow-system text-shadow-blue hover:bg-shadow-system/10
                    transition-all duration-300"
                  >
                    Me contacter
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>
            
            {/* Colonne de droite - Interface système */}
            <div className="lg:col-span-5 p-8 lg:p-0 lg:pr-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 20,
                  delay: 0.6
                }}
                ref={statContainerRef}
              >
                {/* Interface système */}
                <div
                  className="relative rounded-lg overflow-hidden
                  bg-shadow-secondary border-2 border-shadow-system shadow-lg shadow-shadow-blue/10"
                >
                  {/* Barre supérieure */}
                  <div className="px-2 py-1 rounded text-xs font-bold flex items-center
                  bg-shadow-blue text-white">
                    <span className="inline-block w-2 h-2 rounded-full bg-white mr-1.5 animate-pulse"></span>
                    System Interface
                  </div>
                  
                  {/* Corps de l'interface */}
                  <div className="p-4">
                    {/* Infos de niveau/rang */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                        </svg>
                        <h3 className="font-bold text-base text-white">
                          Louis Rigaux
                          <div className="ml-2 px-2 py-0.5 rounded text-xs font-bold 
                          bg-shadow-blue/20 text-shadow-blue">
                            Rang S
                          </div>
                        </h3>
                      </div>
                      <div className="text-xs px-1.5 py-0.5 rounded-sm
                      bg-shadow-surface text-shadow-text/80">
                        4/4
                      </div>
                    </div>
                    
                    {/* Statistiques */}
                    <div className="mt-4 space-y-4">
                      {statsItems.map((stat, index) => (
                        <div 
                          key={stat.name}
                          className="p-3 rounded-lg border
                          bg-shadow-surface/50 border-shadow-system"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <span className="text-shadow-text">{stat.name}</span>
                              <span className="text-xs px-1.5 py-0.5 rounded-sm
                              bg-shadow-blue/20 text-shadow-blue ml-2">
                                Actif
                              </span>
                            </div>
                            <span className="text-shadow-text/70">{stat.value}/100</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-shadow-blue"
                              style={{ width: `${stat.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Barre d'XP */}
                    <div className="mt-4 mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-shadow-text/70">XP</span>
                        <span className="text-shadow-blue">14,560 / 15,000</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-shadow-blue"
                          style={{ width: '97%' }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Capacités */}
                    <div className="mt-6">
                      <h4 className="text-sm font-bold text-shadow-blue">Capacités</h4>
                      <div className="mt-2 space-y-2">
                        {abilities.map((ability, index) => (
                          <div key={index} className="p-2 rounded-md bg-shadow-surface/70 border border-shadow-system/30">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-shadow-text/80">{ability.name}</span>
                              <span className="text-sm font-medium text-shadow-blue">{ability.active ? 'Active' : 'Passive'}</span>
                            </div>
                            <p className="text-xs mt-1 text-shadow-text/70">{ability.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
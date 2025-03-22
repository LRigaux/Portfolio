'use client';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import ParticlesBackground from './ParticlesBackground';

export default function About() {
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
        setTypingSpeed(300);
        setIsDeleting(true);
      } else if (isDeleting && typedText === '') {
        // Passer à la phrase suivante
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
        setTypingSpeed(150);
      } else if (isDeleting) {
        // Effacer un caractère
        setTypedText((prev) => prev.slice(0, -1));
        setTypingSpeed(150);
      } else {
        // Taper un caractère
        setTypedText((prev) => currentPhrase.slice(0, prev.length + 1));
        setTypingSpeed(100);
      }
    }, typingSpeed);

    return () => clearTimeout(typewriterTimeout);
  }, [typedText, currentPhraseIndex, isDeleting, typingSpeed, phrases]);

  return (
    <section id="about" className="min-h-screen py-20 relative overflow-hidden">
        <ParticlesBackground />
      <div className="container mx-auto relative z-10">
        <div className="rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">


          {/* Colonne de gauche - Texte */}
            <div className="lg:col-span-7 p-8 lg:p-12">
            <motion.div 
                variants={staggerContainer}
              initial="hidden"
              animate="visible"
              >
                <motion.div variants={fadeIn}>
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
                  Passionate about <span className="text-shadow-primary">AI</span> and <br className="hidden md:block" />
                  <span className="relative inline-block text-shadow-monarch">
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
                  /> Data
                </span>
              </motion.h1>
              <motion.p
                  variants={fadeIn}
                  className="text-xl max-w-3xl text-shadow-text/90 mt-6"
                >
                  I transform data into actionable insights and intelligent models.
              </motion.p>
            <motion.div
                  variants={fadeIn}
                  className="flex flex-wrap gap-4 mt-8"
            >
              {/* Bouton pour voir mes projets */}
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

              {/* Bouton pour me contacter */}
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
          </div>
        </div>
      </div>
    </section>
  );
}
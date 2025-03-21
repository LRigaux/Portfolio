'use client';
import { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '@/context/ThemeContext';
import ParticlesBackground from './ParticlesBackground';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('projet');
  const [showMessageAnimation, setShowMessageAnimation] = useState(false);
  
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      
      // Déclencher l'animation d'absorption
      setShowMessageAnimation(true);
      
      // Attendre que l'animation se termine avant d'envoyer réellement les données
      setTimeout(async () => {
        try {
          // Envoyer les données au serveur
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
              subject: `${selectedType}: ${formData.subject}`,
              message: formData.message
            })
          });
          
          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.error || 'Erreur lors de l\'envoi du message');
          }
          
          // Afficher le message de succès
          setIsSubmitSuccess(true);
          
          // Réinitialiser le formulaire
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: ''
          });
          
          // Masquer le message de succès après quelques secondes
          setTimeout(() => {
            setIsSubmitSuccess(false);
          }, 5000);
        } catch (error) {
          console.error('Erreur:', error);
          setSubmitError(error instanceof Error ? error.message : 'Error while sending message');
        } finally {
          setIsSubmitting(false);
          // Réinitialiser l'animation après un court délai
          setTimeout(() => {
            setShowMessageAnimation(false);
          }, 500);
        }
      }, 2000); // Attendre 2 secondes pour l'animation
      
    } catch (error) {
      console.error('Erreur:', error);
      setSubmitError(error instanceof Error ? error.message : 'Error while sending message');
      setIsSubmitting(false);
      setShowMessageAnimation(false);
    }
  };
  
  return (
    <section 
      id="contact" 
      className="py-24 relative overflow-hidden"
      ref={ref}
    >
      {/* Arrière-plan de particules */}
      <div className="absolute inset-0 z-0 opacity-30">
      <ParticlesBackground />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* En-tête de la section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            
            
          </motion.div>
 
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Colonne de gauche - Formulaire de contact */}
          <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className={`
                p-6 rounded-lg
                ${isDark 
                  ? 'bg-shadow-secondary border-2 border-shadow-system/30' 
                  : 'bg-light-secondary border-2 border-light-gold-DEFAULT/30'}
              `}>
                <p className='text-xl max-w-2xl mx-auto text-shadow-text/70'>
                  I would love to hear from you !
                </p>
                <h2 className='text-3xl md:text-4xl font-bold mb-6 text-shadow-text'>
                  ARISE a{' '}
                  <span className='text-shadow-blue'>
                    Contact
                  </span>
                </h2>


            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                      <label htmlFor="name" className={`block mb-2 text-sm font-medium ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                        Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                        placeholder="What's your name?"
                        className={`
                          w-full p-3 rounded-lg outline-none
                          ${isDark 
                            ? 'bg-shadow-surface border border-shadow-system text-shadow-text focus:border-shadow-blue' 
                            : 'bg-light-surface border border-light-system text-light-text focus:border-light-gold-DEFAULT'}
                          transition-colors
                        `}
                    required
                  />
                </div>
                <div>
                      <label htmlFor="email" className={`block mb-2 text-sm font-medium ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                        Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                        placeholder="What's your email?"
                        className={`
                          w-full p-3 rounded-lg outline-none
                          ${isDark 
                            ? 'bg-shadow-surface border border-shadow-system text-shadow-text focus:border-shadow-blue' 
                            : 'bg-light-surface border border-light-system text-light-text focus:border-light-gold-DEFAULT'}
                          transition-colors
                        `}
                    required
                  />
                </div>
              </div>
              
                  <div>
                    <label htmlFor="subject" className={`block mb-2 text-sm font-medium ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                      Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                      placeholder="What is it about?"
                      className={`
                        w-full p-3 rounded-lg outline-none
                        ${isDark 
                          ? 'bg-shadow-surface border border-shadow-system text-shadow-text focus:border-shadow-blue' 
                          : 'bg-light-surface border border-light-system text-light-text focus:border-light-gold-DEFAULT'}
                        transition-colors
                      `}
                  required
                />
              </div>
              
              <div>
                    <label htmlFor="message" className={`block mb-2 text-sm font-medium ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                      Your message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                      rows={6}
                      placeholder="What do you want to tell me?"
                      className={`
                        w-full p-3 rounded-lg outline-none
                        ${isDark 
                          ? 'bg-shadow-surface border border-shadow-system text-shadow-text focus:border-shadow-blue' 
                          : 'bg-light-surface border border-light-system text-light-text focus:border-light-gold-DEFAULT'}
                        transition-colors
                      `}
                  required
                ></textarea>
              </div>
              
                  <div className="flex justify-end">
                    <motion.button
                  type="submit"
                  disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                  className={`
                        px-8 py-3 rounded-lg font-medium flex items-center
                    ${isDark 
                          ? 'bg-shadow-system text-white hover:bg-shadow-blue' 
                          : 'bg-light-gold-DEFAULT text-shadow-dark hover:bg-light-gold-light'}
                        transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {isSubmitting ? (
                        <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                  ) : (
                    <>
                      Send
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </motion.button>
              </div>
              
              {submitError && (
                <div className={`
                  mt-4 p-4 rounded-lg
                  ${isDark 
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                    : 'bg-red-50 border border-red-200 text-red-700'}
                `}>
                  <p>{submitError}</p>
                </div>
              )}
            </form>
              </div>
              </motion.div>

            {/* Animation ARISE pour l'enveloppe de l'ombre */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex flex-col items-center justify-center h-full relative backdrop-blur-sm rounded-lg p-4">

                {/* Conteneur de l'animation */}
                <div className="w-full h-[400px] center relative">
                  {/* Éclats de lumière lors de l'absorption */}
                  <AnimatePresence>
                    {showMessageAnimation && (
                      <motion.div
                        className="absolute inset-0 bg-shadow-blue/5 z-10"
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: [0, 0.2, 0, 0.3, 0] 
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                          duration: 1.5,
                          times: [0, 0.3, 0.5, 0.7, 1] 
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Cercle magique ARISE */}
                  <motion.div 
                    className="absolute inset-0 w-full h-full"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      scale: showMessageAnimation ? [1, 1.15, 1] : 1
                    }}
                    transition={{ 
                      opacity: { delay: 0.8, duration: 1 },
                      scale: { duration: 1.5, ease: "easeInOut" }
                    }}
                  >
                    <svg viewBox="0 0 200 200" className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]">
                      <defs>
                        <linearGradient id="shadowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#6b4bb1" stopOpacity="0.3" />
                          <stop offset="50%" stopColor="#957fef" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#6b4bb1" stopOpacity="0.3" />
                        </linearGradient>
                        <radialGradient id="absorptionGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                          <stop offset="0%" stopColor="#957fef" stopOpacity="0.7" />
                          <stop offset="100%" stopColor="#6b4bb1" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <motion.circle 
                        cx="100" 
                        cy="100" 
                        r="80" 
                        fill="none" 
                        stroke="url(#shadowGradient)" 
                        strokeWidth="1"
                        initial={{ strokeDasharray: 500, strokeDashoffset: 500, opacity: 0 }}
                        animate={{ 
                          strokeDashoffset: 0, 
                          opacity: 1,
                          rotate: 360
                        }}
                        transition={{ 
                          duration: 3, 
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      />
                      <motion.circle 
                        cx="100" 
                        cy="100" 
                        r="60" 
                        fill="none" 
                        stroke="url(#shadowGradient)" 
                        strokeWidth="0.5"
                        initial={{ rotate: 0 }}
                        animate={{ 
                          rotate: -360,
                          scale: showMessageAnimation ? [1, 1.2, 1] : 1
                        }}
                        transition={{ 
                          rotate: { duration: 8, ease: "linear", repeat: Infinity },
                          scale: { duration: 1.5, ease: "easeInOut" }
                        }}
                      />
                      {/* Effet d'absorption qui apparaît lors de l'envoi du message */}
                      {showMessageAnimation && (
                        <motion.circle
                          cx="100"
                          cy="100"
                          r="5"
                          fill="url(#absorptionGradient)"
                          initial={{ opacity: 0, r: 10 }}
                          animate={{ 
                            opacity: [0, 0.8, 0],
                            r: [10, 100, 150]
                          }}
                          transition={{ 
                            duration: 2,
                            ease: "easeOut"
                          }}
                        />
                      )}
                    </svg>
                  </motion.div>

                  {/* Animation des particules du message en cours d'absorption */}
                  <AnimatePresence>
                    {showMessageAnimation && (
                      <>
                        {Array.from({ length: 25 }).map((_, i) => {
                          const randomDelay = Math.random() * 0.5;
                          const startPositionX = -150 - Math.random() * 100;
                          const startPositionY = 50 + Math.random() * 100;
                          
                          return (
                            <motion.div
                              key={`message-particle-${i}`}
                              className={`absolute h-1 w-1 rounded-full ${
                                i % 3 === 0 
                                  ? 'bg-shadow-blue' 
                                  : i % 3 === 1 
                                    ? 'bg-shadow-monarch' 
                                    : 'bg-shadow-primary'
                              }`}
                              style={{
                                top: `${startPositionY}px`,
                                left: `${startPositionX}px`,
                                opacity: 0
                              }}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{
                                opacity: [0, 0.8, 0],
                                scale: [0, 1, 0],
                                x: 150,
                                y: 25 - Math.random() * 50
                              }}
                              exit={{ opacity: 0 }}
                              transition={{
                                duration: 1.5,
                                delay: randomDelay,
                                ease: "easeOut"
                              }}
                            />
                          );
                        })}
                      </>
                    )}
                  </AnimatePresence>

                  {/* Message text qui va être absorbé */}
                  <AnimatePresence>
                    {showMessageAnimation && (
                      <motion.div
                        className="absolute top-1/3 left-0 transform -translate-x-[110%] rounded-md bg-shadow-system p-2 text-xs text-shadow-blue shadow-lg shadow-shadow-blue/20 z-10"
                        initial={{ opacity: 0, x: -200 }}
                        animate={{ 
                          opacity: [0, 1, 0], 
                          x: [-200, 0, 150],
                          y: [0, -20, 0],
                          scale: [1, 0.8, 0],
                          rotate: [0, 5, 0]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                          duration: 1.5,
                          ease: "easeOut"
                        }}
                      >
                        <div className="max-w-[120px] truncate font-mono">
                          {formData.message.substring(0, 20)}...
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Envelope 3D */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[100px] perspective-500"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      rotateZ: showMessageAnimation ? [0, 360] : 0
                    }}
                    transition={{ 
                      opacity: { delay: 1.2, duration: 0.8, type: "spring" },
                      scale: { delay: 1.2, duration: 0.8, type: "spring" },
                      rotateZ: { duration: 1.5, ease: "easeInOut" }
                    }}
                  >
                  </motion.div>
                  
    
                  
                  {/* Shadow runes */}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const angle = (i * (360 / 6)) * (Math.PI / 180);
                    const x = 100 + 120 * Math.cos(angle);
                    const y = 100 + 120 * Math.sin(angle);
                    
                    return (
                      <motion.div 
                        key={i}
                        className="absolute"
                        style={{
                          top: `calc(50% + ${y - 100}px)`,
                          left: `calc(50% + ${x - 100}px)`,
                          transform: "translate(-50%, -50%)"
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ 
                          opacity: showMessageAnimation 
                            ? [0, 1, 0.5, 1, 0] 
                            : [0, 0.8, 0],
                          scale: showMessageAnimation 
                            ? [1, 1.5, 1] 
                            : 1,
                          rotate: showMessageAnimation 
                            ? [0, 90, 180, 270, 360] 
                            : 0
                        }}
                        transition={{ 
                          duration: showMessageAnimation ? 1.5 : 4, 
                          repeat: Infinity, 
                          delay: showMessageAnimation ? 0 : i * 0.5
                        }}
                      >
                        <div className="w-8 h-8 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={showMessageAnimation ? "#ffffff" : "#957fef"} strokeWidth="1">
                            {i % 2 === 0 ? (
                              <path d="M12 2L15 6L12 10L9 6L12 2Z M12 10L15 14L12 18L9 14L12 10Z M12 18L15 22L12 26L9 22L12 18Z" />
                            ) : (
                              <path d="M8 5L12 2L16 5L16 9L12 12L8 9L8 5Z M12 12L16 15L16 19L12 22L8 19L8 15L12 12Z" />
                            )}
                          </svg>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Éclairs d'énergie lors de l'absorption du message */}
                  <AnimatePresence>
                    {showMessageAnimation && (
                      Array.from({ length: 8 }).map((_, i) => {
                        const angle = (i * (360 / 8)) * (Math.PI / 180);
                        const length = 80 + Math.random() * 40;
                        const x1 = 150 + Math.cos(angle) * 20;
                        const y1 = 150 + Math.sin(angle) * 20;
                        const x2 = 150 + Math.cos(angle) * length;
                        const y2 = 150 + Math.sin(angle) * length;
                        
                        return (
                          <motion.div
                            key={`lightning-${i}`}
                            className="absolute top-0 left-0 w-full h-full pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 0.5, 1, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ 
                              duration: 1.5, 
                              delay: i * 0.1,
                              times: [0, 0.2, 0.3, 0.7, 1]
                            }}
                          >
                            <svg width="300" height="300" viewBox="0 0 300 300" className="absolute top-0 left-0">
                              <motion.line
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#957fef"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeDasharray="10 5"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: [0, 1, 0.5, 1] }}
                                transition={{ 
                                  duration: 1.2,
                                  times: [0, 0.3, 0.6, 1]
                                }}
                              />
                            </svg>
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>

                  {/* Vibration de l'écran lors de l'absorption */}
                  {showMessageAnimation && (
                    <motion.div
                      className="absolute inset-0 z-30 pointer-events-none"
                      animate={{ 
                        x: [0, -3, 5, -2, 4, -1, 0],
                        y: [0, 2, -4, 3, -3, 1, 0]
                      }}
                      transition={{ 
                        duration: 0.5,
                        delay: 0.8,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </div>
              
              </div>
            </motion.div>
          </div>

          {/* Messages de notification */}
          <AnimatePresence>
              {isSubmitSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 25 }}
                className={`
                  mt-8 p-4 rounded-lg
                  ${isDark 
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
                    : 'bg-green-50 border border-green-200 text-green-700'}
                  flex items-start
                `}
              >
                <div className="flex-shrink-0 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Request sent successfully !</h4>
                  <p className="text-sm">Your message has been sent. I will respond in the best possible way.</p>
                </div>
              </motion.div>
              )}
              
              {submitError && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 25 }}
                className={`
                  mt-8 p-4 rounded-lg
                  ${isDark 
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                    : 'bg-red-50 border border-red-200 text-red-700'}
                  flex items-start
                `}
              >
                <div className="flex-shrink-0 mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" x2="12" y1="8" y2="12"></line>
                    <line x1="12" x2="12.01" y1="16" y2="16"></line>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg">Transmission error</h4>
                  <p className="text-sm">{submitError}</p>
                </div>
              </motion.div>
              )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
} 
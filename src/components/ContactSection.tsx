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
      setSubmitError(error instanceof Error ? error.message : 'Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Méthodes de contact avec leurs icônes
  const contactMethods = [
    {
      id: 'email',
      label: 'Email',
      value: 'pro.lrigs@gmail.com',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="16" x="2" y="4" rx="2"></rect>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
        </svg>
      )
    },
    {
      id: 'github',
      label: 'GitHub',
      value: 'github.com/lrigaux',
      link: 'https://github.com/lrigaux',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
          <path d="M9 18c-4.51 2-5-2-7-2"></path>
        </svg>
      )
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      value: 'linkedin.com/in/lrigaux',
      link: 'https://linkedin.com/in/lrigaux',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect width="4" height="12" x="2" y="9"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      )
    }
  ];
  
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
            <h2 className={`
              text-3xl md:text-4xl font-bold mb-6
              ${isDark ? 'text-shadow-text' : 'text-light-text'}
            `}>
              Établir une{' '}
              <span className={
                isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'
              }>
                Communication
              </span>
            </h2>
            <p className={`
              text-xl max-w-2xl mx-auto
              ${isDark ? 'text-shadow-text/70' : 'text-light-text/70'}
            `}>
              Envoyez une requête pour former une alliance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Colonne de gauche - Méthodes de contact */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className={`
                p-6 rounded-lg h-full
                ${isDark 
                  ? 'bg-shadow-secondary border-2 border-shadow-system/30' 
                  : 'bg-light-secondary border-2 border-light-gold-DEFAULT/30'}
              `}>
                <h3 className={`
                  text-xl font-bold mb-6
                  ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}
                `}>
                  Points de Contact
                </h3>

                <div className="space-y-6">
                  {contactMethods.map((method) => (
                    <div key={method.id} className="flex items-start">
                      <div className={`
                        p-3 rounded-full mr-4
                        ${isDark 
                          ? 'bg-shadow-surface text-shadow-accent' 
                          : 'bg-light-surface text-light-gold-DEFAULT'}
                      `}>
                        {method.icon}
                      </div>
                      <div>
                        <h4 className={`font-medium ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                          {method.label}
                        </h4>
                        {method.link ? (
                          <a 
                            href={method.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`
                              text-sm hover:underline
                              ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}
                            `}
                          >
                            {method.value}
                          </a>
                        ) : (
                          <p className={`text-sm ${isDark ? 'text-shadow-text/80' : 'text-light-text/80'}`}>
                            {method.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
        </div>
        
                {/* Status du système */}
                <div className={`
                  mt-10 p-4 rounded-lg
                  ${isDark 
                    ? 'bg-shadow-dark border border-shadow-system' 
                    : 'bg-light-surface border border-light-gold-DEFAULT/30'}
                `}>
                  <h4 className={`
                    text-sm font-bold mb-3
                    ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}
                  `}>
                    Status du Système
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${isDark ? 'text-shadow-text/70' : 'text-light-text/70'}`}>
                        Disponibilité
                      </span>
                      <span className="flex items-center text-green-500">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        En ligne
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${isDark ? 'text-shadow-text/70' : 'text-light-text/70'}`}>
                        Temps de réponse moyen
                      </span>
                      <span className={`text-sm font-medium ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                        24-48h
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Colonne de droite - Formulaire de contact */}
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
                <h3 className={`
                  text-xl font-bold mb-6
                  ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}
                `}>
                  Envoyer un Message
                </h3>

                {/* Type de requête */}
                <div className="mb-6">
                  <label className={`block mb-2 text-sm font-medium ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                    Type de requête
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {['projet', 'collaboration', 'emploi', 'autre'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedType(type)}
                        className={`
                          px-4 py-2 rounded-lg text-sm font-medium transition-colors
                          ${selectedType === type 
                            ? isDark
                              ? 'bg-shadow-system text-white' 
                              : 'bg-light-gold-DEFAULT text-shadow-dark'
                            : isDark
                              ? 'bg-shadow-surface text-shadow-text hover:bg-shadow-system/70' 
                              : 'bg-light-surface text-light-text hover:bg-light-gold-DEFAULT/70'}
                        `}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                      <label htmlFor="name" className={`block mb-2 text-sm font-medium ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                        Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                        placeholder="Votre nom"
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
                        placeholder="exemple@domaine.com"
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
                      Sujet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                      placeholder="Sujet de votre message"
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
                      Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                      rows={6}
                      placeholder="Écrivez votre message ici..."
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
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          Envoyer la requête
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                          </svg>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
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
                  <h4 className="font-bold text-lg">Requête transmise avec succès !</h4>
                  <p className="text-sm">Votre message a été enregistré. Je vous répondrai dans les meilleurs délais.</p>
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
                  <h4 className="font-bold text-lg">Erreur de transmission</h4>
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
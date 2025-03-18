'use client';
import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import ParticlesBackground from './ParticlesBackground';

const ContactSection = () => {
  const { theme } = useTheme();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const controls = useAnimation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    // Animation de soumission
    await controls.start({
      scale: [1, 0.95, 1],
      transition: { duration: 0.2 }
    });

    try {
      // Simuler l'envoi
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Réinitialiser le formulaire
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = theme === 'dark';

  const inputClassName = `
    w-full px-4 py-3 rounded-lg
    ${isDark
      ? 'bg-shadow-surface border border-shadow-primary/30 text-shadow-text placeholder-shadow-text/50 focus:border-shadow-accent'
      : 'bg-light-surface border border-light-primary/30 text-light-text placeholder-light-text/50 focus:border-light-accent'}
    transition-all duration-300 focus:outline-none focus:ring-2
    ${isDark ? 'focus:ring-shadow-primary/20' : 'focus:ring-light-primary/20'}
  `;

  const magicParticles = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: [0, 1, 0],
      scale: [0.2, 1.5, 0.2],
      transition: {
        duration: 2,
        repeat: Infinity,
      }
    }
  };

  return (
    <section id="contact" className={`
      relative py-24
      ${isDark ? 'bg-shadow-secondary' : 'bg-light-secondary'}
    `}>
      <ParticlesBackground />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className={`
            text-4xl md:text-5xl font-bold mb-4
            ${isDark ? 'text-shadow-text' : 'text-light-text'}
          `}>
            <span className={isDark ? 'text-shadow-primary' : 'text-light-primary'}>
              Contact
            </span>
          </h2>
          <p className={`
            max-w-2xl mx-auto text-lg
            ${isDark ? 'text-shadow-text/80' : 'text-light-text/80'}
          `}>
            Une collaboration ? Une mission ? N'hésitez pas à me contacter pour échanger sur vos projets.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <div className={`
            relative p-8 rounded-xl shadow-xl
            ${isDark 
              ? 'bg-shadow-dark border border-shadow-primary/30' 
              : 'bg-light-surface border border-light-primary/30'}
          `}>
            {/* Système Solo Leveling en-tête */}
            <div className={`
              absolute top-0 left-0 right-0 
              ${isDark ? 'bg-shadow-system' : 'bg-light-gold-DEFAULT'} 
              px-4 py-2 rounded-t-xl flex justify-between items-center
            `}>
              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-shadow-dark'}`}>
                Système de Communication
              </h3>
              <div className={`
                text-xs px-2 py-1 rounded 
                ${isDark ? 'bg-shadow-blue text-white' : 'bg-light-gold-light text-shadow-dark'}
              `}>
                Sécurisé
              </div>
            </div>

            {/* Formulaire */}
            <form 
              onSubmit={handleSubmit}
              className="mt-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label 
                    htmlFor="name" 
                    className={`block mb-2 text-sm font-medium ${
                      isDark ? 'text-shadow-text' : 'text-light-text'
                    }`}
                  >
                    Nom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="email" 
                    className={`block mb-2 text-sm font-medium ${
                      isDark ? 'text-shadow-text' : 'text-light-text'
                    }`}
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formState.email}
                    onChange={handleChange}
                    required
                    className={inputClassName}
                    placeholder="votre.email@exemple.com"
                  />
                </div>
              </div>
              
              <div>
                <label 
                  htmlFor="subject" 
                  className={`block mb-2 text-sm font-medium ${
                    isDark ? 'text-shadow-text' : 'text-light-text'
                  }`}
                >
                  Sujet
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                  placeholder="Sujet de votre message"
                />
              </div>
              
              <div>
                <label 
                  htmlFor="message" 
                  className={`block mb-2 text-sm font-medium ${
                    isDark ? 'text-shadow-text' : 'text-light-text'
                  }`}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className={inputClassName}
                  placeholder="Votre message..."
                />
              </div>
              
              <motion.div
                animate={controls}
                className="flex justify-center"
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    px-10 py-3 rounded-lg font-medium relative overflow-hidden
                    ${isDark 
                      ? 'bg-shadow-primary text-white shadow-lg shadow-shadow-primary/30' 
                      : 'bg-light-primary text-white shadow-lg shadow-light-primary/30'}
                    transition-all duration-300
                    ${isSubmitting ? 'opacity-80 cursor-wait' : ''}
                  `}
                >
                  {/* Effet de particules de magie autour du bouton */}
                  {isSubmitting && (
                    <>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <motion.span
                          key={i}
                          className={`
                            absolute w-2 h-2 rounded-full
                            ${isDark ? 'bg-shadow-blue' : 'bg-light-gold-light'}
                          `}
                          initial={{ 
                            x: 0, 
                            y: 0, 
                            opacity: 0,
                            scale: 0 
                          }}
                          animate={{ 
                            x: [0, (Math.random() - 0.5) * 100], 
                            y: [0, (Math.random() - 0.5) * 100], 
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                          }}
                          transition={{ 
                            duration: 1.5,
                            delay: i * 0.2,
                            repeat: Infinity
                          }}
                          style={{
                            left: `${50 + (Math.random() - 0.5) * 20}%`,
                            top: `${50 + (Math.random() - 0.5) * 20}%`
                          }}
                        />
                      ))}
                    </>
                  )}
                  
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </div>
                  ) : 'Envoyer le message'}
                </motion.button>
              </motion.div>
              
              {/* Message de confirmation */}
              <AnimatedNotification 
                type={submitStatus} 
                successMessage="Votre message a été envoyé avec succès !" 
                errorMessage="Une erreur s'est produite lors de l'envoi du message."
              />
            </form>
          </div>
          
          {/* Informations de contact */}
          <div className={`
            mt-12 grid grid-cols-1 md:grid-cols-3 gap-6
          `}>
            <ContactInfoCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              title="E-mail"
              detail="pro.lrigs@gmail.com"
              isDark={isDark}
            />
            
            <ContactInfoCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              }
              title="Localisation"
              detail="Paris, France"
              isDark={isDark}
            />
            
            <ContactInfoCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-7 h-7">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              }
              title="Disponibilité"
              detail="Missions & Freelance"
              isDark={isDark}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

interface AnimatedNotificationProps {
  type: 'idle' | 'success' | 'error';
  successMessage: string;
  errorMessage: string;
}

const AnimatedNotification: React.FC<AnimatedNotificationProps> = ({ 
  type, 
  successMessage, 
  errorMessage 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  if (type === 'idle') return null;
  
  const isSuccess = type === 'success';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        p-4 rounded-lg mt-6 flex items-center
        ${isSuccess 
          ? isDark ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'
          : isDark ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}
      `}
    >
      <div className={`
        rounded-full p-1 mr-3
        ${isSuccess 
          ? isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-500'
          : isDark ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-500'}
      `}>
        {isSuccess ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <p className={`text-sm ${
        isSuccess 
          ? isDark ? 'text-green-300' : 'text-green-700'
          : isDark ? 'text-red-300' : 'text-red-700'
      }`}>
        {isSuccess ? successMessage : errorMessage}
      </p>
    </motion.div>
  );
};

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  detail: string;
  isDark: boolean;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ icon, title, detail, isDark }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`
        p-6 rounded-lg text-center
        ${isDark 
          ? 'bg-shadow-surface border border-shadow-primary/30' 
          : 'bg-light-surface border border-light-primary/30'}
      `}
    >
      <div className={`
        mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center
        ${isDark 
          ? 'bg-shadow-primary/20 text-shadow-accent' 
          : 'bg-light-primary/20 text-light-primary'}
      `}>
        {icon}
      </div>
      <h4 className={`
        text-lg font-semibold mb-2
        ${isDark ? 'text-shadow-text' : 'text-light-text'}
      `}>
        {title}
      </h4>
      <p className={`
        ${isDark ? 'text-shadow-text/80' : 'text-light-text/80'}
      `}>
        {detail}
      </p>
    </motion.div>
  );
};

export default ContactSection; 
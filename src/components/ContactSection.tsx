'use client';
import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';

const ContactSection = () => {
  const { theme } = useTheme();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const controls = useAnimation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Animation de soumission
    await controls.start({
      scale: [1, 0.95, 1],
      transition: { duration: 0.2 }
    });

    // Simuler l'envoi
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
  };

  const inputClassName = `
    w-full px-4 py-3 rounded-lg
    ${theme === 'dark'
      ? 'bg-shadow-secondary/50 border border-shadow-primary/30 text-shadow-text placeholder-shadow-text/50 focus:border-shadow-accent'
      : 'bg-light-secondary/50 border border-light-primary/30 text-light-text placeholder-light-text/50 focus:border-light-accent'}
    transition-all duration-300 focus:outline-none focus:ring-2
    ${theme === 'dark' ? 'focus:ring-shadow-primary/20' : 'focus:ring-light-primary/20'}
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
    <section className={`
      min-h-screen py-24 relative overflow-hidden
      ${theme === 'dark' ? 'bg-shadow-secondary' : 'bg-light-secondary'}
    `}>
      {/* Particules magiques */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          variants={magicParticles}
          initial="hidden"
          animate="visible"
          className={`
            absolute w-2 h-2 rounded-full
            ${theme === 'dark' ? 'bg-shadow-primary' : 'bg-light-primary'}
          `}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className={`
            text-4xl md:text-5xl font-bold mb-6
            ${theme === 'dark' ? 'text-shadow-text' : 'text-light-text'}
          `}>
            Invoquez une{' '}
            <span className={
              theme === 'dark' ? 'text-shadow-primary' : 'text-light-primary'
            }>
              Communication
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            animate={controls}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="text"
                  placeholder="Votre nom"
                  className={inputClassName}
                  required
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <input
                  type="email"
                  placeholder="Votre email"
                  className={inputClassName}
                  required
                />
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="text"
                placeholder="Sujet"
                className={inputClassName}
                required
              />
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <textarea
                placeholder="Votre message"
                rows={6}
                className={inputClassName}
                required
              />
            </motion.div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              className={`
                w-full py-4 rounded-lg font-medium relative overflow-hidden
                ${theme === 'dark'
                  ? 'bg-shadow-primary text-white hover:bg-shadow-accent'
                  : 'bg-light-primary text-shadow-secondary hover:bg-light-accent'}
                transition-all duration-300
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isSubmitting ? (
                <motion.div
                  animate={{
                    rotate: 360
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="w-6 h-6 border-2 border-t-transparent rounded-full mx-auto"
                />
              ) : (
                "Envoyer le message"
              )}
              
              {/* Effet d'énergie */}
              <motion.div
                className={`
                  absolute inset-0
                  ${theme === 'dark'
                    ? 'bg-gradient-to-r from-shadow-primary via-shadow-accent to-shadow-primary'
                    : 'bg-gradient-to-r from-light-primary via-light-accent to-light-primary'}
                `}
                animate={{
                  x: ['0%', '100%', '0%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  opacity: 0.2,
                }}
              />
            </motion.button>
          </motion.form>

          {/* Informations de contact */}
          <div className="space-y-8">
            {[
              {
                icon: '🏰',
                title: 'Localisation',
                content: 'Paris, France',
                animation: 'castle'
              },
              {
                icon: '📜',
                title: 'Email',
                content: 'contact@votrenom.com',
                animation: 'scroll'
              },
              {
                icon: '⚔️',
                title: 'Disponibilité',
                content: 'Lun-Ven, 9h-18h',
                animation: 'swords'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className={`
                  p-6 rounded-lg
                  ${theme === 'dark'
                    ? 'bg-shadow-secondary/50 border border-shadow-primary/30'
                    : 'bg-light-secondary/50 border border-light-primary/30'}
                `}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className={`
                      font-bold mb-1
                      ${theme === 'dark' ? 'text-shadow-text' : 'text-light-text'}
                    `}>
                      {item.title}
                    </h3>
                    <p className={`
                      ${theme === 'dark' ? 'text-shadow-text/80' : 'text-light-text/80'}
                    `}>
                      {item.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Réseaux sociaux */}
            <div className="flex space-x-4">
              {[
                { icon: '🐦', platform: 'Twitter' },
                { icon: '💼', platform: 'LinkedIn' },
                { icon: '🐱', platform: 'GitHub' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className={`
                    w-12 h-12 flex items-center justify-center rounded-full
                    ${theme === 'dark'
                      ? 'bg-shadow-primary hover:bg-shadow-accent'
                      : 'bg-light-primary hover:bg-light-accent'}
                    transition-colors duration-300
                  `}
                >
                  <span className="text-xl">{social.icon}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 
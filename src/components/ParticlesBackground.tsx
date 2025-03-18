'use client';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number; 
  velocity: { x: number; y: number };
  opacity: number;
  shape: 'circle' | 'square' | 'triangle'; // Formes variées pour les particules
  rotation: number; // Rotation pour les formes carrées et triangulaires
}

const ParticlesBackground = () => {
  const { theme } = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);
  const isDark = theme === 'dark';

  useEffect(() => {
    const shapes: ('circle' | 'square' | 'triangle')[] = ['circle', 'square', 'triangle'];
    
    const createParticle = (): Particle => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 5 + 1, // Tailles plus variées
      velocity: {
        x: (Math.random() - 0.5) * 0.8, // Vitesse légèrement plus rapide
        y: (Math.random() - 0.5) * 0.8
      },
      opacity: Math.random() * 0.5 + 0.1, // Opacité variable
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360 // Rotation aléatoire
    });

    // Plus de particules pour un effet plus dense
    const particleCount = isDark ? 80 : 60; // Plus de particules en mode sombre
    const initialParticles = Array.from({ length: particleCount }, createParticle);
    setParticles(initialParticles);

    // Fonction pour faire pulser l'opacité
    const pulseOpacity = (opacity: number): number => {
      const change = (Math.random() - 0.5) * 0.05;
      const newOpacity = opacity + change;
      return Math.max(0.05, Math.min(0.6, newOpacity)); // Limiter entre 0.05 et 0.6
    };

    const updateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let newX = particle.x + particle.velocity.x;
          let newY = particle.y + particle.velocity.y;

          // Effet de "wrap around" au lieu de rebond
          if (newX < -20) newX = window.innerWidth + 20;
          if (newX > window.innerWidth + 20) newX = -20;
          if (newY < -20) newY = window.innerHeight + 20;
          if (newY > window.innerHeight + 20) newY = -20;

          // Légère rotation des particules
          const newRotation = (particle.rotation + 0.2) % 360;

          return {
            ...particle,
            x: newX,
            y: newY,
            opacity: pulseOpacity(particle.opacity),
            rotation: newRotation
          };
        })
      );
    };

    const animationFrame = setInterval(updateParticles, 50);
    
    // Nettoyage
    return () => clearInterval(animationFrame);
  }, [isDark]);

  // Fonction pour rendre la forme en fonction du type de particule
  const renderParticleShape = (particle: Particle) => {
    const particleClasses = `absolute ${
      isDark
        ? 'bg-gradient-to-r from-shadow-monarch to-shadow-blue shadow-sm shadow-shadow-blue/30'
        : 'bg-gradient-to-r from-light-gold-light to-light-rank shadow-sm shadow-light-gold-DEFAULT/30'
    }`;
    
    switch (particle.shape) {
      case 'circle':
        return (
          <motion.div
            key={particle.id}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: particle.opacity
            }}
            transition={{
              duration: 0.1,
              ease: "linear"
            }}
            className={`${particleClasses} rounded-full`}
            style={{
              width: particle.size,
              height: particle.size,
            }}
          />
        );
      case 'square':
        return (
          <motion.div
            key={particle.id}
            animate={{
              x: particle.x,
              y: particle.y,
              rotate: particle.rotation,
              opacity: particle.opacity
            }}
            transition={{
              duration: 0.1,
              ease: "linear"
            }}
            className={particleClasses}
            style={{
              width: particle.size,
              height: particle.size,
            }}
          />
        );
      case 'triangle':
        // Triangle représenté en CSS
        return (
          <motion.div
            key={particle.id}
            animate={{
              x: particle.x,
              y: particle.y,
              rotate: particle.rotation,
              opacity: particle.opacity
            }}
            transition={{
              duration: 0.1,
              ease: "linear"
            }}
            className="absolute"
            style={{
              width: 0,
              height: 0,
              borderLeft: `${particle.size/2}px solid transparent`,
              borderRight: `${particle.size/2}px solid transparent`,
              borderBottom: `${particle.size}px solid ${
                isDark ? '#8E24AA' : '#FDB813'
              }`,
            }}
          />
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => renderParticleShape(particle))}
      
      {/* Effet de lueur floue pour représenter l'énergie du Shadow Monarch */}
      {isDark && (
        <div className="absolute inset-0 bg-shadow-monarch/5 backdrop-blur-[100px] mix-blend-overlay animate-monarch-emerge"></div>
      )}
    </div>
  );
};

export default ParticlesBackground; 
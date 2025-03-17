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
}

const ParticlesBackground = () => {
  const { theme } = useTheme();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const createParticle = (): Particle => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      velocity: {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5
      }
    });

    // Créer les particules initiales
    const initialParticles = Array.from({ length: 50 }, createParticle);
    setParticles(initialParticles);

    const updateParticles = () => {
      setParticles(prevParticles =>
        prevParticles.map(particle => {
          let newX = particle.x + particle.velocity.x;
          let newY = particle.y + particle.velocity.y;

          // Rebond sur les bords
          if (newX < 0 || newX > window.innerWidth) particle.velocity.x *= -1;
          if (newY < 0 || newY > window.innerHeight) particle.velocity.y *= -1;

          return {
            ...particle,
            x: newX,
            y: newY
          };
        })
      );
    };

    const animationFrame = setInterval(updateParticles, 50);
    return () => clearInterval(animationFrame);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          animate={{
            x: particle.x,
            y: particle.y,
          }}
          transition={{
            duration: 0.05,
            ease: "linear"
          }}
          className={`absolute rounded-full ${
            theme === 'light'
              ? 'bg-gradient-to-r from-[#FDB813] to-[#9E2A2B] opacity-30'
              : 'bg-gradient-to-r from-purple-600 to-red-600 opacity-40'
          }`}
          style={{
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}
    </div>
  );
};

export default ParticlesBackground; 
'use client';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useInView } from 'react-intersection-observer';
import SkillBar from './SkillBar';

interface Skill {
  name: string;
  level: number;
  rank: 'S' | 'A' | 'B' | 'C';
  category: string;
}

const skills: Skill[] = [
  {
    name: "Ruler's Authority",
    level: 95,
    rank: 'S',
    category: "Combat"
  },
  {
    name: "Shadow Extraction",
    level: 90,
    rank: 'S',
    category: "Necromancy"
  },
  {
    name: "Mana Control",
    level: 85,
    rank: 'A',
    category: "Magic"
  },
  {
    name: "Deep Learning",
    level: 95,
    rank: 'S',
    category: "Intelligence Artificielle"
  },
  {
    name: "Machine Learning",
    level: 90,
    rank: 'S',
    category: "Intelligence Artificielle"
  },
  {
    name: "Computer Vision",
    level: 85,
    rank: 'A',
    category: "Intelligence Artificielle"
  },
  {
    name: "NLP",
    level: 88,
    rank: 'A',
    category: "Intelligence Artificielle"
  },
  // Ajoutez d'autres compétences...
];

const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => {
  const { theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const getRankColor = (rank: string) => {
    if (theme === 'dark') {
      switch (rank) {
        case 'S': return 'text-purple-400 shadow-purple-500/50';
        case 'A': return 'text-blue-400 shadow-blue-500/50';
        case 'B': return 'text-green-400 shadow-green-500/50';
        default: return 'text-gray-400 shadow-gray-500/50';
      }
    } else {
      switch (rank) {
        case 'S': return 'text-yellow-600 shadow-yellow-500/50';
        case 'A': return 'text-orange-500 shadow-orange-500/50';
        case 'B': return 'text-amber-500 shadow-amber-500/50';
        default: return 'text-gray-600 shadow-gray-500/50';
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay: index * 0.1 }
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative p-6 rounded-lg
        ${theme === 'dark' 
          ? 'bg-shadow-secondary border border-shadow-primary/30' 
          : 'bg-light-secondary border border-light-primary/30'}
        transform transition-all duration-300 hover:scale-105
      `}
    >
      {/* Effet de particules au hover */}
      <motion.div
        className={`
          absolute inset-0 rounded-lg opacity-0
          ${theme === 'dark' ? 'bg-shadow-pattern' : 'bg-light-pattern'}
        `}
        animate={{ opacity: isHovered ? 0.2 : 0 }}
      />

      {/* En-tête avec rang */}
      <div className="flex justify-between items-center mb-4">
        <h3 className={`
          text-xl font-bold
          ${theme === 'dark' ? 'text-shadow-text' : 'text-light-text'}
        `}>
          {skill.name}
        </h3>
        <motion.div
          className={`
            text-2xl font-bold px-3 py-1 rounded
            ${getRankColor(skill.rank)}
          `}
          animate={{
            scale: isHovered ? 1.1 : 1,
            textShadow: isHovered 
              ? theme === 'dark' 
                ? '0 0 8px rgba(155, 114, 233, 0.8)' 
                : '0 0 8px rgba(255, 215, 0, 0.8)'
              : 'none'
          }}
        >
          {skill.rank}
        </motion.div>
      </div>

      {/* Barre de progression */}
      <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`
            absolute h-full rounded-full
            ${theme === 'dark'
              ? 'bg-gradient-to-r from-shadow-primary to-shadow-accent'
              : 'bg-gradient-to-r from-light-primary to-light-accent'}
          `}
        />
        {/* Effet de brillance */}
        <motion.div
          className="absolute inset-0 opacity-0"
          animate={{
            opacity: isHovered ? [0, 0.5, 0] : 0,
            left: isHovered ? ['0%', '100%'] : '0%'
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'loop'
          }}
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(90deg, transparent, rgba(155, 114, 233, 0.3), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(255, 215, 0, 0.3), transparent)'
          }}
        />
      </div>

      {/* Niveau numérique */}
      <div className={`
        mt-2 text-right text-sm font-medium
        ${theme === 'dark' ? 'text-shadow-accent' : 'text-light-primary'}
      `}>
        Niveau {skill.level}
      </div>
    </motion.div>
  );
};

export default function SkillsSection() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(skills.map(skill => skill.category))];

  return (
    <section className={`
      min-h-screen py-24 relative overflow-hidden
      ${theme === 'dark' ? 'bg-shadow-secondary' : 'bg-light-secondary'}
    `}>
      {/* Effet de fond animé */}
      <div className={`
        absolute inset-0 opacity-20
        ${theme === 'dark' ? 'bg-shadow-pattern' : 'bg-light-pattern'}
      `} />

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
            Mes{' '}
            <span className={
              theme === 'dark' ? 'text-shadow-primary' : 'text-light-primary'
            }>
              Compétences
            </span>
          </h2>

          {/* Filtres de catégories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-6 py-2 rounded-full text-sm font-medium
                  ${selectedCategory === category
                    ? theme === 'dark'
                      ? 'bg-shadow-primary text-white'
                      : 'bg-light-primary text-shadow-secondary'
                    : theme === 'dark'
                      ? 'bg-shadow-secondary text-shadow-text'
                      : 'bg-light-secondary text-light-text'
                  }
                  transition-all duration-300
                `}
                whileHover={{
                  scale: 1.05,
                  boxShadow: theme === 'dark'
                    ? '0 0 15px rgba(155, 114, 233, 0.3)'
                    : '0 0 15px rgba(255, 215, 0, 0.3)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grille de compétences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills
            .filter(skill => selectedCategory === 'all' || skill.category === selectedCategory)
            .map((skill, index) => (
              <SkillBar
                key={index}
                name={skill.name}
                level={skill.level}
                rank={skill.rank}
                index={index}
              />
            ))}
        </div>
      </div>
    </section>
  );
} 
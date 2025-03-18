'use client';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useInView } from 'react-intersection-observer';
import SkillBar from './SkillBar';
import ParticlesBackground from './ParticlesBackground';

interface Skill {
  name: string;
  level: number;
  rank: 'S' | 'A' | 'B' | 'C';
  category: string;
  description?: string;
  relatedProjects?: Array<{
    name: string;
    description: string;
    url?: string;
  }>;
}

interface SkillInfoProps {
  skill: Skill;
  onClose: () => void;
  isVisible: boolean;
}

// Composant pour afficher les informations détaillées d'une compétence
const SkillInfo = ({ skill, onClose, isVisible }: SkillInfoProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className={`
            fixed inset-0 z-50 flex items-center justify-center p-4
          `}
        >
          {/* Overlay de fond semi-transparent */}
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Contenu */}
          <motion.div 
            className={`
              relative w-full max-w-2xl rounded-lg overflow-hidden z-10
              ${isDark 
                ? 'bg-shadow-secondary border-2 border-shadow-system' 
                : 'bg-light-secondary border-2 border-light-gold-DEFAULT'}
              shadow-2xl
            `}
            layoutId={`skill-card-${skill.name}`}
          >
            {/* En-tête du système */}
            <div className={`
              px-4 py-3 flex items-center justify-between
              ${isDark ? 'bg-shadow-system' : 'bg-light-gold-DEFAULT'}
            `}>
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-shadow-dark'}`}>
                {skill.name}
              </h3>
              <div className={`
                px-3 py-1 rounded text-sm font-bold
                ${isDark 
                  ? skill.rank === 'S' ? 'bg-purple-600 text-white' 
                  : skill.rank === 'A' ? 'bg-blue-600 text-white' 
                  : skill.rank === 'B' ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 text-white'
                  : skill.rank === 'S' ? 'bg-yellow-500 text-shadow-dark' 
                  : skill.rank === 'A' ? 'bg-orange-500 text-shadow-dark' 
                  : skill.rank === 'B' ? 'bg-blue-500 text-shadow-dark' 
                  : 'bg-green-500 text-shadow-dark'
                }
              `}>
                Rang {skill.rank}
              </div>
            </div>
            
            {/* Corps */}
            <div className="p-6">
              {/* Description */}
              <div className="mb-6">
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                  Description
                </h4>
                <p className={`${isDark ? 'text-shadow-text/80' : 'text-light-text/80'}`}>
                  {skill.description || `Compétence avancée dans le domaine de ${skill.name}.`}
                </p>
              </div>
              
              {/* Niveau */}
              <div className="mb-6">
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                  Niveau de maîtrise
                </h4>
                <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1 }}
                    className={`
                      absolute h-full rounded-full
                      ${isDark
                        ? 'bg-gradient-to-r from-shadow-primary to-shadow-accent'
                        : 'bg-gradient-to-r from-light-primary to-light-accent'}
                    `}
                  />
                </div>
                <div className={`mt-2 text-right text-sm font-medium
                  ${isDark ? 'text-shadow-accent' : 'text-light-primary'}
                `}>
                  Niveau {skill.level}
                </div>
              </div>
              
              {/* Projets associés */}
              <div>
                <h4 className={`font-semibold mb-3 ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                  Projets associés
                </h4>
                {skill.relatedProjects && skill.relatedProjects.length > 0 ? (
                  <div className="space-y-3">
                    {skill.relatedProjects.map((project, index) => (
                      <div key={index} className={`
                        p-3 rounded-lg
                        ${isDark ? 'bg-shadow-surface' : 'bg-light-surface'}
                      `}>
                        <h5 className={`font-medium ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                          {project.name}
                        </h5>
                        <p className={`text-sm mt-1 ${isDark ? 'text-shadow-text/70' : 'text-light-text/70'}`}>
                          {project.description}
                        </p>
                        {project.url && (
                          <a 
                            href={project.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className={`
                              mt-2 text-xs font-medium inline-flex items-center
                              ${isDark ? 'text-shadow-blue hover:text-shadow-accent' : 'text-light-primary hover:text-light-accent'}
                            `}
                          >
                            Voir le projet <span className="ml-1">→</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`
                    p-4 rounded-lg text-center
                    ${isDark ? 'bg-shadow-surface' : 'bg-light-surface'}
                  `}>
                    <p className={`text-sm ${isDark ? 'text-shadow-text/70' : 'text-light-text/70'}`}>
                      Aucun projet associé pour le moment.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Pied */}
            <div className={`
              px-6 py-3 flex justify-end
              ${isDark ? 'bg-shadow-dark' : 'bg-light-surface'}
            `}>
              <button
                onClick={onClose}
                className={`
                  px-4 py-2 rounded font-medium text-sm
                  ${isDark 
                    ? 'bg-shadow-primary text-white hover:bg-shadow-accent' 
                    : 'bg-light-primary text-white hover:bg-light-accent'}
                  transition-colors
                `}
              >
                Fermer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Données enrichies pour les compétences
const skills: Skill[] = [
  {
    name: "Deep Learning",
    level: 95,
    rank: 'S',
    category: "Intelligence Artificielle",
    description: "Maîtrise avancée des architectures de réseaux de neurones profonds, y compris CNN, RNN, Transformers et GANs.",
    relatedProjects: [
      {
        name: "Système de recommandation IA",
        description: "Un système de recommandation utilisant des réseaux de neurones profonds pour prédire les préférences des utilisateurs.",
        url: "/projects/systeme-recommandation"
      },
      {
        name: "Classification d'images médicales",
        description: "Application de détection de pathologies à partir d'images médicales utilisant des CNN.",
        url: "/projects/classification-images-medicales"
      }
    ]
  },
  {
    name: "Machine Learning",
    level: 90,
    rank: 'S',
    category: "Intelligence Artificielle",
    description: "Expertise dans les algorithmes classiques et avancés de machine learning, y compris l'optimisation et le tuning des hyperparamètres.",
    relatedProjects: [
      {
        name: "Prédiction de la demande",
        description: "Modèle de prévision pour optimiser les stocks en fonction de multiples variables.",
        url: "/projects/prediction-demande"
      }
    ]
  },
  {
    name: "Computer Vision",
    level: 85,
    rank: 'A',
    category: "Intelligence Artificielle",
    description: "Développement de solutions de traitement d'images et de vidéos, détection d'objets, reconnaissance faciale et analyse de scènes.",
    relatedProjects: [
      {
        name: "Tracking d'objets en temps réel",
        description: "Système de suivi d'objets utilisant YOLO et DeepSORT pour des applications de sécurité.",
        url: "/projects/tracking-temps-reel"
      }
    ]
  },
  {
    name: "NLP",
    level: 88,
    rank: 'A',
    category: "Intelligence Artificielle",
    description: "Traitement du langage naturel avancé, incluant l'analyse de sentiment, la génération de texte et les chatbots.",
    relatedProjects: [
      {
        name: "Assistant virtuel",
        description: "Chatbot intelligent utilisant des techniques de NLP pour comprendre et répondre aux requêtes des utilisateurs.",
        url: "/projects/assistant-virtuel"
      }
    ]
  },
  // Ajoutez d'autres compétences...
];

const SkillCard = ({ skill, index, onClick }: { skill: Skill; index: number; onClick: () => void }) => {
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
      layoutId={`skill-card-${skill.name}`}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`
        relative p-6 rounded-lg cursor-pointer
        ${theme === 'dark' 
          ? 'bg-shadow-secondary border border-shadow-primary/30' 
          : 'bg-light-secondary border border-light-primary/30'}
        transform transition-all duration-300
      `}
      whileHover={{ 
        scale: 1.05,
        boxShadow: theme === 'dark' 
          ? '0 0 15px rgba(150, 100, 255, 0.3)' 
          : '0 0 15px rgba(255, 215, 0, 0.3)' 
      }}
    >
      {/* Effet de particules au hover */}
      <motion.div
        className={`
          absolute inset-0 rounded-lg opacity-0
          ${theme === 'dark' ? 'bg-shadow-pattern' : 'bg-light-pattern'}
        `}
        animate={{ opacity: isHovered ? 0.2 : 0 }}
      />

      {/* Effet de glow au hover */}
      <motion.div 
        className="absolute inset-0 rounded-lg"
        animate={{ 
          boxShadow: isHovered 
            ? theme === 'dark'
              ? '0 0 20px rgba(150, 100, 255, 0.5), inset 0 0 10px rgba(150, 100, 255, 0.3)'
              : '0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 10px rgba(255, 215, 0, 0.3)'
            : 'none'
        }}
      />

      {/* En-tête avec rang */}
      <div className="flex justify-between items-center mb-4">
        <h3 className={`
          text-xl font-bold
          ${theme === 'dark' ? 'text-shadow-text' : 'text-light-text'}
          ${isHovered ? theme === 'dark' ? 'text-shadow-blue' : 'text-light-gold-DEFAULT' : ''}
          transition-colors duration-300
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
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Filtrer les compétences par catégorie
  const filteredSkills = selectedCategory === 'all'
    ? skills
    : skills.filter(skill => skill.category === selectedCategory);

  const categories = ['all', ...new Set(skills.map(skill => skill.category))];

  return (
    <section id="skills" className={`
      min-h-screen py-24 relative overflow-hidden
      ${theme === 'dark' ? 'bg-shadow-secondary' : 'bg-light-secondary'}
    `} ref={sectionRef}>
      {/* Fond animé */}
      <ParticlesBackground />

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
                    ? '0 0 10px rgba(150, 100, 255, 0.3)'
                    : '0 0 10px rgba(255, 215, 0, 0.3)'
                }}
              >
                {category === 'all' ? 'Toutes' : category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Grille de compétences */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => (
            <SkillCard 
              key={skill.name} 
              skill={skill} 
                index={index}
              onClick={() => setSelectedSkill(skill)}
              />
            ))}
        </div>
      </div>

      {/* Fenêtre modale d'information sur la compétence */}
      <SkillInfo 
        skill={selectedSkill || skills[0]} 
        onClose={() => setSelectedSkill(null)}
        isVisible={selectedSkill !== null}
      />
    </section>
  );
} 
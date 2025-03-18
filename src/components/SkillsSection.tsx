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
          transition={{ type: "spring", damping: 25 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
        >
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
            onClick={(e) => e.stopPropagation()}
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
                  : skill.rank === 'A' ? 'bg-red-600 text-white' 
                  : skill.rank === 'B' ? 'bg-blue-600 text-white' 
                  : 'bg-green-600 text-white'
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
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}`}>
                  Description
                </h4>
                <p className={`text-sm ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                  {skill.description || `Compétence avancée dans le domaine de ${skill.name}.`}
                </p>
              </div>
              
              {/* Barre de niveau */}
              <div className="mb-6">
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}`}>
                  Niveau de maîtrise
                </h4>
                <div className="relative h-6 rounded-lg overflow-hidden bg-gray-800">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`
                      absolute top-0 left-0 h-full
                      ${isDark
                        ? skill.rank === 'S' ? 'bg-gradient-to-r from-purple-700 to-purple-500' 
                        : skill.rank === 'A' ? 'bg-gradient-to-r from-red-700 to-red-500' 
                        : skill.rank === 'B' ? 'bg-gradient-to-r from-blue-700 to-blue-500' 
                        : 'bg-gradient-to-r from-green-700 to-green-500'
                        : skill.rank === 'S' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' 
                        : skill.rank === 'A' ? 'bg-gradient-to-r from-orange-600 to-orange-400' 
                        : skill.rank === 'B' ? 'bg-gradient-to-r from-blue-600 to-blue-400' 
                        : 'bg-gradient-to-r from-green-600 to-green-400'
                      }
                    `}
                  />
                  <div className="absolute inset-0 flex items-center justify-end px-3">
                    <span className="text-xs font-bold text-white">
                      {skill.level}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Projets associés */}
              {skill.relatedProjects && skill.relatedProjects.length > 0 && (
                <div>
                  <h4 className={`text-sm font-bold mb-3 ${isDark ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}`}>
                    Projets associés
                  </h4>
                  <div className="space-y-4">
                    {skill.relatedProjects.map((project, index) => (
                      <div 
                        key={index}
                        className={`
                          p-3 rounded-lg 
                          ${isDark 
                            ? 'bg-shadow-surface hover:bg-shadow-surface/80' 
                            : 'bg-light-surface hover:bg-light-surface/80'}
                          transition-colors
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <h5 className={`font-semibold ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                            {project.name}
                          </h5>
                          {project.url && (
                            <a 
                              href={project.url}
                              className={`
                                text-xs px-2 py-1 rounded
                                ${isDark 
                                  ? 'bg-shadow-system text-white hover:bg-shadow-monarch' 
                                  : 'bg-light-gold-DEFAULT text-shadow-dark hover:bg-light-gold-light'}
                                transition-colors
                              `}
                            >
                              Voir
                            </a>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${isDark ? 'text-shadow-text/80' : 'text-light-text/80'}`}>
                          {project.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Pied du modal */}
            <div className={`
              px-4 py-3 flex justify-end
              ${isDark ? 'bg-shadow-surface' : 'bg-light-surface'}
            `}>
              <button
                onClick={onClose}
                className={`
                  px-4 py-2 rounded-md text-sm font-medium
                  ${isDark 
                    ? 'bg-shadow-secondary hover:bg-shadow-primary text-shadow-text' 
                    : 'bg-light-secondary hover:bg-light-primary text-light-text'}
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

// Liste des compétences avec leurs détails
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

  // Obtenir la couleur du rang selon le thème
  const getRankColor = (rank: string) => {
    if (theme === 'dark') {
      switch (rank) {
        case 'S': return 'bg-purple-600';
        case 'A': return 'bg-red-600';
        case 'B': return 'bg-blue-600';
        default: return 'bg-green-600';
      }
    } else {
      switch (rank) {
        case 'S': return 'bg-yellow-500';
        case 'A': return 'bg-orange-500';
        case 'B': return 'bg-blue-500';
        default: return 'bg-green-500';
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
        hover:shadow-lg
      `}
      whileHover={{ 
        scale: 1.03,
        boxShadow: theme === 'dark' 
          ? '0 0 15px rgba(150, 100, 255, 0.3)' 
          : '0 0 15px rgba(255, 215, 0, 0.3)' 
      }}
    >
      {/* Badge de rang */}
      <div className={`
        absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center
        ${getRankColor(skill.rank)}
        text-white font-bold
      `}>
        {skill.rank}
      </div>

      {/* En-tête */}
      <h3 className={`
        text-xl font-bold mb-4 pr-10
        ${theme === 'dark' ? 'text-shadow-text' : 'text-light-text'}
        ${isHovered ? theme === 'dark' ? 'text-shadow-blue' : 'text-light-gold-DEFAULT' : ''}
        transition-colors duration-300
      `}>
        {skill.name}
      </h3>

      {/* Barre de progression */}
      <div className="relative h-6 rounded-lg overflow-hidden bg-gray-800 mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${skill.level}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`
            absolute top-0 left-0 h-full
            ${theme === 'dark'
              ? skill.rank === 'S' ? 'bg-gradient-to-r from-purple-700 to-purple-500' 
              : skill.rank === 'A' ? 'bg-gradient-to-r from-red-700 to-red-500' 
              : skill.rank === 'B' ? 'bg-gradient-to-r from-blue-700 to-blue-500' 
              : 'bg-gradient-to-r from-green-700 to-green-500'
              : skill.rank === 'S' ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' 
              : skill.rank === 'A' ? 'bg-gradient-to-r from-orange-600 to-orange-400' 
              : skill.rank === 'B' ? 'bg-gradient-to-r from-blue-600 to-blue-400' 
              : 'bg-gradient-to-r from-green-600 to-green-400'
            }
          `}
        />
        
        {/* Brillance sur la barre */}
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
        
        {/* Affichage du pourcentage */}
        <div className="absolute inset-0 flex items-center justify-end px-3">
          <span className="text-xs font-bold text-white">
            {skill.level}%
          </span>
        </div>
      </div>

      {/* Catégorie de la compétence */}
      <div className={`
        inline-block px-3 py-1 rounded-full text-xs font-medium mt-2
        ${theme === 'dark' 
          ? 'bg-shadow-surface text-shadow-accent' 
          : 'bg-light-surface text-light-gold-DEFAULT'}
      `}>
        {skill.category}
      </div>

      {/* Indicateur de clic pour plus d'infos */}
      <div className={`
        absolute bottom-3 right-3 text-xs
        ${theme === 'dark' ? 'text-shadow-blue/70' : 'text-light-gold-DEFAULT/70'}
      `}>
        Cliquer pour plus d'infos
      </div>
    </motion.div>
  );
};

export default function SkillsSection() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Extraire les catégories uniques des compétences
  const categories = Array.from(new Set(skills.map(skill => skill.category)));

  // Filtrer les compétences par catégorie
  const filteredSkills = selectedCategory 
    ? skills.filter(skill => skill.category === selectedCategory)
    : skills;

  // Gérer le changement de catégorie
  const handleCategoryChange = (category: string | null) => {
    if (category === selectedCategory) {
      // Désactiver le filtre si on clique à nouveau sur la même catégorie
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <section 
      id="skills" 
      className={`py-24 relative overflow-hidden ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
      ref={sectionRef}
    >
      {/* Arrière-plan de particules */}
      <div className="absolute inset-0 z-0 opacity-30">
        <ParticlesBackground />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-12 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' 
                ? 'text-shadow-primary shadow-text-glow' 
                : 'text-light-primary'
            }`}
          >
            Mes Compétences
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-shadow-text' : 'text-light-text'
            }`}
          >
            Aptitudes et connaissances acquises au fil de mes quêtes
          </motion.p>
        </div>

        {/* Système de filtrage par catégorie amélioré */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mb-10"
        >
          <div className={`
            px-4 py-3 rounded-lg 
            ${theme === 'dark' 
              ? 'bg-shadow-secondary/80 border-2 border-shadow-system shadow-lg shadow-shadow-primary/20' 
              : 'bg-light-secondary/80 border-2 border-light-gold-DEFAULT shadow-lg shadow-light-primary/20'}
          `}>
            <div className="flex flex-col items-center">
              <div className={`
                text-sm font-medium mb-2
                ${theme === 'dark' ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'}
              `}>
                Filtrer par domaine :
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-colors
                    ${!selectedCategory 
                      ? theme === 'dark'
                        ? 'bg-shadow-system text-white' 
                        : 'bg-light-gold-DEFAULT text-shadow-dark'
                      : theme === 'dark'
                        ? 'bg-shadow-surface hover:bg-shadow-system/70 text-shadow-text' 
                        : 'bg-light-surface hover:bg-light-gold-DEFAULT/70 text-light-text'}
                  `}
                >
                  Toutes
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`
                      px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${selectedCategory === category 
                        ? theme === 'dark'
                          ? 'bg-shadow-system text-white' 
                          : 'bg-light-gold-DEFAULT text-shadow-dark'
                        : theme === 'dark'
                          ? 'bg-shadow-surface hover:bg-shadow-system/70 text-shadow-text' 
                          : 'bg-light-surface hover:bg-light-gold-DEFAULT/70 text-light-text'}
                    `}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grille de compétences améliorée */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill, index) => (
              <SkillCard 
                key={skill.name} 
                skill={skill} 
                index={index}
                onClick={() => setSelectedSkill(skill)}
              />
            ))
          ) : (
            <div className={`col-span-3 text-center py-10 ${
              theme === 'dark' ? 'text-shadow-text' : 'text-light-text'
            }`}>
              Aucune compétence trouvée dans cette catégorie.
            </div>
          )}
        </div>
      </div>

      {/* Fenêtre modale d'information sur la compétence */}
      {selectedSkill && (
        <SkillInfo 
          skill={selectedSkill} 
          onClose={() => setSelectedSkill(null)}
          isVisible={selectedSkill !== null}
        />
      )}
    </section>
  );
} 
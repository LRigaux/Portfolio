'use client';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useInView } from 'react-intersection-observer';
import ParticlesBackground from './ParticlesBackground';
import { Technology } from '@/types';

interface TechnologyInfoProps {
  technology: Technology;
  onClose: () => void;
  isVisible: boolean;
}

// Composant pour afficher les informations détaillées d'une technologie
const TechnologyInfo = ({ technology, onClose, isVisible }: TechnologyInfoProps) => {
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
            layoutId={`tech-card-${technology.id}`}
          >
            {/* En-tête du système */}
            <div className={`
              px-4 py-3 flex items-center justify-between
              ${isDark ? 'bg-shadow-system' : 'bg-light-gold-DEFAULT'}
            `}>
              <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-shadow-dark'}`}>
                {technology.name}
              </h3>
              {technology.rank && (
                <div className={`
                  px-3 py-1 rounded text-sm font-bold
                  ${isDark 
                    ? technology.rank === 'S' ? 'bg-purple-600 text-white' 
                    : technology.rank === 'A' ? 'bg-blue-600 text-white' 
                    : technology.rank === 'B' ? 'bg-green-600 text-white' 
                    : 'bg-gray-600 text-white'
                    : technology.rank === 'S' ? 'bg-yellow-500 text-shadow-dark' 
                    : technology.rank === 'A' ? 'bg-orange-500 text-shadow-dark' 
                    : technology.rank === 'B' ? 'bg-blue-500 text-shadow-dark' 
                    : 'bg-green-500 text-shadow-dark'
                  }
                `}>
                  Rang {technology.rank}
                </div>
              )}
            </div>
            
            {/* Corps */}
            <div className="p-6">
              {/* Description */}
              <div className="mb-6">
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                  Description
                </h4>
                <p className={`${isDark ? 'text-shadow-text/80' : 'text-light-text/80'}`}>
                  {technology.description || `Maîtrise avancée de ${technology.name}.`}
                </p>
              </div>
              
              {/* Niveau */}
              {technology.level !== undefined && (
                <div className="mb-6">
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                    Niveau de maîtrise
                  </h4>
                  <div className="relative h-4 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${technology.level}%` }}
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
                    Niveau {technology.level}
                  </div>
                </div>
              )}
              
              {/* Projets associés */}
              <div>
                <h4 className={`font-semibold mb-3 ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                  Projets associés
                </h4>
                {technology.relatedProjects && technology.relatedProjects.length > 0 ? (
                  <div className="space-y-3">
                    {technology.relatedProjects.map((project, index) => (
                      <div key={index} className={`
                        p-3 rounded-lg
                        ${isDark ? 'bg-shadow-surface' : 'bg-light-surface'}
                      `}>
                        <h5 className={`font-medium ${isDark ? 'text-shadow-text' : 'text-light-text'}`}>
                          {project.title}
                        </h5>
                        <div className={`flex items-center mt-1`}>
                          <span className={`
                            px-2 py-0.5 text-xs rounded font-medium
                            ${project.rank === 'S'
                              ? isDark ? 'bg-shadow-blue text-white' : 'bg-light-gold-light text-shadow-dark'
                              : project.rank === 'A'
                                ? isDark ? 'bg-shadow-monarch text-white' : 'bg-light-rank text-white'
                                : isDark ? 'bg-shadow-accent text-white' : 'bg-light-primary text-white'
                            }
                          `}>
                            Rang {project.rank}
                          </span>
                        </div>
                        <a 
                          href={`/projects/${project.slug}`} 
                          className={`
                            mt-2 text-xs font-medium inline-flex items-center
                            ${isDark ? 'text-shadow-blue hover:text-shadow-accent' : 'text-light-primary hover:text-light-accent'}
                          `}
                        >
                          Voir le projet <span className="ml-1">→</span>
                        </a>
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

// Carte pour afficher une technologie
const TechnologyCard = ({ technology, index, onClick }: { 
  technology: Technology; 
  index: number; 
  onClick: () => void 
}) => {
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

  const getRankColor = (rank?: string) => {
    if (!rank) return theme === 'dark' ? 'text-gray-400 shadow-gray-500/50' : 'text-gray-600 shadow-gray-500/50';
    
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
      layoutId={`tech-card-${technology.id}`}
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
          {technology.name}
        </h3>
        {technology.rank && (
          <motion.div
            className={`
              text-2xl font-bold px-3 py-1 rounded
              ${getRankColor(technology.rank)}
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
            {technology.rank}
          </motion.div>
        )}
      </div>

      {/* Description */}
      <p className={`
        mb-4 text-sm
        ${theme === 'dark' ? 'text-shadow-text/70' : 'text-light-text/70'}
      `}>
        {technology.description?.substring(0, 100)}
        {technology.description && technology.description.length > 100 ? '...' : ''}
      </p>

      {/* Projets associés */}
      <div>
        <div className={`text-xs font-medium mt-4 mb-2
          ${theme === 'dark' ? 'text-shadow-text/50' : 'text-light-text/50'}
        `}>
          {technology.relatedProjects && technology.relatedProjects.length 
            ? `${technology.relatedProjects.length} projet${technology.relatedProjects.length > 1 ? 's' : ''} associé${technology.relatedProjects.length > 1 ? 's' : ''}`
            : 'Aucun projet associé'
          }
        </div>
        
        {technology.relatedProjects && technology.relatedProjects.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {technology.relatedProjects.slice(0, 3).map((project, idx) => (
              <span key={idx} className={`
                px-2 py-0.5 text-xs rounded-full
                ${theme === 'dark' ? 'bg-shadow-surface text-shadow-text/80' : 'bg-light-surface text-light-text/80'}
              `}>
                {project.title.length > 15 ? project.title.substring(0, 15) + '...' : project.title}
              </span>
            ))}
            {technology.relatedProjects.length > 3 && (
              <span className={`
                px-2 py-0.5 text-xs rounded-full
                ${theme === 'dark' ? 'bg-shadow-blue/20 text-shadow-text/80' : 'bg-light-gold-light/20 text-light-text/80'}
              `}>
                +{technology.relatedProjects.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Données temporaires pour les technologies
const fallbackTechnologies: Technology[] = [
  {
    id: '1',
    name: 'Python',
    slug: 'python',
    description: 'Langage principal pour le développement IA et analyse de données',
    level: 100,
    rank: 'S',
    category: 'Langages de programmation',
    relatedProjects: [
      { id: '1', title: 'Système de Recommandation IA', slug: 'systeme-de-recommandation-ia', rank: 'S' },
      { id: '3', title: 'Agent de Trading Automatisé', slug: 'agent-trading-automatise', rank: 'A' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'TensorFlow',
    slug: 'tensorflow',
    description: 'Framework de deep learning pour la construction de modèles IA',
    level: 85,
    rank: 'S',
    category: 'Frameworks',
    relatedProjects: [
      { id: '1', title: 'Système de Recommandation IA', slug: 'systeme-de-recommandation-ia', rank: 'S' },
      { id: '2', title: 'Classification d\'Images Médicales', slug: 'classification-images-medicales', rank: 'A' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'React/Next.js',
    slug: 'react-nextjs',
    description: 'Développement d\'interfaces web modernes et réactives',
    level: 90,
    rank: 'A',
    category: 'Frameworks Frontend',
    relatedProjects: [
      { id: '8', title: 'Portfolio Solo Leveling', slug: 'portfolio-solo-leveling', rank: 'S' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    name: 'Docker/Kubernetes',
    slug: 'docker-kubernetes',
    description: 'Conteneurisation et orchestration de services',
    level: 75,
    rank: 'A',
    category: 'DevOps',
    relatedProjects: [
      { id: '6', title: 'Plateforme ETL Cloud-Native', slug: 'plateforme-etl-cloud-native', rank: 'S' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    name: 'AWS/GCP',
    slug: 'aws-gcp',
    description: 'Services cloud pour le déploiement et la gestion d\'applications',
    level: 80,
    rank: 'B',
    category: 'Cloud',
    relatedProjects: [
      { id: '6', title: 'Plateforme ETL Cloud-Native', slug: 'plateforme-etl-cloud-native', rank: 'S' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '6',
    name: 'TypeScript',
    slug: 'typescript',
    description: 'JavaScript avec typage statique pour des applications plus robustes',
    level: 85,
    rank: 'A',
    category: 'Langages de programmation',
    relatedProjects: [
      { id: '8', title: 'Portfolio Solo Leveling', slug: 'portfolio-solo-leveling', rank: 'S' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export default function TechnologiesSection() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);
  const [technologies, setTechnologies] = useState<Technology[]>(fallbackTechnologies);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const techContainerRef = useRef<HTMLDivElement>(null);

  // Charger les technologies depuis l'API
  useEffect(() => {
    const fetchTechnologies = async () => {
      try {
        const res = await fetch('/api/technologies');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setTechnologies(data);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement des technologies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTechnologies();
  }, []);

  // Faire défiler les technologies horizontalement
  const scrollTechnologies = (direction: 'left' | 'right') => {
    if (!techContainerRef.current) return;
    
    const container = techContainerRef.current;
    const scrollAmount = 400; // Ajuster selon vos besoins
    
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Filtrer les technologies par catégorie
  const filteredTechnologies = selectedCategory === 'all'
    ? technologies
    : technologies.filter(tech => tech.category === selectedCategory);

  const categories = ['all', ...new Set(technologies.map(tech => tech.category || 'Autre'))];

  return (
    <section id="technologies" className={`
      min-h-screen py-24 relative overflow-hidden
      ${theme === 'dark' ? 'bg-shadow-primary' : 'bg-light-primary'}
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
              theme === 'dark' ? 'text-shadow-blue' : 'text-light-gold-DEFAULT'
            }>
              Technologies
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
                      ? 'bg-shadow-blue text-white'
                      : 'bg-light-gold-DEFAULT text-shadow-secondary'
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

        {loading ? (
          <div className="flex justify-center py-12">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
              theme === 'dark' ? 'border-shadow-blue' : 'border-light-gold-DEFAULT'
            }`}></div>
          </div>
        ) : (
          <div className="relative w-full max-w-full mx-auto">
            {/* Flèche gauche */}
            <button 
              onClick={() => scrollTechnologies('left')}
              className={`
                absolute left-2 top-1/2 transform -translate-y-1/2 z-20
                p-4 rounded-full shadow-lg
                ${theme === 'light' 
                  ? 'bg-light-surface hover:bg-light-primary/20 text-light-text' 
                  : 'bg-shadow-surface hover:bg-shadow-primary/20 text-shadow-text'}
                transition-colors
              `}
              aria-label="Défiler vers la gauche"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>

            {/* Conteneur de technologies avec défilement horizontal */}
            <div 
              ref={techContainerRef}
              className="flex py-6 px-4 overflow-x-auto space-x-6 snap-x snap-mandatory hide-scrollbar"
              style={{ scrollBehavior: 'smooth' }}
            >
              {filteredTechnologies.map((technology, index) => (
                <div key={technology.id} className="snap-start flex-shrink-0">
                  <TechnologyCard 
                    technology={technology} 
                    index={index} 
                    onClick={() => setSelectedTechnology(technology)}
                  />
                </div>
              ))}
            </div>

            {/* Flèche droite */}
            <button 
              onClick={() => scrollTechnologies('right')}
              className={`
                absolute right-2 top-1/2 transform -translate-y-1/2 z-20
                p-4 rounded-full shadow-lg
                ${theme === 'light' 
                  ? 'bg-light-surface hover:bg-light-primary/20 text-light-text' 
                  : 'bg-shadow-surface hover:bg-shadow-primary/20 text-shadow-text'}
                transition-colors
              `}
              aria-label="Défiler vers la droite"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Fenêtre modale d'information sur la technologie */}
      {selectedTechnology && (
        <TechnologyInfo 
          technology={selectedTechnology} 
          onClose={() => setSelectedTechnology(null)}
          isVisible={selectedTechnology !== null}
        />
      )}
    </section>
  );
} 
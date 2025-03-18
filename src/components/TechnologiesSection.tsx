'use client';
import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import ParticlesBackground from './ParticlesBackground';
import { Technology } from '@/types';
import TechnologyCard from './TechnologyCard';
import TechnologyInfo from './TechnologyInfo';

// Données de secours au cas où l'API n'est pas disponible
const fallbackTechnologies: Technology[] = [
  {
    id: '1',
    name: 'React',
    slug: 'react',
    description: 'Bibliothèque JavaScript pour créer des interfaces utilisateur interactives',
    imageUrl: '/images/technologies/react.png',
    category: 'Frontend',
    level: 90,
    rank: 'S',
    relatedProjects: [
      {
        id: '101',
        title: 'Portfolio Personnel',
        slug: 'portfolio-personnel',
        rank: 'S'
      },
      {
        id: '102',
        title: 'Dashboard Analytics',
        slug: 'dashboard-analytics',
        rank: 'A'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Next.js',
    slug: 'nextjs',
    description: 'Framework React pour la production avec rendu côté serveur, génération statique, et plus',
    imageUrl: '/images/technologies/nextjs.png',
    category: 'Framework',
    level: 85,
    rank: 'S',
    relatedProjects: [
      {
        id: '101',
        title: 'Portfolio Personnel',
        slug: 'portfolio-personnel',
        rank: 'S'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'TypeScript',
    slug: 'typescript',
    description: 'JavaScript avec une syntaxe de types, améliorant la qualité du code et l\'expérience de développement',
    imageUrl: '/images/technologies/typescript.png',
    category: 'Langage',
    level: 88,
    rank: 'A',
    relatedProjects: [
      {
        id: '101',
        title: 'Portfolio Personnel',
        slug: 'portfolio-personnel',
        rank: 'S'
      },
      {
        id: '103',
        title: 'API REST',
        slug: 'api-rest',
        rank: 'A'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  // Ajoutez d'autres technologies de secours si nécessaire
];

export default function TechnologiesSection() {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTechnology, setSelectedTechnology] = useState<Technology | null>(null);
  const [technologies, setTechnologies] = useState<Technology[]>(fallbackTechnologies);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  // Extraire les catégories uniques des technologies
  const categories = Array.from(new Set(technologies.map(tech => tech.category || 'Autre')));

  // Filtrer les technologies par catégorie
  const filteredTechnologies = selectedCategory 
    ? technologies.filter(tech => tech.category === selectedCategory)
    : technologies;

  // Limiter les technologies affichées
  const displayedTechnologies = showAll 
    ? filteredTechnologies 
    : filteredTechnologies.slice(0, 6);

  // Gérer le changement de catégorie
  const handleCategoryChange = (category: string | null) => {
    if (category === selectedCategory) {
      // Désactiver le filtre si on clique à nouveau sur la même catégorie
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
      setShowAll(false); // Réinitialiser la vue lors du changement de filtre
    }
  };

  // Basculer entre afficher toutes les technologies ou seulement 6
  const toggleShowAll = () => {
    setShowAll(prev => !prev);
    
    // Faire défiler vers le haut de la section si on réduit l'affichage
    if (showAll && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section 
      id="technologies" 
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
            Mes Technologies
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-shadow-text' : 'text-light-text'
            }`}
          >
            Arsenal technique acquis durant mes explorations
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

        {/* Affichage des technologies */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
              theme === 'dark' ? 'border-shadow-blue' : 'border-light-gold-DEFAULT'
            }`}></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedTechnologies.length > 0 ? (
                displayedTechnologies.map((technology, index) => (
                  <TechnologyCard 
                    key={technology.id} 
                    technology={technology} 
                    index={index} 
                    onClick={() => setSelectedTechnology(technology)}
                  />
                ))
              ) : (
                <div className={`col-span-3 text-center py-10 ${
                  theme === 'dark' ? 'text-shadow-text' : 'text-light-text'
                }`}>
                  Aucune technologie trouvée dans cette catégorie.
                </div>
              )}
            </div>

            {/* Bouton Afficher plus/moins */}
            {filteredTechnologies.length > 6 && (
              <div className="mt-12 text-center">
                <motion.button
                  onClick={toggleShowAll}
              className={`
                    px-6 py-3 rounded-lg font-medium
                    ${theme === 'dark' 
                      ? 'bg-shadow-system text-white hover:bg-shadow-blue' 
                      : 'bg-light-gold-DEFAULT text-shadow-dark hover:bg-light-gold-light'}
                    transition-all duration-300
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center">
                    {showAll ? (
                      <>
                        <span className="mr-2">Afficher moins</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m18 15-6-6-6 6"/>
                        </svg>
                      </>
                    ) : (
                      <>
                        <span className="mr-2">Afficher plus</span>
                        <span className="text-sm">({filteredTechnologies.length - 6} restantes)</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                          <path d="m6 9 6 6 6-6"/>
              </svg>
                      </>
                    )}
                  </div>
                </motion.button>
          </div>
            )}
          </>
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
'use client';
import { useProjects } from '@/hooks/useProjects';
import ProjectCard from './ProjectCard';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import { useRef, useEffect, useState, useCallback } from 'react';
import ParticlesBackground from './ParticlesBackground';

const ProjectsSection = () => {
  const { projects, loading, pagination, filters, setFilter } = useProjects();
  const { theme } = useTheme();
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  const [activeRank, setActiveRank] = useState<string | null>(null);
  // État pour la mise en cache des projets filtrés
  const [cachedProjects, setCachedProjects] = useState<Record<string, Project[]>>({
    all: [],
    S: [],
    A: [],
    B: [],
    C: [],
  });
  const [displayedProjects, setDisplayedProjects] = useState<Project[]>([]);
  const [autoScrollInterval, setAutoScrollInterval] = useState<NodeJS.Timeout | null>(null);

  const ranks = ['S', 'A', 'B', 'C'];
  
  // Projets de secours correctement typés avec toutes les propriétés requises
  const fallbackProjects: Project[] = [
    {
      id: 'fallback-1',
      title: 'Système de Recommandation IA',
      slug: 'systeme-de-recommandation-ia',
      description: 'Un système de recommandation basé sur l\'apprentissage profond',
      rank: 'S',
      featured: true,
      status: 'published',
      imageUrl: '/projects/fallback.jpg',
      technologies: ['Python', 'TensorFlow', 'Pandas'],
      categories: ['Machine Learning', 'Deep Learning'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'fallback-2',
      title: 'Portfolio Solo Leveling',
      slug: 'portfolio-solo-leveling',
      description: 'Portfolio inspiré de l\'univers Solo Leveling',
      rank: 'A',
      featured: true,
      status: 'published',
      imageUrl: '/projects/fallback.jpg',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      categories: ['Web Development'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'fallback-3',
      title: 'Analyse de Données Climatiques',
      slug: 'analyse-de-donnees-climatiques',
      description: 'Visualisation et analyse de données climatiques',
      rank: 'B',
      featured: false,
      status: 'published',
      imageUrl: '/projects/fallback.jpg',
      technologies: ['Python', 'Pandas', 'Matplotlib'],
      categories: ['Data Science', 'Data Visualization'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Fonction pour filtrer les projets par rang côté client
  const filterProjectsByRank = useCallback((rank: string | null) => {
    if (!rank) {
      setDisplayedProjects(cachedProjects.all);
      return;
    }
    
    // Utiliser le cache si disponible
    if (cachedProjects[rank] && cachedProjects[rank].length > 0) {
      setDisplayedProjects(cachedProjects[rank]);
      return;
    }
    
    // Sinon filtrer et mettre en cache
    const filtered = cachedProjects.all.filter(project => project.rank === rank);
    setCachedProjects(prev => ({
      ...prev,
      [rank]: filtered,
    }));
    setDisplayedProjects(filtered);
  }, [cachedProjects]);

  // Function to truncate description to maintain same card height
  const truncateDescription = (description: string, maxLength: number = 100) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  // Fonction pour faire défiler les projets horizontalement
  const scrollProjects = (direction: 'left' | 'right') => {
    if (projectsContainerRef.current) {
      const scrollAmount = 600; // pixels à défiler - augmenté pour un défilement plus grand
      const container = projectsContainerRef.current;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Auto-scroll setup
  useEffect(() => {
    // Démarrer le défilement automatique
    const startAutoScroll = () => {
      const interval = setInterval(() => {
        if (projectsContainerRef.current) {
          const container = projectsContainerRef.current;
          const isAtEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
          
          if (isAtEnd) {
            // Revenir au début
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Continuer à défiler
            container.scrollBy({ left: 300, behavior: 'smooth' });
          }
        }
      }, 8000); // Intervalle augmenté pour donner plus de temps à l'utilisateur
      
      return interval;
    };
    
    // Démarrer le défilement
    const interval = startAutoScroll();
    setAutoScrollInterval(interval);
    
    // Arrêter le défilement au hover
    const container = projectsContainerRef.current;
    if (container) {
      const stopScroll = () => {
        if (autoScrollInterval) {
          clearInterval(autoScrollInterval);
          setAutoScrollInterval(null);
        }
      };
      
      const resumeScroll = () => {
        if (!autoScrollInterval) {
          const interval = startAutoScroll();
          setAutoScrollInterval(interval);
        }
      };
      
      container.addEventListener('mouseenter', stopScroll);
      container.addEventListener('mouseleave', resumeScroll);
      
      return () => {
        clearInterval(autoScrollInterval as NodeJS.Timeout);
        container.removeEventListener('mouseenter', stopScroll);
        container.removeEventListener('mouseleave', resumeScroll);
      };
    }
    
    return () => {
      if (autoScrollInterval) clearInterval(autoScrollInterval);
    };
  }, [autoScrollInterval]);

  // Effet pour mettre à jour les projets affichés lorsque les projets sont chargés
  useEffect(() => {
    // Utiliser les projets de l'API ou les fallbacks
    const allProjects = projects && projects.length > 0 ? projects : fallbackProjects;
    
    // Mettre à jour le cache principal
    setCachedProjects(prev => ({
      ...prev,
      all: allProjects,
    }));
    
    // Mettre à jour les projets affichés
    if (!activeRank) {
      setDisplayedProjects(allProjects);
    } else {
      filterProjectsByRank(activeRank);
    }
  }, [projects, filterProjectsByRank, activeRank]);

  // Gérer le changement de rang
  const handleRankChange = (rank: string | null) => {
    if (rank === activeRank) {
      // Désactiver le filtre si on clique à nouveau sur le même rang
      setActiveRank(null);
      filterProjectsByRank(null);
    } else {
      setActiveRank(rank);
      filterProjectsByRank(rank);
    }
  };

  return (
    <section id="projects" className={`py-16 relative ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
      {/* Arrière-plan de particules */}
      <div className="absolute inset-0 z-0 opacity-30">
      <ParticlesBackground />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="mb-8 text-center">
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
            Mes Quêtes Complétées
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`text-xl max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-shadow-text' : 'text-light-text'
            }`}
          >
            Projets classés par rang selon leur complexité et impact
          </motion.p>
        </div>

        {/* Système de filtrage par rang amélioré avec style inspiré du jeu */}
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
                Filtrer par rang :
              </div>
              <div className="flex space-x-2">
              <button
                  onClick={() => handleRankChange(null)}
                  className={`
                    relative w-14 h-14 rounded-full transition-all duration-300 flex items-center justify-center
                    ${!activeRank 
                      ? theme === 'dark'
                        ? 'bg-shadow-system ring-2 ring-shadow-primary ring-offset-2 ring-offset-shadow-dark' 
                        : 'bg-light-gold-DEFAULT ring-2 ring-light-primary ring-offset-2 ring-offset-light-secondary'
                      : theme === 'dark'
                        ? 'bg-shadow-secondary hover:bg-shadow-system/70' 
                        : 'bg-light-secondary hover:bg-light-gold-DEFAULT/70'
                    }
                  `}
                >
                  <span className={`font-bold ${!activeRank ? 'text-white' : ''}`}>ALL</span>
              </button>
              {ranks.map((rank) => (
                <button
                  key={rank}
                    onClick={() => handleRankChange(rank)}
                    className={`
                      relative w-14 h-14 rounded-full transition-all duration-300 flex items-center justify-center
                      ${activeRank === rank 
                        ? getRankColor(rank, true)
                        : theme === 'dark'
                          ? 'bg-shadow-secondary hover:bg-shadow-system/70' 
                          : 'bg-light-secondary hover:bg-light-gold-DEFAULT/70'
                      }
                      ${activeRank === rank ? 'ring-2 ring-offset-2 ring-shadow-primary ring-offset-shadow-dark' : ''}
                    `}
                  >
                    <span className={`font-bold ${activeRank === rank ? 'text-white' : ''}`}>{rank}</span>
                </button>
              ))}
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${
              theme === 'dark' ? 'border-shadow-primary' : 'border-light-gold-DEFAULT'
            }`}></div>
          </div>
        ) : (
          <>
            {/* Conteneur de projets avec défilement horizontal */}
            <div className="relative px-16">
              {/* Bouton de navigation gauche - Écarté */}
          <button 
            onClick={() => scrollProjects('left')}
            className={`
                  absolute left-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2
                  ${theme === 'dark' 
                    ? 'bg-shadow-system/70 text-white hover:bg-shadow-monarch' 
                    : 'bg-light-gold-DEFAULT/70 text-shadow-dark hover:bg-light-gold-DEFAULT'}
                  transition-colors w-12 h-12 flex items-center justify-center
                `}
                aria-label="Précédent"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

              {/* Conteneur avec défilement horizontal - Centré */}
            <div 
              ref={projectsContainerRef}
                className="
                  flex overflow-x-auto pb-8 pt-4 px-2 snap-x justify-center
                  hide-scrollbar
                "
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {displayedProjects.length > 0 ? (
                  displayedProjects.map((project, index) => (
                    <div 
                      key={project.id} 
                      className="min-w-[350px] max-w-[350px] px-4 snap-start flex-shrink-0"
                    >
                    <ProjectCard 
                      id={project.id} 
                      title={project.title}
                        description={truncateDescription(project.description)}
                        image={project.imageUrl || '/projects/fallback.jpg'}
                      tags={Array.isArray(project.technologies) 
                        ? project.technologies.map((tech: any) => 
                            typeof tech === 'string' ? tech : tech.name || '') 
                        : []}
                        link={`/projects/${project.slug}`}
                      liveLink={project.liveUrl}
                        githubUrl={project.githubUrl}
                        index={index}
                      rank={project.rank}
                      featured={project.featured}
                    />
                  </div>
                ))
              ) : (
                  <div className={`w-full py-16 text-center ${
                    theme === 'dark' ? 'text-shadow-text' : 'text-light-text'
                  }`}>
                    <p>Aucun projet disponible pour ce rang.</p>
                </div>
              )}
            </div>

              {/* Bouton de navigation droite - Écarté */}
          <button 
            onClick={() => scrollProjects('right')}
            className={`
                  absolute right-0 top-1/2 -translate-y-1/2 z-10 rounded-full p-2
                  ${theme === 'dark' 
                    ? 'bg-shadow-system/70 text-white hover:bg-shadow-monarch' 
                    : 'bg-light-gold-DEFAULT/70 text-shadow-dark hover:bg-light-gold-DEFAULT'}
                  transition-colors w-12 h-12 flex items-center justify-center
                `}
                aria-label="Suivant"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

            {/* Indicateurs de page */}
            {displayedProjects.length > 3 && (
              <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.ceil(displayedProjects.length / 3) }).map((_, index) => (
                <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === 0
                        ? theme === 'dark' 
                          ? 'bg-shadow-primary' 
                          : 'bg-light-gold-DEFAULT'
                        : theme === 'dark'
                          ? 'bg-shadow-surface hover:bg-shadow-system/70'
                          : 'bg-light-surface hover:bg-light-gold-DEFAULT/70'
                    }`}
                    aria-label={`Page ${index + 1}`}
                    onClick={() => {
                      if (projectsContainerRef.current) {
                        const container = projectsContainerRef.current;
                        const scrollAmount = container.scrollWidth / Math.ceil(displayedProjects.length / 3) * index;
                        container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                      }
                    }}
                  />
              ))}
            </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

// Fonction utilitaire pour obtenir la couleur de fond selon le rang
const getRankColor = (rank?: string, active = false) => {
  const opacity = active ? '' : '70';
  
  switch (rank) {
    case 'S': return `bg-red-600${opacity} text-white`;
    case 'A': return `bg-purple-600${opacity} text-white`;
    case 'B': return `bg-blue-600${opacity} text-white`;
    case 'C': return `bg-green-600${opacity} text-white`;
    default: return `bg-gray-600${opacity} text-white`;
  }
};

export default ProjectsSection; 
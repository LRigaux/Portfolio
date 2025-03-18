'use client';
import { useProjects } from '@/hooks/useProjects';
import ProjectCard from './ProjectCard';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import { useRef, useEffect } from 'react';
import ParticlesBackground from './ParticlesBackground';

const ProjectsSection = () => {
  const { projects, loading, pagination, filters, setFilter } = useProjects();
  const { theme } = useTheme();
  const projectsContainerRef = useRef<HTMLDivElement>(null);

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
      imageUrl: '/images/projects/ai-recommendation.jpg',
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
      imageUrl: '/images/projects/portfolio.jpg',
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
      imageUrl: '/images/projects/climate-data.jpg',
      technologies: ['Python', 'Pandas', 'Matplotlib'],
      categories: ['Data Science', 'Data Visualization'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
  
  // Utiliser les projets de secours si aucun projet n'est disponible
  const displayProjects = projects && projects.length > 0 ? projects : fallbackProjects;

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

  // Fonction pour appliquer les filtres de manière sécurisée
  const applyFilter = (filterType: 'rank' | 'category' | 'technology' | 'page', value: string | null) => {
    try {
      console.log(`Applying filter: ${filterType} = ${value}`);
      // Vérifier si on essaie d'appliquer le même filtre que celui déjà actif
      if (filterType !== 'page' && filters[filterType] === value) {
        console.log('Skipping filter application - same value already applied');
        return;
      }
      
      // Ajouter un délai pour éviter les problèmes de performance avec les filtres rapides
      setTimeout(() => {
        console.log(`Setting filter after delay: ${filterType} = ${value}`);
        setFilter(filterType, value);
      }, 50);
    } catch (error) {
      console.error(`Erreur lors de l'application du filtre ${filterType}:`, error);
    }
  };

  // Ajouter un effet pour logger les changements de filtres ou de projets
  useEffect(() => {
    console.log('Current filters:', filters);
    console.log('Projects loaded:', projects?.length || 0);
    console.log('Current pagination:', pagination);
    
    // Si on n'a pas de projets et qu'on a un filtre de rang appliqué, vérifier si le filtre est correctement appliqué
    if (projects?.length === 0 && filters.rank) {
      console.log('No projects found with rank filter:', filters.rank);
    }
  }, [filters, projects, pagination]);

  return (
    <section id="projects" className={`
      relative py-20 
      ${theme === 'light' ? 'bg-light-secondary' : 'bg-shadow-secondary'}
    `}>
      <ParticlesBackground />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h2 className={`text-3xl font-bold ${
            theme === 'light' ? 'text-light-text' : 'text-shadow-text'
          }`}>
            Mes Projets
          </h2>
        </motion.div>

        {/* Filtres - afficher uniquement si des projets réels sont disponibles */}
        {projects && projects.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => applyFilter('rank', null)}
                className={`px-4 py-2 rounded-md transition-all ${
                  !filters.rank
                    ? theme === 'light'
                      ? 'bg-light-primary text-white'
                      : 'bg-shadow-primary text-white'
                    : theme === 'light'
                    ? 'bg-light-surface text-light-text'
                    : 'bg-shadow-surface text-shadow-text'
                }`}
              >
                Tous
              </button>
              {ranks.map((rank) => (
                <button
                  key={rank}
                  onClick={() => applyFilter('rank', rank)}
                  className={`px-4 py-2 rounded-md transition-all ${
                    filters.rank === rank
                      ? theme === 'light'
                        ? 'bg-light-primary text-white'
                        : 'bg-shadow-primary text-white'
                      : theme === 'light'
                      ? 'bg-light-surface text-light-text'
                      : 'bg-shadow-surface text-shadow-text'
                  }`}
                >
                  Rang {rank}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Section des projets avec flèches de navigation sur les côtés */}
        <div className="relative w-full max-w-full mx-auto">
          {/* Flèche gauche positionnée sur le côté gauche */}
          <button 
            onClick={() => scrollProjects('left')}
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

          {/* Projets */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
                theme === 'light' ? 'border-light-primary' : 'border-shadow-primary'
              }`}></div>
            </div>
          ) : (
            <div 
              ref={projectsContainerRef}
              className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory px-16 w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayProjects.length > 0 ? (
                displayProjects.map((project, index) => (
                  <div key={project.id} className="flex-shrink-0 w-80 snap-start">
                    <ProjectCard 
                      id={project.id} 
                      title={project.title}
                      description={truncateDescription(project.description, 100)}
                      image={project.imageUrl}
                      tags={Array.isArray(project.technologies) 
                        ? project.technologies.map((tech: any) => 
                            typeof tech === 'string' ? tech : tech.name || '') 
                        : []}
                      link={project.githubUrl || ''}
                      liveLink={project.liveUrl}
                      rank={project.rank}
                      featured={project.featured}
                      index={index}
                    />
                  </div>
                ))
              ) : (
                <div className="w-full flex justify-center items-center py-16">
                  <div className={`text-center ${theme === 'light' ? 'text-light-text' : 'text-shadow-text'}`}>
                    <p className="text-xl font-medium mb-2">Aucun projet trouvé</p>
                    <p className="text-sm opacity-70">
                      Aucun projet ne correspond aux critères sélectionnés.
                    </p>
                    <button
                      onClick={() => applyFilter('rank', null)}
                      className={`mt-4 px-4 py-2 rounded-md ${
                        theme === 'light' ? 'bg-light-primary text-white' : 'bg-shadow-primary text-white'
                      }`}
                    >
                      Voir tous les projets
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Flèche droite positionnée sur le côté droit */}
          <button 
            onClick={() => scrollProjects('right')}
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

        {/* Pagination - afficher uniquement si des projets réels sont disponibles */}
        {projects && projects.length > 0 && pagination && pagination.pages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => applyFilter('page', page.toString())}
                  className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${
                    pagination.page === page
                      ? theme === 'light'
                        ? 'bg-light-primary text-white'
                        : 'bg-shadow-primary text-white'
                      : theme === 'light'
                      ? 'bg-light-surface text-light-text'
                      : 'bg-shadow-surface text-shadow-text'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection; 
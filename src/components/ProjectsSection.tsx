'use client';
import { useProjects } from '@/hooks/useProjects';
import ProjectCard from './ProjectCard';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import { useRef } from 'react';

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

  // Fonction pour faire défiler les projets horizontalement
  const scrollProjects = (direction: 'left' | 'right') => {
    if (projectsContainerRef.current) {
      const scrollAmount = 350; // pixels à défiler
      const container = projectsContainerRef.current;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="projects" className={`py-20 ${
      theme === 'light' ? 'bg-light-surface/50' : 'bg-shadow-surface/50'
    }`}>
      <div className="container mx-auto px-4">
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
          
          <div className="flex space-x-2">
            <button 
              onClick={() => scrollProjects('left')}
              className={`p-2 rounded-full ${
                theme === 'light' 
                  ? 'bg-light-surface hover:bg-light-primary/20 text-light-text' 
                  : 'bg-shadow-surface hover:bg-shadow-primary/20 text-shadow-text'
              } transition-colors`}
              aria-label="Défiler vers la gauche"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>
            <button 
              onClick={() => scrollProjects('right')}
              className={`p-2 rounded-full ${
                theme === 'light' 
                  ? 'bg-light-surface hover:bg-light-primary/20 text-light-text' 
                  : 'bg-shadow-surface hover:bg-shadow-primary/20 text-shadow-text'
              } transition-colors`}
              aria-label="Défiler vers la droite"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </motion.div>

        {/* Filtres - afficher uniquement si des projets réels sont disponibles */}
        {projects && projects.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8 justify-center">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('rank', null)}
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
                  onClick={() => setFilter('rank', rank)}
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

        {/* Projets */}
        {loading ? (
          <div className="flex justify-center">
            <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
              theme === 'light' ? 'border-light-primary' : 'border-shadow-primary'
            }`}></div>
          </div>
        ) : (
          <>
            <div 
              ref={projectsContainerRef}
              className="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {displayProjects.map((project, index) => (
                <div key={project.id} className="flex-shrink-0 w-80">
                  <ProjectCard 
                    id={project.id} 
                    title={project.title}
                    description={project.description}
                    image={project.imageUrl || '/projects/default.jpg'}
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
              ))}
            </div>

            {/* Pagination - afficher uniquement si des projets réels sont disponibles */}
            {projects && projects.length > 0 && pagination && pagination.pages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setFilter('page', page.toString())}
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
          </>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection; 
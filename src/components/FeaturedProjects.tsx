'use client';
import { useProjects } from '@/hooks/useProjects';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import ProjectFallback from './ProjectFallback';
import ProjectCard from './ProjectCard';

export default function FeaturedProjects() {
  const { projects, loading, error } = useProjects({ featured: true });
  const { theme } = useTheme();

  // Données de secours pour les projets
  const fallbackProjects: Project[] = [
    {
      id: 'fallback-1',
      title: 'Portfolio Solo Leveling',
      slug: 'portfolio-solo-leveling',
      description: 'Portfolio personnel inspiré de l\'univers Solo Leveling',
      rank: 'S',
      featured: true,
      status: 'published',
      imageUrl: '/images/projects/portfolio.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'fallback-2',
      title: 'Analyse de Données',
      slug: 'analyse-de-donnees',
      description: 'Projet d\'analyse de données avec Python',
      rank: 'A',
      featured: true,
      status: 'published',
      imageUrl: '/images/projects/data-analysis.jpg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Utiliser les projets de secours si aucun projet n'est disponible
  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <ProjectFallback key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    console.error('Error loading projects:', error);
    // En cas d'erreur, afficher les projets de secours
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fallbackProjects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`rounded-lg overflow-hidden shadow-lg ${
              theme === 'light' ? 'bg-light-surface' : 'bg-shadow-surface'
            }`}
          >
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className={`text-xl font-bold ${
                  theme === 'light' ? 'text-light-text' : 'text-shadow-text'
                }`}>
                  {project.title}
                </h3>
                <span className={`text-sm font-bold px-2 py-1 rounded ${
                  project.rank === 'S'
                    ? theme === 'light' ? 'bg-light-red-DEFAULT text-white' : 'bg-shadow-primary text-white'
                    : project.rank === 'A'
                    ? theme === 'light' ? 'bg-light-gold-DEFAULT text-white' : 'bg-shadow-accent text-white'
                    : theme === 'light' ? 'bg-light-muted text-white' : 'bg-shadow-muted text-white'
                }`}>
                  {project.rank}
                </span>
              </div>
              <p className={`mb-4 ${
                theme === 'light' ? 'text-light-text' : 'text-shadow-text'
              }`}>
                {project.description}
              </p>
              <div className="flex justify-end">
                <a
                  href={`/projects/${project.slug}`}
                  className={`px-4 py-2 rounded ${
                    theme === 'light'
                      ? 'bg-light-primary text-white hover:bg-light-primary/80'
                      : 'bg-shadow-primary text-white hover:bg-shadow-primary/80'
                  } transition-colors`}
                >
                  Voir plus
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayProjects.map((project: Project) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-lg overflow-hidden shadow-lg ${
            theme === 'light' ? 'bg-light-surface' : 'bg-shadow-surface'
          }`}
        >
          {project.imageUrl && (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className={`text-xl font-bold ${
                theme === 'light' ? 'text-light-text' : 'text-shadow-text'
              }`}>
                {project.title}
              </h3>
              <span className={`text-sm font-bold px-2 py-1 rounded ${
                project.rank === 'S'
                  ? theme === 'light' ? 'bg-light-red-DEFAULT text-white' : 'bg-shadow-primary text-white'
                  : project.rank === 'A'
                  ? theme === 'light' ? 'bg-light-gold-DEFAULT text-white' : 'bg-shadow-accent text-white'
                  : theme === 'light' ? 'bg-light-muted text-white' : 'bg-shadow-muted text-white'
              }`}>
                {project.rank}
              </span>
            </div>
            <p className={`mb-4 ${
              theme === 'light' ? 'text-light-text' : 'text-shadow-text'
            }`}>
              {project.description}
            </p>
            <div className="flex justify-end">
              <a
                href={`/projects/${project.slug}`}
                className={`px-4 py-2 rounded ${
                  theme === 'light'
                    ? 'bg-light-primary text-white hover:bg-light-primary/80'
                    : 'bg-shadow-primary text-white hover:bg-shadow-primary/80'
                } transition-colors`}
              >
                Voir plus
              </a>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 
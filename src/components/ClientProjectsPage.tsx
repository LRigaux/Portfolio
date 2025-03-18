'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  liveLink?: string | null;
  rank: string;
  featured: boolean;
}

interface ClientProjectsPageProps {
  initialProjects: Project[];
}

export default function ClientProjectsPage({ initialProjects }: ClientProjectsPageProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [activeFilter, setActiveFilter] = useState('Tous');

  // Filtrer les projets en fonction du filtre actif
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    // Si tu as besoin de filtrer côté client, tu peux implémenter ici
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">
              Mes Projets
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Découvrez mes derniers projets en Data Science et Intelligence Artificielle.
          </p>
        </motion.div>

        {/* Filtres de projets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {['Tous', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision'].map((filter, index) => (
            <button
              key={index}
              onClick={() => handleFilterChange(filter)}
              className={`px-6 py-2 rounded-full transition-all ${
                activeFilter === filter 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:shadow-md'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Grille de projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} {...project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
} 
'use client';
import { motion } from 'framer-motion';
import ProjectCard from '@/components/ProjectCard';

const projects = [
  {
    title: "AI Image Generator",
    description: "Une application de génération d'images utilisant l'IA avec des modèles de diffusion stable.",
    image: "/projects/ai-image.jpg",
    tags: ["Python", "PyTorch", "React", "API"],
    link: "https://github.com/yourusername/ai-image-generator"
  },
  {
    title: "Prédiction de Séries Temporelles",
    description: "Modèle de deep learning pour la prédiction de séries temporelles financières.",
    image: "/projects/time-series.jpg",
    tags: ["Python", "TensorFlow", "Time Series", "Finance"],
    link: "https://github.com/yourusername/time-series"
  },
  {
    title: "Analyse de Sentiments",
    description: "Analyse des sentiments en temps réel sur les réseaux sociaux.",
    image: "/projects/sentiment.jpg",
    tags: ["NLP", "Python", "Twitter API", "BERT"],
    link: "https://github.com/yourusername/sentiment-analysis"
  },
  // Ajoutez d'autres projets...
];

export default function ProjectsPage() {
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
              className="px-6 py-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-gray-800 hover:shadow-md transition-all"
            >
              {filter}
            </button>
          ))}
        </motion.div>

        {/* Grille de projets */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={index} {...project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
} 
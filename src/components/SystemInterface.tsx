'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';

interface Stat {
  name: string;
  value: number;
  rank: string;
}

interface Skill {
  name: string;
  level: number;
  rank: string;
  description: string;
  relatedProjects?: RelatedProject[];
}

interface RelatedProject {
  id: string;
  title: string;
  slug: string;
  rank: string;
}

interface Technology {
  name: string;
  level: number;
  rank: string;
  description: string;
  relatedProjects?: RelatedProject[];
}

const SystemInterface = () => {
  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const [currentTab, setCurrentTab] = useState<'stats' | 'skills' | 'technologies' | 'quests'>('stats');
  const [isLeveling, setIsLeveling] = useState(false);
  const [level, setLevel] = useState(50);
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const [hoveredTech, setHoveredTech] = useState<Technology | null>(null);
  const projectsContainerRef = useRef<HTMLDivElement>(null);
  
  // Statistiques fictives pour un Data Scientist / Ingénieur IA
  const stats: Stat[] = [
    { name: 'Machine Learning', value: 95, rank: 'S' },
    { name: 'Deep Learning', value: 87, rank: 'A' },
    { name: 'Data Analysis', value: 92, rank: 'S' },
    { name: 'NLP', value: 80, rank: 'A' },
    { name: 'Computer Vision', value: 78, rank: 'A' },
    { name: 'Cloud Computing', value: 72, rank: 'B' },
    { name: 'MLOps', value: 83, rank: 'A' },
  ];
  
  // Compétences fictives avec projets associés
  const skills: Skill[] = [
    { 
      name: 'Neural Network Architecture', 
      level: 4, 
      rank: 'S', 
      description: 'Conception de réseaux de neurones avancés pour des problèmes complexes',
      relatedProjects: [
        { id: '1', title: 'Système de Recommandation IA', slug: 'systeme-de-recommandation-ia', rank: 'S' },
        { id: '2', title: 'Classification d\'Images Médicales', slug: 'classification-images-medicales', rank: 'A' }
      ]
    },
    { 
      name: 'Reinforcement Learning', 
      level: 3, 
      rank: 'A', 
      description: 'Développement d\'agents intelligents qui apprennent par interaction',
      relatedProjects: [
        { id: '3', title: 'Agent de Trading Automatisé', slug: 'agent-trading-automatise', rank: 'A' }
      ]
    },
    { 
      name: 'Natural Language Processing', 
      level: 3,
      rank: 'A', 
      description: 'Analyse et génération de texte avec des modèles pré-entraînés',
      relatedProjects: [
        { id: '4', title: 'Chatbot d\'Assistance Client', slug: 'chatbot-assistance-client', rank: 'B' },
        { id: '5', title: 'Analyse de Sentiments Twitter', slug: 'analyse-sentiments-twitter', rank: 'A' }
      ]
    },
    { 
      name: 'Data Pipeline Engineering', 
      level: 4, 
      rank: 'S', 
      description: 'Conception de pipelines de données évolutifs et robustes',
      relatedProjects: [
        { id: '6', title: 'Plateforme ETL Cloud-Native', slug: 'plateforme-etl-cloud-native', rank: 'S' }
      ]
    },
    { 
      name: 'Time Series Forecasting', 
      level: 3, 
      rank: 'A', 
      description: 'Prédiction de tendances temporelles avec des modèles avancés',
      relatedProjects: [
        { id: '7', title: 'Prévision Demande Énergétique', slug: 'prevision-demande-energetique', rank: 'A' }
      ]
    },
  ];

  // Technologies fictives avec projets associés
  const technologies: Technology[] = [
    {
      name: 'Python',
      level: 5,
      rank: 'S',
      description: 'Langage principal pour le développement IA et analyse de données',
      relatedProjects: [
        { id: '1', title: 'Système de Recommandation IA', slug: 'systeme-de-recommandation-ia', rank: 'S' },
        { id: '3', title: 'Agent de Trading Automatisé', slug: 'agent-trading-automatise', rank: 'A' }
      ]
    },
    {
      name: 'TensorFlow',
      level: 4,
      rank: 'S',
      description: 'Framework de deep learning pour la construction de modèles IA',
      relatedProjects: [
        { id: '1', title: 'Système de Recommandation IA', slug: 'systeme-de-recommandation-ia', rank: 'S' },
        { id: '2', title: 'Classification d\'Images Médicales', slug: 'classification-images-medicales', rank: 'A' }
      ]
    },
    {
      name: 'React/Next.js',
      level: 4,
      rank: 'A',
      description: 'Développement d\'interfaces web modernes et réactives',
      relatedProjects: [
        { id: '8', title: 'Portfolio Solo Leveling', slug: 'portfolio-solo-leveling', rank: 'S' }
      ]
    },
    {
      name: 'Docker/Kubernetes',
      level: 3,
      rank: 'A',
      description: 'Conteneurisation et orchestration de services',
      relatedProjects: [
        { id: '6', title: 'Plateforme ETL Cloud-Native', slug: 'plateforme-etl-cloud-native', rank: 'S' }
      ]
    },
    {
      name: 'AWS/GCP',
      level: 3,
      rank: 'B',
      description: 'Services cloud pour le déploiement et la gestion d\'applications',
      relatedProjects: [
        { id: '6', title: 'Plateforme ETL Cloud-Native', slug: 'plateforme-etl-cloud-native', rank: 'S' }
      ]
    }
  ];
  
  // Simulation du "Level Up"
  const simulateLevelUp = () => {
    setIsLeveling(true);
    setLevel(prev => prev + 1);
    setTimeout(() => setIsLeveling(false), 1500);
  };

  // Fonction pour faire défiler les projets horizontalement
  const scrollProjects = (direction: 'left' | 'right') => {
    if (projectsContainerRef.current) {
      const scrollAmount = 300; // pixels à défiler
      const container = projectsContainerRef.current;
      
      if (direction === 'left') {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  // Style conditionnel basé sur le thème
  const isDark = theme === 'dark';
  const bgColor = isDark ? 'bg-shadow-dark' : 'bg-light-surface';
  const textColor = isDark ? 'text-shadow-text' : 'text-light-text';
  const accentColor = isDark ? 'shadow-blue' : 'light-rank';
  const borderColor = isDark ? 'border-shadow-system' : 'border-light-gold-dark';
  
  return (
    <>
      {/* Bouton pour ouvrir l'interface */}
      <motion.button
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full 
          ${isDark ? 'bg-shadow-primary' : 'bg-light-primary'} 
          shadow-lg`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={isDark ? 'text-white' : 'text-light-text'}
        >
          <path d="M12 2v4"></path>
          <path d="M12 18v4"></path>
          <path d="m4.93 4.93 2.83 2.83"></path>
          <path d="m16.24 16.24 2.83 2.83"></path>
          <path d="M2 12h4"></path>
          <path d="M18 12h4"></path>
          <path d="m4.93 19.07 2.83-2.83"></path>
          <path d="m16.24 7.76 2.83-2.83"></path>
        </svg>
      </motion.button>
      
      {/* Modal pour l'interface système */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
              onClick={() => setShowModal(false)}
            ></div>
            
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`relative w-full max-w-3xl max-h-[80vh] overflow-auto rounded-lg border-2 
                ${bgColor} ${borderColor} shadow-2xl`}
            >
              {/* En-tête de l'interface */}
              <div className={`
                flex items-center justify-between p-4 border-b-2 ${borderColor}
                ${isDark ? 'bg-shadow-system' : 'bg-light-gold-DEFAULT'}
              `}>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-shadow-dark'}`}>
                  Système{isDark ? ' [Shadow Monarch]' : ' [Chasseur de Rang S]'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className={`p-1 rounded-full hover:${isDark ? 'bg-shadow-accent/20' : 'bg-light-red/20'}`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className={isDark ? 'text-white' : 'text-shadow-dark'}
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </button>
              </div>
              
              {/* Niveau et progression */}
              <div className="p-6 text-center">
                <div className="relative inline-block">
                  <div 
                    className={`text-5xl font-bold mb-2 
                      ${isLeveling ? 'animate-level-up' : ''}
                      ${isDark ? 'text-shadow-accent' : 'text-light-gold-DEFAULT'}`}
                  >
                    Niveau {level}
                  </div>
                  {isLeveling && (
                    <div className={`
                      absolute -top-4 -right-4 px-2 py-1 rounded text-sm font-bold
                      ${isDark ? 'bg-shadow-level text-white' : 'bg-light-stat text-white'}
                      animate-system-alert
                    `}>
                      +1
                    </div>
                  )}
                </div>
                <p className={`text-sm ${textColor}`}>
                  Data Scientist {isDark ? 'avec Double-Éveil' : 'de Rang S'}
                </p>
                
                <div className="mt-4">
                  <button
                    onClick={simulateLevelUp}
                    className={`px-4 py-2 rounded 
                      ${isDark 
                        ? 'bg-double-awakening text-white hover:animate-flicker' 
                        : 'bg-light-gold-DEFAULT text-shadow-dark hover:bg-light-gold-light'}
                      transition-all duration-300`}
                  >
                    Niveau Supérieur
                  </button>
                </div>
              </div>
              
              {/* Onglets */}
              <div className={`flex border-b ${borderColor}`}>
                <button
                  onClick={() => setCurrentTab('stats')}
                  className={`px-4 py-2 ${currentTab === 'stats' 
                    ? (isDark ? 'bg-shadow-system text-white' : 'bg-light-gold-DEFAULT text-shadow-dark')
                    : `${textColor} hover:bg-opacity-10 hover:bg-gray-500`
                  }`}
                >
                  Statistiques
                </button>
                <button
                  onClick={() => setCurrentTab('skills')}
                  className={`px-4 py-2 ${currentTab === 'skills' 
                    ? (isDark ? 'bg-shadow-system text-white' : 'bg-light-gold-DEFAULT text-shadow-dark')
                    : `${textColor} hover:bg-opacity-10 hover:bg-gray-500`
                  }`}
                >
                  Compétences
                </button>
                <button
                  onClick={() => setCurrentTab('technologies')}
                  className={`px-4 py-2 ${currentTab === 'technologies' 
                    ? (isDark ? 'bg-shadow-system text-white' : 'bg-light-gold-DEFAULT text-shadow-dark')
                    : `${textColor} hover:bg-opacity-10 hover:bg-gray-500`
                  }`}
                >
                  Technologies
                </button>
                <button
                  onClick={() => setCurrentTab('quests')}
                  className={`px-4 py-2 ${currentTab === 'quests' 
                    ? (isDark ? 'bg-shadow-system text-white' : 'bg-light-gold-DEFAULT text-shadow-dark')
                    : `${textColor} hover:bg-opacity-10 hover:bg-gray-500`
                  }`}
                >
                  Projets
                </button>
              </div>
              
              {/* Contenu des onglets */}
              <div className="p-4">
                {currentTab === 'stats' && (
                  <div className="space-y-4">
                    <h3 className={`text-lg font-bold ${textColor}`}>Statistiques</h3>
                    {stats.map((stat, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between">
                          <span className={`${textColor}`}>{stat.name}</span>
                          <span className={`font-bold ${
                            stat.rank === 'S' 
                              ? (isDark ? 'text-shadow-blue' : 'text-light-gold-light') 
                              : stat.rank === 'A' 
                                ? (isDark ? 'text-shadow-monarch' : 'text-light-rank') 
                                : (isDark ? 'text-shadow-accent' : 'text-light-primary')
                          }`}>
                            {stat.rank}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              stat.rank === 'S' 
                                ? (isDark ? 'bg-shadow-blue' : 'bg-light-gold-light') 
                                : stat.rank === 'A' 
                                  ? (isDark ? 'bg-shadow-monarch' : 'bg-light-rank') 
                                  : (isDark ? 'bg-shadow-accent' : 'bg-light-primary')
                            }`}
                            style={{ width: `${stat.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {currentTab === 'skills' && (
                  <div className="space-y-4">
                    <h3 className={`text-lg font-bold ${textColor}`}>Compétences</h3>
                    {skills.map((skill, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border ${borderColor} hover:bg-opacity-10 hover:bg-gray-500 cursor-pointer`}
                        onMouseEnter={() => setHoveredSkill(skill)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${textColor}`}>{skill.name}</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            skill.rank === 'S' 
                              ? (isDark ? 'bg-shadow-blue text-white' : 'bg-light-gold-light text-shadow-dark') 
                              : skill.rank === 'A' 
                                ? (isDark ? 'bg-shadow-monarch text-white' : 'bg-light-rank text-white') 
                                : (isDark ? 'bg-shadow-accent text-white' : 'bg-light-primary text-white')
                          }`}>
                            {skill.rank}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center">
                          <span className={`text-sm ${textColor} mr-2`}>Niveau {skill.level}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-4 h-4 mr-1 rounded-full ${
                                  i < skill.level 
                                    ? (isDark ? 'bg-shadow-accent' : 'bg-light-primary') 
                                    : 'bg-gray-300'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                        <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {skill.description}
                        </p>
                        
                        {/* Projets associés affichés au survol */}
                        {hoveredSkill === skill && skill.relatedProjects && skill.relatedProjects.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-3 pt-3 border-t ${borderColor}`}
                          >
                            <p className={`text-sm font-bold ${textColor} mb-2`}>Projets associés:</p>
                            <div className="space-y-2">
                              {skill.relatedProjects.map(project => (
                                <Link 
                                  href={`/projets/${project.slug}`} 
                                  key={project.id}
                                  className="block"
                                >
                                  <div className={`px-3 py-2 rounded flex items-center justify-between ${
                                    isDark ? 'bg-shadow-system/30 hover:bg-shadow-system/50' : 'bg-light-gold-DEFAULT/10 hover:bg-light-gold-DEFAULT/20'
                                  } transition-colors`}>
                                    <span className={`text-sm ${textColor}`}>{project.title}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                      project.rank === 'S' 
                                        ? (isDark ? 'bg-shadow-blue text-white' : 'bg-light-gold-light text-shadow-dark') 
                                        : project.rank === 'A' 
                                          ? (isDark ? 'bg-shadow-monarch text-white' : 'bg-light-rank text-white') 
                                          : (isDark ? 'bg-shadow-accent text-white' : 'bg-light-primary text-white')
                                    }`}>
                                      {project.rank}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {currentTab === 'technologies' && (
                  <div className="space-y-4">
                    <h3 className={`text-lg font-bold ${textColor}`}>Technologies</h3>
                    {technologies.map((tech, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border ${borderColor} hover:bg-opacity-10 hover:bg-gray-500 cursor-pointer`}
                        onMouseEnter={() => setHoveredTech(tech)}
                        onMouseLeave={() => setHoveredTech(null)}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${textColor}`}>{tech.name}</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            tech.rank === 'S' 
                              ? (isDark ? 'bg-shadow-blue text-white' : 'bg-light-gold-light text-shadow-dark') 
                              : tech.rank === 'A' 
                                ? (isDark ? 'bg-shadow-monarch text-white' : 'bg-light-rank text-white') 
                                : (isDark ? 'bg-shadow-accent text-white' : 'bg-light-primary text-white')
                          }`}>
                            {tech.rank}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center">
                          <span className={`text-sm ${textColor} mr-2`}>Maîtrise {tech.level}/5</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <div 
                                key={i} 
                                className={`w-4 h-4 mr-1 rounded-full ${
                                  i < tech.level 
                                    ? (isDark ? 'bg-shadow-accent' : 'bg-light-primary') 
                                    : 'bg-gray-300'
                                }`}
                              ></div>
                            ))}
                          </div>
                        </div>
                        <p className={`mt-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {tech.description}
                        </p>
                        
                        {/* Projets associés affichés au survol */}
                        {hoveredTech === tech && tech.relatedProjects && tech.relatedProjects.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-3 pt-3 border-t ${borderColor}`}
                          >
                            <p className={`text-sm font-bold ${textColor} mb-2`}>Projets associés:</p>
                            <div className="space-y-2">
                              {tech.relatedProjects.map(project => (
                                <Link 
                                  href={`/projets/${project.slug}`} 
                                  key={project.id}
                                  className="block"
                                >
                                  <div className={`px-3 py-2 rounded flex items-center justify-between ${
                                    isDark ? 'bg-shadow-system/30 hover:bg-shadow-system/50' : 'bg-light-gold-DEFAULT/10 hover:bg-light-gold-DEFAULT/20'
                                  } transition-colors`}>
                                    <span className={`text-sm ${textColor}`}>{project.title}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                      project.rank === 'S' 
                                        ? (isDark ? 'bg-shadow-blue text-white' : 'bg-light-gold-light text-shadow-dark') 
                                        : project.rank === 'A' 
                                          ? (isDark ? 'bg-shadow-monarch text-white' : 'bg-light-rank text-white') 
                                          : (isDark ? 'bg-shadow-accent text-white' : 'bg-light-primary text-white')
                                    }`}>
                                      {project.rank}
                                    </span>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                {currentTab === 'quests' && (
                  <div className="space-y-4">
                    <h3 className={`text-lg font-bold ${textColor} flex justify-between items-center`}>
                      <span>Projets en cours</span>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => scrollProjects('left')}
                          className={`p-1 rounded-full ${isDark ? 'bg-shadow-system hover:bg-shadow-accent/20' : 'bg-light-gold-DEFAULT/30 hover:bg-light-gold-DEFAULT/50'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6"/>
                          </svg>
                        </button>
                        <button 
                          onClick={() => scrollProjects('right')}
                          className={`p-1 rounded-full ${isDark ? 'bg-shadow-system hover:bg-shadow-accent/20' : 'bg-light-gold-DEFAULT/30 hover:bg-light-gold-DEFAULT/50'}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m9 18 6-6-6-6"/>
                          </svg>
                        </button>
                      </div>
                    </h3>
                    
                    <div 
                      ref={projectsContainerRef}
                      className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide"
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      <div className={`flex-shrink-0 w-80 p-3 rounded-lg border ${borderColor} ${isDark ? 'bg-shadow-system/30' : 'bg-light-gold-DEFAULT/10'}`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${textColor}`}>Optimisation d&apos;algorithmes de ML</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            isDark ? 'bg-shadow-quest text-shadow-dark' : 'bg-light-gold-light text-shadow-dark'
                          }`}>
                            S
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isDark ? 'bg-shadow-quest' : 'bg-light-gold-light'}`} style={{ width: '70%' }}></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className={`text-xs ${textColor}`}>Progression: 70%</span>
                            <span className={`text-xs ${textColor}`}>Récompense: +3 niveaux</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex-shrink-0 w-80 p-3 rounded-lg border ${borderColor} ${isDark ? 'bg-shadow-system/30' : 'bg-light-gold-DEFAULT/10'}`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${textColor}`}>Déploiement modèle NLP</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            isDark ? 'bg-shadow-monarch text-white' : 'bg-light-rank text-white'
                          }`}>
                            A
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isDark ? 'bg-shadow-monarch' : 'bg-light-rank'}`} style={{ width: '45%' }}></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className={`text-xs ${textColor}`}>Progression: 45%</span>
                            <span className={`text-xs ${textColor}`}>Récompense: +2 niveaux</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className={`flex-shrink-0 w-80 p-3 rounded-lg border ${borderColor} ${isDark ? 'bg-shadow-system/30' : 'bg-light-gold-DEFAULT/10'}`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${textColor}`}>Infrastructure MLOps</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            isDark ? 'bg-shadow-accent text-white' : 'bg-light-primary text-white'
                          }`}>
                            B
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isDark ? 'bg-shadow-accent' : 'bg-light-primary'}`} style={{ width: '20%' }}></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className={`text-xs ${textColor}`}>Progression: 20%</span>
                            <span className={`text-xs ${textColor}`}>Récompense: +1 niveau</span>
                          </div>
                        </div>
                      </div>

                      <div className={`flex-shrink-0 w-80 p-3 rounded-lg border ${borderColor} ${isDark ? 'bg-shadow-system/30' : 'bg-light-gold-DEFAULT/10'}`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${textColor}`}>Visualisation de données</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            isDark ? 'bg-shadow-monarch text-white' : 'bg-light-rank text-white'
                          }`}>
                            A
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isDark ? 'bg-shadow-monarch' : 'bg-light-rank'}`} style={{ width: '60%' }}></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className={`text-xs ${textColor}`}>Progression: 60%</span>
                            <span className={`text-xs ${textColor}`}>Récompense: +2 niveaux</span>
                          </div>
                        </div>
                      </div>

                      <div className={`flex-shrink-0 w-80 p-3 rounded-lg border ${borderColor} ${isDark ? 'bg-shadow-system/30' : 'bg-light-gold-DEFAULT/10'}`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold ${textColor}`}>API de traitement d'images</span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            isDark ? 'bg-shadow-accent text-white' : 'bg-light-primary text-white'
                          }`}>
                            B
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isDark ? 'bg-shadow-accent' : 'bg-light-primary'}`} style={{ width: '35%' }}></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className={`text-xs ${textColor}`}>Progression: 35%</span>
                            <span className={`text-xs ${textColor}`}>Récompense: +1 niveau</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SystemInterface;
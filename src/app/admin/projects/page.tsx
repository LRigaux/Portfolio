'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Project } from '@/types';

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Badge de rang avec couleur appropriée
const RankBadge = ({ rank }: { rank: string }) => {
  let bgColor = '';
  
  switch (rank) {
    case 'S':
      bgColor = 'bg-gradient-to-r from-shadow-monarch to-shadow-blue';
      break;
    case 'A':
      bgColor = 'bg-shadow-blue';
      break;
    case 'B':
      bgColor = 'bg-shadow-quest';
      break;
    case 'C':
    default:
      bgColor = 'bg-shadow-system';
      break;
  }
  
  return (
    <span className={`text-white text-xs font-bold px-2 py-1 rounded ${bgColor}`}>
      {rank}
    </span>
  );
};

// Badge de statut
const StatusBadge = ({ status }: { status: string }) => {
  const isDraft = status === 'draft';
  
  return (
    <span 
      className={`text-xs font-semibold px-2 py-1 rounded ${
        isDraft 
          ? 'bg-shadow-system/30 text-shadow-text' 
          : 'bg-double-awakening/20 text-double-awakening'
      }`}
    >
      {isDraft ? 'Brouillon' : 'Publié'}
    </span>
  );
};

// Ajouter un type pour les données de pagination
interface PaginationData {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterRank, setFilterRank] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  // Récupération des projets
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/projects');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des projets');
        }
        const data = await response.json();
        
        // Vérification de la structure de la réponse
        if (data.projects && Array.isArray(data.projects)) {
          setProjects(data.projects);
          setPagination(data.pagination || null);
        } else if (Array.isArray(data)) {
          // Compatibilité avec l'ancien format
          setProjects(data);
        } else {
          console.error('Format de données inattendu:', data);
          setError('Format de données inattendu');
          setProjects([]);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Fonction pour supprimer un projet
  const deleteProject = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du projet');
      }
      
      // Mettre à jour la liste des projets
      setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
      
    } catch (error) {
      console.error('Erreur:', error);
      alert(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  // Filtrer les projets
  const filteredProjects = projects.filter(project => {
    let match = true;
    
    // Filtre par statut
    if (filterStatus) {
      match = match && project.status === filterStatus;
    }
    
    // Filtre par rang
    if (filterRank) {
      match = match && project.rank === filterRank;
    }
    
    // Recherche par titre
    if (searchQuery) {
      match = match && project.title.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return match;
  });

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setFilterStatus(null);
    setFilterRank(null);
    setSearchQuery('');
  };

  return (
    <div className="p-6 pt-8">
      {/* En-tête de page */}
      <div className="mb-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-shadow-text mb-2 flex items-center">
              <span className="mr-3 text-double-awakening">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 10H2M22 10C22 14.4183 22 16.6275 20.3137 18.3137C18.6275 20 16.4183 20 12 20C7.58172 20 5.37258 20 3.68629 18.3137C2 16.6275 2 14.4183 2 10M22 10V8M2 10V8M19 8C19 9.65685 17.6569 11 16 11C14.3431 11 13 9.65685 13 8C13 6.34315 14.3431 5 16 5C17.6569 5 19 6.34315 19 8ZM11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              Gestion des Projets
            </h1>
            <p className="text-shadow-text/70">
              Gérez vos projets et leur visibilité sur votre portfolio.
            </p>
          </div>
          
          <div>
            <Link 
              href="/admin/projects/new" 
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-double-awakening to-shadow-blue text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Nouveau Projet
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-6 rounded text-red-700">
          <p>{error}</p>
        </div>
      )}
      
      {/* État de chargement */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-shadow-blue/30 rounded-full"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-transparent border-t-shadow-blue rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Affichage des projets */}
          {filteredProjects.length === 0 ? (
            <div className="text-center py-12 bg-shadow-surface/30 rounded-lg border border-dashed border-shadow-system">
              <svg className="mx-auto w-12 h-12 text-shadow-text/30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12h6m-6 4h3m-5-14h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="mt-2 text-lg font-medium text-shadow-text">Aucun projet trouvé</h3>
              <p className="mt-1 text-shadow-text/70">Essayez de modifier vos filtres ou créez un nouveau projet.</p>
              <div className="mt-6">
                <Link 
                  href="/admin/projects/new" 
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-double-awakening to-shadow-blue text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Créer un projet
                </Link>
              </div>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 gap-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredProjects.map((project) => (
                <motion.div 
                  key={project.id}
                  className="bg-shadow-surface border border-shadow-system rounded-lg overflow-hidden hover:border-shadow-blue transition-colors duration-200"
                  variants={item}
                >
                  <div className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4">
                    {/* Aperçu de l'image */}
                    <div className="w-full sm:w-48 h-32 bg-shadow-dark rounded-lg overflow-hidden relative flex-shrink-0">
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 192px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-shadow-text/30">
                          <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4 16l4-4m0 0l4 4m-4-4v7m6-11l4-4m0 0l4 4m-4-4v17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                    
                    {/* Contenu du projet */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="text-xl font-bold text-shadow-text">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <RankBadge rank={project.rank} />
                          <StatusBadge status={project.status} />
                          {project.featured && (
                            <span className="bg-shadow-accent/20 text-shadow-accent text-xs font-semibold px-2 py-1 rounded">
                              Vedette
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-shadow-text/70 mb-4 line-clamp-2">
                        {project.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center justify-between gap-y-4">
                        <div className="text-shadow-text/50 text-sm">
                          <span>Créé le {new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {project.status === 'published' && (
                            <Link 
                              href={`/projects/${project.slug}`}
                              target="_blank"
                              className="text-shadow-text/70 hover:text-shadow-blue p-2 rounded-lg hover:bg-shadow-system/30 transition-colors"
                              title="Voir"
                            >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </Link>
                          )}
                          
                          <Link 
                            href={`/admin/projects/${project.id}`}
                            className="text-shadow-text/70 hover:text-shadow-blue p-2 rounded-lg hover:bg-shadow-system/30 transition-colors"
                            title="Modifier"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </Link>
                          
                          <button 
                            onClick={() => deleteProject(project.id)}
                            className="text-shadow-text/70 hover:text-shadow-monarch p-2 rounded-lg hover:bg-shadow-system/30 transition-colors"
                            title="Supprimer"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}
    </div>
  );
} 
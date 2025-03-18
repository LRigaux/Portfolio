'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Project } from '@/types';
import { isValidImagePath } from '@/lib/utils';

export function useProjects(options?: { 
  featured?: boolean;
  rank?: string;
  category?: string;
  technology?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10
  });

  const page = Number(searchParams.get('page') || 1);
  const category = options?.category || searchParams.get('category');
  const technology = options?.technology || searchParams.get('technology');
  const rank = options?.rank || searchParams.get('rank');
  const featured = options?.featured;

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (page > 1) params.set('page', page.toString());
        if (category) params.set('category', category);
        if (technology) params.set('technology', technology);
        if (rank) params.set('rank', rank);
        if (featured !== undefined) params.set('featured', featured.toString());

        const apiUrl = `/api/projects?${params.toString()}`;
        console.log(`Fetching projects from API: ${apiUrl}`);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API response:', data);
        
        // Ajouter des images par défaut pour les projets qui n'en ont pas
        const projectsWithFallbacks = (data.projects || []).map((project: Project) => {
          // Si pas d'imageUrl ou imageUrl non valide, ajouter une image par défaut
          if (!project.imageUrl || !isValidImagePath(project.imageUrl)) {
            // Utiliser des images spécifiques selon le rang, sinon fallback générique
            switch(project.rank) {
              case 'S':
                project.imageUrl = '/projects/fallback.jpg';
                break;
              case 'A':
                project.imageUrl = '/projects/fallback.jpg';
                break;
              case 'B':
                project.imageUrl = '/projects/fallback.jpg';
                break;
              case 'C':
                project.imageUrl = '/projects/fallback.jpg';
                break;
              default:
                project.imageUrl = '/projects/fallback.jpg';
            }
          }
          return project;
        });
        
        setProjects(projectsWithFallbacks);
        setPagination(data.pagination || {
          total: 0,
          pages: 0,
          page: 1,
          limit: 10
        });
        
        console.log(`Received ${data.projects?.length || 0} projects with rank filter: ${rank || 'none'}`);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [page, category, technology, rank, featured]);

  const setFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    const oldValue = searchParams.get(key);
    
    console.log(`setFilter called: changing ${key} from "${oldValue}" to "${value}"`);
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Réinitialiser la page lors du changement de filtre
    params.delete('page');
    
    const newUrl = `?${params.toString()}`;
    console.log(`Navigating to: ${newUrl}`);
    
    // Utiliser replace au lieu de push pour éviter le rechargement complet et prévenir le freeze
    router.replace(newUrl, { scroll: false });
  };

  return {
    projects,
    loading,
    error,
    pagination,
    filters: {
      category,
      technology,
      rank,
      featured
    },
    setFilter
  };
} 
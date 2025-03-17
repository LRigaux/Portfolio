'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Project } from '@/types';

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

        const response = await fetch(`/api/projects?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setProjects(data.projects || []);
        setPagination(data.pagination || {
          total: 0,
          pages: 0,
          page: 1,
          limit: 10
        });
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
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Réinitialiser la page lors du changement de filtre
    params.delete('page');
    
    router.push(`?${params.toString()}`);
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
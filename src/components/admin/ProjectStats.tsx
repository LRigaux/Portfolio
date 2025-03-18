'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProjectStatsProps {
  projectId: string;
}

interface ProjectStats {
  viewCount: number;
  clicks: {
    github: number;
    live: number;
  };
  lastViewed: string | null;
}

export default function ProjectStats({ projectId }: ProjectStatsProps) {
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/projects/${projectId}/stats`);
        
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des statistiques');
        }
        
        const data = await response.json();
        setStats(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [projectId]);
  
  if (loading) {
    return (
      <div className="bg-shadow-dark border-2 border-shadow-system rounded-lg p-6 grid place-items-center h-[200px]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-t-2 border-shadow-blue animate-spin rounded-full"></div>
          <div className="absolute inset-1 border-r-2 border-shadow-monarch animate-spin rounded-full"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-shadow-dark border-2 border-shadow-system rounded-lg p-6">
        <div className="bg-red-500/10 border-l-4 border-red-500 text-red-700 p-4 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="bg-shadow-dark border-2 border-shadow-system rounded-lg p-6">
        <div className="text-shadow-text/60 text-center p-4">
          Aucune donnée disponible
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-shadow-dark border-2 border-shadow-system rounded-lg p-6">
      <h3 className="text-xl font-bold text-shadow-text mb-6 flex items-center">
        <span className="w-2 h-6 bg-double-awakening mr-3 rounded"></span>
        Statistiques du Projet
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div 
          className="border border-shadow-system rounded-lg p-4 bg-shadow-surface/10"
          whileHover={{ y: -4, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-shadow-text/60 text-sm mb-1">Vues totales</div>
          <div className="text-3xl font-bold text-shadow-text flex items-baseline">
            {stats.viewCount}
            <span className="text-xs text-shadow-blue ml-2">+1.2%/semaine</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="border border-shadow-system rounded-lg p-4 bg-shadow-surface/10"
          whileHover={{ y: -4, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-shadow-text/60 text-sm mb-1">Clics GitHub</div>
          <div className="text-3xl font-bold text-shadow-text flex items-baseline">
            {stats.clicks.github}
            <span className="text-xs text-shadow-blue ml-2">+0.8%/semaine</span>
          </div>
        </motion.div>
        
        <motion.div 
          className="border border-shadow-system rounded-lg p-4 bg-shadow-surface/10"
          whileHover={{ y: -4, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-shadow-text/60 text-sm mb-1">Clics Site Live</div>
          <div className="text-3xl font-bold text-shadow-text flex items-baseline">
            {stats.clicks.live}
            <span className="text-xs text-shadow-blue ml-2">+1.5%/semaine</span>
          </div>
        </motion.div>
      </div>
      
      <div className="border border-shadow-system rounded-lg p-4 bg-shadow-surface/10">
        <h4 className="text-shadow-text/80 text-sm mb-3">Intérêt au fil du temps</h4>
        <div className="h-[120px] w-full flex items-end">
          {/* Graphique simulé - à remplacer par un vrai graphique */}
          {Array.from({ length: 12 }).map((_, i) => {
            const height = Math.max(15, Math.floor(Math.random() * 100));
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <motion.div 
                  className="w-4/5 bg-gradient-to-t from-shadow-blue to-double-awakening rounded-t"
                  initial={{ height: 0 }}
                  animate={{ height }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                ></motion.div>
                <div className="text-[10px] text-shadow-text/40 mt-1">
                  {i + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Link
          href={`/admin/projects/${projectId}/analytics`}
          className="px-4 py-2 text-sm text-shadow-text/80 flex items-center hover:text-shadow-blue transition-colors"
        >
          <span>Voir les analyses détaillées</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
} 
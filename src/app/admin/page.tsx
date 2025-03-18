'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  status: string;
  rank: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

interface AdminStats {
  projectCount: number;
  draftProjects: number;
  publishedProjects: number;
  visitCount: number;
  contactCount: number;
  skillCount: number;
  techCount: number;
  highestRankedProject: Project | null;
  recentProjects: Project[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    projectCount: 0,
    draftProjects: 0,
    publishedProjects: 0,
    visitCount: 0,
    contactCount: 0,
    skillCount: 0,
    techCount: 0,
    highestRankedProject: null,
    recentProjects: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState('dark');

  // Récupérer les statistiques
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/stats');
        
        if (!res.ok) {
          throw new Error('Erreur lors de la récupération des statistiques');
        }
        
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Erreur:', error);
        setError('Impossible de charger les statistiques');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  const isDark = theme === 'dark';

  // Niveaux et rangs fictifs pour le thème Solo Leveling
  const adminLevel = 3;
  const experience = stats.projectCount * 10 + stats.visitCount * 0.1;
  const nextLevelExp = adminLevel * 100;
  const expPercentage = Math.min(100, Math.floor((experience / nextLevelExp) * 100));
  
  // Calculer un rang en fonction des statistiques
  const getAdminRank = () => {
    const totalProjects = stats.projectCount;
    
    if (totalProjects >= 20) return 'S';
    if (totalProjects >= 10) return 'A';
    if (totalProjects >= 5) return 'B';
    return 'C';
  };
  
  const adminRank = getAdminRank();
  
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
  
  // Obtenir la couleur du rang
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'S': return 'from-shadow-monarch to-shadow-blue';
      case 'A': return 'from-shadow-blue to-shadow-blue/70';
      case 'B': return 'from-shadow-quest to-shadow-quest/70';
      case 'C': return 'from-shadow-system to-shadow-system/70';
      default: return 'from-shadow-system to-shadow-system/70';
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/auth/admin-logout');
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };
  
  return (
    <div className="p-6 pt-8">
      {error && (
        <div className="bg-red-500/10 border-l-4 border-red-500 p-4 mb-6 rounded text-red-700">
          <p>{error}</p>
        </div>
      )}

      {/* En-tête */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-shadow-text mb-2 flex items-center">
          <span className="mr-3 text-double-awakening">
            <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          Tableau de Bord
        </h1>
        <p className="text-shadow-text/70">
          Bienvenue dans votre centre de contrôle. Consultez vos statistiques et gérez votre portfolio.
        </p>
      </motion.div>

      {/* Informations sur l'admin */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8 bg-shadow-surface border border-shadow-system rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            {/* Avatar et niveau */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-double-awakening to-shadow-blue rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-white">A</span>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-shadow-dark border-2 border-shadow-accent text-shadow-accent rounded-full w-10 h-10 flex items-center justify-center font-bold">
                {adminLevel}
              </div>
            </div>
            
            {/* Infos admin */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-shadow-text mb-1">Administrateur</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 text-xs font-bold text-white rounded bg-gradient-to-r ${getRankColor(adminRank)}`}>
                  Rang {adminRank}
                </span>
                <span className="text-shadow-text/60 text-sm">
                  {adminLevel} niveaux collectés
                </span>
              </div>
              
              {/* Barre d'expérience */}
              <div className="w-full bg-shadow-dark/50 rounded-full h-2.5 mb-1 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-double-awakening to-shadow-blue h-2.5 rounded-full transition-all duration-1000" 
                  style={{ width: `${expPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-shadow-text/70">
                <span>{Math.floor(experience)} EXP</span>
                <span>{expPercentage}% pour le niveau {adminLevel + 1}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Statistiques */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-shadow-blue/30 rounded-full"></div>
            <div className="absolute top-0 left-0 right-0 bottom-0 border-4 border-transparent border-t-shadow-blue rounded-full animate-spin"></div>
          </div>
        </div>
      ) : (
        <motion.div 
          className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Total des projets */}
          <motion.div 
            className="bg-shadow-surface border border-shadow-system rounded-lg p-6 hover:border-shadow-blue transition-colors duration-200"
            variants={item}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-shadow-blue/20 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-shadow-blue" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-shadow-text">Projets</h3>
                <p className="text-3xl font-bold text-shadow-blue">{stats.projectCount}</p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-shadow-text/70">{stats.publishedProjects} publiés</span>
              <span className="text-shadow-text/70">{stats.draftProjects} brouillons</span>
            </div>
          </motion.div>
          
          {/* Visites */}
          <motion.div 
            className="bg-shadow-surface border border-shadow-system rounded-lg p-6 hover:border-shadow-blue transition-colors duration-200"
            variants={item}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-shadow-quest/20 flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-shadow-quest" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-shadow-text">Visites</h3>
                <p className="text-3xl font-bold text-shadow-quest">{stats.visitCount}</p>
              </div>
            </div>
            <div className="text-sm text-shadow-text/70">
              Total des visites sur votre portfolio
            </div>
          </motion.div>
          
          {/* Projet le mieux classé */}
          <motion.div 
            className="bg-shadow-surface border border-shadow-system rounded-lg p-6 hover:border-shadow-blue transition-colors duration-200 md:col-span-2"
            variants={item}
          >
            <h3 className="text-lg font-semibold text-shadow-text mb-4">Projet le mieux classé</h3>
            
            {stats.highestRankedProject ? (
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getRankColor(stats.highestRankedProject.rank)} flex items-center justify-center text-white font-bold text-xl mr-4`}>
                  {stats.highestRankedProject.rank}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-shadow-text">{stats.highestRankedProject.title}</h4>
                  <div className="flex justify-between mt-1">
                    <span className="text-sm text-shadow-text/70">
                      {stats.highestRankedProject.viewCount} vues
                    </span>
                    <Link 
                      href={`/admin/projects/${stats.highestRankedProject.id}`}
                      className="text-sm text-shadow-blue hover:underline"
                    >
                      Voir les détails
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-shadow-text/70 text-center py-2">
                Aucun projet trouvé
      </div>
            )}
          </motion.div>
        </motion.div>
      )}
      
      {/* Projets récents */}
      {!loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-shadow-text">Projets récents</h2>
          <Link 
            href="/admin/projects" 
              className="text-shadow-blue hover:text-shadow-blue/80 text-sm font-medium"
          >
              Voir tous les projets
          </Link>
        </div>
        
          <div className="bg-shadow-surface border border-shadow-system rounded-lg overflow-hidden">
            {stats.recentProjects && stats.recentProjects.length > 0 ? (
        <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-shadow-dark/30 text-shadow-text/80 text-sm">
                    <tr>
                      <th className="px-6 py-3 font-medium">Projet</th>
                      <th className="px-6 py-3 font-medium">Statut</th>
                      <th className="px-6 py-3 font-medium">Rang</th>
                      <th className="px-6 py-3 font-medium">Vues</th>
                      <th className="px-6 py-3 font-medium">Dernière mise à jour</th>
                      <th className="px-6 py-3 font-medium w-20"></th>
              </tr>
            </thead>
                  <tbody className="divide-y divide-shadow-system/30">
                    {stats.recentProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-shadow-system/10">
                        <td className="px-6 py-4 font-medium text-shadow-text">
                      {project.title}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            project.status === 'published' 
                              ? 'bg-double-awakening/20 text-double-awakening' 
                              : 'bg-shadow-system/30 text-shadow-text'
                          }`}>
                            {project.status === 'published' ? 'Publié' : 'Brouillon'}
                          </span>
                  </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 text-xs font-bold text-white rounded bg-gradient-to-r ${getRankColor(project.rank)}`}>
                      {project.rank}
                    </span>
                  </td>
                        <td className="px-6 py-4 text-shadow-text/70">
                          {project.viewCount}
                  </td>
                        <td className="px-6 py-4 text-shadow-text/70">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Link 
                              href={`/admin/projects/${project.id}`}
                              className="p-1.5 text-shadow-text/70 hover:text-shadow-blue rounded hover:bg-shadow-system/30"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </Link>
                            <Link 
                              href={`/projects/${project.id}`}
                              className="p-1.5 text-shadow-text/70 hover:text-shadow-blue rounded hover:bg-shadow-system/30"
                              target="_blank"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </Link>
                          </div>
                        </td>
                </tr>
              ))}
            </tbody>
          </table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <svg className="w-12 h-12 text-shadow-text/30 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-shadow-text/70">Aucun projet trouvé</p>
                <Link 
                  href="/admin/projects/new" 
                  className="mt-4 px-4 py-2 bg-gradient-to-r from-double-awakening to-shadow-blue text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  Créer un projet
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Raccourcis rapides */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-shadow-text mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link 
            href="/admin/projects/new"
            className="bg-shadow-surface border border-shadow-system hover:border-shadow-blue rounded-lg p-6 flex flex-col items-center justify-center transition-colors duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-shadow-blue/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-shadow-blue" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-shadow-text font-medium">Nouveau projet</span>
          </Link>
          
          <Link 
            href="/admin/skills"
            className="bg-shadow-surface border border-shadow-system hover:border-shadow-blue rounded-lg p-6 flex flex-col items-center justify-center transition-colors duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-shadow-quest/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-shadow-quest" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-9.618 5.04c-.18.666-.18 1.494-.18 2.072 0 4.208 3.36 7.63 7.49 9.562a2.5 2.5 0 002.62 0c4.13-1.933 7.49-5.35 7.49-9.562 0-.578 0-1.41-.18-2.072z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-shadow-text font-medium">Gérer les compétences</span>
          </Link>
          
          <Link 
            href="/"
            className="bg-shadow-surface border border-shadow-system hover:border-shadow-primary rounded-lg p-6 flex flex-col items-center justify-center transition-colors duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-shadow-primary/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-shadow-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h2a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-shadow-text font-medium">Voir le portfolio</span>
          </Link>
          
          <button 
            onClick={handleLogout}
            className="bg-shadow-surface border border-shadow-system hover:border-shadow-monarch rounded-lg p-6 flex flex-col items-center justify-center transition-colors duration-200"
          >
            <div className="w-12 h-12 rounded-full bg-shadow-monarch/20 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-shadow-monarch" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span className="text-shadow-text font-medium">Déconnexion</span>
          </button>
        </div>
      </motion.div>

      {/* Cartes de gestion */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {/* Carte Projets */}
        <Link href="/admin/projects" className={`
          p-6 rounded-lg flex flex-col
          ${isDark 
            ? 'bg-shadow-secondary hover:bg-shadow-system border border-shadow-blue/30' 
            : 'bg-light-secondary hover:bg-light-surface border border-light-primary/30'}
          transition-colors duration-300 group
        `}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`
              text-lg font-bold
              ${isDark ? 'text-shadow-text' : 'text-light-text'}
            `}>
              Projets
            </h3>
            <span className={`
              w-10 h-10 flex items-center justify-center rounded-full
              ${isDark 
                ? 'bg-shadow-blue text-white' 
                : 'bg-light-primary text-white'}
            `}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </span>
          </div>
          <p className={`
            mb-4 text-sm
            ${isDark ? 'text-shadow-text/70' : 'text-light-text/70'}
          `}>
            Gérer vos projets, modifier leur contenu et leurs statuts.
          </p>
          <div className="mt-auto flex justify-between items-center">
            <div className={`
              text-sm font-medium
              ${isDark ? 'text-shadow-text/50' : 'text-light-text/50'}
            `}>
              {stats.projectCount} projets
            </div>
            <span className={`
              group-hover:translate-x-1 transform transition-transform
              ${isDark ? 'text-shadow-blue' : 'text-light-primary'}
            `}>
              →
            </span>
          </div>
        </Link>

        {/* Carte Compétences */}
        <Link href="/admin/skills" className={`
          p-6 rounded-lg flex flex-col
          ${isDark 
            ? 'bg-shadow-secondary hover:bg-shadow-system border border-shadow-monarch/30' 
            : 'bg-light-secondary hover:bg-light-surface border border-light-rank/30'}
          transition-colors duration-300 group
        `}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`
              text-lg font-bold
              ${isDark ? 'text-shadow-text' : 'text-light-text'}
            `}>
              Compétences
            </h3>
            <span className={`
              w-10 h-10 flex items-center justify-center rounded-full
              ${isDark 
                ? 'bg-shadow-monarch text-white' 
                : 'bg-light-rank text-white'}
            `}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
          <p className={`
            mb-4 text-sm
            ${isDark ? 'text-shadow-text/70' : 'text-light-text/70'}
          `}>
            Mettre à jour vos compétences et ajuster les niveaux de maîtrise.
          </p>
          <div className="mt-auto flex justify-between items-center">
            <div className={`
              text-sm font-medium
              ${isDark ? 'text-shadow-text/50' : 'text-light-text/50'}
            `}>
              {stats.skillCount} compétences
            </div>
            <span className={`
              group-hover:translate-x-1 transform transition-transform
              ${isDark ? 'text-shadow-monarch' : 'text-light-rank'}
            `}>
              →
            </span>
          </div>
        </Link>

        {/* Carte Technologies */}
        <Link href="/admin/technologies" className={`
          p-6 rounded-lg flex flex-col
          ${isDark 
            ? 'bg-shadow-secondary hover:bg-shadow-system border border-shadow-primary/30' 
            : 'bg-light-secondary hover:bg-light-surface border border-light-gold-DEFAULT/30'}
          transition-colors duration-300 group
        `}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`
              text-lg font-bold
              ${isDark ? 'text-shadow-text' : 'text-light-text'}
            `}>
              Technologies
            </h3>
            <span className={`
              w-10 h-10 flex items-center justify-center rounded-full
              ${isDark 
                ? 'bg-shadow-primary text-white' 
                : 'bg-light-gold-DEFAULT text-shadow-dark'}
            `}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </span>
          </div>
          <p className={`
            mb-4 text-sm
            ${isDark ? 'text-shadow-text/70' : 'text-light-text/70'}
          `}>
            Gérer les technologies utilisées dans vos projets.
          </p>
          <div className="mt-auto flex justify-between items-center">
            <div className={`
              text-sm font-medium
              ${isDark ? 'text-shadow-text/50' : 'text-light-text/50'}
            `}>
              {stats.techCount || 0} technologies
            </div>
            <span className={`
              group-hover:translate-x-1 transform transition-transform
              ${isDark ? 'text-shadow-primary' : 'text-light-gold-DEFAULT'}
            `}>
              →
            </span>
          </div>
        </Link>

        {/* Carte Messages */}
        <Link href="/admin/messages" className={`
          p-6 rounded-lg flex flex-col
          ${isDark 
            ? 'bg-shadow-secondary hover:bg-shadow-system border border-shadow-accent/30' 
            : 'bg-light-secondary hover:bg-light-surface border border-light-accent/30'}
          transition-colors duration-300 group
        `}>
          <div className="flex justify-between items-center mb-4">
            <h3 className={`
              text-lg font-bold
              ${isDark ? 'text-shadow-text' : 'text-light-text'}
            `}>
              Messages
            </h3>
            <span className={`
              w-10 h-10 flex items-center justify-center rounded-full
              ${isDark 
                ? 'bg-shadow-accent text-white' 
                : 'bg-light-accent text-white'}
            `}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
            </span>
          </div>
          <p className={`
            mb-4 text-sm
            ${isDark ? 'text-shadow-text/70' : 'text-light-text/70'}
          `}>
            Consulter et répondre aux messages reçus via le formulaire de contact.
          </p>
          <div className="mt-auto flex justify-between items-center">
            <div className={`
              text-sm font-medium
              ${isDark ? 'text-shadow-text/50' : 'text-light-text/50'}
            `}>
              {stats.contactCount} messages
            </div>
            <span className={`
              group-hover:translate-x-1 transform transition-transform
              ${isDark ? 'text-shadow-accent' : 'text-light-accent'}
            `}>
              →
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
} 
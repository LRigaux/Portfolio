'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const theme = useTheme();
  
  // Mettre à jour l'heure toutes les secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Récupérer les messages non lus
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          const data = await res.json();
          setUnreadMessages(data.unreadMessages || 0);
        }
      } catch (error) {
        console.error('Erreur de récupération des messages non lus:', error);
      }
    };

    fetchUnreadMessages();
    
    // Actualiser toutes les 5 minutes
    const interval = setInterval(fetchUnreadMessages, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Fonction pour obtenir le titre de la page actuelle
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Administrator System';
    if (pathname?.startsWith('/admin/projects')) return 'Gestion des projets';
    if (pathname?.startsWith('/admin/skills')) return 'Gestion des compétences';
    if (pathname?.startsWith('/admin/technologies')) return 'Gestion des technologies';
    if (pathname?.startsWith('/admin/messages')) return 'Messages';
    return 'Administrator System';
  };
  
  // Fonction pour gérer la déconnexion
  const handleLogout = async () => {
    try {
      await fetch('/auth/admin-logout');
      router.push('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 z-10 bg-shadow-dark border-b border-shadow-system">
      <div className="px-4 py-3 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center"
        >
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden mr-4 text-shadow-text hover:text-shadow-accent"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h1 className="text-lg font-medium text-shadow-text">
            {getPageTitle()}
          </h1>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          
          {/* Bouton de déconnexion rapide */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleLogout}
            className="p-2 rounded-full bg-shadow-system hover:bg-shadow-monarch/20 text-shadow-monarch transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 16L21 12M21 12L17 8M21 12H9M9 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </div>
      </div>
    </header>
  );
} 
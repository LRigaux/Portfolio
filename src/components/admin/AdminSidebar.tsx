'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Icônes stylisées avec le thème Solo Leveling
const icons = {
  dashboard: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  projects: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  skills: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  profile: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 16L21 12M21 12L17 8M21 12H9M9 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  const menuItems = [
    { path: '/admin', label: 'Tableau de bord', icon: icons.dashboard },
    { path: '/admin/projects', label: 'Projets', icon: icons.projects },
    { path: '/admin/skills', label: 'Compétences', icon: icons.skills },
  ];

  // Animation pour l'apparition des éléments du menu
  const sidebarVariants = {
    open: { width: '16rem', transition: { duration: 0.3 } },
    closed: { width: '5rem', transition: { duration: 0.3 } }
  };

  const labelVariants = {
    open: { opacity: 1, display: 'block', transition: { delay: 0.2 } },
    closed: { opacity: 0, display: 'none', transition: { duration: 0.1 } }
  };

  return (
    <motion.aside 
      className="fixed left-0 top-0 z-20 h-screen bg-shadow-dark border-r border-shadow-system"
      initial="open"
      animate={isOpen ? 'open' : 'closed'}
      variants={sidebarVariants}
    >
      <div className="flex flex-col h-full">
        {/* Entête */}
        <div className="py-6 px-4 flex justify-between items-center border-b border-shadow-system">
          <motion.div 
            className="flex items-center gap-3"
            variants={labelVariants}
          >
            <div className="w-8 h-8 rounded-full bg-double-awakening flex items-center justify-center text-white font-bold">
              A
            </div>
            <motion.h2 
              className="text-shadow-text font-bold"
              variants={labelVariants}
            >
              Admin <span className="text-shadow-blue">System</span>
            </motion.h2>
          </motion.div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded-full hover:bg-shadow-system/50 text-shadow-text"
          >
            <svg 
              className="w-5 h-5 transform transition-transform" 
              style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)' }}
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Barre de niveau */}
        <div className="py-4 px-3 border-b border-shadow-system">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-double-awakening to-shadow-blue flex items-center justify-center text-white font-bold text-sm">
              LV3
            </div>
            <motion.div className="flex-1" variants={labelVariants}>
              <p className="text-shadow-text text-sm font-medium">Admin System</p>
              <div className="w-full h-2 bg-shadow-surface rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-double-awakening to-shadow-blue rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-shadow-text/70 mt-1">
                <span>Niveau 3</span>
                <span>45%</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-6 flex-1">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link href={item.path} className="block">
                    <div 
                      className={`
                        flex items-center py-3 px-4 mx-2 rounded-lg transition-colors relative
                        ${active ? 'text-white' : 'text-shadow-text hover:text-shadow-blue'}
                      `}
                    >
                      {active && (
                        <motion.div 
                          className="absolute inset-0 bg-gradient-to-r from-double-awakening to-shadow-blue rounded-lg"
                          layoutId="activeBackground"
                          transition={{ type: 'spring', duration: 0.5 }}
                        />
                      )}
                      <span className={`relative z-10 ${active ? 'text-white' : ''}`}>
                        {item.icon}
                      </span>
                      <motion.span 
                        className="ml-3 relative z-10 font-medium"
                        variants={labelVariants}
                      >
                        {item.label}
                      </motion.span>
                      {active && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full relative z-10"></span>
                      )}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Déconnexion */}
        <div className="p-4 border-t border-shadow-system mt-auto">
          <Link href="/auth/admin-logout">
            <div className="flex items-center py-3 px-4 text-shadow-text hover:text-shadow-monarch transition-colors rounded-lg">
              <span className="text-shadow-monarch">
                {icons.logout}
              </span>
              <motion.span 
                className="ml-3 font-medium"
                variants={labelVariants}
              >
                Déconnexion
              </motion.span>
            </div>
          </Link>
        </div>
      </div>
    </motion.aside>
  );
} 
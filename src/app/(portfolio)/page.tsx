'use client';
import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import Hero from '@/components/About';
import SystemInterface from '@/components/SystemInterface';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import TechnologiesSection from '@/components/TechnologiesSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chargement simulé
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Si chargement en cours, montrer un écran de chargement
  if (loading) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center ${
        theme === 'dark' ? 'bg-shadow-dark' : 'bg-light-primary'
      }`}>
        <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${
          theme === 'dark' ? 'border-shadow-primary' : 'border-light-gold-DEFAULT'
        }`}></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-shadow-dark' : 'bg-light-primary'}`}>
      <Hero />
      <SystemInterface />
      <ProjectsSection />
      <SkillsSection />
      <TechnologiesSection />
      <ContactSection />
    </div>
  );
} 
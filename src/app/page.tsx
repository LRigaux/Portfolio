import Hero from '@/components/Hero';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import ContactSection from '@/components/ContactSection';
import SystemInterface from '@/components/SystemInterface';
import ParticlesBackground from '@/components/ParticlesBackground';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-shadow-dark relative">
      {/* Arrière-plan de particules pour l'ambiance Solo Leveling */}
      <div className="fixed inset-0 z-0">
        <ParticlesBackground />
      </div>
      
      {/* Contenu principal */}
      <div className="relative z-10">
        <Hero />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </div>
      
      {/* Interface système de Solo Leveling */}
      <SystemInterface />
    </div>
  );
} 
import Hero from '@/components/Hero';
import ProjectsSection from '@/components/ProjectsSection';
import SkillsSection from '@/components/SkillsSection';
import ContactSection from '@/components/ContactSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ProjectsSection />
      <SkillsSection />
      <ContactSection />
    </div>
  );
} 
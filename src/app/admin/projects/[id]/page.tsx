import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProjectForm from '@/components/admin/ProjectForm';

interface Project {
  id: string;
  title: string;
  description: string;
  content?: string | null;
  rank: 'S' | 'A' | 'B' | 'C';
  featured: boolean;
  status: 'draft' | 'published';
  imageUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  technologies: Array<{ technology: { id: string; name: string } }>;
  categories: Array<{ category: { id: string; name: string } }>;
}

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      technologies: {
        include: {
          technology: true
        }
      },
      categories: {
        include: {
          category: true
        }
      }
    }
  });

  if (!project) {
    notFound();
  }

  // Formater les données pour le formulaire
  const formattedProject = {
    ...project,
    technologies: project.technologies.map(t => t.technology.name),
    categories: project.categories.map(c => c.category.name)
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Modifier le projet</h1>
      <ProjectForm project={formattedProject} isEdit={true} />
    </div>
  );
} 
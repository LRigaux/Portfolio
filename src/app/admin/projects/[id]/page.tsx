import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProjectForm from '@/components/admin/ProjectForm';

interface ProjectTechnology {
  technology: {
    id: string;
    name: string;
  }
}

interface ProjectCategory {
  category: {
    id: string;
    name: string;
  }
}

interface ProjectData {
  id: string;
  title: string;
  description: string;
  content: string | null;
  rank: 'S' | 'A' | 'B' | 'C';
  featured: boolean;
  status: 'draft' | 'published';
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  technologies: ProjectTechnology[];
  categories: ProjectCategory[];
}

interface FormattedProject {
  id: string;
  title: string;
  description: string;
  content: string | null;
  rank: 'S' | 'A' | 'B' | 'C';
  featured: boolean;
  status: 'draft' | 'published';
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  technologies: string[];
  categories: string[];
}

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  if (!prisma) {
    throw new Error("Prisma client is not initialized");
  }
  
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
  }) as ProjectData | null;

  if (!project) {
    notFound();
  }

  // Formater les données pour le formulaire
  const formattedProject: FormattedProject = {
    ...project,
    technologies: project.technologies.map((t: ProjectTechnology) => t.technology.name),
    categories: project.categories.map((c: ProjectCategory) => c.category.name)
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Modifier le projet</h1>
      <ProjectForm project={formattedProject} isEdit={true} />
    </div>
  );
} 
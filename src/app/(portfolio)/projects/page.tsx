import { Suspense } from 'react';
import ProjectCard from '@/components/ProjectCard';
import ClientProjectsPage from '@/components/ClientProjectsPage';
import { prisma } from '@/lib/prisma';

// Cette fonction s'exécute côté serveur uniquement
async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: 'published'
      },
      orderBy: [
        { rank: 'asc' },
        { createdAt: 'desc' }
      ],
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
  
    return projects.map(project => ({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.imageUrl || '/projects/default.jpg',
      tags: project.technologies.map(t => t.technology.name),
      link: project.githubUrl || '#',
      liveLink: project.liveUrl,
      rank: project.rank,
      featured: project.featured
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <ClientProjectsPage initialProjects={projects} />
  );
} 
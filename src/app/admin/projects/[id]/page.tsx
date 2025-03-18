import React from 'react';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProjectForm from '@/components/admin/ProjectForm';
import ProjectStats from '@/components/admin/ProjectStats';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string | null;
  imageUrl: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  rank: 'S' | 'A' | 'B' | 'C';
  featured: boolean;
  status: 'draft' | 'published';
  technologies: string[];
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
  viewCount: number;
}

// Récupérer le projet par son ID
async function getProject(id: string): Promise<Project | null> {
  try {
    const dbProject = await prisma.project.findUnique({
      where: { id },
      include: {
        technologies: {
          select: { technology: { select: { name: true } } }
        },
        categories: {
          select: { category: { select: { name: true } } }
        },
      },
    });

    if (!dbProject) return null;

    return {
      id: dbProject.id,
      title: dbProject.title,
      slug: dbProject.slug || '',
      description: dbProject.description,
      content: dbProject.content,
      imageUrl: dbProject.imageUrl,
      githubUrl: dbProject.githubUrl,
      liveUrl: dbProject.liveUrl,
      rank: dbProject.rank as 'S' | 'A' | 'B' | 'C',
      featured: dbProject.featured,
      status: dbProject.status as 'draft' | 'published',
      technologies: dbProject.technologies.map(tech => tech.technology.name),
      categories: dbProject.categories.map(cat => cat.category.name),
      createdAt: dbProject.createdAt,
      updatedAt: dbProject.updatedAt,
      viewCount: dbProject.viewCount || 0,
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

// Récupérer les statistiques du projet
async function getProjectStats(id: string) {
  try {
    // Récupérer le projet avec son nombre de vues
    const project = await prisma.project.findUnique({
      where: { id },
      select: { viewCount: true }
    });
    
    return {
      views: project?.viewCount || 0,
      lastUpdate: new Date(),
    };
  } catch (error) {
    console.error('Error fetching project stats:', error);
    return { views: 0, lastUpdate: new Date() };
  }
}

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  const stats = await getProjectStats(params.id);
  
  if (!project) {
    notFound();
  }

  // Fonction pour déterminer la couleur du rang
  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'S': return 'from-shadow-monarch to-shadow-blue';
      case 'A': return 'from-shadow-blue to-shadow-blue/70';
      case 'B': return 'from-shadow-quest to-shadow-quest/70';
      case 'C': return 'from-shadow-system to-shadow-system/70';
      default: return 'from-shadow-system to-shadow-system/70';
    }
  };

  return (
    <div className="p-6 pt-8">
      {/* Header avec Breadcrumb et stats */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-shadow-text/70 mb-2">
              <Link href="/admin" className="hover:text-shadow-blue transition-colors">
                Admin
              </Link>
              <span>/</span>
              <Link href="/admin/projects" className="hover:text-shadow-blue transition-colors">
                Projets
              </Link>
              <span>/</span>
              <span className="text-shadow-text">{project.title}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-shadow-text flex items-center">
              <span className="mr-3 inline-block p-1 rounded-lg bg-gradient-to-r from-double-awakening to-shadow-blue text-white">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              Modifier: {project.title}
            </h1>
          </div>
          
          <div className="flex gap-3">
            <Link 
              href={`/projects/${project.slug}`} 
              target="_blank"
              className="inline-flex items-center px-4 py-2 bg-shadow-surface border border-shadow-system text-shadow-text hover:border-shadow-blue rounded-lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Voir le projet
            </Link>
            
            <Link 
              href={`/admin/projects/${project.id}/delete`}
              className="inline-flex items-center px-4 py-2 bg-shadow-monarch/10 border border-shadow-monarch/20 text-shadow-monarch hover:bg-shadow-monarch/20 rounded-lg"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Supprimer
            </Link>
          </div>
        </div>
        
        {/* Statistiques du projet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Rang du projet */}
          <div className="bg-shadow-surface border border-shadow-system rounded-lg p-4 flex items-center">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getRankColor(project.rank)} flex items-center justify-center text-white font-bold text-xl mr-4`}>
              {project.rank}
            </div>
            <div>
              <h3 className="text-shadow-text font-semibold">Rang du Projet</h3>
              <p className="text-shadow-text/70 text-sm">
                {project.rank === 'S' ? 'Exceptionnel' : 
                 project.rank === 'A' ? 'Excellent' :
                 project.rank === 'B' ? 'Bon' : 'Standard'}
              </p>
            </div>
          </div>
          
          {/* Nombre de vues */}
          <div className="bg-shadow-surface border border-shadow-system rounded-lg p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-shadow-quest to-shadow-quest/70 flex items-center justify-center text-white mr-4">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-shadow-text font-semibold">Vues Totales</h3>
              <p className="text-shadow-text/70 text-sm">
                {stats.views} {stats.views === 1 ? 'visite' : 'visites'}
              </p>
            </div>
          </div>
          
          {/* Date de création et mise à jour */}
          <div className="bg-shadow-surface border border-shadow-system rounded-lg p-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-shadow-accent to-shadow-accent/70 flex items-center justify-center text-white mr-4">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="text-shadow-text font-semibold">Dates</h3>
              <p className="text-shadow-text/70 text-sm">
                Créé le {new Date(project.createdAt).toLocaleDateString()}
              </p>
              <p className="text-shadow-text/70 text-sm">
                Mis à jour le {new Date(project.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <ProjectForm project={project} isEdit={true} />
    </div>
  );
} 
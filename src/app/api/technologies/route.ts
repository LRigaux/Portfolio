import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Fetching technologies...');
    
    // Récupérer toutes les technologies avec leurs projets associés
    const technologies = await prisma.technology.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        projects: {
          include: {
            project: true
          }
        }
      }
    });

    console.log(`Found ${technologies.length} technologies`);
    
    // Transformer les données pour correspondre à l'interface Technology
    const formattedTechnologies = technologies.map(tech => {
      // Construire la liste des projets associés
      const relatedProjects = tech.projects.map(projectRel => ({
        id: projectRel.project.id,
        title: projectRel.project.title,
        slug: projectRel.project.slug
      }));

      // Log pour débogage
      console.log(`Formatting tech: ${tech.name}, projects: ${relatedProjects.length}`);

      return {
        id: tech.id,
        name: tech.name,
        slug: tech.slug,
        iconUrl: tech.iconUrl,
        description: `Maîtrise de ${tech.name} pour le développement d'applications de qualité`,
        relatedProjects,
        createdAt: tech.createdAt,
        updatedAt: tech.updatedAt
      };
    });

    return NextResponse.json(formattedTechnologies);
  } catch (error) {
    console.error('Erreur lors de la récupération des technologies:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des technologies' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
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

    // Transformer les données pour correspondre à l'interface Technology
    const formattedTechnologies = technologies.map(tech => {
      // Construire la liste des projets associés
      const relatedProjects = tech.projects.map(projectRel => ({
        id: projectRel.project.id,
        title: projectRel.project.title,
        slug: projectRel.project.slug,
        rank: projectRel.project.rank
      }));

      // Calculer dynamiquement le rang en fonction du nombre de projets associés
      let calculatedRank = 'C';
      if (relatedProjects.length > 3) {
        calculatedRank = 'S';
      } else if (relatedProjects.length > 1) {
        calculatedRank = 'A';
      } else if (relatedProjects.length > 0) {
        calculatedRank = 'B';
      }

      // Calculer dynamiquement la catégorie en fonction des projets
      let calculatedCategory = 'Autres';
      // Logique pour déterminer la catégorie (simplifiée pour l'exemple)
      if (tech.name.toLowerCase().includes('react') || 
          tech.name.toLowerCase().includes('vue') || 
          tech.name.toLowerCase().includes('angular')) {
        calculatedCategory = 'Frontend';
      } else if (tech.name.toLowerCase().includes('node') || 
                tech.name.toLowerCase().includes('express') ||
                tech.name.toLowerCase().includes('django')) {
        calculatedCategory = 'Backend';
      } else if (tech.name.toLowerCase().includes('sql') || 
                tech.name.toLowerCase().includes('mongo') ||
                tech.name.toLowerCase().includes('postgres')) {
        calculatedCategory = 'Database';
      }

      return {
        id: tech.id,
        name: tech.name,
        slug: tech.slug,
        iconUrl: tech.iconUrl,
        level: Math.floor(Math.random() * 41) + 60, // Génère un niveau entre 60 et 100 pour le moment
        rank: calculatedRank,
        category: calculatedCategory,
        description: `Maîtrise avancée de ${tech.name} pour le développement d'applications de qualité`,
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
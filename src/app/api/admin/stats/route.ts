import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Récupérer les statistiques de base
    const [
      projectCount,
      draftCount,
      publishedCount,
      visitCount
    ] = await Promise.all([
      // Nombre total de projets
      prisma.project.count(),
      // Nombre de projets en brouillon
      prisma.project.count({ where: { status: 'draft' } }),
      // Nombre de projets publiés
      prisma.project.count({ where: { status: 'published' } }),
      // Nombre total de visites (en utilisant le champ viewCount agrégé)
      prisma.project.aggregate({
        _sum: {
          viewCount: true
        }
      }).then(result => result._sum.viewCount || 0)
    ]);

    // Récupérer le projet le mieux classé
    const highestRankedProject = await prisma.project.findFirst({
      where: {
        status: 'published'
      },
      orderBy: [
        {
          rank: 'asc' // 'S' vient avant 'A', 'B', 'C' dans l'ordre alphabétique
        },
        {
          viewCount: 'desc'
        }
      ],
      select: {
        id: true,
        title: true,
        status: true,
        rank: true,
        viewCount: true,
        updatedAt: true
      }
    });

    // Récupérer les projets récents
    const recentProjects = await prisma.project.findMany({
      take: 5,
      orderBy: {
        updatedAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        status: true,
        rank: true,
        viewCount: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      projectCount,
      draftCount,
      publishedCount,
      visitCount,
      highestRankedProject,
      recentProjects
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
} 
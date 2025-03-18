import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Récupérer le nombre total de projets
    const projectCount = await prisma.project.count();
    
    // Récupérer le nombre de projets par statut
    const draftProjects = await prisma.project.count({
      where: { status: 'draft' }
    });
    
    const publishedProjects = await prisma.project.count({
      where: { status: 'published' }
    });
    
    // Récupérer les statistiques de visite
    const visitCount = await prisma.siteVisit.count();
    
    // Récupérer le nombre de contacts
    const contactCount = await prisma.contact.count();
    
    // Récupérer le nombre de compétences
    const skillCount = await prisma.skill.count();
    
    // Récupérer le nombre de technologies
    const techCount = await prisma.technology.count();
    
    // Récupérer le projet le mieux classé
    const highestRankedProject = await prisma.project.findFirst({
      where: { 
        status: 'published',
        rank: 'S'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Récupérer les projets récents
    const recentProjects = await prisma.project.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({
      projectCount,
      draftProjects,
      publishedProjects,
      visitCount,
      contactCount,
      skillCount,
      techCount,
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
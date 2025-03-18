import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  // Vérifier que prisma est défini (côté serveur)
  if (!prisma) {
    return NextResponse.json(
      { error: 'Database client not available', projects: [] },
      { status: 500 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const technology = searchParams.get('technology');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    
    // Construire les filtres
    const where: any = {};
    
    if (featured === 'true') {
      where.featured = true;
    }
    
    if (category) {
      where.categories = {
        some: {
          category: {
            slug: category
          }
        }
      };
    }
    
    if (technology) {
      where.technologies = {
        some: {
          technology: {
            slug: technology
          }
        }
      };
    }
    
    // Récupérer les projets
    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { rank: 'asc' },
        { createdAt: 'desc' }
      ],
      take: limit,
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
    
    // Formatter les projets pour la réponse
    const formattedProjects = projects.map(project => ({
      ...project,
      technologies: project.technologies.map(t => t.technology),
      categories: project.categories.map(c => c.category)
    }));
    
    return NextResponse.json({ projects: formattedProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
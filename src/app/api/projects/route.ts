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
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 10;
    const skip = (page - 1) * limit;
    
    console.log('API Request params:', { 
      featured, 
      category, 
      technology, 
      page, 
      limit 
    });
    
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

    console.log('Prisma where filter:', JSON.stringify(where, null, 2));

    // Compter le nombre total de projets pour la pagination
    const total = await prisma.project.count({ where });
    
    // Récupérer les projets
    const projects = await prisma.project.findMany({
      where,
      orderBy: [
        { createdAt: 'desc' }
      ],
      skip,
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

    console.log(`Found ${formattedProjects.length} projects matching filters (total: ${total})`);

    // Calculer la pagination
    const pagination = {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit
    };
    
    return NextResponse.json({ 
      projects: formattedProjects,
      pagination
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
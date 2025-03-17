import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Project } from '@/types';

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
    const featured = searchParams.get('featured') === 'true';
    const rank = searchParams.get('rank');
    
    const projects = await prisma.project.findMany({
      where: {
        status: 'published',
        ...(featured && { featured: true }),
        ...(rank && { rank })
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ]
    });
    
    // Convertir les dates en chaînes pour la sérialisation JSON
    const serializedProjects: Project[] = projects.map((project: any) => ({
      ...project,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString()
    }));
    
    return NextResponse.json({ projects: serializedProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects', projects: [] },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { slugify } from '@/lib/utils';

// Schéma de validation pour la mise à jour d'une technologie
const technologyUpdateSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').optional(),
  iconUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable()
});

// GET - Récupérer une technologie spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const technology = await prisma.technology.findUnique({
      where: { id: params.id },
      include: {
        // Inclure les projets utilisant cette technologie
        projects: {
          include: {
            project: {
              select: {
                id: true,
                title: true,
                slug: true,
                rank: true,
                imageUrl: true
              }
            }
          }
        }
      }
    });

    if (!technology) {
      return NextResponse.json(
        { error: 'Technologie non trouvée' },
        { status: 404 }
      );
    }

    // Transformer les données pour une meilleure utilisation côté client
    const formattedTechnology = {
      ...technology,
      projects: technology.projects.map(p => p.project)
    };

    return NextResponse.json(formattedTechnology);
  } catch (error) {
    console.error('Erreur lors de la récupération de la technologie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la technologie' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une technologie
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    // Valider les données
    const validation = technologyUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const data = validation.data;
    
    // Vérifier si la technologie existe
    const existingTechnology = await prisma.technology.findUnique({
      where: { id: params.id }
    });
    
    if (!existingTechnology) {
      return NextResponse.json(
        { error: 'Technologie non trouvée' },
        { status: 404 }
      );
    }
    
    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (data.name) {
      updateData.name = data.name;
      updateData.slug = slugify(data.name);
    }
    
    if (data.iconUrl !== undefined) {
      updateData.iconUrl = data.iconUrl;
    }
    
    // Mettre à jour la technologie
    const technology = await prisma.technology.update({
      where: { id: params.id },
      data: updateData
    });
    
    return NextResponse.json(technology);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la technologie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la technologie' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une technologie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si la technologie existe
    const existingTechnology = await prisma.technology.findUnique({
      where: { id: params.id },
      include: {
        projects: true
      }
    });
    
    if (!existingTechnology) {
      return NextResponse.json(
        { error: 'Technologie non trouvée' },
        { status: 404 }
      );
    }
    
    // Si la technologie est utilisée dans des projets, empêcher la suppression
    if (existingTechnology.projects.length > 0) {
      return NextResponse.json(
        { 
          error: 'La technologie est utilisée dans des projets et ne peut pas être supprimée',
          projects: existingTechnology.projects.length
        },
        { status: 409 }
      );
    }
    
    // Supprimer la technologie
    await prisma.technology.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de la technologie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la technologie' },
      { status: 500 }
    );
  }
} 
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
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const technology = await prisma.technology.findUnique({
      where: { id }
    });
    
    if (!technology) {
      return NextResponse.json(
        { error: 'Technologie non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(technology);
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
    const { id } = params;
    const body = await request.json();
    const { name, iconUrl, rank, category } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      );
    }
    
    // Vérifier que la technologie existe
    const technology = await prisma.technology.findUnique({
      where: { id }
    });
    
    if (!technology) {
      return NextResponse.json(
        { error: 'Technologie non trouvée' },
        { status: 404 }
      );
    }
    
    // Vérifier si le nouveau nom n'est pas déjà utilisé par une autre technologie
    if (name !== technology.name) {
      const existing = await prisma.technology.findUnique({
        where: { name }
      });
      
      if (existing && existing.id !== id) {
        return NextResponse.json(
          { error: 'Une technologie avec ce nom existe déjà' },
          { status: 400 }
        );
      }
    }
    
    // Mettre à jour la technologie
    const updatedTechnology = await prisma.technology.update({
      where: { id },
      data: {
        name,
        slug: name !== technology.name ? slugify(name) : technology.slug,
        iconUrl,
        rank,
        category
      }
    });
    
    return NextResponse.json(updatedTechnology);
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
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Vérifier que la technologie existe
    const technology = await prisma.technology.findUnique({
      where: { id }
    });
    
    if (!technology) {
      return NextResponse.json(
        { error: 'Technologie non trouvée' },
        { status: 404 }
      );
    }
    
    // Supprimer la technologie
    await prisma.technology.delete({
      where: { id }
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
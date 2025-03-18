import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { slugify } from '@/lib/utils';

// Schéma de validation pour la création d'une technologie
const technologySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  iconUrl: z.string().optional(),
  category: z.string().optional()
});

// Endpoint pour récupérer toutes les technologies utilisées
// Utilisé pour l'auto-complétion dans le formulaire de projet
export async function GET() {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    return NextResponse.json(technologies);
  } catch (error) {
    console.error('Erreur lors de la récupération des technologies:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des technologies' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle technologie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, iconUrl, rank, category } = body;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      );
    }
    
    const slug = slugify(name);
    
    // Vérifier que le nom n'existe pas déjà
    const existing = await prisma.technology.findUnique({
      where: { name }
    });
    
    if (existing) {
      return NextResponse.json(
        { error: 'Une technologie avec ce nom existe déjà' },
        { status: 400 }
      );
    }
    
    const technology = await prisma.technology.create({
      data: {
        name,
        slug,
        iconUrl,
        rank,
        category
      }
    });
    
    return NextResponse.json(technology);
  } catch (error) {
    console.error('Erreur lors de la création de la technologie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la technologie' },
      { status: 500 }
    );
  }
} 
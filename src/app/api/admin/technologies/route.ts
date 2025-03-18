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
    // Récupérer toutes les technologies distinctes
    const technologies = await prisma.technology.findMany({
      orderBy: {
        name: 'asc',
      },
      distinct: ['name'],
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
    
    // Valider les données
    const validation = technologySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { name, iconUrl, category } = validation.data;
    
    // Vérifier si une technologie avec ce nom existe déjà
    const existingTechnology = await prisma.technology.findUnique({
      where: { name }
    });
    
    if (existingTechnology) {
      return NextResponse.json(
        { error: 'Une technologie avec ce nom existe déjà' },
        { status: 409 }
      );
    }
    
    // Créer la nouvelle technologie
    const technology = await prisma.technology.create({
      data: {
        name,
        slug: slugify(name),
        iconUrl: iconUrl || null
      }
    });
    
    return NextResponse.json(technology, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la technologie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la technologie' },
      { status: 500 }
    );
  }
} 
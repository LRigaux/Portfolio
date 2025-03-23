import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { slugify } from '@/lib/utils';

// Schéma de validation pour la création d'une technologie
const technologySchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  iconUrl: z.string().optional()
});

// Endpoint pour récupérer toutes les technologies utilisées
// Utilisé pour l'auto-complétion dans le formulaire de projet
export async function GET() {
  try {
    console.log('Admin API: Fetching all technologies...');
    
    const technologies = await prisma.technology.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log(`Admin API: Found ${technologies.length} technologies`);
    
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
    console.log('Admin API: Creating new technology');
    
    const body = await request.json();
    const { name, iconUrl } = body;
    
    console.log('Admin API: Request data:', { name, iconUrl });
    
    // Validation des données
    const validationResult = technologySchema.safeParse({ name, iconUrl });
    if (!validationResult.success) {
      console.log('Admin API: Validation failed', validationResult.error.format());
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const slug = slugify(name);
    console.log('Admin API: Generated slug:', slug);
    
    // Vérifier que le nom n'existe pas déjà
    const existing = await prisma.technology.findUnique({
      where: { name }
    });
    
    if (existing) {
      console.log('Admin API: Technology already exists');
      return NextResponse.json(
        { error: 'Une technologie avec ce nom existe déjà' },
        { status: 400 }
      );
    }
    
    // Création de la technologie (uniquement nom, slug et iconUrl)
    const technology = await prisma.technology.create({
      data: {
        name,
        slug,
        iconUrl
      }
    });
    
    console.log('Admin API: Technology created successfully', technology);
    
    return NextResponse.json(technology);
  } catch (error) {
    console.error('Erreur lors de la création de la technologie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la technologie' },
      { status: 500 }
    );
  }
} 
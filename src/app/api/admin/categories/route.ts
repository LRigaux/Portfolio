import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Endpoint pour récupérer toutes les catégories utilisées
// Utilisé pour l'auto-complétion dans le formulaire de projet
export async function GET() {
  try {
    // Récupérer toutes les catégories distinctes
    const categories = await prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
      distinct: ['name'],
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
} 
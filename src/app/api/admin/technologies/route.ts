import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
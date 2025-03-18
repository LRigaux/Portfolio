import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schéma de validation pour la création/mise à jour d'une compétence
const skillSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  level: z.number().min(0).max(100),
  category: z.string().min(1, 'La catégorie est requise'),
  icon: z.string().optional()
});

// Fonction pour calculer le rang basé sur le niveau
function calculateRank(level: number): string {
  if (level >= 90) return 'S';
  if (level >= 75) return 'A';
  if (level >= 50) return 'B';
  return 'C';
}

// GET - Récupérer toutes les compétences
export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: [
        { category: 'asc' },
        { level: 'desc' }
      ]
    });
    
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des compétences' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle compétence
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Valider les données
    const validation = skillSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { name, level, category, icon } = validation.data;
    
    // Calculer le rang en fonction du niveau
    const rank = calculateRank(level);
    
    // Vérifier si une compétence avec le même nom existe déjà
    const existingSkill = await prisma.skill.findFirst({
      where: { name }
    });
    
    if (existingSkill) {
      return NextResponse.json(
        { error: 'Une compétence avec ce nom existe déjà' },
        { status: 409 }
      );
    }
    
    // Créer la nouvelle compétence
    const skill = await prisma.skill.create({
      data: {
        name,
        level,
        category,
        rank,
        iconUrl: icon || null
      }
    });
    
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la compétence:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la compétence' },
      { status: 500 }
    );
  }
} 
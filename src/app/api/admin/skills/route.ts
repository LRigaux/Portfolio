import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schéma de validation pour la création d'une compétence
const skillSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  category: z.string().min(1, 'La catégorie est requise'),
  iconUrl: z.string().optional(),
  technologyId: z.string().optional().nullable()
});

// GET - Récupérer toutes les compétences
export async function GET() {
  try {
    // Récupérer toutes les compétences avec leur technologie associée
    const skills = await prisma.skill.findMany({
      include: {
        technology: true
      },
      orderBy: {
        name: 'asc'
      }
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
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Normaliser le champ technologyId
    const normalizedBody = {
      ...body,
      technologyId: body.technologyId === '' ? null : body.technologyId
    };
    
    // Validation des données
    const validationResult = skillSchema.safeParse(normalizedBody);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { name, category, iconUrl, technologyId } = validationResult.data;
    
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
    
    // Création de la compétence avec une approche simplifiée
    const skill = await prisma.$executeRaw`
      INSERT INTO Skill (id, name, category, iconUrl, technologyId, createdAt, updatedAt)
      VALUES (${crypto.randomUUID()}, ${name}, ${category}, ${iconUrl || null}, ${technologyId || null}, ${new Date().toISOString()}, ${new Date().toISOString()})
    `;
    
    // Récupérer la compétence nouvellement créée
    const newSkill = await prisma.skill.findFirst({
      where: { name },
      include: { technology: true }
    });
    
    return NextResponse.json(newSkill);
  } catch (error) {
    console.error('Erreur lors de la création de la compétence:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la compétence' },
      { status: 500 }
    );
  }
} 
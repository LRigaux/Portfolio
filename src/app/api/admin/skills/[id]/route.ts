import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schéma de validation pour la mise à jour d'une compétence
const skillSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  description: z.string().optional(),
  level: z.number().min(0).max(100),
  category: z.string().min(1, 'La catégorie est requise'),
  icon: z.string().optional()
});

// GET - Récupérer une compétence par ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const skill = await prisma.skill.findUnique({
      where: { id: params.id }
    });
    
    if (!skill) {
      return NextResponse.json(
        { error: 'Compétence non trouvée' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(skill);
  } catch (error) {
    console.error('Erreur lors de la récupération de la compétence:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la compétence' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une compétence
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    
    // Vérifier si la compétence existe
    const existingSkill = await prisma.skill.findUnique({
      where: { id: params.id }
    });
    
    if (!existingSkill) {
      return NextResponse.json(
        { error: 'Compétence non trouvée' },
        { status: 404 }
      );
    }
    
    // Extraire les données validées
    const { name, description, level, category, icon } = validation.data;
    
    // Mettre à jour la compétence
    const updatedSkill = await prisma.skill.update({
      where: { id: params.id },
      data: {
        name,
        description,
        level,
        category,
        icon
      }
    });
    
    return NextResponse.json(updatedSkill);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la compétence:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la compétence' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une compétence
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si la compétence existe
    const existingSkill = await prisma.skill.findUnique({
      where: { id: params.id }
    });
    
    if (!existingSkill) {
      return NextResponse.json(
        { error: 'Compétence non trouvée' },
        { status: 404 }
      );
    }
    
    // Supprimer la compétence
    await prisma.skill.delete({
      where: { id: params.id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression de la compétence:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la compétence' },
      { status: 500 }
    );
  }
} 
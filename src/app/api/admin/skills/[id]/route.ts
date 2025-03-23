import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schéma de validation pour la mise à jour d'une compétence
const skillUpdateSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').optional(),
  category: z.string().min(1, 'La catégorie est requise').optional(),
  iconUrl: z.string().optional().nullable(),
  technologyId: z.string().optional().nullable()
});

// GET - Récupérer une compétence spécifique
export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        technology: true
      }
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
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // Validation des données
    const validationResult = skillUpdateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { name, category, iconUrl, technologyId } = validationResult.data;
    
    // Vérifier que la compétence existe
    const skill = await prisma.skill.findUnique({
      where: { id }
    });
    
    if (!skill) {
      return NextResponse.json(
        { error: 'Compétence non trouvée' },
        { status: 404 }
      );
    }
    
    // Mettre à jour la compétence
    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        category,
        iconUrl,
        technologyId: technologyId === null ? null : technologyId || undefined
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
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Vérifier que la compétence existe
    const skill = await prisma.skill.findUnique({
      where: { id }
    });
    
    if (!skill) {
      return NextResponse.json(
        { error: 'Compétence non trouvée' },
        { status: 404 }
      );
    }
    
    // Supprimer la compétence
    await prisma.skill.delete({
      where: { id }
    });
    
    return NextResponse.json(
      { success: true, message: 'Compétence supprimée avec succès' }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la compétence:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la compétence' },
      { status: 500 }
    );
  }
} 
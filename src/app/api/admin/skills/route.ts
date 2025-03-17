import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schéma de validation
const SkillSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  level: z.number().min(0).max(100),
  rank: z.enum(["S", "A", "B", "C"], {
    errorMap: () => ({ message: "Le rang doit être S, A, B ou C" })
  }),
  category: z.string().min(2, "La catégorie doit contenir au moins 2 caractères"),
  technologyId: z.string().optional().nullable()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const rank = searchParams.get('rank');
    
    const where = {
      ...(category && { category }),
      ...(rank && { rank })
    };
    
    const skills = await prisma.skill.findMany({
      where,
      orderBy: [
        { rank: 'asc' },
        { level: 'desc' }
      ],
      include: {
        technology: true
      }
    });
    
    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Valider les données
    const validatedData = SkillSchema.parse(data);
    
    // Extraire l'ID de la technologie
    const { technologyId, ...skillData } = validatedData;
    
    // Créer la compétence
    const skill = await prisma.skill.create({
      data: {
        ...skillData,
        ...(technologyId && {
          technology: {
            connect: { id: technologyId }
          }
        })
      },
      include: {
        technology: true
      }
    });
    
    return NextResponse.json({ skill }, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create skill' },
      { status: 500 }
    );
  }
} 
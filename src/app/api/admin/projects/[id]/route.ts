import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { slugify } from '@/lib/utils';
import { PrismaClient, Prisma } from '@prisma/client';

// Schéma de validation
const ProjectSchema = z.object({
  title: z.string().min(3, "Le titre doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  content: z.string().optional(),
  rank: z.enum(["S", "A", "B", "C"], {
    errorMap: () => ({ message: "Le rang doit être S, A, B ou C" })
  }),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "published"], {
    errorMap: () => ({ message: "Le statut doit être 'draft' ou 'published'" })
  }).default("draft"),
  imageUrl: z.string().url("L'URL de l'image doit être valide").optional().nullable(),
  githubUrl: z.string().url("L'URL GitHub doit être valide").optional().nullable(),
  liveUrl: z.string().url("L'URL du site doit être valide").optional().nullable(),
  technologies: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([])
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        technologies: {
          include: {
            technology: true
          }
        },
        categories: {
          include: {
            category: true
          }
        }
      }
    });
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Formater les données pour le client
    const formattedProject = {
      ...project,
      technologies: project.technologies.map((t: { technology: { name: string } }) => t.technology.name),
      categories: project.categories.map((c: { category: { name: string } }) => c.category.name)
    };
    
    return NextResponse.json({ project: formattedProject });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    
    // Valider les données
    const validatedData = ProjectSchema.parse(data);
    
    // Vérifier si le projet existe
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id }
    });
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Extraire les technologies et catégories
    const { technologies, categories, ...projectData } = validatedData;
    
    // Mettre à jour le projet avec les relations
    const project = await prisma.$transaction(async (tx) => {
      // Mettre à jour le projet
      const updatedProject = await tx.project.update({
        where: { id: params.id },
        data: projectData
      });
      
      // Supprimer les anciennes technologies
      await tx.projectTechnology.deleteMany({
        where: { projectId: params.id }
      });
      
      // Ajouter les nouvelles technologies
      for (const techName of technologies) {
        // Trouver ou créer la technologie
        const technology = await tx.technology.upsert({
          where: { name: techName },
          update: {},
          create: {
            name: techName,
            slug: slugify(techName)
          }
        });
        
        // Lier la technologie au projet
        await tx.projectTechnology.create({
          data: {
            projectId: updatedProject.id,
            technologyId: technology.id
          }
        });
      }
      
      // Supprimer les anciennes catégories
      await tx.projectCategory.deleteMany({
        where: { projectId: params.id }
      });
      
      // Ajouter les nouvelles catégories
      for (const catName of categories) {
        // Trouver ou créer la catégorie
        const category = await tx.category.upsert({
          where: { name: catName },
          update: {},
          create: {
            name: catName,
            slug: slugify(catName)
          }
        });
        
        // Lier la catégorie au projet
        await tx.projectCategory.create({
          data: {
            projectId: updatedProject.id,
            categoryId: category.id
          }
        });
      }
      
      return updatedProject;
    });
    
    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error updating project:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si le projet existe
    const existingProject = await prisma.project.findUnique({
      where: { id: params.id }
    });
    
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }
    
    // Supprimer le projet et ses relations
    await prisma.$transaction(async (tx) => {
      // Supprimer les relations avec les technologies
      await tx.projectTechnology.deleteMany({
        where: { projectId: params.id }
      });
      
      // Supprimer les relations avec les catégories
      await tx.projectCategory.deleteMany({
        where: { projectId: params.id }
      });
      
      // Supprimer le projet
      await tx.project.delete({
        where: { id: params.id }
      });
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
} 
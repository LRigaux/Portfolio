import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { slugify } from '@/lib/utils';
import { PrismaClient, Prisma } from '@prisma/client';

/**
 * API pour la gestion des projets
 * 
 * GET: Récupère la liste des projets avec filtrage et pagination
 * POST: Crée un nouveau projet avec ses relations (technologies, catégories)
 * 
 * La validation des données est effectuée via Zod
 * Les transactions Prisma garantissent l'intégrité des données
 */

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

export async function GET(request: NextRequest) {
  try {
    if (!prisma) {
      throw new Error("Prisma client is not initialized");
    }
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    const skip = (page - 1) * limit;
    
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } }
          ]
        }
      : {};
    
    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit,
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
      }),
      prisma.project.count({ where })
    ]);
    
    // Transformer les données pour le client
    const formattedProjects = projects.map(project => ({
      ...project,
      technologies: project.technologies.map(t => t.technology.name),
      categories: project.categories.map(c => c.category.name)
    }));
    
    return NextResponse.json({
      projects: formattedProjects,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!prisma) {
      throw new Error("Prisma client is not initialized");
    }
    
    const data = await request.json();
    
    // Valider les données
    const validatedData = ProjectSchema.parse(data);
    
    // Générer un slug unique
    let slug = slugify(validatedData.title);
    const existingProject = await prisma.project.findUnique({ where: { slug } });
    
    if (existingProject) {
      // Ajouter un suffixe aléatoire si le slug existe déjà
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
    }
    
    // Extraire les technologies et catégories
    const { technologies, categories, ...projectData } = validatedData;
    
    // Créer le projet avec les relations
    const project = await prisma.$transaction(async (tx) => {
      // Créer le projet
      const newProject = await tx.project.create({
        data: {
          ...projectData,
          slug
        }
      });
      
      // Ajouter les technologies
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
            projectId: newProject.id,
            technologyId: technology.id
          }
        });
      }
      
      // Ajouter les catégories
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
            projectId: newProject.id,
            categoryId: category.id
          }
        });
      }
      
      return newProject;
    });
    
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
} 
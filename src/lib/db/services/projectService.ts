import { prisma } from '../prisma';
import { z } from 'zod';
import { slugify } from '@/lib/utils';
import { Prisma, PrismaClient } from '@prisma/client';

// Schéma de validation
export const ProjectSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10),
  content: z.string().optional(),
  imageUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional(),
  rank: z.enum(['S', 'A', 'B', 'C']),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published']).default('draft'),
  technologies: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
});

export type CreateProjectInput = z.infer<typeof ProjectSchema>;

export const projectService = {
  async getProjects({ 
    page = 1, 
    limit = 10, 
    rank, 
    featured, 
    status = 'published',
    category,
    technology
  }: { 
    page?: number; 
    limit?: number; 
    rank?: string; 
    featured?: boolean;
    status?: string;
    category?: string;
    technology?: string;
  } = {}) {
    // Utiliser un type plus générique pour where
    const where: any = {
      status,
      ...(rank && { rank }),
      ...(featured !== undefined && { featured }),
      ...(category && {
        categories: {
          some: {
            category: {
              slug: category
            }
          }
        }
      }),
      ...(technology && {
        technologies: {
          some: {
            technology: {
              slug: technology
            }
          }
        }
      })
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
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
        },
        orderBy: [
          { featured: 'desc' },
          { rank: 'asc' },
          { updatedAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where })
    ]);

    return {
      projects,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit
      }
    };
  },

  async getProjectBySlug(slug: string) {
    return prisma.project.findUnique({
      where: { slug },
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
  },

  async createProject(data: CreateProjectInput) {
    const validated = ProjectSchema.parse(data);
    const { technologies = [], categories = [], ...projectData } = validated;

    // Générer un slug unique
    const slug = slugify(validated.title);
    
    // Spécifier le type de tx
    return prisma.$transaction(async (tx: PrismaClient) => {
      // Créer le projet
      const project = await tx.project.create({
        data: {
          ...projectData,
          slug,
          technologies: {
            create: await Promise.all(technologies.map(async (techName) => {
              // Trouver ou créer la technologie
              const tech = await tx.technology.upsert({
                where: { name: techName },
                update: {},
                create: { 
                  name: techName,
                  slug: slugify(techName)
                }
              });
              
              return {
                technology: {
                  connect: { id: tech.id }
                }
              };
            }))
          },
          categories: {
            create: await Promise.all(categories.map(async (catName) => {
              // Trouver ou créer la catégorie
              const cat = await tx.category.upsert({
                where: { name: catName },
                update: {},
                create: { 
                  name: catName,
                  slug: slugify(catName)
                }
              });
              
              return {
                category: {
                  connect: { id: cat.id }
                }
              };
            }))
          }
        }
      });
      
      return project;
    });
  },

  async incrementViewCount(id: string) {
    return prisma.project.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1
        }
      }
    });
  }
}; 
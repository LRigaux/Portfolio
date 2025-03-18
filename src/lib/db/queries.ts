/**
 * Requêtes Prisma optimisées et réutilisables
 */
export const projectInclude = {
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
}; 
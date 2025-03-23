import { PrismaClient } from '@prisma/client';
import { slugify } from '../src/lib/utils';

const prisma = new PrismaClient();

async function main() {
  // Créer des technologies
  const technologies = [
    'React', 'Next.js', 'TypeScript', 'Tailwind CSS', 
    'Python', 'PyTorch', 'TensorFlow', 'Node.js',
    'NLP', 'Computer Vision', 'Dash', 'SQL',
  ];
  
  // Créer des catégories
  const categories = [
    'Web Development', 'Machine Learning', 'Deep Learning', 
    'NLP', 'Computer Vision', 'Full Stack', 'Cloud Computing', 
    'DevOps', 'ML Ops', 'Data Engineering', 'Data Science', 'AI'
  ];
  
  // Créer ou récupérer les technologies
  for (const name of technologies) {
    await prisma.technology.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug: slugify(name)
      }
    });
  }
  
  // Créer ou récupérer les catégories
  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug: slugify(name)
      }
    });
  }
  
  console.log('Base de données initialisée avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
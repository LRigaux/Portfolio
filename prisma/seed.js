const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fonction pour créer un slug à partir d'un texte
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function main() {
  // Créer des technologies
  const technologies = [
    'React', 'Next.js', 'TypeScript', 'Python', 'TensorFlow',
    'PyTorch', 'Scikit-learn', 'Pandas', 'Tailwind CSS', 'Framer Motion'
  ];

  for (const tech of technologies) {
    await prisma.technology.upsert({
      where: { name: tech },
      update: {},
      create: {
        name: tech,
        slug: slugify(tech)
      }
    });
  }

  // Créer des catégories
  const categories = [
    'Web Development', 'Data Science', 'Machine Learning',
    'Deep Learning', 'Natural Language Processing', 'Computer Vision'
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { name: cat },
      update: {},
      create: {
        name: cat,
        slug: slugify(cat)
      }
    });
  }

  // Créer des projets
  const projects = [
    {
      title: 'Système de Recommandation IA',
      description: 'Un système de recommandation basé sur l\'apprentissage profond',
      content: 'Description détaillée du projet...',
      rank: 'S',
      featured: true,
      status: 'published',
      technologies: ['Python', 'TensorFlow', 'Pandas'],
      categories: ['Machine Learning', 'Deep Learning']
    },
    {
      title: 'Portfolio Solo Leveling',
      description: 'Portfolio inspiré de l\'univers Solo Leveling',
      content: 'Description détaillée du projet...',
      rank: 'A',
      featured: true,
      status: 'published',
      technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
      categories: ['Web Development']
    }
  ];

  for (const project of projects) {
    const { technologies, categories, ...projectData } = project;
    
    await prisma.project.upsert({
      where: { slug: slugify(project.title) },
      update: {},
      create: {
        ...projectData,
        slug: slugify(project.title),
        technologies: {
          create: technologies.map(tech => ({
            technology: {
              connect: { name: tech }
            }
          }))
        },
        categories: {
          create: categories.map(cat => ({
            category: {
              connect: { name: cat }
            }
          }))
        }
      }
    });
  }

  // Créer des compétences
  const skills = [
    { name: 'React', level: 90, rank: 'S', category: 'Frontend' },
    { name: 'Python', level: 95, rank: 'S', category: 'Backend' },
    { name: 'Machine Learning', level: 85, rank: 'A', category: 'Data Science' },
    { name: 'Next.js', level: 80, rank: 'A', category: 'Frontend' },
    { name: 'TypeScript', level: 85, rank: 'A', category: 'Frontend' },
    { name: 'SQL', level: 75, rank: 'B', category: 'Database' }
  ];

  for (const skill of skills) {
    await prisma.skill.create({
      data: {
        ...skill,
        technology: skill.name === 'React' || skill.name === 'Next.js' || skill.name === 'TypeScript' || skill.name === 'Python'
          ? { connect: { name: skill.name } }
          : undefined
      }
    });
  }

  console.log('Base de données initialisée avec succès');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
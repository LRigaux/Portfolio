import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction pour créer un slug à partir d'un texte
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function main() {
  try {
    console.log('Début du seeding...');

    // Créer quelques projets
    const projects = [
      {
        title: "Portfolio Solo Leveling",
        description: "Portfolio personnel inspiré de l'univers Solo Leveling",
        content: "Ce portfolio présente mes projets et compétences dans un design inspiré de Solo Leveling.",
        rank: "S",
        featured: true,
        status: "published",
        imageUrl: "/images/projects/portfolio.jpg",
        technologies: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
        categories: ["Web Development", "Frontend"]
      },
      {
        title: "Analyse de Données",
        description: "Projet d'analyse de données avec Python",
        content: "Analyse de données utilisant pandas, matplotlib et scikit-learn.",
        rank: "A",
        featured: false,
        status: "published",
        imageUrl: "/images/projects/data-analysis.jpg"
      }
    ];

    console.log('Création des projets...');
    for (const project of projects) {
      await prisma.project.upsert({
        where: { slug: slugify(project.title) },
        update: {},
        create: {
          ...project,
          slug: slugify(project.title)
        }
      });
    }

    // Créer quelques compétences
    const skills = [
      { name: "React", level: 90, rank: "S", category: "Frontend" },
      { name: "Python", level: 85, rank: "A", category: "Backend" },
      { name: "TypeScript", level: 80, rank: "A", category: "Frontend" }
    ];

    console.log('Création des compétences...');
    for (const skill of skills) {
      await prisma.skill.create({
        data: skill
      });
    }

    // Créer une expérience
    console.log('Création des expériences...');
    await prisma.experience.create({
      data: {
        company: "Entreprise Tech",
        position: "Développeur Full Stack",
        location: "Paris, France",
        startDate: new Date("2020-01-01"),
        current: true,
        description: "Développement d'applications web avec React et Node.js."
      }
    });

    console.log('Seeding terminé avec succès!');
  } catch (error) {
    console.error('Erreur pendant le seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
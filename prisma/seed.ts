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
  
  // Exemple de projets
  const projects = [
    {
      title: "AI Image Generator",
      slug: "ai-image-generator",
      description: "Une application de génération d'images utilisant l'IA avec des modèles de diffusion stable.",
      content: "# AI Image Generator\n\nCe projet utilise des modèles de diffusion stable pour générer des images à partir de descriptions textuelles.\n\n## Technologies\n\n- Python\n- PyTorch\n- React\n- API\n\n## Fonctionnalités\n\n- Génération d'images à partir de texte\n- Personnalisation des paramètres\n- Interface utilisateur intuitive",
      rank: "S",
      featured: true,
      status: "published",
      imageUrl: "/projects/ai-image.jpg",
      githubUrl: "https://github.com/yourusername/ai-image-generator",
      liveUrl: "https://ai-image-generator.example.com",
      technologies: ["Python", "PyTorch", "React"],
      categories: ["Machine Learning", "Computer Vision"]
    },
    {
      title: "Prédiction de Séries Temporelles",
      slug: "prediction-series-temporelles",
      description: "Modèle de deep learning pour la prédiction de séries temporelles financières.",
      content: "# Prédiction de Séries Temporelles\n\nCe projet implémente des modèles LSTM et Transformer pour la prédiction de prix d'actions.\n\n## Technologies\n\n- Python\n- TensorFlow\n- Time Series Analysis\n\n## Fonctionnalités\n\n- Prédiction de prix futurs\n- Visualisation des résultats\n- Backtesting des stratégies",
      rank: "A",
      featured: true,
      status: "published",
      imageUrl: "/projects/time-series.jpg",
      githubUrl: "https://github.com/yourusername/time-series",
      liveUrl: null,
      technologies: ["Python", "TensorFlow", "Machine Learning"],
      categories: ["Machine Learning", "Deep Learning"]
    },
    {
      title: "Analyse de Sentiments",
      slug: "analyse-sentiments",
      description: "Analyse des sentiments en temps réel sur les réseaux sociaux.",
      content: "# Analyse de Sentiments\n\nCe projet analyse les sentiments des tweets en temps réel pour suivre la perception d'une marque ou d'un produit.\n\n## Technologies\n\n- Python\n- BERT\n- Twitter API\n\n## Fonctionnalités\n\n- Analyse en temps réel\n- Tableaux de bord visuels\n- Alertes automatiques",
      rank: "B",
      featured: false,
      status: "published",
      imageUrl: "/projects/sentiment.jpg",
      githubUrl: "https://github.com/yourusername/sentiment-analysis",
      liveUrl: null,
      technologies: ["Python", "NLP", "Machine Learning"],
      categories: ["NLP", "Machine Learning"]
    },
    {
      title: "Portfolio Solo Leveling",
      slug: "portfolio-solo-leveling",
      description: "Portfolio inspiré de l'univers Solo Leveling.",
      content: "# Portfolio Solo Leveling\n\nCe projet est un portfolio inspiré de l'univers Solo Leveling.",
      rank: "S",
      featured: true,
      status: "published",
      imageUrl: "/projects/sentiment.jpg",
      githubUrl: "https://github.com/LRigaux/Portfolio",
      liveUrl: "https://sentiment-demo.example.com",
      technologies: ["React", "Tailwind CSS", "Framer Motion"],
      categories: ["NLP", "Machine Learning"]
    }
  ];
  
  // Créer les projets
  for (const projectData of projects) {
    const { technologies: techNames, categories: catNames, ...projectInfo } = projectData;
    
    // Créer le projet
    const project = await prisma.project.upsert({
      where: { slug: projectInfo.slug },
      update: projectInfo,
      create: projectInfo
    });
    
    // Lier les technologies
    for (const techName of techNames) {
      const technology = await prisma.technology.findUnique({
        where: { name: techName }
      });
      
      if (technology) {
        await prisma.projectTechnology.upsert({
          where: {
            projectId_technologyId: {
              projectId: project.id,
              technologyId: technology.id
            }
          },
          update: {},
          create: {
            projectId: project.id,
            technologyId: technology.id
          }
        });
      }
    }
    
    // Lier les catégories
    for (const catName of catNames) {
      const category = await prisma.category.findUnique({
        where: { name: catName }
      });
      
      if (category) {
        await prisma.projectCategory.upsert({
          where: {
            projectId_categoryId: {
              projectId: project.id,
              categoryId: category.id
            }
          },
          update: {},
          create: {
            projectId: project.id,
            categoryId: category.id
          }
        });
      }
    }
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
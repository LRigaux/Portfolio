import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Vérification de l'existence du projet
    const projectId = params.id;
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Projet non trouvé' },
        { status: 404 }
      );
    }

    // Pour cette version, nous simulons les statistiques
    // car nous n'avons pas encore les modèles de statistiques
    
    // Génération de nombres aléatoires pour la démo
    const viewCount = Math.floor(Math.random() * 1000) + 50;
    const gitHubClicks = Math.floor(Math.random() * 200) + 10;
    const liveClicks = Math.floor(Math.random() * 300) + 20;
    
    // Date de dernière vue (aujourd'hui moins un nombre aléatoire d'heures)
    const lastViewedDate = new Date();
    lastViewedDate.setHours(lastViewedDate.getHours() - Math.floor(Math.random() * 72));

    // Construction des données de statistiques
    const stats = {
      viewCount,
      clicks: {
        github: gitHubClicks,
        live: liveClicks,
      },
      lastViewed: lastViewedDate.toISOString(),
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques :', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
} 
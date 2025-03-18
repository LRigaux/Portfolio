import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Mettre à jour tous les messages non lus
    const { count } = await prisma.contact.updateMany({
      where: { status: 'unread' },
      data: { status: 'read' }
    });
    
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des messages' },
      { status: 500 }
    );
  }
} 
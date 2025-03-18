import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'IDs des messages invalides' },
        { status: 400 }
      );
    }
    
    // Supprimer les messages
    const { count } = await prisma.contact.deleteMany({
      where: {
        id: { in: ids }
      }
    });
    
    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('Erreur lors de la suppression des messages:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression des messages' },
      { status: 500 }
    );
  }
} 
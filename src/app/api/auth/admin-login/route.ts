import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateToken } from '@/lib/auth';

// Normalement, ces informations seraient dans la base de données, mais pour simplifier le développement
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin'; // À changer pour un mot de passe sécurisé en production

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    
    // Vérifier les identifiants
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      );
    }
    
    // Générer un token JWT
    const token = await generateToken({ username });
    
    // Configurer le cookie (7 jours d'expiration)
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60, // 7 jours en secondes
      path: '/'
    };
    
    // Définir le cookie
    cookies().set('admin_token', token, cookieOptions);
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la connexion admin:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { signToken, checkAdminPassword, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Vérifier le mot de passe
    if (!checkAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 401 }
      );
    }
    
    // Générer un token JWT
    const token = await signToken();
    
    // Définir le cookie d'authentification
    setAuthCookie(token);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la connexion' },
      { status: 500 }
    );
  }
} 
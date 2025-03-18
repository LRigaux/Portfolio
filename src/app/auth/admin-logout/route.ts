import { logout } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  // Supprimer le cookie d'authentification
  logout();
  
  // Rediriger vers la page d'accueil
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
}
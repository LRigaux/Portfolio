import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuth, verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  // IMPORTANT: Vérifier le chemin exact pour éviter la redirection en boucle
  const { pathname } = request.nextUrl;
  
  // Exclure explicitement la page de login et les routes d'authentification
  if (pathname === '/admin/auth/admin-login'|| 
      pathname.startsWith('/api/admin/auth/login')) {
    return NextResponse.next();
  }
  
  // Vérifier si la route est une route d'administration
  if (pathname.startsWith('/admin')) {
    // Vérifier l'authentification
    const isAuthenticated = verifyAuth(request);
    
    if (!isAuthenticated) {
      // Rediriger vers la page de connexion avec le paramètre "from" pour rediriger après connexion
      const loginUrl = new URL('/admin/auth/admin-login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Protéger les API admin
  if (pathname.startsWith('/api/admin') && 
      !pathname.startsWith('/api/admin/auth/login')) {
    
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    try {
      // Utiliser verifyToken au lieu de verifyJWT
      const isValid = await verifyToken(token);
      if (!isValid) {
        throw new Error('Invalid token');
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }
  
  // Ne pas tracker les requêtes API ou les assets statiques
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Au lieu d'utiliser Prisma directement, faites une requête API
  try {
    // Enregistrer la visite via une API route
    const visitData = {
      page: pathname,
      referrer: request.headers.get('referer') || undefined,
      userAgent: request.headers.get('user-agent') || undefined,
      ip: process.env.NODE_ENV === 'production'
        ? hashIP(request.ip || '')
        : request.ip
    };

    // En production, vous pouvez faire une requête fetch à votre propre API
    // Mais pour éviter de bloquer la navigation, faites-le de manière non bloquante
    if (process.env.NODE_ENV === 'production') {
      // Utiliser une requête non bloquante
      fetch('/api/analytics/track-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitData),
      }).catch(err => console.error('Failed to track visit:', err));
    } else {
      console.log('Visit tracked (dev):', visitData);
    }
  } catch (error) {
    console.error('Error tracking visit:', error);
  }

  return NextResponse.next();
}

// Fonction pour anonymiser les IPs
function hashIP(ip: string): string {
  // En production, utilisez une fonction de hachage réelle
  return ip.split('.').slice(0, 2).join('.') + '.x.x';
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ],
}; 
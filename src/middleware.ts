import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';

export async function middleware(request: NextRequest) {
  // Protéger les routes admin sauf la page de login
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
    
    try {
      const payload = await verifyJWT(token);
      if (!payload) {
        throw new Error('Invalid token');
      }
    } catch (error) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }
  
  // Protéger les API admin
  if (request.nextUrl.pathname.startsWith('/api/admin') && 
      !request.nextUrl.pathname.startsWith('/api/admin/auth/login')) {
    
    const token = request.cookies.get('admin_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    try {
      const payload = await verifyJWT(token);
      if (!payload) {
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
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Au lieu d'utiliser Prisma directement, faites une requête API
  try {
    // Enregistrer la visite via une API route
    const visitData = {
      page: request.nextUrl.pathname,
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
  matcher: ['/admin/:path*', '/api/admin/:path*', '((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import * as jose from 'jose';

// Clé secrète pour les JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const TOKEN_NAME = 'admin_token';

/**
 * Génère un token JWT pour l'authentification admin
 * 
 * @returns {Promise<string>} Token JWT signé
 */
export async function signToken(): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET);
  
  const token = await new jose.SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
  
  return token;
}

/**
 * Vérifie si un token JWT est valide
 * 
 * @param {string} token - Le token JWT à vérifier
 * @returns {Promise<boolean>} True si le token est valide, sinon False
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    await jose.jwtVerify(token, secret);
    return true;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

/**
 * Vérifie si une requête est authentifiée via JWT
 * 
 * @param {NextRequest} request - La requête Next.js à vérifier
 * @returns {boolean} True si l'utilisateur est authentifié, sinon False
 */
export function verifyAuth(request: NextRequest): boolean {
  const token = request.cookies.get(TOKEN_NAME)?.value;
  
  if (!token) {
    return false;
  }
  
  // Vérification synchrone simplifiée pour le middleware
  try {
    // Vérifier l'expiration du token
    const payload = jose.decodeJwt(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (!payload.exp || payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return false;
  }
}

/**
 * Définit le cookie d'authentification
 * 
 * @param {string} token - Le token JWT à stocker
 */
export function setAuthCookie(token: string): void {
  cookies().set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 // 24 heures
  });
}

/**
 * Supprime le cookie d'authentification (déconnexion)
 */
export function logout(): void {
  cookies().delete(TOKEN_NAME);
}

/**
 * Vérifie si le mot de passe admin est correct
 * 
 * @param {string} password - Le mot de passe à vérifier
 * @returns {boolean} True si le mot de passe est correct, sinon False
 */
export function checkAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    console.error('ADMIN_PASSWORD environment variable is not set');
    return false;
  }
  
  return password === adminPassword;
} 
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { SignJWT, jwtVerify, decodeJwt } from 'jose';

// Clé secrète pour les JWT
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'un_secret_temporaire_pour_le_developpement'
);
const TOKEN_NAME = 'admin_token';

export interface TokenPayload {
  username: string;
  exp?: number;
}

/**
 * Génère un token JWT pour l'authentification admin
 * 
 * @param {TokenPayload} payload - Les informations à inclure dans le token
 * @returns {Promise<string>} Token JWT signé
 */
export async function generateToken(payload: TokenPayload): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60; // 7 jours
  
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(JWT_SECRET);
  
  return token;
}

/**
 * Vérifie la validité d'un token JWT
 * 
 * @param {string} token - Le token JWT à vérifier
 * @returns {Promise<boolean>} true si le token est valide, false sinon
 */
export async function verifyToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Vérifier que le token n'est pas expiré
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur de vérification du token:', error);
    return false;
  }
}

/**
 * Extrait les informations du payload d'un token JWT
 * 
 * @param {string} token - Le token JWT à analyser
 * @returns {Promise<TokenPayload | null>} Les informations extraites du token ou null si le token est invalide
 */
export async function getTokenPayload(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as TokenPayload;
  } catch (error) {
    console.error('Erreur lors de l\'extraction du payload:', error);
    return null;
  }
}

/**
 * Vérifie l'authentification d'une requête pour le middleware
 * 
 * @param {NextRequest} request - La requête entrante
 * @returns {boolean} true si authentifié, false sinon
 */
export function verifyAuth(request: NextRequest): boolean {
  const token = request.cookies.get(TOKEN_NAME)?.value;
  
  if (!token) {
    return false;
  }
  
  // Vérification synchrone simplifiée pour le middleware
  try {
    // Vérifier l'expiration du token
    const payload = decodeJwt(token);
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
  cookies().set(TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/',
  });
}

/**
 * Supprime le cookie d'authentification
 */
export function logout(): void {
  cookies().delete(TOKEN_NAME);
}

/**
 * Vérifie si le mot de passe admin est correct
 * 
 * @param {string} password - Le mot de passe à vérifier
 * @returns {boolean} true si le mot de passe est correct, false sinon
 */
export function checkAdminPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
  return password === adminPassword;
} 
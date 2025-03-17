import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import * as jose from 'jose';

// Clé secrète pour signer les JWT
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_change_this_in_production'
);

export async function signJWT(payload: any) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Expire après 24 heures
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function getAuthToken() {
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token');
  return token?.value;
}

export async function isAuthenticated() {
  const token = await getAuthToken();
  if (!token) return false;
  
  const payload = await verifyJWT(token);
  return !!payload;
}

export async function authenticateUser(password: string) {
  // En production, utilisez une méthode plus sécurisée comme bcrypt
  if (password !== process.env.ADMIN_PASSWORD) {
    return false;
  }
  
  const token = await signJWT({ role: 'admin' });
  return token;
}

export function logout() {
  cookies().delete('admin_token');
} 
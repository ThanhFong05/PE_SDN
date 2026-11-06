import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export const COOKIE_NAME = 'session_token';
const AUTH_SECRET = process.env.AUTH_SECRET || 'readlog-super-secret-auth-key-2026';
const SECRET_KEY = new TextEncoder().encode(AUTH_SECRET);

export interface SessionUser {
  id: string;
  email: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: SessionUser): Promise<string> {
  return new SignJWT({ id: payload.id, email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);
}

export async function verifyToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    if (typeof payload.id === 'string' && typeof payload.email === 'string') {
      return { id: payload.id, email: payload.email };
    }
    return null;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function getSessionUser(req?: Request): Promise<SessionUser | null> {
  // 1. Try reading from request headers if available (direct HTTP calls)
  if (req) {
    const cookieHeader = req.headers.get('cookie');
    if (cookieHeader) {
      const match = cookieHeader
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${COOKIE_NAME}=`));
      if (match) {
        const token = match.substring(COOKIE_NAME.length + 1);
        const user = await verifyToken(token);
        if (user) return user;
      }
    }
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = await verifyToken(token);
      if (user) return user;
    }
  }

  // 2. Fall back to Next.js cookies()
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      return await verifyToken(token);
    }
  } catch {
    // cookies() might not be available in some contexts
  }

  return null;
}

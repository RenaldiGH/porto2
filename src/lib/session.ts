import { SignJWT, jwtVerify } from "jose";

// File ini SENGAJA dipisah dari auth.ts (yang pakai bcrypt) karena
// middleware.ts jalan di Edge Runtime, yang tidak mendukung modul Node.js
// seperti bcryptjs. jose aman dipakai di Edge Runtime.

export const COOKIE_NAME = "admin_session";
const SESSION_DURATION = "7d";

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET belum diisi di .env");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(email: string): Promise<string> {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(SESSION_DURATION)
    .sign(getSecretKey());
}

export async function verifySessionToken(token: string): Promise<{ email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    if (payload.role !== "admin" || typeof payload.email !== "string") return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

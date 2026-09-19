import bcrypt from "bcryptjs";

// Dipakai HANYA di API route login (Node.js runtime) — jangan diimpor dari
// middleware.ts atau file yang jalan di Edge Runtime. Untuk sesi/JWT,
// pakai src/lib/session.ts.

export async function verifyCredentials(email: string, password: string): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !adminHash) return false;
  if (email.trim().toLowerCase() !== adminEmail.trim().toLowerCase()) return false;
  return bcrypt.compare(password, adminHash);
}

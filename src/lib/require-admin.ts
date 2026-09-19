import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME } from "@/lib/session";

/**
 * Helper dipakai di API routes yang tidak otomatis lewat middleware
 * (mis. /api/admin/**) — mengembalikan session kalau valid, atau null.
 */
export async function requireAdminSession() {
  const token = cookies().get(COOKIE_NAME)?.value;
  return token ? verifySessionToken(token) : null;
}

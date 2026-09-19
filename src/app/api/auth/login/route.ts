import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials } from "@/lib/auth";
import { createSessionToken, COOKIE_NAME } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
    }

    const isValid = await verifyCredentials(String(email), String(password));
    if (!isValid) {
      return NextResponse.json({ error: "Email atau password salah" }, { status: 401 });
    }

    const token = await createSessionToken(String(email));
    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error("POST /api/auth/login failed:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

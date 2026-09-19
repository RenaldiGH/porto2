import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const socials = await prisma.socialLink.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(socials);
  } catch (error) {
    console.error("GET /api/socials failed:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

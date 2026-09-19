import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const profile = await prisma.profile.findFirst({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/profile failed:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

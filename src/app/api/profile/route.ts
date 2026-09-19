import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";

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

export async function PATCH(request: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const existing = await prisma.profile.findFirst();
    if (!existing) {
      return NextResponse.json({ error: "Profile belum ada, jalankan seed dulu" }, { status: 404 });
    }

    const data: Record<string, unknown> = {};
    const fields = [
      "name", "origin", "role", "passion", "status", "location",
      "headline", "subHeadline", "bio", "quote",
    ] as const;
    for (const field of fields) {
      if (body[field] !== undefined) data[field] = String(body[field]);
    }
    if (body.experienceYears !== undefined) data.experienceYears = Number(body.experienceYears);

    const updated = await prisma.profile.update({ where: { id: existing.id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/profile failed:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 400 });
  }
}

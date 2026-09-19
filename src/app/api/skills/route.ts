import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const skills = await prisma.skillBadge.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(skills);
  } catch (error) {
    console.error("GET /api/skills failed:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const count = await prisma.skillBadge.count();
    const skill = await prisma.skillBadge.create({
      data: {
        label: String(body.label),
        iconUrl: body.iconUrl ? String(body.iconUrl) : null,
        order: Number(body.order ?? count),
      },
    });
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error("POST /api/skills failed:", error);
    return NextResponse.json({ error: "Failed to create skill" }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await prisma.techCategory.findMany({
      orderBy: { order: "asc" },
      include: { items: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/tech-stack failed:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category = await prisma.techCategory.create({
      data: {
        title: String(body.title),
        badge: String(body.badge),
        order: Number(body.order ?? 0),
      },
      include: { items: true },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("POST /api/tech-stack failed:", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 400 });
  }
}
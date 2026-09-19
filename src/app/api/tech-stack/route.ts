import { NextResponse } from "next/server";
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

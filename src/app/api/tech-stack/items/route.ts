import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const item = await prisma.techItem.create({
      data: {
        categoryId: String(body.categoryId),
        name: String(body.name),
        tag: String(body.tag),
        description: String(body.description || ""),
        order: Number(body.order ?? 0),
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("POST /api/tech-stack/items failed:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 400 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.techItem.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/tech-stack/items/[id] failed:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 400 });
  }
}
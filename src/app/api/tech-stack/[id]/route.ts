import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // items ikut terhapus otomatis (onDelete: Cascade di schema.prisma)
    await prisma.techCategory.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/tech-stack/[id] failed:", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 400 });
  }
}

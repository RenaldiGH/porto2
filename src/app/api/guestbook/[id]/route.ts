import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.guestbookEntry.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/guestbook/[id] failed:", error);
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 400 });
  }
}

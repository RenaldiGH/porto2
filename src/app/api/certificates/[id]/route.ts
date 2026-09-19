import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.certificate.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/certificates/[id] failed:", error);
    return NextResponse.json({ error: "Failed to delete certificate" }, { status: 400 });
  }
}

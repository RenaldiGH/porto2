import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(entries);
  } catch (error) {
    console.error("GET /api/guestbook failed:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim().slice(0, 80);
    const message = String(body?.message ?? "").trim().slice(0, 500);

    if (!name || !message) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }

    const entry = await prisma.guestbookEntry.create({
      data: { name, message },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("POST /api/guestbook failed:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
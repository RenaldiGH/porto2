import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const certificates = await prisma.certificate.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(certificates);
  } catch (error) {
    console.error("GET /api/certificates failed:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const certificate = await prisma.certificate.create({
      data: {
        title: String(body.title),
        issuer: String(body.issuer),
        issueDate: body.issueDate ? new Date(body.issueDate) : null,
        credentialUrl: body.credentialUrl || null,
        imageUrl: body.imageUrl || null,
        description: body.description || null,
        order: Number(body.order ?? 0),
      },
    });
    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error("POST /api/certificates failed:", error);
    return NextResponse.json({ error: "Failed to create certificate" }, { status: 400 });
  }
}

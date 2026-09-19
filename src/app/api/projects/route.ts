import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: "asc" },
      include: { technologies: true },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects failed:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

// Dipakai dari admin/dashboard internal (belum ada UI-nya) untuk menambah
// proyek baru saat mengisi data asli (Fase 2 roadmap).
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const project = await prisma.project.create({
      data: {
        slug: String(body.slug),
        name: String(body.name),
        description: String(body.description),
        status: body.status ?? "PLANNED",
        repoUrl: body.repoUrl ?? null,
        demoUrl: body.demoUrl ?? null,
        footnote: body.footnote ?? null,
        isFeatured: Boolean(body.isFeatured ?? false),
        order: Number(body.order ?? 0),
        technologies: {
          connectOrCreate: (body.technologies ?? []).map((name: string) => ({
            where: { name },
            create: { name },
          })),
        },
      },
      include: { technologies: true },
    });
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects failed:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 400 });
  }
}

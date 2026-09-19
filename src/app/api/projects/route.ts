import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const publishedOnly = request.nextUrl.searchParams.get("all") !== "true";
    const projects = await prisma.project.findMany({
      where: publishedOnly ? { isPublished: true } : undefined,
      orderBy: { order: "asc" },
      include: { technologies: true },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("GET /api/projects failed:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
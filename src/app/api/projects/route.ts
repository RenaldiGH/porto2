import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/require-admin";

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { technologies: true },
    });
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (error) {
    console.error("GET /api/projects/[id] failed:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.name !== undefined) data.name = String(body.name);
    if (body.slug !== undefined) data.slug = String(body.slug);
    if (body.description !== undefined) data.description = String(body.description);
    if (body.status !== undefined) data.status = String(body.status);
    if (body.repoUrl !== undefined) data.repoUrl = body.repoUrl || null;
    if (body.repoFullName !== undefined) data.repoFullName = body.repoFullName || null;
    if (body.branch !== undefined) data.branch = body.branch || null;
    if (body.demoUrl !== undefined) data.demoUrl = body.demoUrl || null;
    if (body.footnote !== undefined) data.footnote = body.footnote || null;
    if (body.isFeatured !== undefined) data.isFeatured = Boolean(body.isFeatured);
    if (body.isPublished !== undefined) data.isPublished = Boolean(body.isPublished);
    if (body.order !== undefined) data.order = Number(body.order);

    if (Array.isArray(body.technologies)) {
      data.technologies = {
        set: [],
        connectOrCreate: body.technologies.map((name: string) => ({
          where: { name },
          create: { name },
        })),
      };
    }

    const project = await prisma.project.update({
      where: { id: params.id },
      data,
      include: { technologies: true },
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error("PATCH /api/projects/[id] failed:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/projects/[id] failed:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 400 });
  }
}

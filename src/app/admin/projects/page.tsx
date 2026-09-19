import { prisma } from "@/lib/prisma";
import ProjectsTable from "@/components/admin/ProjectsTable";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { order: "asc" },
    include: { technologies: true },
  });

  const serializable = projects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    status: p.status,
    repoUrl: p.repoUrl,
    repoFullName: p.repoFullName,
    branch: p.branch,
    isPublished: p.isPublished,
    order: p.order,
    technologies: p.technologies.map((t) => t.name),
  }));

  return <ProjectsTable initialProjects={serializable} />;
}

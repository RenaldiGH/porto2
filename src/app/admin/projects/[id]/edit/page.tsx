import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { technologies: true },
  });

  if (!project) notFound();

  return (
    <ProjectForm
      initial={{
        id: project.id,
        name: project.name,
        slug: project.slug,
        description: project.description,
        status: project.status,
        repoUrl: project.repoUrl ?? "",
        repoFullName: project.repoFullName ?? "",
        branch: project.branch ?? "",
        demoUrl: project.demoUrl ?? "",
        imageUrl: project.imageUrl ?? "",
        footnote: project.footnote ?? "",
        isFeatured: project.isFeatured,
        isPublished: project.isPublished,
        order: project.order,
        technologies: project.technologies.map((t) => t.name),
      }}
    />
  );
}

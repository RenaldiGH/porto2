import { prisma } from "@/lib/prisma";
import TechStackAdminList from "@/components/admin/TechStackAdminList";
import SkillIconsAdminList from "@/components/admin/SkillIconsAdminList";

export const dynamic = "force-dynamic";

export default async function AdminTechStackPage() {
  const [categories, skills] = await Promise.all([
    prisma.techCategory.findMany({
      orderBy: { order: "asc" },
      include: { items: { orderBy: { order: "asc" } } },
    }),
    prisma.skillBadge.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="space-y-12 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Tech Stack</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Kelola kategori dan item yang tampil di section &quot;Tech Stack Breakdown&quot;, tanpa perlu edit kode.
        </p>
      </div>
      <TechStackAdminList initialCategories={categories} />

      <div className="pt-8 border-t border-zinc-800">
        <SkillIconsAdminList initialSkills={skills} />
      </div>
    </div>
  );
}

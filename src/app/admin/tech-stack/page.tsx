import { prisma } from "@/lib/prisma";
import TechStackAdminList from "@/components/admin/TechStackAdminList";

export const dynamic = "force-dynamic";

export default async function AdminTechStackPage() {
  const categories = await prisma.techCategory.findMany({
    orderBy: { order: "asc" },
    include: { items: { orderBy: { order: "asc" } } },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Tech Stack</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Kelola kategori dan item yang tampil di section &quot;Tech Stack&quot; portofolio, tanpa perlu edit kode.
        </p>
      </div>
      <TechStackAdminList initialCategories={categories} />
    </div>
  );
}

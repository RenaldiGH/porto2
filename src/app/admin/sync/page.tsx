import { prisma } from "@/lib/prisma";
import GitHubSyncPanel from "@/components/admin/GitHubSyncPanel";

export const dynamic = "force-dynamic";

export default async function AdminSyncPage() {
  const projects = await prisma.project.findMany({
    where: { repoFullName: { not: null } },
    select: { repoFullName: true },
  });
  const importedRepoNames = projects.map((p) => p.repoFullName).filter(Boolean) as string[];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Sinkronisasi Repo</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Tarik daftar repository GitHub kamu, lalu impor sebagai proyek di portofolio.
        </p>
      </div>
      <GitHubSyncPanel importedRepoNames={importedRepoNames} />
    </div>
  );
}

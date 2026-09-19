"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Plus, ExternalLink, Pencil, Trash2, Eye, FolderOpen, RotateCcw } from "lucide-react";

interface ProjectRow {
  id: string;
  name: string;
  slug: string;
  status: string;
  repoUrl: string | null;
  repoFullName: string | null;
  branch: string | null;
  isPublished: boolean;
  order: number;
  technologies: string[];
}

type TabId = "all" | "published" | "draft";

export default function ProjectsTable({ initialProjects }: { initialProjects: ProjectRow[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initialProjects);
  const [tab, setTab] = useState<TabId>("all");
  const [query, setQuery] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  const publishedCount = projects.filter((p) => p.isPublished).length;
  const draftCount = projects.filter((p) => !p.isPublished).length;

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (tab === "published" && !p.isPublished) return false;
      if (tab === "draft" && p.isPublished) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.repoFullName ?? "").toLowerCase().includes(q);
      }
      return true;
    });
  }, [projects, tab, query]);

  async function togglePublish(id: string, current: boolean) {
    setPendingId(id);
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, isPublished: !current } : p)));
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: !current }),
      });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      // revert on failure
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, isPublished: current } : p)));
    } finally {
      setPendingId(null);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus proyek "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setProjects((prev) => prev.filter((p) => p.id !== id));
      router.refresh();
    } catch {
      alert("Gagal menghapus proyek. Coba lagi.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Kelola Proyek Portofolio</h1>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Atur visibilitas repositori, konfigurasi live demo, dan urutan tampilan proyek pada portofolio Anda.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-zinc-800 bg-surface flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 mb-1">Tayang di Portofolio</div>
            <div className="text-2xl font-extrabold text-white font-mono">{publishedCount}</div>
            <div className="text-xs text-emerald-400 mt-0.5">Proyek Aktif</div>
          </div>
          <div className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-400">
            <Eye className="w-4 h-4" />
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-zinc-800 bg-surface flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 mb-1">Total Draft / Repositori</div>
            <div className="text-2xl font-extrabold text-white font-mono">{projects.length}</div>
            <div className="text-xs text-zinc-500 mt-0.5">Tersimpan</div>
          </div>
          <div className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-400">
            <FolderOpen className="w-4 h-4" />
          </div>
        </div>
        <div className="p-5 rounded-2xl border border-zinc-800 bg-surface flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500 mb-1">Sinkronisasi Repo</div>
            <div className="text-sm font-semibold text-zinc-300 mt-1">Belum tersambung</div>
            <Link href="/admin/sync" className="text-xs text-zinc-500 hover:text-white underline mt-0.5 inline-block">
              Atur sekarang
            </Link>
          </div>
          <div className="w-10 h-10 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-400">
            <RotateCcw className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="inline-flex p-1 rounded-xl border border-zinc-800 bg-surface">
          {([
            { id: "all", label: `Semua (${projects.length})` },
            { id: "published", label: `Tayang di Web (${publishedCount})` },
            { id: "draft", label: `Draft (${draftCount})` },
          ] as { id: TabId; label: string }[]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-colors ${
                tab === t.id ? "bg-white text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari proyek atau repository..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface border border-zinc-800 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-mono uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
                <th className="px-5 py-3 font-medium">Urutan</th>
                <th className="px-5 py-3 font-medium">Proyek & Repositori</th>
                <th className="px-5 py-3 font-medium">Tech Stack</th>
                <th className="px-5 py-3 font-medium">Status Portofolio</th>
                <th className="px-5 py-3 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-zinc-500 text-sm">
                    Tidak ada proyek yang cocok.
                  </td>
                </tr>
              )}
              {filtered.map((project) => (
                <tr key={project.id} className="border-b border-zinc-900 hover:bg-black/40 transition-colors">
                  <td className="px-5 py-4 align-top">
                    <span className="w-8 h-8 rounded-lg bg-black border border-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-400">
                      {project.order}
                    </span>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{project.name}</span>
                      {project.branch && (
                        <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-800 text-zinc-400">
                          {project.branch}
                        </span>
                      )}
                    </div>
                    {project.repoFullName && (
                      <div className="text-xs text-zinc-500 font-mono mt-0.5">{project.repoFullName}</div>
                    )}
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex flex-wrap gap-1.5">
                      {project.technologies.map((tech) => (
                        <span key={tech} className="px-2 py-0.5 text-[11px] rounded-md bg-zinc-800/70 text-zinc-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <button
                      onClick={() => togglePublish(project.id, project.isPublished)}
                      disabled={pendingId === project.id}
                      className="flex items-center gap-2 disabled:opacity-50"
                    >
                      <span
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          project.isPublished ? "bg-emerald-500" : "bg-zinc-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            project.isPublished ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                      <span className={`text-xs font-semibold ${project.isPublished ? "text-emerald-400" : "text-zinc-500"}`}>
                        {project.isPublished ? "Tayang" : "Draft"}
                      </span>
                    </button>
                  </td>
                  <td className="px-5 py-4 align-top">
                    <div className="flex items-center justify-end gap-1">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="Buka repositori"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id, project.name)}
                        disabled={pendingId === project.id}
                        className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors disabled:opacity-50"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-zinc-800 text-xs text-zinc-500 font-mono">
          Menampilkan {filtered.length} dari {projects.length} proyek
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Github,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertTriangle,
  Lock,
  GitBranch,
} from "lucide-react";

interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  default_branch: string;
  language: string | null;
  private: boolean;
  fork: boolean;
  updated_at: string;
  homepage: string | null;
}

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function GitHubSyncPanel({ importedRepoNames }: { importedRepoNames: string[] }) {
  const router = useRouter();
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [imported, setImported] = useState<Set<string>>(new Set(importedRepoNames));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [importingId, setImportingId] = useState<number | null>(null);

  async function loadData() {
    setLoading(true);
    setError(null);
    try {
      const [userRes, reposRes] = await Promise.all([
        fetch("/api/admin/github/user"),
        fetch("/api/admin/github/repos"),
      ]);
      const userData = await userRes.json();
      const reposData = await reposRes.json();

      if (!userRes.ok) throw new Error(userData.error || "Gagal menghubungi GitHub");
      if (!reposRes.ok) throw new Error(reposData.error || "Gagal mengambil daftar repo");

      setUser(userData);
      setRepos(reposData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleImport(repo: Repo) {
    setImportingId(repo.id);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: repo.name,
          slug: slugify(repo.name),
          description: repo.description || "Belum ada deskripsi — edit di menu Kelola Proyek.",
          status: "PLANNED",
          repoUrl: repo.html_url,
          repoFullName: repo.full_name,
          branch: repo.default_branch,
          demoUrl: repo.homepage || null,
          isFeatured: false,
          isPublished: false, // aman: draft dulu, admin publish manual setelah cek/edit
          order: 99,
          technologies: repo.language ? [repo.language] : [],
        }),
      });
      if (!res.ok) throw new Error("Gagal mengimpor repo");
      setImported((prev) => new Set(prev).add(repo.full_name));
      router.refresh();
    } catch {
      alert(`Gagal mengimpor "${repo.name}". Coba lagi.`);
    } finally {
      setImportingId(null);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center rounded-2xl border border-zinc-800 bg-surface/50 space-y-2">
        <RefreshCw className="w-6 h-6 mx-auto text-zinc-600 animate-spin" />
        <p className="text-sm text-zinc-500">Menghubungi GitHub...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-2xl border border-amber-900/50 bg-amber-950/20 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Belum tersambung ke GitHub</span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">{error}</p>
        <div className="text-xs text-zinc-500 bg-black/40 rounded-lg p-3 space-y-1 font-mono">
          <p>1. Buka github.com/settings/tokens → Generate new token (classic atau fine-grained)</p>
          <p>2. Kasih akses scope &quot;repo&quot; (read)</p>
          <p>3. Salin tokennya, isi ke .env: GITHUB_TOKEN=&quot;ghp_xxxxx&quot;</p>
          <p>4. Restart server (`npm run dev`) atau redeploy di Vercel</p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-xs font-mono text-zinc-300 hover:border-zinc-500 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Coba Lagi</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between p-4 rounded-2xl border border-zinc-800 bg-surface">
        <div className="flex items-center gap-3">
          {user?.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar_url} alt={user.login} className="w-9 h-9 rounded-full border border-zinc-700" />
          )}
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
              <Github className="w-4 h-4" />
              <span>@{user?.login}</span>
            </div>
            <div className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Terhubung
            </div>
          </div>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-surface overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-800 text-xs font-mono text-zinc-500">
          {repos.length} repository ditemukan
        </div>
        <div className="divide-y divide-zinc-900">
          {repos.map((repo) => {
            const isImported = imported.has(repo.full_name);
            return (
              <div key={repo.id} className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-white truncate">{repo.name}</span>
                    {repo.private && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        <Lock className="w-2.5 h-2.5" /> private
                      </span>
                    )}
                    {repo.fork && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500">fork</span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      <GitBranch className="w-2.5 h-2.5" /> {repo.default_branch}
                    </span>
                    {repo.language && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                        {repo.language}
                      </span>
                    )}
                  </div>
                  {repo.description && (
                    <p className="text-xs text-zinc-500 mt-1 truncate">{repo.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleImport(repo)}
                  disabled={isImported || importingId === repo.id}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                    isImported
                      ? "text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 cursor-default"
                      : "bg-white text-black hover:bg-zinc-200 disabled:opacity-60"
                  }`}
                >
                  {isImported ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Sudah diimpor</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>{importingId === repo.id ? "Mengimpor..." : "Impor"}</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-zinc-600">
        Repo yang diimpor otomatis berstatus <strong className="text-zinc-400">Draft</strong> — cek & lengkapi
        deskripsinya dulu di menu <strong className="text-zinc-400">Kelola Proyek</strong> sebelum di-tayangkan.
      </p>
    </div>
  );
}

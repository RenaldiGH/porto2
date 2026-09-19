"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export interface ProjectFormValues {
  id?: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  repoUrl: string;
  repoFullName: string;
  branch: string;
  demoUrl: string;
  footnote: string;
  isFeatured: boolean;
  isPublished: boolean;
  order: number;
  technologies: string[];
}

const statusOptions = [
  { value: "PLANNED", label: "Planned" },
  { value: "IN_PRODUCTION", label: "In Production" },
  { value: "INTERNAL_TOOL", label: "Internal Tool" },
  { value: "ARCHIVED", label: "Archived" },
];

export default function ProjectForm({ initial }: { initial?: ProjectFormValues }) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);
  const [values, setValues] = useState<ProjectFormValues>(
    initial ?? {
      name: "",
      slug: "",
      description: "",
      status: "PLANNED",
      repoUrl: "",
      repoFullName: "",
      branch: "main",
      demoUrl: "",
      footnote: "",
      isFeatured: false,
      isPublished: true,
      order: 0,
      technologies: [],
    }
  );
  const [techInput, setTechInput] = useState(initial?.technologies.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const technologies = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = { ...values, technologies };

    try {
      const res = await fetch(isEdit ? `/api/projects/${initial!.id}` : "/api/projects", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Gagal menyimpan proyek");
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan proyek");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/projects" className="p-2 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          {isEdit ? "Edit Proyek" : "Tambah Proyek"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-zinc-800 bg-surface space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nama Proyek">
            <input
              required
              value={values.name}
              onChange={(e) => update("name", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Slug (URL-friendly)">
            <input
              required
              value={values.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="modern-web-app"
              className="input"
            />
          </Field>
        </div>

        <Field label="Deskripsi">
          <textarea
            required
            rows={3}
            value={values.description}
            onChange={(e) => update("description", e.target.value)}
            className="input resize-none"
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Status Badge (publik)">
            <select value={values.status} onChange={(e) => update("status", e.target.value)} className="input">
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Branch">
            <input value={values.branch} onChange={(e) => update("branch", e.target.value)} placeholder="main" className="input" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Repo Full Name">
            <input
              value={values.repoFullName}
              onChange={(e) => update("repoFullName", e.target.value)}
              placeholder="RenaldiGH/nama-repo"
              className="input"
            />
          </Field>
          <Field label="Repo URL">
            <input
              value={values.repoUrl}
              onChange={(e) => update("repoUrl", e.target.value)}
              placeholder="https://github.com/..."
              className="input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Demo URL (opsional)">
            <input value={values.demoUrl} onChange={(e) => update("demoUrl", e.target.value)} className="input" />
          </Field>
          <Field label="Footnote (kalau repo privat)">
            <input value={values.footnote} onChange={(e) => update("footnote", e.target.value)} placeholder="SMK PGRI 3 Lab" className="input" />
          </Field>
        </div>

        <Field label="Tech Stack (pisahkan dengan koma)">
          <input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            placeholder="Next.js, Tailwind, MySQL"
            className="input"
          />
        </Field>

        <Field label="Urutan tampil (angka kecil = duluan)">
          <input
            type="number"
            value={values.order}
            onChange={(e) => update("order", Number(e.target.value))}
            className="input"
          />
        </Field>

        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={values.isPublished}
              onChange={(e) => update("isPublished", e.target.checked)}
              className="rounded border-zinc-700 bg-black"
            />
            Tayang di portofolio
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={values.isFeatured}
              onChange={(e) => update("isFeatured", e.target.checked)}
              className="rounded border-zinc-700 bg-black"
            />
            Featured
          </label>
        </div>

        {error && <div className="text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 rounded-lg px-3 py-2">{error}</div>}

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? "Menyimpan..." : "Simpan Proyek"}</span>
        </button>
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          background: black;
          border: 1px solid #27272a;
          color: white;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          border-color: #ffffff;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

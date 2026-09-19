"use client";

import { FormEvent, useState } from "react";
import { Trash2, Plus, ImageOff } from "lucide-react";

interface Skill {
  id: string;
  label: string;
  iconUrl: string | null;
}

export default function SkillIconsAdminList({ initialSkills }: { initialSkills: Skill[] }) {
  const [skills, setSkills] = useState(initialSkills);
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      label: String(formData.get("label") || ""),
      iconUrl: String(formData.get("iconUrl") || "") || null,
    };
    if (!payload.label) return;

    setSaving(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      const created = await res.json();
      setSkills((prev) => [...prev, created]);
      form.reset();
    } catch {
      alert("Gagal menambah skill.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus skill ini?")) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Gagal menghapus skill.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Skill Icons</h2>
        <p className="text-xs text-zinc-500 mt-1">
          Grid logo teknologi yang tampil di tab &quot;Tech Stack&quot; pada section Portfolio Showcase (bukan yang
          breakdown 3 kolom di atas).
        </p>
      </div>

      <form onSubmit={handleAdd} className="p-5 rounded-2xl border border-zinc-800 bg-surface space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input name="label" required placeholder="Nama (ex: React, Node JS)" className="admin-input" />
          <input name="iconUrl" placeholder="Link logo (opsional, lihat contoh di bawah)" className="admin-input" />
        </div>
        <p className="text-[11px] text-zinc-600 leading-relaxed">
          Contoh link logo yang bisa langsung dipakai (ganti nama di akhir URL sesuai teknologinya, huruf kecil semua):
          <br />
          <code className="text-zinc-400">https://cdn.simpleicons.org/react</code> ·{" "}
          <code className="text-zinc-400">https://cdn.simpleicons.org/nodedotjs</code> ·{" "}
          <code className="text-zinc-400">https://cdn.simpleicons.org/tailwindcss</code>
          <br />
          Cari nama slug yang benar di{" "}
          <a href="https://simpleicons.org" target="_blank" rel="noopener noreferrer" className="underline text-zinc-400">
            simpleicons.org
          </a>{" "}
          (search nama tech-nya, salin nama slug-nya). Boleh dikosongkan kalau belum ada logo.
        </p>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-60"
        >
          <Plus className="w-4 h-4" />
          <span>{saving ? "Menyimpan..." : "Tambah Skill"}</span>
        </button>
      </form>

      {skills.length === 0 ? (
        <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-800 bg-surface/50 text-sm text-zinc-500">
          Belum ada skill icon.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="relative p-4 rounded-2xl border border-zinc-800 bg-surface flex flex-col items-center gap-2 group"
            >
              <button
                onClick={() => handleDelete(skill.id)}
                disabled={pendingId === skill.id}
                className="absolute top-2 right-2 p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-950/40 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              {skill.iconUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={skill.iconUrl} alt={skill.label} className="w-10 h-10 object-contain" />
              ) : (
                <ImageOff className="w-10 h-10 text-zinc-700" />
              )}
              <span className="text-xs font-semibold text-white text-center">{skill.label}</span>
            </div>
          ))}
        </div>
      )}

      <style jsx global>{`
        .admin-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.75rem;
          background: black;
          border: 1px solid #27272a;
          color: white;
          font-size: 0.875rem;
        }
        .admin-input:focus {
          outline: none;
          border-color: #ffffff;
        }
      `}</style>
    </div>
  );
}

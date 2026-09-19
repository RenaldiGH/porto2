"use client";

import { FormEvent, useState } from "react";
import { Save } from "lucide-react";

interface ProfileValues {
  name: string;
  origin: string;
  role: string;
  passion: string;
  status: string;
  location: string;
  headline: string;
  subHeadline: string;
  bio: string;
  quote: string;
  experienceYears: number;
}

export default function ProfileForm({ initial }: { initial: ProfileValues }) {
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ProfileValues>(key: K, value: ProfileValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Gagal menyimpan profil");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-zinc-800 bg-surface space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nama">
          <input value={values.name} onChange={(e) => update("name", e.target.value)} className="admin-input" required />
        </Field>
        <Field label="Asal Sekolah">
          <input value={values.origin} onChange={(e) => update("origin", e.target.value)} className="admin-input" required />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Headline (Hero, 2 kata)">
          <input value={values.headline} onChange={(e) => update("headline", e.target.value)} className="admin-input" required />
        </Field>
        <Field label="Sub-headline">
          <input value={values.subHeadline} onChange={(e) => update("subHeadline", e.target.value)} className="admin-input" required />
        </Field>
      </div>

      <Field label="Bio (paragraf di Hero)">
        <textarea rows={4} value={values.bio} onChange={(e) => update("bio", e.target.value)} className="admin-input resize-none" required />
      </Field>

      <Field label="Quote">
        <input value={values.quote} onChange={(e) => update("quote", e.target.value)} className="admin-input" required />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Role (code window)">
          <input value={values.role} onChange={(e) => update("role", e.target.value)} className="admin-input" required />
        </Field>
        <Field label="Passion (code window)">
          <input value={values.passion} onChange={(e) => update("passion", e.target.value)} className="admin-input" required />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Status (code window)">
          <input value={values.status} onChange={(e) => update("status", e.target.value)} className="admin-input" required />
        </Field>
        <Field label="Lokasi">
          <input value={values.location} onChange={(e) => update("location", e.target.value)} className="admin-input" required />
        </Field>
        <Field label="Tahun Pengalaman">
          <input
            type="number"
            value={values.experienceYears}
            onChange={(e) => update("experienceYears", Number(e.target.value))}
            className="admin-input"
            required
          />
        </Field>
      </div>

      {error && <div className="text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 rounded-lg px-3 py-2">{error}</div>}
      {saved && <div className="text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 rounded-lg px-3 py-2">Tersimpan!</div>}

      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-60"
      >
        <Save className="w-4 h-4" />
        <span>{saving ? "Menyimpan..." : "Simpan Profil"}</span>
      </button>

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
    </form>
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

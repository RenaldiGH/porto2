"use client";

import { FormEvent, useRef, useState } from "react";
import { Trash2, Award, Plus, UploadCloud, FileCheck } from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  credentialUrl: string | null;
  fileUrl?: string | null;
}

export default function CertificatesAdminList({ initialCertificates }: { initialCertificates: Certificate[] }) {
  const [certificates, setCertificates] = useState(initialCertificates);
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "certificates");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal upload file");

      setUploadedFileUrl(data.url);
      setUploadedFileName(file.name);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Gagal upload file");
    } finally {
      setUploading(false);
    }
  }

  async function handleAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      title: String(formData.get("title") || ""),
      issuer: String(formData.get("issuer") || ""),
      credentialUrl: String(formData.get("credentialUrl") || "") || null,
      fileUrl: uploadedFileUrl,
    };
    if (!payload.title || !payload.issuer) return;

    setSaving(true);
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      const created = await res.json();
      setCertificates((prev) => [...prev, created]);
      form.reset();
      setUploadedFileUrl(null);
      setUploadedFileName(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      alert("Gagal menambah sertifikat.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus sertifikat ini?")) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/certificates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setCertificates((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Gagal menghapus sertifikat.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="p-5 rounded-2xl border border-zinc-800 bg-surface space-y-4">
        <h2 className="text-sm font-bold text-white">Tambah Sertifikat Baru</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="title" required placeholder="Judul sertifikat" className="admin-input" />
          <input name="issuer" required placeholder="Penerbit (ex: Dicoding, Google)" className="admin-input" />
        </div>
        <input name="credentialUrl" placeholder="Link verifikasi online (opsional)" className="admin-input" />

        <div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 text-zinc-300 text-xs font-medium hover:border-zinc-500 hover:text-white transition-colors disabled:opacity-60"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>{uploading ? "Mengupload..." : "Upload File Bukti (PDF/gambar)"}</span>
            </button>
            {uploadedFileName && (
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                <FileCheck className="w-3.5 h-3.5" />
                {uploadedFileName}
              </span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          <p className="text-[11px] text-zinc-600 mt-1.5">
            File ini yang bisa didownload pengunjung sebagai bukti kamu mengikuti kegiatan/pelatihannya. Boleh PDF
            atau gambar (scan sertifikat), maksimal 10MB.
          </p>
          {uploadError && <p className="text-[11px] text-rose-400 mt-1">{uploadError}</p>}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-60"
        >
          <Plus className="w-4 h-4" />
          <span>{saving ? "Menyimpan..." : "Tambah"}</span>
        </button>
      </form>

      {certificates.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-zinc-800 bg-surface/50 space-y-2">
          <Award className="w-8 h-8 mx-auto text-zinc-700" />
          <p className="text-sm text-zinc-500">Belum ada sertifikat.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {certificates.map((cert) => (
            <div key={cert.id} className="p-4 rounded-xl border border-zinc-800 bg-surface flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-bold text-sm text-white">{cert.title}</div>
                  {cert.fileUrl && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 border border-emerald-900/50 bg-emerald-950/30 px-1.5 py-0.5 rounded">
                      <FileCheck className="w-3 h-3" /> Ada file bukti
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-500">{cert.issuer}</div>
              </div>
              <button
                onClick={() => handleDelete(cert.id)}
                disabled={pendingId === cert.id}
                className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors shrink-0 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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

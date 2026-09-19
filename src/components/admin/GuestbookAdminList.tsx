"use client";

import { useState } from "react";
import { Trash2, MessageCircle } from "lucide-react";

interface Entry {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export default function GuestbookAdminList({ initialEntries }: { initialEntries: Entry[] }) {
  const [entries, setEntries] = useState(initialEntries);
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Hapus komentar ini?")) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/guestbook/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Gagal menghapus komentar.");
    } finally {
      setPendingId(null);
    }
  }

  if (entries.length === 0) {
    return (
      <div className="p-10 text-center rounded-2xl border border-dashed border-zinc-800 bg-surface/50 space-y-2">
        <MessageCircle className="w-8 h-8 mx-auto text-zinc-700" />
        <p className="text-sm text-zinc-500">Belum ada komentar masuk.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="p-4 rounded-xl border border-zinc-800 bg-surface flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">{entry.name}</span>
              <span className="text-[11px] text-zinc-500 font-mono">
                {new Date(entry.createdAt).toLocaleString("id-ID")}
              </span>
            </div>
            <p className="text-sm text-zinc-300 mt-1 break-words">{entry.message}</p>
          </div>
          <button
            onClick={() => handleDelete(entry.id)}
            disabled={pendingId === entry.id}
            className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors shrink-0 disabled:opacity-50"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

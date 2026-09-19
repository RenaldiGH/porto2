"use client";

import { FormEvent, useState } from "react";
import { Trash2, Layers, Plus, ChevronDown, ChevronRight } from "lucide-react";

interface TechItem {
  id: string;
  name: string;
  tag: string;
  description: string;
}

interface TechCategory {
  id: string;
  title: string;
  badge: string;
  items: TechItem[];
}

export default function TechStackAdminList({ initialCategories }: { initialCategories: TechCategory[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [savingCategory, setSavingCategory] = useState(false);
  const [savingItemFor, setSavingItemFor] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(initialCategories[0]?.id ?? null);

  async function handleAddCategory(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      title: String(formData.get("title") || ""),
      badge: String(formData.get("badge") || ""),
      order: categories.length,
    };
    if (!payload.title || !payload.badge) return;

    setSavingCategory(true);
    try {
      const res = await fetch("/api/tech-stack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      const created = await res.json();
      setCategories((prev) => [...prev, created]);
      setOpenId(created.id);
      form.reset();
    } catch {
      alert("Gagal menambah kategori.");
    } finally {
      setSavingCategory(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    if (!confirm("Hapus kategori ini beserta seluruh item di dalamnya?")) return;
    setPendingId(id);
    try {
      const res = await fetch(`/api/tech-stack/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Gagal menghapus kategori.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleAddItem(e: FormEvent<HTMLFormElement>, categoryId: string) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const category = categories.find((c) => c.id === categoryId);
    const payload = {
      categoryId,
      name: String(formData.get("name") || ""),
      tag: String(formData.get("tag") || ""),
      description: String(formData.get("description") || ""),
      order: category?.items.length ?? 0,
    };
    if (!payload.name || !payload.tag) return;

    setSavingItemFor(categoryId);
    try {
      const res = await fetch("/api/tech-stack/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      const created = await res.json();
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, items: [...c.items, created] } : c))
      );
      form.reset();
    } catch {
      alert("Gagal menambah item.");
    } finally {
      setSavingItemFor(null);
    }
  }

  async function handleDeleteItem(categoryId: string, itemId: string) {
    if (!confirm("Hapus item ini?")) return;
    setPendingId(itemId);
    try {
      const res = await fetch(`/api/tech-stack/items/${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("failed");
      setCategories((prev) =>
        prev.map((c) => (c.id === categoryId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c))
      );
    } catch {
      alert("Gagal menghapus item.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddCategory} className="p-5 rounded-2xl border border-zinc-800 bg-surface space-y-4">
        <h2 className="text-sm font-bold text-white">Tambah Kategori Baru</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="title" required placeholder="Judul kategori (ex: Framework & Language)" className="admin-input" />
          <input name="badge" required placeholder="Badge (ex: Production, UI/UX)" className="admin-input" />
        </div>
        <button
          type="submit"
          disabled={savingCategory}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black text-sm font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-60"
        >
          <Plus className="w-4 h-4" />
          <span>{savingCategory ? "Menyimpan..." : "Tambah Kategori"}</span>
        </button>
      </form>

      {categories.length === 0 ? (
        <div className="p-10 text-center rounded-2xl border border-dashed border-zinc-800 bg-surface/50 space-y-2">
          <Layers className="w-8 h-8 mx-auto text-zinc-700" />
          <p className="text-sm text-zinc-500">Belum ada kategori tech stack.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => {
            const isOpen = openId === cat.id;
            return (
              <div key={cat.id} className="rounded-2xl border border-zinc-800 bg-surface overflow-hidden">
                <div className="flex items-center justify-between gap-3 p-4">
                  <button
                    onClick={() => setOpenId(isOpen ? null : cat.id)}
                    className="flex items-center gap-2 min-w-0 text-left flex-1"
                  >
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-sm text-white truncate">{cat.title}</div>
                      <div className="text-xs text-zinc-500">
                        {cat.badge} · {cat.items.length} item
                      </div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    disabled={pendingId === cat.id}
                    className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors shrink-0 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isOpen && (
                  <div className="px-4 pb-4 space-y-3 border-t border-zinc-800 pt-4">
                    {cat.items.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border border-zinc-800 bg-black flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white">
                            {item.name} <span className="text-zinc-600 font-normal">· {item.tag}</span>
                          </div>
                          {item.description && (
                            <div className="text-xs text-zinc-500 truncate">{item.description}</div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteItem(cat.id, item.id)}
                          disabled={pendingId === item.id}
                          className="p-2 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors shrink-0 disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <form
                      onSubmit={(e) => handleAddItem(e, cat.id)}
                      className="p-3 rounded-xl border border-dashed border-zinc-700 space-y-2"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input name="name" required placeholder="Nama (ex: Next.js)" className="admin-input" />
                        <input name="tag" required placeholder="Tag (ex: v14.2.5)" className="admin-input" />
                      </div>
                      <input name="description" placeholder="Deskripsi singkat (opsional)" className="admin-input" />
                      <button
                        type="submit"
                        disabled={savingItemFor === cat.id}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors disabled:opacity-60"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{savingItemFor === cat.id ? "Menyimpan..." : "Tambah Item"}</span>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
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

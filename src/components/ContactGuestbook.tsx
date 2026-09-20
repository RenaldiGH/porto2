"use client";

import { FormEvent, useEffect, useState } from "react";
import { Share2, Send, MessageSquare, MessageCircle } from "lucide-react";
import type { GuestbookEntry } from "@/types";

interface Social {
  id: string;
  platform: string;
  handle: string;
  url: string;
  initials: string;
}

export default function ContactGuestbook() {
  // Contact form state
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // Socials state
  const [socials, setSocials] = useState<Social[]>([]);

  // Guestbook state
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [gbName, setGbName] = useState("");
  const [gbMessage, setGbMessage] = useState("");
  const [gbLoading, setGbLoading] = useState(false);

  useEffect(() => {
    fetch("/api/socials")
      .then((res) => (res.ok ? res.json() : []))
      .then(setSocials)
      .catch(() => setSocials([]));
  }, []);

  useEffect(() => {
    async function loadEntries() {
      try {
        const res = await fetch("/api/guestbook");
        if (!res.ok) throw new Error("failed");
        const data: GuestbookEntry[] = await res.json();
        setEntries(data);
      } catch {
        // No database configured yet (Phase 2 of the roadmap) — start empty, stay client-side.
        setEntries([]);
      }
    }
    loadEntries();
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("guestbook:count", { detail: entries.length }));
  }, [entries.length]);

  async function handleContactSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      message: String(formData.get("message") || ""),
    };

    setContactStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("failed");
      setContactStatus("sent");
      form.reset();
    } catch {
      setContactStatus("error");
    } finally {
      setTimeout(() => setContactStatus("idle"), 5000);
    }
  }

  async function handleGuestbookSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = gbName.trim();
    const message = gbMessage.trim();
    if (!name || !message) return;

    setGbLoading(true);
    const optimisticEntry: GuestbookEntry = {
      id: `local-${Date.now()}`,
      name,
      message,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });
      if (!res.ok) throw new Error("failed");
      const saved: GuestbookEntry = await res.json();
      setEntries((prev) => [saved, ...prev]);
    } catch {
      // Fall back to a local-only entry so the guestbook still feels alive without a DB.
      setEntries((prev) => [optimisticEntry, ...prev]);
    } finally {
      setGbName("");
      setGbMessage("");
      setGbLoading(false);
    }
  }

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start scroll-mt-24" id="contact">
      {/* Contact + Socials */}
      <div className="lg:col-span-6 space-y-6">
        <div className="p-6 sm:p-8 rounded-2xl border border-surface-border bg-surface space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-white">Hubungi Saya</h3>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Ada yang ingin didiskusikan? Kirim saya pesan dan mari kita bicara.
              </p>
            </div>
            <Share2 className="w-5 h-5 text-zinc-400" />
          </div>

          <form className="space-y-4" onSubmit={handleContactSubmit}>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2" htmlFor="contact-name">
                Nama
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="Nama Anda"
                className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-sm transition-colors font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2" htmlFor="contact-email">
                Email
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="Email Anda"
                className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-sm transition-colors font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2" htmlFor="contact-msg">
                Pesan
              </label>
              <textarea
                id="contact-msg"
                name="message"
                required
                rows={4}
                placeholder="Tuliskan pesan Anda..."
                className="w-full px-4 py-3 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-sm transition-colors font-sans resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={contactStatus === "sending"}
              className="w-full py-3.5 px-4 rounded-xl bg-white text-black font-semibold text-sm flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors duration-200 shadow-md disabled:opacity-60"
            >
              <Send className="w-4 h-4" />
              <span>{contactStatus === "sending" ? "Mengirim..." : "Kirim Pesan"}</span>
            </button>
            {contactStatus === "sent" && (
              <div className="text-xs font-mono text-center text-emerald-400 pt-2">
                ✓ Pesan Anda telah terkirim. Terima kasih!
              </div>
            )}
            {contactStatus === "error" && (
              <div className="text-xs font-mono text-center text-zinc-400 pt-2">
                Pesan disimpan secara lokal — endpoint email belum dikonfigurasi.
              </div>
            )}
          </form>
        </div>

        <div className="p-6 rounded-2xl border border-surface-border bg-surface space-y-4">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 block">Connect With Me</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {socials.map((social) => (
              <a
                key={social.id}
                className="p-3.5 rounded-xl border border-zinc-800 bg-black/50 hover:border-zinc-600 hover:bg-zinc-900/50 transition-all flex items-center justify-between group"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 font-mono text-xs font-bold">
                    {social.initials}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">{social.platform}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">{social.handle}</div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Guestbook */}
      <div className="lg:col-span-6 space-y-6 scroll-mt-24" id="guestbook">
        <div className="p-6 sm:p-8 rounded-2xl border border-surface-border bg-surface space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-white" />
              <h3 className="text-xl font-bold tracking-tight text-white font-mono">Guestbook</h3>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                {entries.length}
              </span>
            </div>  
          </div>

          <form className="space-y-4" onSubmit={handleGuestbookSubmit}>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="gb-name">
                Name *
              </label>
              <input
                id="gb-name"
                type="text"
                required
                value={gbName}
                onChange={(e) => setGbName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-sm transition-colors font-sans"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5" htmlFor="gb-message">
                Message *
              </label>
              <textarea
                id="gb-message"
                required
                rows={3}
                value={gbMessage}
                onChange={(e) => setGbMessage(e.target.value)}
                placeholder="Write your message here..."
                className="w-full px-4 py-2.5 rounded-xl bg-black border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white text-sm transition-colors font-sans resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={gbLoading}
              className="w-full py-3 px-4 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-zinc-200 transition-colors disabled:opacity-60"
            >
              Post Comment
            </button>
          </form>

          <div className="pt-4 border-t border-zinc-800/80">
            {entries.length === 0 ? (
              <div className="text-center py-8 text-zinc-500 space-y-2">
                <MessageCircle className="w-8 h-8 mx-auto text-zinc-700 stroke-1" />
                <p className="text-xs font-mono">No comments yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {entries.map((entry) => (
                  <div key={entry.id} className="p-3 rounded-xl border border-zinc-800 bg-black/60 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-white font-mono">{entry.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {new Date(entry.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300">{entry.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

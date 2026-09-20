"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navLinks, profile as fallbackProfile } from "@/data/content";

export default function Header({ initialLocation }: { initialLocation?: string | null }) {
  const [time, setTime] = useState("24°C • --:-- WIB");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [guestCount, setGuestCount] = useState(0);
  const [location, setLocation] = useState(initialLocation || fallbackProfile.location);

  useEffect(() => {
    // Data lokasi sudah dikirim dari server (page.tsx) — cuma fetch ulang
    // kalau karena suatu sebab initialLocation tidak dikirim sama sekali.
    if (initialLocation !== undefined) return;

    fetch("/api/profile")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.location) setLocation(data.location);
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const timeString = new Intl.DateTimeFormat([], {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
      }).format(now);
      setTime(`24°C • ${timeString} WIB`);
    }
    updateClock();
    const id = setInterval(updateClock, 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function handler(e: Event) {
      const custom = e as CustomEvent<number>;
      setGuestCount(custom.detail);
    }
    window.addEventListener("guestbook:count", handler);
    return () => window.removeEventListener("guestbook:count", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/80 border-b border-surface-border transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a className="group flex items-center space-x-3" href="#">
            <span className="text-lg font-black tracking-tight font-mono group-hover:opacity-80 transition-opacity">
              REYNALDI<span className="text-zinc-500">.DEV</span>
            </span>
          </a>      
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-wider uppercase text-zinc-400">
          {navLinks.map((link) => (
            <a key={link.href} className="hover:text-white transition-colors duration-150 py-1" href={link.href}>
              {link.label}
            </a>
          ))}
          <a className="hover:text-white transition-colors duration-150 py-1 flex items-center gap-1.5" href="#guestbook">
            Guestbook
            <span className="px-1.5 py-0.2 text-[9px] bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
              {guestCount}
            </span>
          </a>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden lg:flex flex-col text-right font-mono text-[11px] text-zinc-400">
            <span className="text-white font-medium">{location}</span>
            <span className="text-zinc-500">{time}</span>
          </div>
          <a
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider font-semibold rounded-lg bg-white text-black hover:bg-zinc-200 transition-all duration-200 shadow-[0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            href="#contact"
          >
            <span>Get in Touch</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
          <button
            className="md:hidden text-zinc-300 hover:text-white"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="md:hidden border-t border-surface-border bg-black px-6 py-4 flex flex-col space-y-4 text-xs font-mono tracking-wider uppercase text-zinc-400">
          {[...navLinks, { label: "Guestbook", href: "#guestbook" }].map((link) => (
            <a
              key={link.href}
              className="hover:text-white transition-colors"
              href={link.href}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

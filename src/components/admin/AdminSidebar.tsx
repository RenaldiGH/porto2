"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  RefreshCw,
  ShieldCheck,
  MessageSquare,
  Settings,
  LogOut,
  Layers,
  UserCircle,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/profile", label: "Profil", icon: UserCircle },
  { href: "/admin/projects", label: "Kelola Proyek", icon: Package },
  { href: "/admin/tech-stack", label: "Tech Stack", icon: Layers },
  { href: "/admin/sync", label: "Sinkronisasi Repo", icon: RefreshCw },
  { href: "/admin/certificates", label: "Sertifikasi & Skill", icon: ShieldCheck },
  { href: "/admin/guestbook", label: "Buku Tamu", icon: MessageSquare },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export default function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="w-64 shrink-0 bg-black border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="h-20 flex items-center px-6 border-b border-zinc-800 gap-3">
        <div className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center font-black text-sm font-mono">
          R
        </div>
        <div>
          <div className="text-sm font-black tracking-tight font-mono text-white">REYNALDI🤓</div>
          <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Admin Workspace</div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-600 px-3 mb-2">Navigasi</div>
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                isActive
                  ? "bg-white text-black font-semibold"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-zinc-800 text-white flex items-center justify-center text-xs font-bold shrink-0">
              {adminEmail.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">Reynaldi</div>
              <div className="text-[10px] text-zinc-500 truncate">Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Keluar"
            className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
import { Settings, KeyRound } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Pengaturan</h1>
        <p className="text-sm text-zinc-400 mt-1">Pengaturan akun & keamanan dashboard admin.</p>
      </div>

      <div className="p-6 rounded-2xl border border-zinc-800 bg-surface space-y-3">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <KeyRound className="w-4 h-4" />
          <span>Ganti Password Admin</span>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          Password admin diatur lewat environment variable <code className="text-zinc-300 bg-black px-1 py-0.5 rounded">ADMIN_PASSWORD_HASH</code>,
          bukan lewat form di sini (supaya tidak perlu tabel user terpisah). Untuk ganti password: jalankan{" "}
          <code className="text-zinc-300 bg-black px-1 py-0.5 rounded">npm run hash:password -- &quot;password-baru&quot;</code>{" "}
          di terminal, lalu update nilai <code className="text-zinc-300 bg-black px-1 py-0.5 rounded">ADMIN_PASSWORD_HASH</code> di{" "}
          Environment Variables project Vercel kamu, dan redeploy.
        </p>
      </div>

      <div className="p-6 rounded-2xl border border-dashed border-zinc-800 bg-surface/50 space-y-2">
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          <Settings className="w-4 h-4" />
          <span>Pengaturan lain</span>
        </div>
        <p className="text-xs text-zinc-500">Menyusul — belum ada pengaturan tambahan saat ini.</p>
      </div>
    </div>
  );
}

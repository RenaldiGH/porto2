import { prisma } from "@/lib/prisma";
import { Package, Award, MessageSquare, Mail } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [projectCount, publishedCount, certificateCount, guestbookCount, unreadMessages] = await Promise.all([
    prisma.project.count().catch(() => 0),
    prisma.project.count({ where: { isPublished: true } }).catch(() => 0),
    prisma.certificate.count().catch(() => 0),
    prisma.guestbookEntry.count().catch(() => 0),
    prisma.contactMessage.count({ where: { isRead: false } }).catch(() => 0),
  ]);

  const cards = [
    { label: "Proyek Tayang", value: publishedCount, sub: `${projectCount} total proyek`, icon: Package, href: "/admin/projects" },
    { label: "Sertifikat", value: certificateCount, sub: "Tersimpan", icon: Award, href: "/admin/certificates" },
    { label: "Guestbook", value: guestbookCount, sub: "Komentar masuk", icon: MessageSquare, href: "/admin/guestbook" },
    { label: "Pesan Belum Dibaca", value: unreadMessages, sub: "Dari form kontak", icon: Mail, href: "/admin" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Dashboard</h1>
        <p className="text-sm text-zinc-400 mt-1">Ringkasan konten portofolio kamu.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="p-5 rounded-2xl border border-zinc-800 bg-surface hover:border-zinc-600 transition-colors block"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">{card.label}</span>
                <Icon className="w-4 h-4 text-zinc-500" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">{card.value}</div>
              <div className="text-xs text-zinc-500 mt-1">{card.sub}</div>
            </Link>
          );
        })}
      </div>

      <div className="p-6 rounded-2xl border border-dashed border-zinc-800 bg-surface/50 text-sm text-zinc-400">
        Kelola konten portofolio lewat menu di sebelah kiri — mulai dari <strong className="text-white">Kelola Proyek</strong>{" "}
        untuk menambah/mengubah proyek yang tampil di halaman publik.
      </div>
    </div>
  );
}

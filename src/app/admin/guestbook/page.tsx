import { prisma } from "@/lib/prisma";
import GuestbookAdminList from "@/components/admin/GuestbookAdminList";

export const dynamic = "force-dynamic";

export default async function AdminGuestbookPage() {
  const entries = await prisma.guestbookEntry.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Buku Tamu</h1>
        <p className="text-sm text-zinc-400 mt-1">Kelola komentar yang masuk lewat guestbook di halaman publik.</p>
      </div>
      <GuestbookAdminList
        initialEntries={entries.map((e) => ({
          id: e.id,
          name: e.name,
          message: e.message,
          createdAt: e.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}

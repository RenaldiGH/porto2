import { prisma } from "@/lib/prisma";
import ProfileForm from "@/components/admin/ProfileForm";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await prisma.profile.findFirst();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Profil</h1>
        <p className="text-sm text-zinc-400 mt-1">
          Konten ini tampil di bagian Hero portofolio publik (headline, bio, quote).
        </p>
      </div>
      {profile ? (
        <ProfileForm
          initial={{
            name: profile.name,
            origin: profile.origin,
            role: profile.role,
            passion: profile.passion,
            status: profile.status,
            location: profile.location,
            headline: profile.headline,
            subHeadline: profile.subHeadline,
            bio: profile.bio,
            quote: profile.quote,
            experienceYears: profile.experienceYears,
          }}
        />
      ) : (
        <div className="p-6 rounded-2xl border border-dashed border-zinc-800 bg-surface/50 text-sm text-zinc-400">
          Profile belum ada di database. Jalankan <code className="text-zinc-300 bg-black px-1 py-0.5 rounded">npm run prisma:seed</code> dulu.
        </div>
      )}
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import CertificatesAdminList from "@/components/admin/CertificatesAdminList";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const certificates = await prisma.certificate.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Sertifikasi & Skill</h1>
        <p className="text-sm text-zinc-400 mt-1">Tambahkan sertifikat yang akan tampil di tab "Certificates" portofolio.</p>
      </div>
      <CertificatesAdminList
        initialCertificates={certificates.map((c) => ({
          id: c.id,
          title: c.title,
          issuer: c.issuer,
          credentialUrl: c.credentialUrl,
        }))}
      />
    </div>
  );
}

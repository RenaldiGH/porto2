import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import ContactGuestbook from "@/components/ContactGuestbook";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, projectCount, certificateCount] = await Promise.all([
    prisma.profile.findFirst().catch(() => null),
    prisma.project.count({ where: { isPublished: true } }).catch(() => 0),
    prisma.certificate.count().catch(() => 0),
  ]);

  return (
    <>
      <Header initialLocation={profile?.location ?? null} />
      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20 space-y-28 lg:space-y-36">
        <Hero initialProfile={profile} initialProjectCount={projectCount} initialCertificateCount={certificateCount} />
        <TechStack />
        <PortfolioShowcase />
        <ContactGuestbook />
      </main>
      <Footer />
    </>
  );
}

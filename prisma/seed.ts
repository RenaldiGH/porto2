import { PrismaClient, ProjectStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Profile (singleton)
  await prisma.profile.deleteMany();
  await prisma.profile.create({
    data: {
      name: "Reynaldi",
      origin: "SMK PGRI 3 Malang",
      role: "Frontend & Database",
      passion: "Building Scalable Web Apps",
      status: "Active & Innovating",
      location: "MALANG, ID",
      headline: "Frontend Developer",
      subHeadline: "Web Engineering & Database Management",
      bio: "Saya adalah murid SMK PGRI 3 MALANG yang berfokus pada pengelolaan database dan selalu berupaya memberikan solusi terbaik dalam setiap proyek yang saya kerjakan.",
      quote: "Leveraging AI as a professional tool, not a replacement.",
      experienceYears: 4,
    },
  });

  // 2. Tech Stack
  await prisma.techItem.deleteMany();
  await prisma.techCategory.deleteMany();

  const frameworkCategory = await prisma.techCategory.create({
    data: {
      title: "Framework & Language",
      badge: "Production",
      order: 0,
      items: {
        create: [
          { name: "Next.js", tag: "v14.2.5", description: "App Router, SSR, Server Components & Edge Optimization", order: 0 },
          { name: "React & React DOM", tag: "v18.3.1", description: "Component-driven UI, Hooks, Concurrent Rendering", order: 1 },
          { name: "TypeScript", tag: "Strict", description: "Static typing, compile-time safety, enhanced developer experience", order: 2 },
        ],
      },
    },
  });

  const stylingCategory = await prisma.techCategory.create({
    data: {
      title: "Styling & Animation",
      badge: "UI / UX",
      order: 1,
      items: {
        create: [
          { name: "Tailwind CSS", tag: "PostCSS + Autoprefixer", description: "Utility-first workflow, responsive layouts & dark mode tokens", order: 0 },
          { name: "Framer Motion", tag: "Spring Physics", description: "Complex UI gesture animations, micro-interactions, layout transitions", order: 1 },
          { name: "Lucide & React Icons", tag: "Scalable Vectors", description: "Clean scalable vector iconography engineered for modern responsive web", order: 2 },
        ],
      },
    },
  });

  const dbCategory = await prisma.techCategory.create({
    data: {
      title: "Database & Tooling",
      badge: "Infrastructure",
      order: 2,
      items: {
        create: [
          { name: "MySQL & Prisma", tag: "ORM & Relational", description: "Database architecture, schema migration, relational integrity & pooling", order: 0 },
          { name: "Git & GitHub Actions", tag: "Version Control", description: "Automated builds, branch protections, pull requests & release cycles", order: 1 },
          { name: "Vercel & Edge Runtime", tag: "Deployment", description: "Global content delivery network caching, edge handlers & telemetry", order: 2 },
        ],
      },
    },
  });
  console.log(`Created tech categories: ${frameworkCategory.title}, ${stylingCategory.title}, ${dbCategory.title}`);

  // 3. Tags (technologies used in projects)
  const tagNames = ["Next.js", "Tailwind", "MySQL", "SQL", "TypeScript"];
  await prisma.$transaction(
    tagNames.map((name) =>
      prisma.tag.upsert({ where: { name }, update: {}, create: { name } })
    )
  );

  // 4. Projects
  await prisma.project.deleteMany();
  await prisma.project.create({
    data: {
      slug: "modern-web-app",
      name: "Modern Web App",
      description:
        "Sistem informasi database dengan integrasi frontend responsif dan manajemen query efisien, didukung caching dan modern state handler.",
      status: ProjectStatus.IN_PRODUCTION,
      repoUrl: "https://github.com/RenaldiGH/modern-ecommerce-app",
      repoFullName: "RenaldiGH/modern-ecommerce-app",
      branch: "main",
      isFeatured: true,
      isPublished: true,
      order: 0,
      technologies: { connect: [{ name: "Next.js" }, { name: "Tailwind" }, { name: "MySQL" }] },
    },
  });
  await prisma.project.create({
    data: {
      slug: "database-query-engine",
      name: "Database Query Engine",
      description:
        "Perancangan skema relasional terstruktur untuk mengoptimasi query execution plan dan pengelolaan data secara terpusat.",
      status: ProjectStatus.INTERNAL_TOOL,
      repoFullName: "RenaldiGH/db-query-profiler",
      branch: "master",
      footnote: "SMK PGRI 3 Lab",
      isPublished: true,
      order: 1,
      technologies: { connect: [{ name: "SQL" }, { name: "TypeScript" }] },
    },
  });

  // 5. Certificates — masih kosong (sesuai stat "0 Certificates"),
  //    tinggal tambahkan lewat prisma.certificate.create() saat sertifikat asli tersedia.
  await prisma.certificate.deleteMany();

  // 6. Skill badges (tab ringkasan "Tech Stack")
  await prisma.skillBadge.deleteMany();
  await prisma.skillBadge.createMany({
    data: [
      { label: "Frontend Architecture", order: 0 },
      { label: "Relational Schemas", order: 1 },
      { label: "API Optimization", order: 2 },
      { label: "Clean Code", order: 3 },
    ],
  });

  // 7. Social links
  await prisma.socialLink.deleteMany();
  await prisma.socialLink.createMany({
    data: [
      { platform: "Instagram", handle: "@rey_wkw", url: "https://instagram.com/rey_wkw", initials: "IG", order: 0 },
      { platform: "GitHub", handle: "@RenaldiGH", url: "https://github.com/RenaldiGH", initials: "GH", order: 1 },
      { platform: "TikTok", handle: "@reyawikwok", url: "https://tiktok.com/@reyawikwok", initials: "TK", order: 2 },
    ],
  });

  console.log("Seeding selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export const profile = {
  name: "Reynaldi",
  origin: "SMK PGRI 3 Malang",
  role: "Frontend & Database",
  passion: "Building Scalable Web Apps",
  status: "Active & Innovating",
  location: "MALANG, ID",
};

export const stats = [
  { index: "01", icon: "code-2", value: "0", label: "Projects", sub: "Innovative web apps" },
  { index: "02", icon: "award", value: "0", label: "Certificates", sub: "Skills validated" },
  { index: "03", icon: "clock", value: "4", suffix: "y", label: "Experience", sub: "Continuous learning" },
] as const;

export const codeSnippetLines = [
  { indent: 0, parts: [{ t: "const", c: "text-zinc-500" }, { t: " developer", c: "text-white font-semibold" }, { t: " = {", c: "text-zinc-300" }] },
  { indent: 1, parts: [{ t: "name", c: "text-zinc-400" }, { t: ": ", c: "text-zinc-300" }, { t: "'Reynaldi'", c: "text-white" }, { t: ",", c: "text-zinc-300" }] },
  { indent: 1, parts: [{ t: "origin", c: "text-zinc-400" }, { t: ": ", c: "text-zinc-300" }, { t: "'SMK PGRI 3 Malang'", c: "text-white" }, { t: ",", c: "text-zinc-300" }] },
  { indent: 1, parts: [{ t: "role", c: "text-zinc-400" }, { t: ": ", c: "text-zinc-300" }, { t: "'Frontend & Database'", c: "text-white" }, { t: ",", c: "text-zinc-300" }] },
  { indent: 1, parts: [{ t: "passion", c: "text-zinc-400" }, { t: ": ", c: "text-zinc-300" }, { t: "'Building Scalable Web Apps'", c: "text-white" }, { t: ",", c: "text-zinc-300" }] },
  { indent: 1, parts: [{ t: "status", c: "text-zinc-400" }, { t: ": ", c: "text-zinc-300" }] },
  { indent: 0, parts: [{ t: "};", c: "text-zinc-300" }] },
];

export const codeSnippetPlain = `const developer = {
  name: 'Reynaldi',
  origin: 'SMK PGRI 3 Malang',
  role: 'Frontend & Database',
  passion: 'Building Scalable Web Apps',
  status: 'Active & Innovating'
};`;

export const techStack = [
  {
    category: "Framework & Language",
    badge: "Production",
    items: [
      { name: "Next.js", tag: "v14.2.5", desc: "App Router, SSR, Server Components & Edge Optimization" },
      { name: "React & React DOM", tag: "v18.3.1", desc: "Component-driven UI, Hooks, Concurrent Rendering" },
      { name: "TypeScript", tag: "Strict", desc: "Static typing, compile-time safety, enhanced developer experience" },
    ],
  },
  {
    category: "Styling & Animation",
    badge: "UI / UX",
    items: [
      { name: "Tailwind CSS", tag: "PostCSS + Autoprefixer", desc: "Utility-first workflow, responsive layouts & dark mode tokens" },
      { name: "Framer Motion", tag: "Spring Physics", desc: "Complex UI gesture animations, micro-interactions, layout transitions" },
      { name: "Lucide & React Icons", tag: "Scalable Vectors", desc: "Clean scalable vector iconography engineered for modern responsive web" },
    ],
  },
  {
    category: "Database & Tooling",
    badge: "Infrastructure",
    items: [
      { name: "MySQL & Prisma", tag: "ORM & Relational", desc: "Database architecture, schema migration, relational integrity & pooling" },
      { name: "Git & GitHub Actions", tag: "Version Control", desc: "Automated builds, branch protections, pull requests & release cycles" },
      { name: "Vercel & Edge Runtime", tag: "Deployment", desc: "Global content delivery network caching, edge handlers & telemetry" },
    ],
  },
] as const;

export const projects = [
  {
    name: "Modern Web App",
    status: "In Production",
    live: true,
    description:
      "Sistem informasi database dengan integrasi frontend responsif dan manajemen query efisien, didukung caching dan modern state handler.",
    tags: ["Next.js", "Tailwind", "MySQL"],
    linkLabel: "Code",
    href: "https://github.com/RenaldiGH",
  },
  {
    name: "Database Query Engine",
    status: "Internal Tool",
    live: false,
    description:
      "Perancangan skema relasional terstruktur untuk mengoptimasi query execution plan dan pengelolaan data secara terpusat.",
    tags: ["SQL", "TypeScript"],
    linkLabel: null,
    href: null,
    footnote: "SMK PGRI 3 Lab",
  },
] as const;

export const skillBadges = [
  "Frontend Architecture",
  "Relational Schemas",
  "API Optimization",
  "Clean Code",
] as const;

export const socials = [
  { name: "Instagram", handle: "@rey_wkw", initials: "IG", href: "https://instagram.com/rey_wkw" },
  { name: "GitHub", handle: "@RenaldiGH", initials: "GH", href: "https://github.com/RenaldiGH" },
  { name: "TikTok", handle: "@reyawikwok", initials: "TK", href: "https://tiktok.com/@reyawikwok" },
] as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

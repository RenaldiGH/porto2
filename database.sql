-- ============================================================================
-- Reynaldi Portfolio — Database Setup (PostgreSQL, untuk Supabase)
-- ============================================================================
-- Cara pakai:
--   1. Buka project Supabase kamu -> menu "SQL Editor" (bukan phpMyAdmin lagi,
--      karena Supabase pakai PostgreSQL, bukan MySQL)
--   2. Klik "New query", paste SELURUH isi file ini, klik "Run"
--   3. Selesai — semua tabel & data awal langsung terbuat di database Supabase
--
-- ALTERNATIF (lebih direkomendasikan): kamu tidak perlu jalankan file ini
-- sama sekali. Cukup isi DATABASE_URL & DIRECT_URL di .env dengan connection
-- string dari Supabase, lalu jalankan:
--     npx prisma migrate dev --name init
--     npm run prisma:seed
-- Prisma akan otomatis membuatkan semua tabel ini + mengisi data awal.
-- File SQL ini cuma alternatif kalau kamu mau import manual lewat SQL Editor.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- ENUM
-- ----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE "ProjectStatus" AS ENUM ('IN_PRODUCTION', 'INTERNAL_TOOL', 'ARCHIVED', 'PLANNED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ----------------------------------------------------------------------------
-- 1. PROFILE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Profile" (
  "id" TEXT PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "origin" VARCHAR(150) NOT NULL,
  "role" VARCHAR(150) NOT NULL,
  "passion" VARCHAR(200) NOT NULL,
  "status" VARCHAR(100) NOT NULL,
  "location" VARCHAR(100) NOT NULL,
  "headline" VARCHAR(150) NOT NULL,
  "subHeadline" VARCHAR(200) NOT NULL,
  "bio" TEXT NOT NULL,
  "quote" VARCHAR(300) NOT NULL,
  "avatarUrl" VARCHAR(500),
  "experienceYears" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ----------------------------------------------------------------------------
-- 2. TECH STACK
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "TechCategory" (
  "id" TEXT PRIMARY KEY,
  "title" VARCHAR(100) NOT NULL,
  "badge" VARCHAR(50) NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS "TechCategory_order_idx" ON "TechCategory" ("order");

CREATE TABLE IF NOT EXISTS "TechItem" (
  "id" TEXT PRIMARY KEY,
  "categoryId" TEXT NOT NULL REFERENCES "TechCategory"("id") ON DELETE CASCADE,
  "name" VARCHAR(100) NOT NULL,
  "tag" VARCHAR(100) NOT NULL,
  "description" VARCHAR(300) NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS "TechItem_categoryId_order_idx" ON "TechItem" ("categoryId", "order");

-- ----------------------------------------------------------------------------
-- 3. TAGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Tag" (
  "id" TEXT PRIMARY KEY,
  "name" VARCHAR(50) NOT NULL UNIQUE
);

-- ----------------------------------------------------------------------------
-- 4. PROJECTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Project" (
  "id" TEXT PRIMARY KEY,
  "slug" VARCHAR(150) NOT NULL UNIQUE,
  "name" VARCHAR(150) NOT NULL,
  "description" VARCHAR(500) NOT NULL,
  "status" "ProjectStatus" NOT NULL DEFAULT 'PLANNED',
  "repoUrl" VARCHAR(500),
  "repoFullName" VARCHAR(200),
  "branch" VARCHAR(50),
  "demoUrl" VARCHAR(500),
  "footnote" VARCHAR(100),
  "isFeatured" BOOLEAN NOT NULL DEFAULT false,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Project_order_idx" ON "Project" ("order");
CREATE INDEX IF NOT EXISTS "Project_isPublished_idx" ON "Project" ("isPublished");

CREATE TABLE IF NOT EXISTS "_ProjectToTag" (
  "A" TEXT NOT NULL REFERENCES "Project"("id") ON DELETE CASCADE,
  "B" TEXT NOT NULL REFERENCES "Tag"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "_ProjectToTag_AB_unique" ON "_ProjectToTag" ("A", "B");
CREATE INDEX IF NOT EXISTS "_ProjectToTag_B_index" ON "_ProjectToTag" ("B");

-- ----------------------------------------------------------------------------
-- 5. CERTIFICATES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "Certificate" (
  "id" TEXT PRIMARY KEY,
  "title" VARCHAR(200) NOT NULL,
  "issuer" VARCHAR(150) NOT NULL,
  "issueDate" TIMESTAMP(3),
  "credentialUrl" VARCHAR(500),
  "imageUrl" VARCHAR(500),
  "description" VARCHAR(500),
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "Certificate_order_idx" ON "Certificate" ("order");

-- ----------------------------------------------------------------------------
-- 6. SKILL BADGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "SkillBadge" (
  "id" TEXT PRIMARY KEY,
  "label" VARCHAR(100) NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS "SkillBadge_order_idx" ON "SkillBadge" ("order");

-- ----------------------------------------------------------------------------
-- 7. SOCIAL LINKS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "SocialLink" (
  "id" TEXT PRIMARY KEY,
  "platform" VARCHAR(50) NOT NULL,
  "handle" VARCHAR(100) NOT NULL,
  "url" VARCHAR(500) NOT NULL,
  "initials" VARCHAR(4) NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS "SocialLink_order_idx" ON "SocialLink" ("order");

-- ----------------------------------------------------------------------------
-- 8. GUESTBOOK
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "GuestbookEntry" (
  "id" TEXT PRIMARY KEY,
  "name" VARCHAR(80) NOT NULL,
  "message" VARCHAR(500) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "GuestbookEntry_createdAt_idx" ON "GuestbookEntry" ("createdAt");

-- ----------------------------------------------------------------------------
-- 9. CONTACT MESSAGES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "ContactMessage" (
  "id" TEXT PRIMARY KEY,
  "name" VARCHAR(120) NOT NULL,
  "email" VARCHAR(160) NOT NULL,
  "message" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "ContactMessage_createdAt_idx" ON "ContactMessage" ("createdAt");

-- ============================================================================
-- DATA AWAL (SEED)
-- ============================================================================

INSERT INTO "Profile" ("id", "name", "origin", "role", "passion", "status", "location", "headline", "subHeadline", "bio", "quote", "experienceYears")
VALUES ('profile_1', 'Reynaldi', 'SMK PGRI 3 Malang', 'Frontend & Database', 'Building Scalable Web Apps',
   'Active & Innovating', 'MALANG, ID', 'Frontend Developer', 'Web Engineering & Database Management',
   'Saya adalah murid SMK PGRI 3 MALANG yang berfokus pada pengelolaan database dan selalu berupaya memberikan solusi terbaik dalam setiap proyek yang saya kerjakan.',
   'Leveraging AI as a professional tool, not a replacement.', 4)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "TechCategory" ("id", "title", "badge", "order") VALUES
  ('cat_framework', 'Framework & Language', 'Production', 0),
  ('cat_styling', 'Styling & Animation', 'UI / UX', 1),
  ('cat_database', 'Database & Tooling', 'Infrastructure', 2)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "TechItem" ("id", "categoryId", "name", "tag", "description", "order") VALUES
  ('tech_1', 'cat_framework', 'Next.js', 'v14.2.5', 'App Router, SSR, Server Components & Edge Optimization', 0),
  ('tech_2', 'cat_framework', 'React & React DOM', 'v18.3.1', 'Component-driven UI, Hooks, Concurrent Rendering', 1),
  ('tech_3', 'cat_framework', 'TypeScript', 'Strict', 'Static typing, compile-time safety, enhanced developer experience', 2),
  ('tech_4', 'cat_styling', 'Tailwind CSS', 'PostCSS + Autoprefixer', 'Utility-first workflow, responsive layouts & dark mode tokens', 0),
  ('tech_5', 'cat_styling', 'Framer Motion', 'Spring Physics', 'Complex UI gesture animations, micro-interactions, layout transitions', 1),
  ('tech_6', 'cat_styling', 'Lucide & React Icons', 'Scalable Vectors', 'Clean scalable vector iconography engineered for modern responsive web', 2),
  ('tech_7', 'cat_database', 'PostgreSQL & Prisma', 'ORM & Relational', 'Database architecture, schema migration, relational integrity & pooling', 0),
  ('tech_8', 'cat_database', 'Git & GitHub Actions', 'Version Control', 'Automated builds, branch protections, pull requests & release cycles', 1),
  ('tech_9', 'cat_database', 'Vercel & Supabase', 'Deployment', 'Global content delivery network caching, managed Postgres & edge handlers', 2)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Tag" ("id", "name") VALUES
  ('tag_nextjs', 'Next.js'),
  ('tag_tailwind', 'Tailwind'),
  ('tag_mysql', 'MySQL'),
  ('tag_sql', 'SQL'),
  ('tag_typescript', 'TypeScript')
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "Project" ("id", "slug", "name", "description", "status", "repoUrl", "repoFullName", "branch", "footnote", "isFeatured", "isPublished", "order")
VALUES
  ('proj_1', 'modern-web-app', 'Modern Web App',
   'Sistem informasi database dengan integrasi frontend responsif dan manajemen query efisien, didukung caching dan modern state handler.',
   'IN_PRODUCTION', 'https://github.com/RenaldiGH/modern-ecommerce-app', 'RenaldiGH/modern-ecommerce-app', 'main', NULL, true, true, 0),
  ('proj_2', 'database-query-engine', 'Database Query Engine',
   'Perancangan skema relasional terstruktur untuk mengoptimasi query execution plan dan pengelolaan data secara terpusat.',
   'INTERNAL_TOOL', NULL, 'RenaldiGH/db-query-profiler', 'master', 'SMK PGRI 3 Lab', false, true, 1)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "_ProjectToTag" ("A", "B") VALUES
  ('proj_1', 'tag_nextjs'),
  ('proj_1', 'tag_tailwind'),
  ('proj_1', 'tag_mysql'),
  ('proj_2', 'tag_sql'),
  ('proj_2', 'tag_typescript')
ON CONFLICT DO NOTHING;

INSERT INTO "SkillBadge" ("id", "label", "order") VALUES
  ('skill_1', 'Frontend Architecture', 0),
  ('skill_2', 'Relational Schemas', 1),
  ('skill_3', 'API Optimization', 2),
  ('skill_4', 'Clean Code', 3)
ON CONFLICT ("id") DO NOTHING;

INSERT INTO "SocialLink" ("id", "platform", "handle", "url", "initials", "order") VALUES
  ('social_ig', 'Instagram', '@rey_wkw', 'https://instagram.com/rey_wkw', 'IG', 0),
  ('social_gh', 'GitHub', '@RenaldiGH', 'https://github.com/RenaldiGH', 'GH', 1),
  ('social_tk', 'TikTok', '@reyawikwok', 'https://tiktok.com/@reyawikwok', 'TK', 2)
ON CONFLICT ("id") DO NOTHING;

-- Certificate, GuestbookEntry & ContactMessage sengaja dikosongkan —
-- akan terisi lewat dashboard admin / form publik.

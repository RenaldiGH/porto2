-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('IN_PRODUCTION', 'INTERNAL_TOOL', 'ARCHIVED', 'PLANNED');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechCategory" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "badge" VARCHAR(50) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TechCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechItem" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "tag" VARCHAR(100) NOT NULL,
    "description" VARCHAR(300) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "TechItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
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
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "issuer" VARCHAR(150) NOT NULL,
    "issueDate" TIMESTAMP(3),
    "credentialUrl" VARCHAR(500),
    "imageUrl" VARCHAR(500),
    "description" VARCHAR(500),
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SkillBadge" (
    "id" TEXT NOT NULL,
    "label" VARCHAR(100) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SkillBadge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "platform" VARCHAR(50) NOT NULL,
    "handle" VARCHAR(100) NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "initials" VARCHAR(4) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestbookEntry" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "message" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GuestbookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "TechCategory_order_idx" ON "TechCategory"("order");

-- CreateIndex
CREATE INDEX "TechItem_categoryId_order_idx" ON "TechItem"("categoryId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");

-- CreateIndex
CREATE INDEX "Project_order_idx" ON "Project"("order");

-- CreateIndex
CREATE INDEX "Project_isPublished_idx" ON "Project"("isPublished");

-- CreateIndex
CREATE INDEX "Certificate_order_idx" ON "Certificate"("order");

-- CreateIndex
CREATE INDEX "SkillBadge_order_idx" ON "SkillBadge"("order");

-- CreateIndex
CREATE INDEX "SocialLink_order_idx" ON "SocialLink"("order");

-- CreateIndex
CREATE INDEX "GuestbookEntry_createdAt_idx" ON "GuestbookEntry"("createdAt");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToTag_AB_unique" ON "_ProjectToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToTag_B_index" ON "_ProjectToTag"("B");

-- AddForeignKey
ALTER TABLE "TechItem" ADD CONSTRAINT "TechItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TechCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTag" ADD CONSTRAINT "_ProjectToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToTag" ADD CONSTRAINT "_ProjectToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

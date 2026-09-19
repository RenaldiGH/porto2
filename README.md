 # Reynaldi Portfolio — Monochrome Developer Showcase

Next.js portfolio untuk Reynaldi (SMK PGRI 3 Malang), lengkap dengan **dashboard admin** (`/admin`, login di `/login`) dan database **PostgreSQL via Supabase**.

## Tech Stack

- Next.js 14 (App Router) + TypeScript (strict)
- Tailwind CSS + Framer Motion + lucide-react
- **Prisma ORM + PostgreSQL (Supabase)**
- **Resend** — notifikasi email dari form kontak
- Auth admin custom: JWT (`jose`) + `bcryptjs`, tanpa dependency auth pihak ketiga

## 1. Setup Supabase (Database)

1. Buat akun & project baru di [supabase.com](https://supabase.com) (gratis).
2. Buka **Project Settings → Database → Connection String**.
3. Kamu akan lihat 2 mode koneksi — salin keduanya:
   - **Transaction pooler** (port `6543`) → untuk `DATABASE_URL`
   - **Session / Direct connection** (port `5432`) → untuk `DIRECT_URL`
4. Copy `.env.example` jadi `.env`, isi kedua URL tersebut (ganti `[PASSWORD]` dengan password database yang kamu buat saat setup project).

## 2. Setup Email Notifikasi (Resend)

1. Daftar gratis di [resend.com](https://resend.com) → buat API Key.
2. Isi `.env`:
   ```
   RESEND_API_KEY="re_xxxxxxxxxxxx"
   CONTACT_EMAIL_TO="emailkamu@gmail.com"
   ```
3. Default pengirim pakai domain testing `onboarding@resend.dev` (langsung jalan tanpa setup). Kalau mau pakai domain sendiri (misal `noreply@reynaldi.dev`), verifikasi domainnya dulu di dashboard Resend, lalu ganti `from` di `src/lib/email.ts`.

> Tanpa `RESEND_API_KEY` diisi, form kontak tetap jalan normal dan pesannya tetap tersimpan ke database — cuma notifikasi emailnya di-skip (dicatat di log server).

## 3. Setup Login Admin

1. Generate hash password (setelah `npm install`):
   ```bash
   npm run hash:password -- "password-rahasia-kamu"
   ```
2. Salin hasil hash-nya, isi di `.env`:
   ```
   ADMIN_EMAIL="admin@reynaldi.dev"
   ADMIN_PASSWORD_HASH="<hasil hash dari langkah 1>"
   AUTH_SECRET="string-acak-minimal-32-karakter"
   ```
   (`AUTH_SECRET` bebas, contoh generate cepat: `openssl rand -base64 32`)
3. Setelah semua service jalan, buka `https://domainkamu.com/login` untuk masuk ke dashboard admin di `/admin`.

## 4. Setup Sinkronisasi GitHub (Personal Access Token)

Fitur "Sinkronisasi Repo" di dashboard admin menarik daftar repository GitHub kamu lewat **Personal Access Token (PAT)** — bukan OAuth App penuh, karena dashboard ini cuma dipakai 1 admin (bukan multi-user login), jadi token statis di server sudah cukup aman dan jauh lebih simpel.

1. Buka [github.com/settings/tokens](https://github.com/settings/tokens)
2. Klik **Generate new token** (classic atau fine-grained, keduanya bisa)
3. Kasih akses scope **`repo`** (read access ke repository — kalau fine-grained, pilih "Read-only" untuk "Contents" & "Metadata")
4. Salin tokennya, isi di `.env`:
   ```
   GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"
   ```
5. Buka `/admin/sync` — daftar repo kamu akan muncul, tinggal klik **Impor** pada repo yang mau dijadikan proyek portofolio (otomatis masuk sebagai draft, tinggal dilengkapi & di-publish lewat **Kelola Proyek**).

> Kalau suatu saat kamu butuh flow **"Login with GitHub"** yang sebenarnya (banyak admin, masing-masing login pakai akun GitHub sendiri), itu perlu OAuth App terpisah (Client ID/Secret + callback URL) — bisa ditambahkan lain waktu kalau memang dibutuhkan.

## Update Skema: Skill Icon

Ditambahkan field `iconUrl` di tabel `SkillBadge` (buat logo teknologi di tab "Tech Stack" — Portfolio Showcase). Kalau database Supabase kamu sudah pernah di-migrate sebelumnya, jalankan sekali lagi supaya kolom barunya ikut terbuat:

```bash
npx prisma migrate dev --name add_skill_icon_url
```

Lalu tambahkan skill icon-nya lewat menu **Tech Stack** di dashboard admin (bagian bawah, "Skill Icons") — bukan lewat seed, supaya data proyek/isi lain yang sudah ada tidak ikut terhapus.

## 5. Menjalankan di Lokal

```bash
npm install
cp .env.example .env    # isi semua variabel di atas
npx prisma generate
npx prisma migrate dev --name init   # bikin tabel di Supabase
npm run prisma:seed                  # isi data awal
npm run dev
```

Buka:
- `http://localhost:3000` → portofolio publik
- `http://localhost:3000/login` → login admin
- `http://localhost:3000/admin` → dashboard admin (setelah login)

## 6. Deploy ke Vercel (Free Tier)

1. Push project ke GitHub.
2. Import repo di [vercel.com](https://vercel.com/new).
3. Di **Environment Variables**, isi SEMUA variabel dari `.env` kamu:
   `DATABASE_URL`, `DIRECT_URL`, `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `AUTH_SECRET`, `GITHUB_TOKEN`.
4. Deploy. `postinstall` script (`prisma generate`) akan jalan otomatis saat build.
5. Kalau database masih kosong, jalankan migrasi dari lokal dulu (`npx prisma migrate dev`) sebelum deploy — Vercel tidak menjalankan migrasi otomatis.
6. Setelah live, akses `https://reynaldiporto.vercel.app/login` untuk masuk ke admin.

## Struktur Proyek

```
src/
  app/
    (public site)/page.tsx, layout.tsx     # portofolio publik
    login/page.tsx                          # form login admin
    admin/                                  # dashboard admin (dilindungi middleware)
      layout.tsx                            # sidebar + cek sesi
      page.tsx                              # ringkasan/dashboard
      profile/                              # edit headline/bio/quote (Hero)
      projects/                             # Kelola Proyek (list, tambah, edit)
      tech-stack/                           # Kelola kategori & item tech stack
      guestbook/                            # moderasi komentar guestbook
      certificates/                         # kelola sertifikat
      sync/                                  # Sinkronisasi Repo (GitHub PAT)
      settings/                              # placeholder
    api/
      auth/login, auth/logout               # session admin (cookie JWT)
      admin/github/repos, admin/github/user # proteksi sesi admin
      profile (GET publik, PATCH admin)
      projects, projects/[id]               # GET publik (published only), mutasi admin
      certificates, certificates/[id]       # GET publik, mutasi admin
      tech-stack, tech-stack/[id], tech-stack/items(/[id])  # GET publik, mutasi admin
      guestbook, guestbook/[id]             # POST publik (komentar), DELETE admin
      contact                               # POST publik, simpan pesan + kirim email (Resend)
      socials                               # GET publik
  components/
    admin/                                  # Sidebar, ProjectsTable, ProjectForm, dll
    (Header, Hero, TechStack, dll)          # komponen portofolio publik
  lib/
    prisma.ts, auth.ts, email.ts
middleware.ts                               # proteksi route /admin/*
prisma/schema.prisma                        # skema PostgreSQL lengkap
database.sql                                # alternatif import manual (Supabase SQL Editor)
scripts/hash-password.js                    # generate ADMIN_PASSWORD_HASH
```

## Dashboard Admin — Fitur

| Menu | Fungsi |
| :--- | :--- |
| **Dashboard** | Ringkasan jumlah proyek, sertifikat, guestbook, pesan belum dibaca |
| **Profil** | Edit headline, bio, quote, tahun pengalaman — tampil langsung di Hero portofolio publik |
| **Kelola Proyek** | Tambah/edit/hapus proyek, toggle Tayang/Draft, cari & filter — otomatis tampil di portofolio publik |
| **Tech Stack** | Kelola kategori & item Tech Stack Breakdown, DAN grid logo skill (tab "Tech Stack" di Portfolio Showcase) |
| **Sinkronisasi Repo** | Tarik daftar repo GitHub (pakai PAT), impor sebagai proyek draft |
| **Sertifikasi & Skill** | Tambah/hapus sertifikat — otomatis tampil di tab Certificates |
| **Buku Tamu** | Lihat & hapus komentar guestbook |
| **Pengaturan** | Panduan ganti password admin |

> Catatan: sinkronisasi pakai Personal Access Token (bukan OAuth App penuh) — lihat bagian "Setup Sinkronisasi GitHub" di atas untuk alasan & cara setup.

## Keamanan API

Semua endpoint yang mengubah data (POST/PATCH/DELETE untuk proyek, sertifikat, tech stack, dan hapus komentar guestbook) **wajib login admin** — dicek lewat `requireAdminSession()` di setiap route, bukan cuma dilindungi di level halaman. Endpoint yang memang untuk publik tetap terbuka tanpa login: kirim pesan kontak, kirim komentar guestbook, dan semua GET data portofolio (proyek yang published, sertifikat, tech stack, sosial media, profil).

> Belum ada admin UI untuk mengelola **Sosial Media** (Instagram/GitHub/TikTok) dan **Skill Badge** (chip di tab Tech Stack) — datanya masih di `src/data/content.ts` untuk skill badge, dan tabel `SocialLink` di database untuk sosial media (sudah tersambung ke halaman publik lewat `/api/socials`, tapi belum ada form tambah/edit di dashboard). Kalau butuh, tinggal bilang.

## Keamanan Login

- Password admin di-hash dengan **bcrypt**, disimpan di environment variable (bukan database) — jadi tidak perlu tabel `User` terpisah untuk kasus single-admin ini.
- Session pakai **JWT** yang ditandatangani `AUTH_SECRET`, disimpan di cookie `httpOnly` + `secure` (production) + `sameSite=lax` — tidak bisa diakses lewat JavaScript di browser (aman dari XSS pencurian token).
- Semua route `/admin/*` diproteksi di `middleware.ts` (edge, sebelum halaman dirender) DAN dicek ulang di `src/app/admin/layout.tsx` (defense in depth).

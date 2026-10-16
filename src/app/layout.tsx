import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reynaldi — Backend Developer & Database Management",
  description:
    "Portofolio Reynaldi, siswa SMK PGRI 3 Malang — Backend Developer & Database Management. Next.js, TypeScript, Tailwind CSS, MySQL & Prisma.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className="bg-black text-white font-sans min-h-screen relative overflow-x-hidden bg-grid-pattern">
        {children}
      </body>
    </html>
  );
}

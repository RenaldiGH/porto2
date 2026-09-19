import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken, COOKIE_NAME } from "@/lib/session";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: middleware sudah memproteksi route ini, tapi dicek lagi
  // di server component supaya tidak ada celah walau middleware ter-skip.
  const token = cookies().get(COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      <AdminSidebar adminEmail={session.email} />
      <main className="flex-1 min-w-0 p-8 lg:p-10">{children}</main>
    </div>
  );
}

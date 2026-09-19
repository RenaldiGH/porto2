import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/require-admin";
import { fetchGitHubUser } from "@/lib/github";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await fetchGitHubUser();
    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/admin/github/user failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal menghubungi GitHub" },
      { status: 502 }
    );
  }
}

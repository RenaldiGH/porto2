import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/require-admin";
import { fetchGitHubRepos } from "@/lib/github";

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const repos = await fetchGitHubRepos();
    return NextResponse.json(repos);
  } catch (error) {
    console.error("GET /api/admin/github/repos failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal mengambil data GitHub" },
      { status: 502 }
    );
  }
}

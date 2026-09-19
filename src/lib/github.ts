// Integrasi GitHub pakai Personal Access Token (PAT), bukan OAuth App penuh.
// Alasan: dashboard ini cuma untuk 1 admin (bukan multi-user login), jadi
// token statis di server jauh lebih simpel & tetap aman (tidak pernah
// dikirim ke browser) dibanding bikin OAuth App (client id/secret/callback).

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  default_branch: string;
  language: string | null;
  private: boolean;
  fork: boolean;
  updated_at: string;
  homepage: string | null;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
}

function getHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN belum diisi di .env");
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export async function fetchGitHubUser(): Promise<GitHubUser> {
  const res = await fetch("https://api.github.com/user", {
    headers: getHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Token GitHub tidak valid (${res.status}). Cek kembali GITHUB_TOKEN di .env.`);
  }
  return res.json();
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(
    "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner",
    { headers: getHeaders(), cache: "no-store" }
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gagal mengambil daftar repo dari GitHub (${res.status}). ${body}`);
  }
  return res.json();
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/require-admin";
import { uploadFile } from "@/lib/supabase-storage";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "misc").replace(/[^a-z0-9-]/gi, "");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "Ukuran file maksimal 10MB" }, { status: 400 });
    }

    const url = await uploadFile(file, folder || "misc");
    return NextResponse.json({ url });
  } catch (error) {
    console.error("POST /api/upload failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal upload file" },
      { status: 500 }
    );
  }
}

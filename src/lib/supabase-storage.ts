import { createClient } from "@supabase/supabase-js";

// Nama "wadah" (bucket) tempat semua file diupload — dibuat otomatis kalau
// belum ada, jadi tidak perlu setup manual di dashboard Supabase.
const BUCKET_NAME = "portfolio-assets";

function getClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY belum diisi di .env");
  }
  // service_role key dipakai supaya upload bisa dilakukan dari server tanpa
  // perlu policy RLS rumit — TIDAK PERNAH dikirim ke browser (cuma dipakai
  // di dalam API route, bukan di komponen client).
  return createClient(url, serviceRoleKey);
}

let bucketReady = false;

async function ensureBucket() {
  if (bucketReady) return;
  const supabase = getClient();
  const { data: buckets } = await supabase.storage.listBuckets();
  const exists = buckets?.some((b) => b.name === BUCKET_NAME);
  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: "10MB",
    });
    // Abaikan error "already exists" kalau ada race condition (2 request bersamaan)
    if (error && !error.message.toLowerCase().includes("already exists")) {
      throw error;
    }
  }
  bucketReady = true;
}

export async function uploadFile(file: File, folder: string): Promise<string> {
  await ensureBucket();
  const supabase = getClient();

  const arrayBuffer = await file.arrayBuffer();
  const safeExt = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(path, Buffer.from(arrayBuffer), {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return data.publicUrl;
}

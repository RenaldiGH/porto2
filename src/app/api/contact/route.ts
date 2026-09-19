import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactNotification } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim().slice(0, 120);
    const email = String(body?.email ?? "").trim().slice(0, 160);
    const message = String(body?.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
    }

    const saved = await prisma.contactMessage.create({
      data: { name, email, message },
    });

    // Pesan sudah aman tersimpan di database di atas. Kirim notifikasi email
    // sebagai langkah tambahan — kalau gagal, tidak menggagalkan permintaan
    // (pesan tetap tersimpan, cuma tidak ada notifikasi).
    const emailResult = await sendContactNotification({ name, email, message });

    return NextResponse.json({ ok: true, id: saved.id, emailSent: emailResult.sent }, { status: 201 });
  } catch (error) {
    console.error("POST /api/contact failed:", error);
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

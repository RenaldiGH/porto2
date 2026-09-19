import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface ContactEmailInput {
  name: string;
  email: string;
  message: string;
}

/**
 * Mengirim notifikasi email saat ada pesan kontak baru.
 * Tidak melempar error kalau RESEND_API_KEY belum diisi — cukup dilewati
 * (skip) supaya pesan tetap tersimpan di database walau email gagal/belum
 * dikonfigurasi.
 */
export async function sendContactNotification({ name, email, message }: ContactEmailInput) {
  if (!resend) {
    console.warn("RESEND_API_KEY belum diisi — notifikasi email dilewati.");
    return { sent: false, reason: "not_configured" as const };
  }

  const to = process.env.CONTACT_EMAIL_TO;
  if (!to) {
    console.warn("CONTACT_EMAIL_TO belum diisi — notifikasi email dilewati.");
    return { sent: false, reason: "no_recipient" as const };
  }

  try {
    await resend.emails.send({
      // Domain "resend.dev" ini domain testing bawaan Resend, langsung bisa
      // dipakai tanpa verifikasi. Ganti dengan domainmu sendiri kalau sudah
      // punya (lihat README bagian Notifikasi Email).
      from: "Reynaldi Portfolio <onboarding@resend.dev>",
      to,
      reply_to: email,
      subject: `Pesan baru dari ${name} — Reynaldi Portfolio`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Pesan baru dari form kontak</h2>
          <p><strong>Nama:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Pesan:</strong></p>
          <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
        </div>
      `,
    });
    return { sent: true as const };
  } catch (error) {
    console.error("Gagal mengirim email notifikasi:", error);
    return { sent: false, reason: "send_failed" as const };
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

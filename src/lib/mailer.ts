import nodemailer, { type Transporter } from "nodemailer";
import { db } from "@/db";
import { emailLogs } from "@/db/schema";
import { getSettings } from "@/lib/data";

let transporter: Transporter | null = null;
function getTransport() {
  if (!process.env.SMTP_HOST) return null;
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT || 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS || "" } : undefined,
    });
  }
  return transporter;
}

/** Sends via SMTP when configured; always records the message in email_logs. Never throws. */
export async function sendMail(opts: { to: string; subject: string; text: string; replyTo?: string }) {
  if (!opts.to) return;
  const s = await getSettings();
  const from = process.env.SMTP_FROM || `${s.brand_name} <${s.contact_email || "no-reply@localhost"}>`;
  let status = "logged";
  let error = "";
  const t = getTransport();
  if (t) {
    try {
      await t.sendMail({ from, to: opts.to, subject: opts.subject, text: opts.text, replyTo: opts.replyTo });
      status = "sent";
    } catch (e) {
      status = "failed";
      error = (e as Error).message.slice(0, 500);
    }
  }
  try {
    await db.insert(emailLogs).values({ toEmail: opts.to, subject: opts.subject, body: opts.text.slice(0, 5000), status, error });
  } catch {
    /* ignore */
  }
}

export async function notifyTeam(subject: string, text: string, replyTo?: string) {
  const s = await getSettings();
  await sendMail({ to: s.notify_email || s.contact_email, subject, text, replyTo });
}

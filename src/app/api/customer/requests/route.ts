import { eq } from "drizzle-orm";
import { db } from "@/db";
import { contactQueries, users } from "@/db/schema";
import { audit, clientIp, fail, guardUser, json, rateLimit, str } from "@/lib/auth";
import { notifyTeam } from "@/lib/mailer";

export async function POST(req: Request) {
  const g = await guardUser(req);
  if ("error" in g) return g.error;
  if (!rateLimit(`req:${g.user.id}`, 10, 60 * 60_000)) return fail("Too many requests. Please try again later.", 429);
  const b = await req.json().catch(() => null);
  const subject = str(b?.subject, 200), message = str(b?.message, 4000);
  if (!subject) return fail("Please add a subject.");
  if (message.length < 10) return fail("Please describe your request (at least 10 characters).");
  const [u] = await db.select().from(users).where(eq(users.id, g.user.id)).limit(1);
  const [row] = await db.insert(contactQueries).values({
    userId: u.id, name: u.fullName, email: u.email, phone: u.mobile, company: u.company, subject, serviceInterest: str(b?.serviceInterest, 120), message, ip: clientIp(req),
  }).returning({ id: contactQueries.id });
  await audit({ type: "user", id: u.id, name: u.fullName }, "customer.request.create", "contact_query", row.id, subject, req);
  await notifyTeam(`Customer request: ${subject}`, `From: ${u.fullName} <${u.email}>\nCompany: ${u.company}\nService: ${str(b?.serviceInterest, 120)}\n\n${message}`, u.email);
  return json({ ok: true });
}

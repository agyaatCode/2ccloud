import { db } from "@/db";
import { contactQueries } from "@/db/schema";
import { audit, clientIp, fail, getUser, isEmail, json, rateLimit, sameOrigin, str } from "@/lib/auth";
import { notifyTeam, sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("Cross-origin request blocked.", 403);
  const ip = clientIp(req);
  if (!rateLimit(`contact:${ip}`, 6, 10 * 60_000)) return fail("Too many messages. Please try again later.", 429);
  const b = await req.json().catch(() => null);
  if (!b || typeof b !== "object") return fail("Invalid request.");
  if (str(b.website)) return json({ ok: true }); // honeypot
  const name = str(b.name, 140), email = str(b.email, 190).toLowerCase(), message = str(b.message, 4000);
  if (name.length < 2) return fail("Please enter your name.");
  if (!isEmail(email)) return fail("Please enter a valid email address.");
  if (message.length < 10) return fail("Please tell us a little more (at least 10 characters).");
  const user = await getUser();
  const [row] = await db.insert(contactQueries).values({
    userId: user?.id ?? null, name, email, phone: str(b.phone, 30), company: str(b.company, 160), subject: str(b.subject, 200),
    serviceInterest: str(b.serviceInterest, 120), message, ip,
  }).returning({ id: contactQueries.id });
  await audit({ type: "public", name }, "contact.create", "contact_query", row.id, email, req);
  await Promise.all([
    notifyTeam(`New enquiry from ${name}${b.serviceInterest ? ` — ${str(b.serviceInterest, 80)}` : ""}`, `Name: ${name}\nEmail: ${email}\nPhone: ${str(b.phone, 30)}\nCompany: ${str(b.company, 160)}\nService: ${str(b.serviceInterest, 120)}\nSubject: ${str(b.subject, 200)}\n\n${message}`, email),
    sendMail({ to: email, subject: "We received your message", text: `Hello ${name},\n\nThank you for contacting us. An engineer will respond within one business day.\n\nYour message:\n${message}\n` }),
  ]);
  return json({ ok: true });
}

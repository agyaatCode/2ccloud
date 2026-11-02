import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { audit, clientIp, createSession, fail, hashPassword, isEmail, json, passwordIssue, rateLimit, sameOrigin, sessionCookies, str, withCookies } from "@/lib/auth";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("Cross-origin request blocked.", 403);
  if (!rateLimit(`register:${clientIp(req)}`, 8, 60 * 60_000)) return fail("Too many attempts. Please try again later.", 429);
  const b = await req.json().catch(() => null);
  if (!b) return fail("Invalid request.");
  if (str(b.website)) return json({ ok: true });
  const fullName = str(b.fullName, 140), email = str(b.email, 190).toLowerCase(), mobile = str(b.mobile, 30);
  const password = typeof b.password === "string" ? b.password : "";
  if (fullName.length < 2) return fail("Please enter your full name.");
  if (!isEmail(email)) return fail("Please enter a valid email address.");
  if (!/^[+\d][\d\s-]{6,20}$/.test(mobile)) return fail("Please enter a valid mobile number.");
  const issue = passwordIssue(password);
  if (issue) return fail(issue);
  if (password !== b.confirmPassword) return fail("Passwords do not match.");
  if (!str(b.country, 80)) return fail("Please enter your country.");
  const [exists] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (exists) return fail("An account with this email already exists. Please sign in.", 409);
  const [u] = await db.insert(users).values({
    fullName, email, mobile, passwordHash: hashPassword(password), company: str(b.company, 160), country: str(b.country, 80),
    state: str(b.state, 80), city: str(b.city, 80), address: str(b.address, 500), serviceInterest: str(b.serviceInterest, 120),
  }).returning({ id: users.id });
  await audit({ type: "user", id: u.id, name: fullName }, "customer.register", "user", u.id, email, req);
  await sendMail({ to: email, subject: "Welcome — your account is ready", text: `Hello ${fullName},\n\nYour customer account has been created. You can sign in at any time to manage your details and submit service requests.\n` });
  const s = await createSession("user", u.id, req);
  return withCookies(json({ ok: true }), sessionCookies("user", s));
}

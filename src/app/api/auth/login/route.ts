import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { audit, clientIp, createSession, fail, json, rateLimit, sameOrigin, sessionCookies, str, verifyPassword, withCookies } from "@/lib/auth";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("Cross-origin request blocked.", 403);
  const b = await req.json().catch(() => null);
  const email = str(b?.email, 190).toLowerCase();
  const password = typeof b?.password === "string" ? b.password : "";
  if (!rateLimit(`login:${clientIp(req)}:${email}`, 8, 10 * 60_000)) return fail("Too many sign-in attempts. Please wait a few minutes.", 429);
  const [u] = email ? await db.select().from(users).where(eq(users.email, email)).limit(1) : [];
  // constant-ish work to avoid user enumeration by timing
  const ok = u ? verifyPassword(password, u.passwordHash) : (verifyPassword(password, "scrypt$00$00"), false);
  if (!u || !ok || !u.isActive) return fail("Incorrect email or password.", 401);
  await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, u.id));
  await audit({ type: "user", id: u.id, name: u.fullName }, "customer.login", "user", u.id, "", req);
  const s = await createSession("user", u.id, req);
  return withCookies(json({ ok: true }), sessionCookies("user", s));
}

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { audit, clearCookies, clientIp, createSession, destroySession, fail, json, rateLimit, sameOrigin, sessionCookies, str, verifyPassword, withCookies } from "@/lib/auth";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("Cross-origin request blocked.", 403);
  const b = await req.json().catch(() => null);
  const email = str(b?.email, 190).toLowerCase();
  const password = typeof b?.password === "string" ? b.password : "";
  if (!rateLimit(`admin-login:${clientIp(req)}:${email}`, 6, 15 * 60_000)) return fail("Too many attempts. Please wait 15 minutes.", 429);
  const [a] = email ? await db.select().from(admins).where(eq(admins.email, email)).limit(1) : [];
  const ok = a ? verifyPassword(password, a.passwordHash) : (verifyPassword(password, "scrypt$00$00"), false);
  if (!a || !ok || !a.isActive) {
    await audit({ type: "public", name: email }, "admin.login.failed", "admin", "", "", req);
    return fail("Incorrect email or password.", 401);
  }
  await db.update(admins).set({ lastLoginAt: new Date() }).where(eq(admins.id, a.id));
  await audit({ id: a.id, name: a.name }, "admin.login", "admin", a.id, "", req);
  const s = await createSession("admin", a.id, req);
  return withCookies(json({ ok: true }), sessionCookies("admin", s));
}

export async function DELETE() {
  await destroySession("admin");
  return withCookies(json({ ok: true }), clearCookies("admin"));
}

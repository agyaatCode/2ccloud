import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { admins, auditLogs, rolePermissions, permissions, roles, sessions, users } from "@/db/schema";

export const ADMIN_COOKIE = "adm_sid";
export const USER_COOKIE = "usr_sid";
export const CSRF_COOKIE = "csrf_token";
const SESSION_HOURS = { admin: 12, user: 24 * 7 };

export type AdminCtx = { id: number; name: string; email: string; roleKey: string; roleName: string; permissions: string[]; csrf: string };
export type UserCtx = { id: number; fullName: string; email: string; csrf: string };

/* ---------- passwords (scrypt) ---------- */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${hash}`;
}
export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64);
  const known = Buffer.from(hash, "hex");
  return known.length === test.length && crypto.timingSafeEqual(known, test);
}
export function passwordIssue(pw: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters.";
  if (!/[a-z]/i.test(pw) || !/\d/.test(pw)) return "Password must include letters and numbers.";
  return null;
}

/* ---------- request helpers ---------- */
export function clientIp(req: Request): string {
  const f = req.headers.get("x-forwarded-for");
  return (f ? f.split(",")[0] : req.headers.get("x-real-ip") || "").trim().slice(0, 64);
}
export function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
export function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}
export const fail = (message: string, status = 400, extra: Record<string, unknown> = {}) => json({ ok: false, error: message, ...extra }, status);

/* ---------- rate limiting (in-memory, per instance) ---------- */
const buckets = new Map<string, { n: number; reset: number }>();
export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { n: 1, reset: now + windowMs });
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
    return true;
  }
  b.n += 1;
  return b.n <= max;
}

/* ---------- sessions ---------- */
const sha = (s: string) => crypto.createHash("sha256").update(s).digest("hex");

export async function createSession(kind: "admin" | "user", subjectId: number, req: Request): Promise<{ token: string; csrf: string; maxAge: number; secure: boolean }> {
  const token = crypto.randomBytes(32).toString("hex");
  const csrf = crypto.randomBytes(24).toString("hex");
  const maxAge = SESSION_HOURS[kind] * 3600;
  await db.insert(sessions).values({
    id: sha(token),
    kind,
    subjectId,
    csrfToken: csrf,
    ip: clientIp(req),
    userAgent: (req.headers.get("user-agent") || "").slice(0, 300),
    expiresAt: new Date(Date.now() + maxAge * 1000),
  });
  const secure = (req.headers.get("x-forwarded-proto") || new URL(req.url).protocol.replace(":", "")) === "https";
  return { token, csrf, maxAge, secure };
}

export function sessionCookies(kind: "admin" | "user", s: { token: string; csrf: string; maxAge: number; secure: boolean }): string[] {
  const base = `Path=/; Max-Age=${s.maxAge}; SameSite=Lax${s.secure ? "; Secure" : ""}`;
  return [
    `${kind === "admin" ? ADMIN_COOKIE : USER_COOKIE}=${s.token}; HttpOnly; ${base}`,
    `${CSRF_COOKIE}=${s.csrf}; ${base}`,
  ];
}
export function clearCookies(kind: "admin" | "user"): string[] {
  return [`${kind === "admin" ? ADMIN_COOKIE : USER_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`];
}
export function withCookies(res: Response, list: string[]) {
  for (const c of list) res.headers.append("Set-Cookie", c);
  return res;
}
export async function destroySession(kind: "admin" | "user") {
  const jar = await cookies();
  const t = jar.get(kind === "admin" ? ADMIN_COOKIE : USER_COOKIE)?.value;
  if (t) await db.delete(sessions).where(eq(sessions.id, sha(t)));
}

async function loadSession(kind: "admin" | "user") {
  const jar = await cookies();
  const token = jar.get(kind === "admin" ? ADMIN_COOKIE : USER_COOKIE)?.value;
  if (!token || token.length < 32) return null;
  const [s] = await db
    .select()
    .from(sessions)
    .where(and(eq(sessions.id, sha(token)), eq(sessions.kind, kind), gt(sessions.expiresAt, new Date())))
    .limit(1);
  return s ?? null;
}

export async function getAdmin(): Promise<AdminCtx | null> {
  try {
    const s = await loadSession("admin");
    if (!s) return null;
    const [a] = await db.select().from(admins).where(eq(admins.id, s.subjectId)).limit(1);
    if (!a || !a.isActive) return null;
    let roleKey = "none";
    let roleName = "No role";
    let perms: string[] = [];
    if (a.roleId) {
      const [r] = await db.select().from(roles).where(eq(roles.id, a.roleId)).limit(1);
      if (r) {
        roleKey = r.key;
        roleName = r.name;
        const rows = await db
          .select({ key: permissions.key })
          .from(rolePermissions)
          .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
          .where(eq(rolePermissions.roleId, r.id));
        perms = rows.map((x) => x.key);
      }
    }
    if (roleKey === "super_admin") perms = ["*"];
    return { id: a.id, name: a.name, email: a.email, roleKey, roleName, permissions: perms, csrf: s.csrfToken };
  } catch {
    return null;
  }
}
export async function getUser(): Promise<UserCtx | null> {
  try {
    const s = await loadSession("user");
    if (!s) return null;
    const [u] = await db.select().from(users).where(eq(users.id, s.subjectId)).limit(1);
    if (!u || !u.isActive) return null;
    return { id: u.id, fullName: u.fullName, email: u.email, csrf: s.csrfToken };
  } catch {
    return null;
  }
}

export const can = (a: AdminCtx, perm?: string) => !perm || a.permissions.includes("*") || a.permissions.includes(perm);

/** Server-component guard. */
export async function requireAdminPage(perm?: string): Promise<AdminCtx> {
  const a = await getAdmin();
  if (!a) redirect("/admin/login");
  if (!can(a, perm)) redirect("/admin?denied=1");
  return a;
}
export async function requireUserPage(): Promise<UserCtx> {
  const u = await getUser();
  if (!u) redirect("/login?next=/dashboard");
  return u;
}

/** Route-handler guard: authentication + authorization + CSRF for mutations. */
export async function guardAdmin(req: Request, perm?: string): Promise<{ admin: AdminCtx } | { error: Response }> {
  const admin = await getAdmin();
  if (!admin) return { error: fail("Authentication required.", 401) };
  if (!can(admin, perm)) return { error: fail("You do not have permission to do this.", 403) };
  if (!["GET", "HEAD"].includes(req.method)) {
    if (!sameOrigin(req)) return { error: fail("Cross-origin request blocked.", 403) };
    if (req.headers.get("x-csrf-token") !== admin.csrf) return { error: fail("Invalid CSRF token. Please refresh the page.", 403) };
  }
  return { admin };
}
export async function guardUser(req: Request): Promise<{ user: UserCtx } | { error: Response }> {
  const user = await getUser();
  if (!user) return { error: fail("Please sign in.", 401) };
  if (!["GET", "HEAD"].includes(req.method)) {
    if (!sameOrigin(req)) return { error: fail("Cross-origin request blocked.", 403) };
    if (req.headers.get("x-csrf-token") !== user.csrf) return { error: fail("Invalid CSRF token. Please refresh the page.", 403) };
  }
  return { user };
}

export async function audit(
  actor: { type?: "admin" | "user" | "public"; id?: number; name?: string } | null,
  action: string,
  entityType = "",
  entityId: string | number = "",
  details = "",
  req?: Request,
) {
  try {
    await db.insert(auditLogs).values({
      actorType: actor?.type ?? "admin",
      actorId: actor?.id ?? null,
      actorName: actor?.name ?? "",
      action,
      entityType,
      entityId: String(entityId),
      details: details.slice(0, 2000),
      ip: req ? clientIp(req) : "",
    });
  } catch {
    /* never block on audit failure */
  }
}

export async function currentHost(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
}

/* ---------- tiny validators ---------- */
export const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 190;
export const slugify = (v: string) =>
  v.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 150);

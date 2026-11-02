import { eq } from "drizzle-orm";
import { db } from "@/db";
import { brandingSettings } from "@/db/schema";
import { audit, fail, guardAdmin, json, str } from "@/lib/auth";
import { clearCache } from "@/lib/data";

const KEYS = ["logoUrl", "mobileLogoUrl", "darkLogoUrl", "faviconUrl"] as const;

export async function GET(req: Request) {
  const g = await guardAdmin(req, "branding.manage");
  if ("error" in g) return g.error;
  const [b] = await db.select().from(brandingSettings).limit(1);
  return json({ ok: true, branding: b ?? {} });
}

export async function PUT(req: Request) {
  const g = await guardAdmin(req, "branding.manage");
  if ("error" in g) return g.error;
  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request.");
  const values: Record<string, string> = {};
  for (const k of KEYS) {
    const v = str(body[k], 2000);
    if (v && !/^(https?:\/\/|\/)/i.test(v)) return fail("Logo fields must be an uploaded file or an http(s) URL.");
    values[k] = v;
  }
  if (!values.logoUrl) return fail("A primary logo is required.");
  const [existing] = await db.select().from(brandingSettings).limit(1);
  if (existing) await db.update(brandingSettings).set({ ...values, updatedAt: new Date() }).where(eq(brandingSettings.id, existing.id));
  else await db.insert(brandingSettings).values(values);
  clearCache();
  await audit({ id: g.admin.id, name: g.admin.name }, "branding.update", "branding", 1, values.logoUrl, req);
  return json({ ok: true });
}

import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { audit, fail, guardAdmin, json, str } from "@/lib/auth";
import { clearCache, getSettings } from "@/lib/data";
import { SETTINGS_DEFAULTS } from "@/lib/content";

export async function GET(req: Request) {
  const g = await guardAdmin(req, "settings.manage");
  if ("error" in g) return g.error;
  return json({ ok: true, settings: await getSettings() });
}

export async function PUT(req: Request) {
  const g = await guardAdmin(req, "settings.manage");
  if ("error" in g) return g.error;
  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request.");
  for (const key of Object.keys(SETTINGS_DEFAULTS)) {
    if (!(key in body)) continue;
    const value = str(body[key], 2000);
    if (/_url$/.test(key) && value && !/^(https?:\/\/|\/)/i.test(value)) return fail(`${key.replace(/_/g, " ")} must be a URL.`);
    await db.insert(siteSettings).values({ key, value }).onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } });
  }
  clearCache();
  await audit({ id: g.admin.id, name: g.admin.name }, "settings.update", "settings", "", "", req);
  return json({ ok: true });
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { pageSections, pages } from "@/db/schema";
import { audit, fail, guardAdmin, json, str } from "@/lib/auth";
import { clearCache, getSections } from "@/lib/data";
import { coerce, dbError } from "@/lib/admin/crud";
import { HERO_FIELDS } from "@/lib/admin/defs";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const g = await guardAdmin(req, "pages.manage");
  if ("error" in g) return g.error;
  const { slug } = await params;
  const [page] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  if (!page) return fail("Page not found.", 404);
  const secs = await getSections(slug);
  const sections = Object.entries(secs).map(([key, s]) => ({
    key, eyebrow: s.eyebrow, title: s.title, body: s.body, imageUrl: s.imageUrl, videoUrl: s.videoUrl, buttonText: s.buttonText, buttonUrl: s.buttonUrl,
    itemsText: s.items.map((i) => `${i.title} | ${i.text}`).join("\n"), isActive: s.isActive,
  }));
  return json({ ok: true, page, sections });
}

export async function PUT(req: Request, { params }: Ctx) {
  const g = await guardAdmin(req, "pages.manage");
  if ("error" in g) return g.error;
  const { slug } = await params;
  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request.");
  try {
    const hero = coerce(HERO_FIELDS, body.page ?? {}, false);
    const extra: Record<string, any> = {};
    if (typeof body.page?.title === "string" && body.page.title.trim()) extra.title = str(body.page.title, 160);
    if (typeof body.page?.isPublished === "boolean") extra.isPublished = body.page.isPublished;
    const res = await db.update(pages).set({ ...hero, ...extra, updatedAt: new Date() }).where(eq(pages.slug, slug)).returning({ id: pages.id });
    if (!res.length) return fail("Page not found.", 404);
    for (const [i, s] of (Array.isArray(body.sections) ? body.sections : []).entries()) {
      const key = str(s.key, 60);
      if (!/^[a-z0-9_-]+$/i.test(key)) continue;
      const items = str(s.itemsText, 8000).split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, 24).map((l) => {
        const [a, ...rest] = l.split("|");
        return { title: a.trim(), text: rest.join("|").trim() };
      });
      const values = {
        eyebrow: str(s.eyebrow, 300), title: str(s.title, 600), body: str(s.body, 20000), imageUrl: str(s.imageUrl, 2000), videoUrl: str(s.videoUrl, 2000),
        buttonText: str(s.buttonText, 200), buttonUrl: str(s.buttonUrl, 1000), data: { items }, isActive: s.isActive !== false, sortOrder: i,
      };
      for (const u of [values.imageUrl, values.videoUrl]) if (u && !/^(https?:\/\/|\/)/i.test(u)) return fail("Media fields must be an uploaded file or an http(s) URL.");
      await db.insert(pageSections).values({ pageSlug: slug, sectionKey: key, ...values }).onConflictDoUpdate({ target: [pageSections.pageSlug, pageSections.sectionKey], set: { ...values, updatedAt: new Date() } });
    }
    clearCache();
    await audit({ id: g.admin.id, name: g.admin.name }, "page.update", "page", slug, "", req);
    return json({ ok: true });
  } catch (e) {
    const d = dbError(e);
    return fail(d.message, d.status);
  }
}

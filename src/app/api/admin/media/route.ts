import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";
import { audit, fail, guardAdmin, json, str } from "@/lib/auth";

export async function GET(req: Request) {
  const g = await guardAdmin(req);
  if ("error" in g) return g.error;
  const q = new URL(req.url).searchParams;
  const page = Math.max(1, parseInt(q.get("page") || "1", 10));
  const limit = Math.min(60, Math.max(6, parseInt(q.get("limit") || "24", 10)));
  const conds = [];
  const term = (q.get("q") || "").trim();
  if (term) conds.push(or(ilike(media.title, `%${term}%`), ilike(media.altText, `%${term}%`), ilike(media.url, `%${term}%`)));
  const kind = q.get("kind");
  if (kind && ["image", "video", "pdf"].includes(kind)) conds.push(eq(media.kind, kind));
  const where = conds.length ? and(...conds) : undefined;
  const [rows, [{ c }]] = await Promise.all([
    db.select().from(media).where(where).orderBy(desc(media.id)).limit(limit).offset((page - 1) * limit),
    db.select({ c: sql<number>`count(*)` }).from(media).where(where),
  ]);
  return json({ ok: true, rows, total: Number(c), page, limit });
}

/** Register an external image/video URL in the library. */
export async function POST(req: Request) {
  const g = await guardAdmin(req, "media.manage");
  if ("error" in g) return g.error;
  const b = await req.json().catch(() => null);
  const url = str(b?.url, 2000);
  const kind = str(b?.kind, 10);
  if (!/^https?:\/\//i.test(url)) return fail("Please enter a full http(s) URL.");
  if (!["image", "video", "pdf"].includes(kind)) return fail("Choose image, video or pdf.");
  const [row] = await db.insert(media).values({ title: str(b?.title, 200) || url.split("/").pop()?.slice(0, 80) || "External media", altText: str(b?.altText, 300), kind, source: "url", url }).returning();
  await audit({ id: g.admin.id, name: g.admin.name }, "media.add_url", "media", row.id, url, req);
  return json({ ok: true, row });
}

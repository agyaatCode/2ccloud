import fs from "node:fs/promises";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";
import { audit, fail, guardAdmin, json, str } from "@/lib/auth";
import { PUBLIC_UPLOADS, safeJoin } from "@/lib/files";
import { clearCache } from "@/lib/data";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const g = await guardAdmin(req, "media.manage");
  if ("error" in g) return g.error;
  const id = parseInt((await params).id, 10);
  const b = await req.json().catch(() => null);
  const [row] = await db.update(media).set({ title: str(b?.title, 200), altText: str(b?.altText, 300) }).where(eq(media.id, id)).returning();
  if (!row) return fail("Not found.", 404);
  await audit({ id: g.admin.id, name: g.admin.name }, "media.update", "media", id, row.title, req);
  return json({ ok: true, row });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const g = await guardAdmin(req, "media.manage");
  if ("error" in g) return g.error;
  const id = parseInt((await params).id, 10);
  const [row] = await db.delete(media).where(eq(media.id, id)).returning();
  if (!row) return fail("Not found.", 404);
  if (row.source === "upload" && row.storagePath) {
    const abs = safeJoin(PUBLIC_UPLOADS, row.storagePath.split("/"));
    if (abs) await fs.rm(abs, { force: true }).catch(() => {});
  }
  clearCache();
  await audit({ id: g.admin.id, name: g.admin.name }, "media.delete", "media", id, row.title, req);
  return json({ ok: true });
}

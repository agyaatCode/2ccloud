import { audit, fail, guardAdmin, json } from "@/lib/auth";
import { createRow, dbError, getResource, listRows } from "@/lib/admin/crud";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const { resource } = await params;
  const r = getResource(resource);
  if (!r) return fail("Unknown resource.", 404);
  const g = await guardAdmin(req, r.def.perm);
  if ("error" in g) return g.error;
  const data = await listRows(r.def, r.cfg, new URL(req.url).searchParams);
  return json({ ok: true, ...data });
}

export async function POST(req: Request, { params }: Ctx) {
  const { resource } = await params;
  const r = getResource(resource);
  if (!r || r.def.canCreate === false) return fail("Unknown resource.", 404);
  const g = await guardAdmin(req, r.def.perm);
  if ("error" in g) return g.error;
  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request.");
  try {
    const row = await createRow(r.def, r.cfg, body);
    await audit({ id: g.admin.id, name: g.admin.name }, `${resource}.create`, resource, row.id, String(row[r.def.titleField] ?? ""), req);
    return json({ ok: true, row });
  } catch (e) {
    const d = dbError(e);
    return fail(d.message, d.status);
  }
}

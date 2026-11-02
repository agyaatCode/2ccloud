import { audit, fail, guardAdmin, json } from "@/lib/auth";
import { dbError, deleteRow, getResource, getRow, updateRow } from "@/lib/admin/crud";

type Ctx = { params: Promise<{ resource: string; id: string }> };

async function setup(req: Request, ctx: Ctx) {
  const { resource, id } = await ctx.params;
  const r = getResource(resource);
  const n = parseInt(id, 10);
  if (!r || !n) return { error: fail("Not found.", 404) };
  const g = await guardAdmin(req, r.def.perm);
  if ("error" in g) return { error: g.error };
  return { r, n, admin: g.admin, resource };
}

export async function GET(req: Request, ctx: Ctx) {
  const s = await setup(req, ctx);
  if ("error" in s) return s.error;
  const data = await getRow(s.r.def, s.r.cfg, s.n);
  return data ? json({ ok: true, ...data }) : fail("Not found.", 404);
}

export async function PUT(req: Request, ctx: Ctx) {
  const s = await setup(req, ctx);
  if ("error" in s) return s.error;
  const body = await req.json().catch(() => null);
  if (!body) return fail("Invalid request.");
  try {
    const row = await updateRow(s.r.def, s.r.cfg, s.n, body);
    if (!row) return fail("Not found.", 404);
    await audit({ id: s.admin.id, name: s.admin.name }, `${s.resource}.update`, s.resource, s.n, String(row[s.r.def.titleField] ?? ""), req);
    return json({ ok: true, row });
  } catch (e) {
    const d = dbError(e);
    return fail(d.message, d.status);
  }
}

export async function DELETE(req: Request, ctx: Ctx) {
  const s = await setup(req, ctx);
  if ("error" in s) return s.error;
  if (s.r.def.canDelete === false) return fail("Deleting is not allowed.", 403);
  if (s.resource === "admins" && s.n === s.admin.id) return fail("You cannot delete your own account.", 400);
  try {
    const ok = await deleteRow(s.r.cfg, s.n);
    if (!ok) return fail("Not found.", 404);
    await audit({ id: s.admin.id, name: s.admin.name }, `${s.resource}.delete`, s.resource, s.n, "", req);
    return json({ ok: true });
  } catch (e) {
    const d = dbError(e);
    return fail(d.message, d.status);
  }
}

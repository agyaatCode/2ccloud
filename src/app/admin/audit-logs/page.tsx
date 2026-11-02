import Link from "next/link";
import { desc, ilike, or, count } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AuditPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  await requireAdminPage("audit.view");
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const page = Math.max(1, parseInt(sp.page || "1", 10));
  const where = q ? or(ilike(auditLogs.action, `%${q}%`), ilike(auditLogs.actorName, `%${q}%`), ilike(auditLogs.details, `%${q}%`), ilike(auditLogs.entityType, `%${q}%`)) : undefined;
  const [rows, [{ c }]] = await Promise.all([
    db.select().from(auditLogs).where(where).orderBy(desc(auditLogs.createdAt)).limit(40).offset((page - 1) * 40),
    db.select({ c: count() }).from(auditLogs).where(where),
  ]);
  const pages = Math.max(1, Math.ceil(Number(c) / 40));
  const qs = (p: number) => `?q=${encodeURIComponent(q)}&page=${p}`;
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold">Audit logs</h1><span className="a-pill">{Number(c)}</span>
        <form className="ml-auto flex gap-2" role="search"><input name="q" defaultValue={q} className="a-input !w-64" placeholder="Search action, user, details…" aria-label="Search audit logs" /><button className="a-btn">Search</button></form>
      </div>
      <div className="a-card admin-scroll overflow-x-auto">
        <table className="a-table">
          <thead><tr><th>When</th><th>Actor</th><th>Action</th><th>Entity</th><th>Details</th><th>IP</th></tr></thead>
          <tbody>
            {rows.map((l) => (
              <tr key={l.id}>
                <td className="whitespace-nowrap">{new Date(l.createdAt).toLocaleString("en-GB")}</td>
                <td>{l.actorName || "—"}<span className="ml-2 a-pill">{l.actorType}</span></td><td><code className="text-[12px]">{l.action}</code></td>
                <td>{l.entityType}{l.entityId ? ` #${l.entityId}` : ""}</td><td className="max-w-xs truncate text-slate-600">{l.details}</td><td className="text-[12px] text-slate-500">{l.ip}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-slate-500">No log entries.</td></tr>}
          </tbody>
        </table>
      </div>
      {pages > 1 && <div className="mt-4 flex items-center justify-between text-[13px]"><span className="text-slate-500">Page {page} of {pages}</span><div className="flex gap-2">{page > 1 && <Link className="a-btn" href={qs(page - 1)}>Previous</Link>}{page < pages && <Link className="a-btn" href={qs(page + 1)}>Next</Link>}</div></div>}
    </div>
  );
}

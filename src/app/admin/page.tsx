import Link from "next/link";
import { count, desc, eq, gte, and } from "drizzle-orm";
import { db } from "@/db";
import { admins, auditLogs, contactQueries, jobApplications, jobs, news, services, users } from "@/db/schema";
import { requireAdminPage, verifyPassword } from "@/lib/auth";
import { statusLabel } from "@/lib/admin/defs";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const admin = await requireAdminPage();
  const { denied } = await searchParams;
  const week = new Date(Date.now() - 7 * 86400000);
  const n = async (q: Promise<{ c: number }[]>) => Number((await q)[0]?.c ?? 0);
  const [svc, newsC, jobsC, apps, appsNew, cust, contactsNew, recentApps, recentContacts, logs, [me]] = await Promise.all([
    n(db.select({ c: count() }).from(services).where(eq(services.isPublished, true))),
    n(db.select({ c: count() }).from(news).where(eq(news.status, "published"))),
    n(db.select({ c: count() }).from(jobs).where(eq(jobs.status, "active"))),
    n(db.select({ c: count() }).from(jobApplications)),
    n(db.select({ c: count() }).from(jobApplications).where(gte(jobApplications.createdAt, week))),
    n(db.select({ c: count() }).from(users)),
    n(db.select({ c: count() }).from(contactQueries).where(eq(contactQueries.status, "new"))),
    db.select().from(jobApplications).orderBy(desc(jobApplications.createdAt)).limit(5),
    db.select().from(contactQueries).orderBy(desc(contactQueries.createdAt)).limit(5),
    db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(8),
    db.select().from(admins).where(and(eq(admins.id, admin.id))).limit(1),
  ]);
  const defaultPw = me ? verifyPassword("Admin@12345", me.passwordHash) : false;
  const stats: [string, number, string, string][] = [
    ["Live services", svc, "/admin/r/services", ""], ["Published news", newsC, "/admin/r/news", ""], ["Active jobs", jobsC, "/admin/r/jobs", ""],
    ["Applicants", apps, "/admin/applicants", `${appsNew} new this week`], ["Customers", cust, "/admin/r/customers", ""], ["New enquiries", contactsNew, "/admin/r/contacts", contactsNew ? "needs attention" : "all clear"],
  ];
  return (
    <div>
      <h1 className="mb-1 text-lg font-bold">Welcome back, {admin.name.split(" ")[0]}</h1>
      <p className="mb-5 text-slate-500">Role: {admin.roleName}</p>
      {denied && <p role="alert" className="mb-4 rounded border border-amber-300 bg-amber-50 px-3 py-2 font-semibold text-amber-900">You do not have permission to open that section.</p>}
      {defaultPw && <p role="alert" className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 font-semibold text-red-800">Security notice: you are still using the default administrator password. <Link className="underline" href="/admin/r/admins">Change it now</Link>.</p>}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(([l, v, h, s]) => (
          <Link key={l} href={h} className="a-card block p-4 transition-colors hover:border-[#1f73c8]">
            <p className="a-label !mb-1">{l}</p><p className="text-3xl font-bold">{v}</p>{s && <p className="mt-1 text-[12px] text-slate-500">{s}</p>}
          </Link>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {[["Edit home hero", "/admin/pages/home"], ["Change logo", "/admin/branding"], ["Add news", "/admin/r/news"], ["Post a job", "/admin/r/jobs"], ["Media library", "/admin/media"]].map(([l, h]) => <Link key={h} href={h} className="a-btn">{l}</Link>)}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="a-card"><h2 className="border-b border-slate-200 p-4 text-sm font-bold">Recent applicants</h2>
          <ul className="divide-y divide-slate-100">{recentApps.map((a) => <li key={a.id}><Link href="/admin/applicants" className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-slate-50"><span><span className="block font-semibold">{a.fullName}</span><span className="text-[12px] text-slate-500">{a.roleName === "Other" ? a.roleOther : a.roleName}</span></span><span className="a-pill">{statusLabel(a.status)}</span></Link></li>)}{recentApps.length === 0 && <li className="p-4 text-slate-500">No applications yet.</li>}</ul></section>
        <section className="a-card"><h2 className="border-b border-slate-200 p-4 text-sm font-bold">Recent enquiries</h2>
          <ul className="divide-y divide-slate-100">{recentContacts.map((c) => <li key={c.id}><Link href="/admin/r/contacts" className="flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-slate-50"><span className="min-w-0"><span className="block font-semibold">{c.name}</span><span className="block truncate text-[12px] text-slate-500">{c.subject || c.message}</span></span><span className={`a-pill ${c.status === "new" ? "warn" : ""}`}>{c.status.replace("_", " ")}</span></Link></li>)}{recentContacts.length === 0 && <li className="p-4 text-slate-500">No enquiries yet.</li>}</ul></section>
        <section className="a-card lg:col-span-2"><h2 className="border-b border-slate-200 p-4 text-sm font-bold">Recent activity</h2>
          <ul className="divide-y divide-slate-100">{logs.map((l) => <li key={l.id} className="flex flex-wrap items-center gap-x-4 px-4 py-2 text-[12.5px]"><code className="text-slate-700">{l.action}</code><span className="text-slate-500">{l.actorName || l.actorType}</span><span className="ml-auto text-slate-400">{new Date(l.createdAt).toLocaleString("en-GB")}</span></li>)}</ul></section>
      </div>
    </div>
  );
}

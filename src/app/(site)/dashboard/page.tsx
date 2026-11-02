import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contactQueries, users } from "@/db/schema";
import { Hero } from "@/components/Hero";
import { LogoutButton, ProfileForm, RequestForm } from "@/components/forms";
import { baseHero } from "@/lib/hero";
import { requireUserPage } from "@/lib/auth";
import { fmtDate } from "@/lib/util";

export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };

const STATUS: Record<string, string> = { new: "Received", in_progress: "In progress", resolved: "Resolved", spam: "Closed" };

export default async function Dashboard() {
  const ctx = await requireUserPage();
  const [u] = await db.select().from(users).where(eq(users.id, ctx.id)).limit(1);
  const reqs = await db.select().from(contactQueries).where(eq(contactQueries.userId, ctx.id)).orderBy(desc(contactQueries.createdAt)).limit(25);
  const hero = baseHero({ eyebrow: "Customer dashboard", title: `Welcome, ${u.fullName.split(" ")[0]}`, description: u.company || "Manage your details and service requests.", imageUrl: "/images/stock/register.jpg", height: 380, overlayOpacity: 84 });
  return (
    <>
      <Hero hero={hero} crumbs={[{ name: "Home", href: "/" }, { name: "Dashboard" }]} />
      <section className="bg-mist py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-[14.5px] text-slate-soft">Signed in as <strong className="text-ink">{u.email}</strong></p>
            <div className="[&_button]:!border-line [&_button]:!text-ink"><LogoutButton /></div>
          </div>
          <dl className="mb-10 grid gap-px border border-line bg-line sm:grid-cols-3">
            {[["Open requests", String(reqs.filter((r) => r.status === "new" || r.status === "in_progress").length)], ["Total requests", String(reqs.length)], ["Member since", fmtDate(u.createdAt)]].map(([k, v]) => (
              <div key={k} className="bg-white p-6"><dt className="font-mono text-[11px] uppercase tracking-wider text-slate-soft">{k}</dt><dd className="mt-2 font-display text-3xl font-semibold">{v}</dd></div>
            ))}
          </dl>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="space-y-8 lg:col-span-7">
              <div className="border border-line bg-white p-6 sm:p-8">
                <h2 className="mb-5 text-lg font-semibold">Your profile</h2>
                <ProfileForm profile={{ fullName: u.fullName, company: u.company, email: u.email, mobile: u.mobile, country: u.country, state: u.state, city: u.city, address: u.address, serviceInterest: u.serviceInterest }} />
              </div>
              <div className="border border-line bg-white p-6 sm:p-8">
                <h2 className="mb-5 text-lg font-semibold">Request history</h2>
                {reqs.length === 0 ? <p className="text-[14.5px] text-slate-soft">No requests yet. Use the form to send your first one.</p> : (
                  <ul className="divide-y divide-line">
                    {reqs.map((r) => (
                      <li key={r.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
                        <div><p className="font-semibold">{r.subject || r.serviceInterest || "Enquiry"}</p><p className="mt-0.5 line-clamp-2 text-[13.5px] text-slate-soft">{r.message}</p><p className="mt-1 font-mono text-[11px] text-slate-soft">{fmtDate(r.createdAt)}{r.serviceInterest ? ` · ${r.serviceInterest}` : ""}</p></div>
                        <span className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider ${r.status === "resolved" ? "bg-green-50 text-ok" : r.status === "in_progress" ? "bg-brand-50 text-brand-700" : "bg-mist text-slate-soft"}`}>{STATUS[r.status] ?? r.status}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <aside className="space-y-8 lg:col-span-5">
              <div className="border border-line bg-white p-6 sm:p-8"><h2 className="mb-5 text-lg font-semibold">New service request</h2><RequestForm /></div>
              <div className="border border-line bg-white p-6">
                <h2 className="mb-3 text-lg font-semibold">Explore services</h2>
                <ul className="space-y-2 text-[14.5px] font-semibold text-brand-600">
                  {[["Public Cloud", "/cloud/public-cloud"], ["Cloud Migration", "/services/cloud-migration"], ["Managed Services", "/services/managed-services"], ["DDoS Protection", "/security/ddos-protection"]].map(([l, h]) => <li key={h}><Link href={h} className="hover:underline">{l} →</Link></li>)}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

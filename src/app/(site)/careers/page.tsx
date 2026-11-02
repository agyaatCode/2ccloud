import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ArrowLink, JsonLd } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { breadcrumbSchema, buildMetadata, getPageHero, getSections, getSiteUrl, listOpenJobs } from "@/lib/data";
import { fmtDate } from "@/lib/util";

export const generateMetadata = () => buildMetadata({ type: "page", key: "careers", path: "/careers", fallbackTitle: "Careers", fallbackDescription: "Join engineers who design, secure and operate real cloud and server infrastructure." });

export default async function CareersPage() {
  const [hero, sec, jobs, base] = await Promise.all([getPageHero("careers"), getSections("careers"), listOpenJobs(), getSiteUrl()]);
  const intro = sec.intro;
  return (
    <>
      <JsonLd data={breadcrumbSchema(base, [{ name: "Home", path: "/" }, { name: "Careers", path: "/careers" }])} />
      <Hero hero={hero} crumbs={[{ name: "Home", href: "/" }, { name: "About Us", href: "/about" }, { name: "Careers" }]} />

      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5"><p className="eyebrow mb-3">{intro.eyebrow}</p><h2 className="h-section text-balance">{intro.title}</h2></Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
            <p className="lead">{intro.body}</p>
            <ul className="mt-8 grid gap-6 sm:grid-cols-3">
              {intro.items.map((i) => (
                <li key={i.title} className="border-t-2 border-brand-600 pt-4"><h3 className="text-[15px] font-semibold">{i.title}</h3><p className="mt-1 text-[13.5px] text-slate-soft">{i.text}</p></li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section id="openings" className="bg-mist py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow mb-3">Open positions</p><h2 className="h-section">Current openings</h2></div><ArrowLink href="/careers/apply">General application</ArrowLink></div>
          {jobs.length === 0 ? (
            <p className="mt-8 text-slate-soft">There are no open positions right now. You are welcome to send a <Link href="/careers/apply" className="font-semibold text-brand-600 hover:underline">general application</Link>.</p>
          ) : (
            <ul className="mt-10 divide-y divide-line border-y border-line bg-white">
              {jobs.map((j) => (
                <li key={j.id}>
                  <Link href={`/careers/${j.slug}`} className="group grid items-center gap-3 px-5 py-6 transition-colors hover:bg-brand-50 md:grid-cols-[1.4fr_1fr_1fr_auto] md:gap-6">
                    <div><h3 className="text-[1.15rem] font-semibold group-hover:text-brand-700">{j.title}</h3><p className="mt-1 text-[14px] text-slate-soft">{j.summary}</p></div>
                    <p className="text-[14px]"><span className="block font-mono text-[11px] uppercase tracking-wider text-slate-soft">Department</span>{j.department || "—"}</p>
                    <p className="text-[14px]"><span className="block font-mono text-[11px] uppercase tracking-wider text-slate-soft">Location · Type</span>{j.location} · {j.employmentType}</p>
                    <span className="text-[14px] font-semibold text-brand-600">View & apply <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></span>
                    {j.closingDate && <p className="text-[12px] text-slate-soft md:col-span-4">Apply by {fmtDate(j.closingDate)}</p>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

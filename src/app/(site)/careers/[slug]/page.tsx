import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { ApplyForm } from "@/components/ApplyForm";
import { JsonLd } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { baseHero } from "@/lib/hero";
import { breadcrumbSchema, buildMetadata, customSchema, getJobBySlug, getMasters, getPage, getSettings, getSiteUrl } from "@/lib/data";
import { fmtDate, lines, paragraphs } from "@/lib/util";

type P = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { slug } = await params;
  const j = await getJobBySlug(slug);
  if (!j) return { title: "Not found" };
  return buildMetadata({ type: "job", key: slug, path: `/careers/${slug}`, fallbackTitle: `${j.title} — Careers`, fallbackDescription: j.summary, image: j.heroImageUrl });
}

const EMP: Record<string, string> = { "full-time": "FULL_TIME", "part-time": "PART_TIME", contract: "CONTRACTOR", internship: "INTERN", temporary: "TEMPORARY" };

export default async function JobPage({ params }: P) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();
  const [masters, base, s, careers, custom] = await Promise.all([getMasters(), getSiteUrl(), getSettings(), getPage("careers"), customSchema("job", slug)]);
  const closed = job.status !== "active";
  const hero = baseHero({
    eyebrow: `Careers${job.department ? ` · ${job.department}` : ""}`, title: job.title, description: job.summary,
    type: job.heroVideoUrl ? "video" : "image", imageUrl: job.heroImageUrl || careers?.heroImageUrl || "/images/stock/careers.jpg", videoUrl: job.heroVideoUrl, posterUrl: job.heroImageUrl || careers?.heroImageUrl || "",
    primaryText: closed ? "" : "Apply now", primaryUrl: "#apply", secondaryText: "All openings", secondaryUrl: "/careers#openings", height: 560, overlayOpacity: 82,
  });
  const schema = {
    "@context": "https://schema.org", "@type": "JobPosting", title: job.title, description: [job.description, job.responsibilities, job.requirements].filter(Boolean).join("\n\n"),
    datePosted: new Date(job.createdAt).toISOString().slice(0, 10), validThrough: job.closingDate || undefined, employmentType: EMP[job.employmentType.toLowerCase()] ?? "FULL_TIME",
    hiringOrganization: { "@type": "Organization", name: s.company_name, sameAs: base }, directApply: true,
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "IN" } },
  };
  const facts: [string, string][] = [["Location", job.location], ["Type", job.employmentType], ["Experience", job.experience], ["Openings", String(job.openings)], ["Closing date", job.closingDate ? fmtDate(job.closingDate) : ""], ["Salary", job.salaryRange]];
  return (
    <>
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbSchema(base, [{ name: "Home", path: "/" }, { name: "Careers", path: "/careers" }, { name: job.title, path: `/careers/${slug}` }])} />
      <JsonLd data={custom} />
      <Hero hero={hero} crumbs={[{ name: "Home", href: "/" }, { name: "Careers", href: "/careers" }, { name: job.title }]} />

      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8">
            {job.description && <Reveal><h2 className="mb-3 text-xl font-semibold">About the role</h2>{paragraphs(job.description).map((p, i) => <p key={i} className="mb-3 leading-relaxed text-slate-soft">{p}</p>)}</Reveal>}
            {job.responsibilities && <Reveal><h2 className="mb-3 text-xl font-semibold">Responsibilities</h2><ul className="space-y-2">{lines(job.responsibilities).map((l) => <li key={l} className="flex gap-3 text-slate-soft"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden="true" />{l}</li>)}</ul></Reveal>}
            {job.requirements && <Reveal><h2 className="mb-3 text-xl font-semibold">Requirements</h2><ul className="space-y-2">{lines(job.requirements).map((l) => <li key={l} className="flex gap-3 text-slate-soft"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-brand-600" aria-hidden="true" />{l}</li>)}</ul></Reveal>}
          </div>
          <aside className="lg:col-span-4">
            <dl className="border border-line lg:sticky lg:top-28">
              {facts.filter(([, v]) => v).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-line px-5 py-3.5 text-[14px] last:border-b-0"><dt className="text-slate-soft">{k}</dt><dd className="text-right font-semibold">{v}</dd></div>
              ))}
              <div className="p-5">{closed ? <p className="text-[14px] font-semibold text-crit">Applications for this role are closed.</p> : <a href="#apply" className="btn btn-primary w-full">Apply for this role</a>}</div>
            </dl>
          </aside>
        </div>
      </section>

      {!closed && (
        <section id="apply" className="bg-mist py-14 lg:py-20">
          <div className="mx-auto max-w-4xl px-5 sm:px-8">
            <p className="eyebrow mb-3">Application</p>
            <h2 className="h-section mb-8">Apply for {job.title}</h2>
            <div className="border border-line bg-white p-6 sm:p-10"><ApplyForm masters={masters} job={{ id: job.id, title: job.title }} /></div>
          </div>
        </section>
      )}
    </>
  );
}

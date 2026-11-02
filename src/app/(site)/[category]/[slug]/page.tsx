import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { SmartImage } from "@/components/SmartImage";
import { ArrowLink, Faq, JsonLd, Prose } from "@/components/ui";
import { ClipReveal, Reveal } from "@/components/motion";
import { FlowDiagram, ServiceIcon } from "@/components/graphics";
import { breadcrumbSchema, buildMetadata, customSchema, getService, getSiteUrl, getSettings, heroFromRow } from "@/lib/data";
import { CATEGORY_LABEL, NAV, TRADEMARK_NOTE } from "@/lib/content";

type Params = { category: string; slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { category, slug } = await params;
  const d = CATEGORY_LABEL[category] ? await getService(category, slug) : null;
  if (!d) return { title: "Not found" };
  return buildMetadata({
    type: "service", key: slug, path: `/${category}/${slug}`, fallbackTitle: `${d.svc.title} — ${d.svc.heroTitle || CATEGORY_LABEL[category]}`,
    fallbackDescription: d.svc.heroDescription || d.svc.shortDescription, image: d.svc.heroImageUrl,
  });
}

const TRADEMARKED = new Set(["aws", "azure", "google-cloud", "m365", "google-workspace"]);

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { category, slug } = await params;
  if (!CATEGORY_LABEL[category]) notFound();
  const d = await getService(category, slug);
  if (!d) notFound();
  const { svc, features, process, benefits, faqs, related } = d;
  const [base, settings, custom] = await Promise.all([getSiteUrl(), getSettings(), customSchema("service", slug)]);

  const catHref = NAV.find((n) => n.label === CATEGORY_LABEL[category])?.href ?? "/";
  const parent = svc.parentSlug ? await getService(category, svc.parentSlug) : null;
  const crumbs = [
    { name: "Home", href: "/" },
    { name: CATEGORY_LABEL[category], href: catHref },
    ...(parent ? [{ name: parent.svc.title, href: `/${category}/${parent.svc.slug}` }] : []),
    { name: svc.title },
  ];
  const hero = heroFromRow(svc, svc.title);
  const ctaUrl = svc.ctaButtonUrl || `/contact?service=${encodeURIComponent(svc.title)}`;

  const schemas = [
    { "@context": "https://schema.org", "@type": "Service", name: svc.title, description: svc.shortDescription, serviceType: svc.title, provider: { "@type": "Organization", name: settings.company_name, alternateName: settings.brand_name, url: base }, url: `${base}/${category}/${slug}`, areaServed: "Worldwide" },
    breadcrumbSchema(base, crumbs.map((c, i) => ({ name: c.name, path: i === crumbs.length - 1 ? `/${category}/${slug}` : c.href ?? "/" }))),
    faqs.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) } : null,
    custom,
  ];

  return (
    <>
      {schemas.map((s, i) => <JsonLd key={i} data={s} />)}
      <Hero hero={hero} crumbs={crumbs} />

      {/* overview — editorial split */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow mb-3">Overview</p>
            <h2 className="h-section text-balance">{svc.shortDescription}</h2>
          </Reveal>
          <Reveal className="lg:col-span-6 lg:col-start-7" delay={0.1}>
            <Prose text={svc.longDescription} className="[&_p:first-child]:text-[1.125rem] [&_p:first-child]:text-ink" />
            <ArrowLink href={ctaUrl} className="mt-2">{svc.ctaButtonText || "Start a conversation"}</ArrowLink>
          </Reveal>
        </div>
      </section>

      {/* capabilities — image + technical information */}
      {features.length > 0 && (
        <section className="bg-mist py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-stretch gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-14">
            <ClipReveal className="img-zoom relative min-h-[320px] lg:col-span-5">
              <SmartImage src={svc.sectionImageUrl || svc.cardImageUrl || svc.heroImageUrl} alt={`${svc.title} infrastructure`} sizes="(min-width:1024px) 40vw, 100vw" style={{ objectPosition: svc.heroPosDesktop }} />
              <div className="absolute inset-0 bg-linear-to-t from-navy-950/70 via-transparent to-transparent" aria-hidden="true" />
              <div className="absolute bottom-5 left-5 flex items-center gap-3 text-white">
                <ServiceIcon kind={svc.icon} className="always h-11 w-11 !text-white" />
                <span className="font-mono text-[11.5px] uppercase tracking-wider">{svc.title}</span>
              </div>
            </ClipReveal>
            <div className="lg:col-span-7">
              <Reveal><p className="eyebrow mb-3">Capabilities</p><h2 className="h-section">What is included</h2></Reveal>
              <ol className="mt-8 divide-y divide-line border-y border-line">
                {features.map((f, i) => (
                  <li key={f.id}>
                    <Reveal delay={i * 0.06} className="grid gap-2 py-5 sm:grid-cols-[3rem_1fr_1.4fr] sm:gap-6">
                      <span className="font-mono text-[12px] text-brand-600">0{i + 1}</span>
                      <h3 className="text-[16px] font-semibold">{f.title}</h3>
                      <p className="text-[14.5px] leading-relaxed text-slate-soft">{f.description}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* architecture + benefits — dark */}
      <section className="on-dark bg-navy-900 py-16 text-white lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="grid gap-5 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7"><p className="eyebrow mb-3">Architecture</p><h2 className="h-section text-balance">How {svc.title} fits together</h2></div>
            <p className="lead lg:col-span-5">A simplified view of the flow we design, build and operate. Every environment is tailored to your workloads and risk profile.</p>
          </Reveal>
          <Reveal className="mt-10 border border-white/10 bg-navy-950/50 p-5 sm:p-8"><FlowDiagram variant={svc.diagram} caption={`${svc.title} architecture`} /></Reveal>
          {benefits.length > 0 && (
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {benefits.map((b, i) => (
                <Reveal key={b.id} delay={i * 0.08} className="border-t border-brand-400/60 pt-5">
                  <h3 className="text-[16px] font-semibold">{b.title}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-white/65">{b.description}</p>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* process */}
      {process.length > 0 && (
        <section className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <Reveal><p className="eyebrow mb-3">Our approach</p><h2 className="h-section">From first call to steady state</h2></Reveal>
            <ol className="relative mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              <span className="absolute left-0 right-0 top-[17px] hidden h-px bg-line lg:block" aria-hidden="true" />
              {process.map((p, i) => (
                <li key={p.id}>
                  <Reveal delay={i * 0.1} className="relative pr-4">
                    <span className="relative z-10 flex h-9 w-9 items-center justify-center border border-brand-600 bg-white font-mono text-[12px] font-medium text-brand-700">0{i + 1}</span>
                    <h3 className="mt-5 text-[17px] font-semibold">{p.title}</h3>
                    <p className="mt-2 text-[14.5px] leading-relaxed text-slate-soft">{p.description}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-mist py-16 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-12">
            <div className="lg:col-span-4"><p className="eyebrow mb-3">FAQ</p><h2 className="h-section">Common questions</h2></div>
            <div className="lg:col-span-8"><Faq items={faqs} /></div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="on-dark relative isolate overflow-hidden bg-navy-950 py-16 text-white lg:py-20">
        <div className="absolute inset-0 -z-20"><SmartImage src={svc.heroImageUrl} alt="" sizes="100vw" style={{ objectPosition: svc.heroPosDesktop }} /></div>
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-navy-950/95 via-navy-900/85 to-navy-900/60" aria-hidden="true" />
        <Reveal className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h2 className="h-section text-balance">{svc.ctaTitle || `Talk to an expert about ${svc.title}`}</h2>
            <p className="lead mt-3">{svc.ctaText}</p>
          </div>
          <Link href={ctaUrl} className="btn btn-primary shrink-0">{svc.ctaButtonText || "Start a Conversation"} <span className="arrow" aria-hidden="true">→</span></Link>
        </Reveal>
      </section>

      {/* related */}
      {related.length > 0 && (
        <section className="bg-white py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <p className="eyebrow mb-5">Related in {CATEGORY_LABEL[category]}</p>
            <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/${r.category}/${r.slug}`} className="group flex items-center justify-between border-t border-line py-4 text-[15px] font-semibold transition-colors hover:border-brand-600 hover:text-brand-700">
                    {r.title}<span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
            {TRADEMARKED.has(slug) && <p className="mt-8 max-w-3xl text-[12px] leading-relaxed text-slate-soft">{TRADEMARK_NOTE}</p>}
          </div>
        </section>
      )}
      {related.length === 0 && TRADEMARKED.has(slug) && (
        <p className="mx-auto max-w-7xl px-5 py-8 text-[12px] leading-relaxed text-slate-soft sm:px-8">{TRADEMARK_NOTE}</p>
      )}
    </>
  );
}

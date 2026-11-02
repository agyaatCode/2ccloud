import Link from "next/link";
import { Hero } from "@/components/Hero";
import { SmartImage } from "@/components/SmartImage";
import { JsonLd } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { breadcrumbSchema, buildMetadata, getPageHero, getSiteUrl, listNews } from "@/lib/data";
import { fmtDate } from "@/lib/util";

export const generateMetadata = () => buildMetadata({ type: "page", key: "news", path: "/news", fallbackTitle: "News & Insights", fallbackDescription: "Announcements, engineering notes and insights on cloud, security and infrastructure." });

export default async function NewsPage() {
  const [hero, items, base] = await Promise.all([getPageHero("news"), listNews(30), getSiteUrl()]);
  const [first, ...rest] = items;
  return (
    <>
      <JsonLd data={breadcrumbSchema(base, [{ name: "Home", path: "/" }, { name: "News", path: "/news" }])} />
      <Hero hero={hero} crumbs={[{ name: "Home", href: "/" }, { name: "About Us", href: "/about" }, { name: "News" }]} />
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          {!first && <p className="text-slate-soft">No news has been published yet. Please check back soon.</p>}
          {first && (
            <Reveal>
              <Link href={`/news/${first.n.slug}`} className="group grid overflow-hidden border border-line lg:grid-cols-12">
                <div className="img-zoom relative min-h-[260px] bg-navy-900 lg:col-span-7 lg:min-h-[380px]"><SmartImage src={first.n.featuredImageUrl} alt="" sizes="(min-width:1024px) 58vw, 100vw" priority /></div>
                <div className="flex flex-col justify-center p-8 lg:col-span-5 lg:p-10">
                  <p className="font-mono text-[11.5px] uppercase tracking-wider text-brand-600">{first.categoryName ?? "News"} · {fmtDate(first.n.publishedAt ?? first.n.createdAt)}</p>
                  <h2 className="mt-3 text-[1.75rem] font-semibold leading-tight group-hover:text-brand-700">{first.n.title}</h2>
                  <p className="mt-3 leading-relaxed text-slate-soft">{first.n.excerpt}</p>
                  <span className="mt-5 text-[14.5px] font-semibold text-brand-600">Read article <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden="true">→</span></span>
                </div>
              </Link>
            </Reveal>
          )}
          {rest.length > 0 && (
            <ul className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((x, i) => (
                <li key={x.n.id}>
                  <Reveal delay={(i % 3) * 0.07}>
                    <Link href={`/news/${x.n.slug}`} className="group block">
                      <div className="img-zoom relative aspect-[16/10] overflow-hidden bg-navy-900"><SmartImage src={x.n.featuredImageUrl} alt="" sizes="(min-width:1024px) 33vw, 100vw" /></div>
                      <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-brand-600">{x.categoryName ?? "News"} · {fmtDate(x.n.publishedAt ?? x.n.createdAt)}</p>
                      <h3 className="mt-2 text-[1.2rem] font-semibold leading-snug group-hover:text-brand-700">{x.n.title}</h3>
                      <p className="mt-2 line-clamp-3 text-[14.5px] text-slate-soft">{x.n.excerpt}</p>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

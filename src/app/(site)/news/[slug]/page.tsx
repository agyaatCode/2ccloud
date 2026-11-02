import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { SmartImage } from "@/components/SmartImage";
import { JsonLd, Prose } from "@/components/ui";
import { Reveal } from "@/components/motion";
import { baseHero } from "@/lib/hero";
import { breadcrumbSchema, buildMetadata, customSchema, getNewsBySlug, getSettings, getSiteUrl, listNews } from "@/lib/data";
import { fmtDate } from "@/lib/util";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = await getNewsBySlug(slug);
  if (!d) return { title: "Not found" };
  return buildMetadata({ type: "news", key: slug, path: `/news/${slug}`, fallbackTitle: d.n.title, fallbackDescription: d.n.excerpt, image: d.n.featuredImageUrl, ogType: "article" });
}

export default async function NewsArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = await getNewsBySlug(slug);
  if (!d) notFound();
  const { n, categoryName, gallery } = d;
  const [base, s, custom, more] = await Promise.all([getSiteUrl(), getSettings(), customSchema("news", slug), listNews(4)]);
  const date = n.publishedAt ?? n.createdAt;
  const hero = baseHero({
    eyebrow: `${categoryName ?? "News"} · ${fmtDate(date)}`, title: n.title, description: n.excerpt,
    type: n.videoUrl ? "video" : "image", imageUrl: n.featuredImageUrl, videoUrl: n.videoUrl, posterUrl: n.posterUrl || n.featuredImageUrl,
    posDesktop: n.heroPosDesktop, height: 560, overlayOpacity: 82,
  });
  const schema = {
    "@context": "https://schema.org", "@type": "Article", headline: n.title, description: n.excerpt, datePublished: new Date(date).toISOString(), dateModified: new Date(n.updatedAt).toISOString(),
    author: { "@type": "Person", name: n.author || s.company_name }, publisher: { "@type": "Organization", name: s.company_name }, image: n.featuredImageUrl ? [n.featuredImageUrl.startsWith("http") ? n.featuredImageUrl : base + n.featuredImageUrl] : undefined,
    mainEntityOfPage: `${base}/news/${slug}`,
  };
  const others = more.filter((x) => x.n.slug !== slug).slice(0, 3);
  return (
    <>
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbSchema(base, [{ name: "Home", path: "/" }, { name: "News", path: "/news" }, { name: n.title, path: `/news/${slug}` }])} />
      <JsonLd data={custom} />
      <Hero hero={hero} crumbs={[{ name: "Home", href: "/" }, { name: "News", href: "/news" }, { name: n.title.length > 48 ? n.title.slice(0, 48) + "…" : n.title }]} />

      <article className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-8 border-b border-line pb-5 font-mono text-[12px] uppercase tracking-wider text-slate-soft">
            {n.author ? `By ${n.author} · ` : ""}{fmtDate(date, { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <Prose text={n.content} className="text-[1.0625rem]" />
        </div>
        {gallery.length > 0 && (
          <div className="mx-auto mt-12 max-w-5xl px-5 sm:px-8">
            <h2 className="eyebrow mb-4">Gallery</h2>
            <ul className="grid gap-4 sm:grid-cols-2">
              {gallery.map((g) => (
                <li key={g.id}>
                  <figure>
                    <div className="img-zoom relative aspect-[16/10] overflow-hidden bg-navy-900"><SmartImage src={g.url} alt={g.caption || n.title} sizes="(min-width:640px) 45vw, 100vw" /></div>
                    {g.caption && <figcaption className="mt-2 text-[13px] text-slate-soft">{g.caption}</figcaption>}
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {others.length > 0 && (
        <section className="bg-mist py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-6 flex items-end justify-between"><h2 className="text-xl font-semibold">More news</h2><Link href="/news" className="text-[14px] font-semibold text-brand-600 hover:underline">All news →</Link></div>
            <ul className="grid gap-6 md:grid-cols-3">
              {others.map((x) => (
                <li key={x.n.id}>
                  <Reveal>
                    <Link href={`/news/${x.n.slug}`} className="group block">
                      <div className="img-zoom relative aspect-[16/10] overflow-hidden bg-navy-900"><SmartImage src={x.n.featuredImageUrl} alt="" sizes="(min-width:768px) 33vw, 100vw" /></div>
                      <h3 className="mt-3 font-semibold leading-snug group-hover:text-brand-700">{x.n.title}</h3>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

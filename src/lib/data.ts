// import type { Metadata } from "next";
// import { headers } from "next/headers";
// import { and, asc, desc, eq, inArray, isNull, lte, or, sql } from "drizzle-orm";
// import { db } from "@/db";
// import {
//   brandingSettings, siteSettings, pages, pageSections, services, serviceFeatures, serviceBenefits, serviceFaqs,
//   news, newsCategories, newsImages, jobs, seoMetadata, universities, boards, qualifications, jobRoles,
// } from "@/db/schema";
// import { SECTION_DEFAULTS, SETTINGS_DEFAULTS, type SectionDefault } from "@/lib/content";

// /* ---------- tiny TTL cache (cleared on every admin write) ---------- */
// const store = new Map<string, { v: unknown; exp: number }>();
// export function clearCache() {
//   store.clear();
// }
// async function memo<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
//   const hit = store.get(key);
//   if (hit && hit.exp > Date.now()) return hit.v as T;
//   const v = await fn();
//   store.set(key, { v, exp: Date.now() + ttlMs });
//   return v;
// }

// /* ---------- branding / settings ---------- */
// export type Branding = { logoUrl: string; mobileLogoUrl: string; darkLogoUrl: string; faviconUrl: string };
// const FALLBACK_BRAND: Branding = { logoUrl: "/brand/logo.svg", mobileLogoUrl: "", darkLogoUrl: "/brand/logo-dark.svg", faviconUrl: "/brand/favicon.svg" };

// export async function getBranding(): Promise<Branding> {
//   return memo("branding", 15000, async () => {
//     try {
//       const [b] = await db.select().from(brandingSettings).orderBy(asc(brandingSettings.id)).limit(1);
//       if (!b) return FALLBACK_BRAND;
//       const logoUrl = b.logoUrl || FALLBACK_BRAND.logoUrl;
//       return {
//         logoUrl,
//         mobileLogoUrl: b.mobileLogoUrl || logoUrl,
//         darkLogoUrl: b.darkLogoUrl || b.logoUrl || FALLBACK_BRAND.darkLogoUrl,
//         faviconUrl: b.faviconUrl || b.logoUrl || FALLBACK_BRAND.faviconUrl,
//       };
//     } catch {
//       return FALLBACK_BRAND;
//     }
//   });
// }

// export async function getSettings(): Promise<Record<string, string>> {
//   return memo("settings", 15000, async () => {
//     const out = { ...SETTINGS_DEFAULTS };
//     try {
//       const rows = await db.select().from(siteSettings);
//       for (const r of rows) if (r.value !== "") out[r.key] = r.value;
//     } catch {
//       /* defaults */
//     }
//     return out;
//   });
// }

// export async function getSiteUrl(): Promise<string> {
//   const s = await getSettings();
//   if (s.site_url) return s.site_url.replace(/\/$/, "");
//   if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
//   try {
//     const h = await headers();
//     const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
//     const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
//     return `${proto}://${host}`;
//   } catch {
//     return "http://localhost:3000";
//   }
// }

// /* ---------- hero ---------- */
// export type Hero = {
//   eyebrow: string; title: string; description: string;
//   primaryText: string; primaryUrl: string; secondaryText: string; secondaryUrl: string;
//   type: "image" | "video"; imageUrl: string; mobileImageUrl: string; videoUrl: string; posterUrl: string;
//   overlayColor: string; overlayOpacity: number; align: "left" | "center" | "right"; height: number;
//   posDesktop: string; posMobile: string; animate: boolean; parallax: boolean;
// };

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function heroFromRow(r: any, fallbackTitle = ""): Hero {
//   return {
//     eyebrow: r.heroEyebrow || "",
//     title: r.heroTitle || fallbackTitle,
//     description: r.heroDescription || "",
//     primaryText: r.heroPrimaryText || "",
//     primaryUrl: r.heroPrimaryUrl || "",
//     secondaryText: r.heroSecondaryText || "",
//     secondaryUrl: r.heroSecondaryUrl || "",
//     type: r.heroType === "video" ? "video" : "image",
//     imageUrl: r.heroImageUrl || "",
//     mobileImageUrl: r.heroMobileImageUrl || "",
//     videoUrl: r.heroVideoUrl || "",
//     posterUrl: r.heroPosterUrl || "",
//     overlayColor: r.heroOverlayColor || "#0A1F44",
//     overlayOpacity: Number(r.heroOverlayOpacity ?? 78),
//     align: (["left", "center", "right"].includes(r.heroAlign) ? r.heroAlign : "left") as Hero["align"],
//     height: Number(r.heroHeight || 640),
//     posDesktop: r.heroPosDesktop || "center center",
//     posMobile: r.heroPosMobile || "center center",
//     animate: r.heroAnimate !== false,
//     parallax: r.heroParallax !== false,
//   };
// }

// export async function getPage(slug: string) {
//   return memo(`page:${slug}`, 10000, async () => {
//     try {
//       const [p] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
//       return p ?? null;
//     } catch {
//       return null;
//     }
//   });
// }

// export async function getPageHero(slug: string): Promise<Hero> {
//   const p = await getPage(slug);
//   return heroFromRow(p ?? {}, p?.title);
// }

// /* ---------- sections ---------- */
// export type Section = Required<Omit<SectionDefault, "items">> & { items: { title: string; text: string }[]; isActive: boolean };

// export async function getSections(pageSlug: string): Promise<Record<string, Section>> {
//   const rows = await memo(`sections:${pageSlug}`, 10000, async () => {
//     try {
//       return await db.select().from(pageSections).where(eq(pageSections.pageSlug, pageSlug));
//     } catch {
//       return [];
//     }
//   });
//   const defs = SECTION_DEFAULTS[pageSlug] ?? {};
//   const out: Record<string, Section> = {};
//   const keys = new Set([...Object.keys(defs), ...rows.map((r) => r.sectionKey)]);
//   for (const k of keys) {
//     const d = defs[k] ?? {};
//     const r = rows.find((x) => x.sectionKey === k);
//     const dbItems = Array.isArray((r?.data as { items?: unknown })?.items) ? ((r!.data as { items: { title: string; text: string }[] }).items) : null;
//     out[k] = {
//       eyebrow: r?.eyebrow || d.eyebrow || "",
//       title: r?.title || d.title || "",
//       body: r?.body || d.body || "",
//       imageUrl: r?.imageUrl || d.imageUrl || "",
//       videoUrl: r?.videoUrl || d.videoUrl || "",
//       buttonText: r?.buttonText || d.buttonText || "",
//       buttonUrl: r?.buttonUrl || d.buttonUrl || "",
//       items: dbItems && dbItems.length ? dbItems : d.items ?? [],
//       isActive: r ? r.isActive : true,
//     };
//   }
//   return out;
// }

// /* ---------- services ---------- */
// export type ServiceRow = typeof services.$inferSelect;

// export async function listServices(): Promise<ServiceRow[]> {
//   return memo("services", 10000, async () => {
//     try {
//       return await db.select().from(services).where(eq(services.isPublished, true)).orderBy(asc(services.sortOrder), asc(services.id));
//     } catch {
//       return [];
//     }
//   });
// }

// export async function getService(category: string, slug: string) {
//   const all = await listServices();
//   const svc = all.find((s) => s.slug === slug && s.category === category);
//   if (!svc) return null;
//   const [feats, bens, faqs] = await Promise.all([
//     db.select().from(serviceFeatures).where(eq(serviceFeatures.serviceId, svc.id)).orderBy(asc(serviceFeatures.sortOrder), asc(serviceFeatures.id)),
//     db.select().from(serviceBenefits).where(eq(serviceBenefits.serviceId, svc.id)).orderBy(asc(serviceBenefits.sortOrder), asc(serviceBenefits.id)),
//     db.select().from(serviceFaqs).where(eq(serviceFaqs.serviceId, svc.id)).orderBy(asc(serviceFaqs.sortOrder), asc(serviceFaqs.id)),
//   ]);
//   return {
//     svc,
//     features: feats.filter((f) => f.kind === "feature"),
//     process: feats.filter((f) => f.kind === "process"),
//     benefits: bens,
//     faqs,
//     related: all.filter((s) => s.category === category && s.slug !== slug && !(s.parentSlug && s.parentSlug !== svc.parentSlug && s.parentSlug !== svc.slug)).slice(0, 4),
//   };
// }

// /* ---------- news ---------- */
// const publishedCond = () =>
//   and(inArray(news.status, ["published", "scheduled"]), or(isNull(news.publishedAt), lte(news.publishedAt, new Date())));

// export async function listNews(limit = 50, offset = 0) {
//   try {
//     return await db
//       .select({ n: news, categoryName: newsCategories.name })
//       .from(news)
//       .leftJoin(newsCategories, eq(newsCategories.id, news.categoryId))
//       .where(publishedCond())
//       .orderBy(desc(news.isFeatured), desc(sql`coalesce(${news.publishedAt}, ${news.createdAt})`))
//       .limit(limit)
//       .offset(offset);
//   } catch {
//     return [];
//   }
// }

// export async function getNewsBySlug(slug: string) {
//   try {
//     const [row] = await db
//       .select({ n: news, categoryName: newsCategories.name })
//       .from(news)
//       .leftJoin(newsCategories, eq(newsCategories.id, news.categoryId))
//       .where(and(eq(news.slug, slug), publishedCond()))
//       .limit(1);
//     if (!row) return null;
//     const gallery = await db.select().from(newsImages).where(eq(newsImages.newsId, row.n.id)).orderBy(asc(newsImages.sortOrder), asc(newsImages.id));
//     return { ...row, gallery };
//   } catch {
//     return null;
//   }
// }

// /* ---------- jobs / masters ---------- */
// export async function listOpenJobs() {
//   try {
//     return await db.select().from(jobs).where(eq(jobs.status, "active")).orderBy(desc(jobs.createdAt));
//   } catch {
//     return [];
//   }
// }
// export async function getJobBySlug(slug: string) {
//   try {
//     const [j] = await db.select().from(jobs).where(eq(jobs.slug, slug)).limit(1);
//     return j && j.status !== "inactive" ? j : null;
//   } catch {
//     return null;
//   }
// }
// export async function getMasters() {
//   return memo("masters", 20000, async () => {
//     const pick = async (t: typeof universities) =>
//       (await db.select({ name: t.name }).from(t).where(eq(t.isActive, true)).orderBy(asc(t.sortOrder), asc(t.name))).map((r) => r.name);
//     const [u, b, q, r] = await Promise.all([pick(universities), pick(boards), pick(qualifications), pick(jobRoles)]);
//     return { universities: u, boards: b, qualifications: q, roles: r };
//   });
// }

// /* ---------- SEO ---------- */
// export type SeoInput = {
//   type: "page" | "service" | "news" | "job";
//   key: string;
//   fallbackTitle: string;
//   fallbackDescription: string;
//   path: string;
//   image?: string;
//   ogType?: "website" | "article";
// };

// export async function getSeoRow(type: string, key: string) {
//   try {
//     const [r] = await db.select().from(seoMetadata).where(and(eq(seoMetadata.entityType, type), eq(seoMetadata.entityKey, key))).limit(1);
//     return r ?? null;
//   } catch {
//     return null;
//   }
// }

// export async function buildMetadata(i: SeoInput): Promise<Metadata> {
//   const [seo, site, base] = await Promise.all([getSeoRow(i.type, i.key), getSettings(), getSiteUrl()]);
//   const brand = site.brand_name || "2CCloud";
//   const title = seo?.title || `${i.fallbackTitle} | ${brand}`;
//   const description = seo?.description || i.fallbackDescription || site.tagline;
//   const abs = (u: string) => (u.startsWith("http") ? u : `${base}${u.startsWith("/") ? "" : "/"}${u}`);
//   const canonical = seo?.canonical || `${base}${i.path}`;
//   const og = abs(seo?.ogImage || i.image || site.default_og_image);
//   const tw = abs(seo?.twitterImage || seo?.ogImage || i.image || site.default_og_image);
//   const robots = seo?.robots || "index,follow";
//   return {
//     title: { absolute: title },
//     description,
//     metadataBase: new URL(base),
//     alternates: { canonical },
//     robots: { index: !robots.includes("noindex"), follow: !robots.includes("nofollow") },
//     openGraph: { title, description, url: canonical, siteName: site.company_name, type: i.ogType ?? "website", images: [{ url: og }] },
//     twitter: { card: "summary_large_image", title, description, images: [tw] },
//   };
// }

// export async function customSchema(type: string, key: string): Promise<unknown | null> {
//   const r = await getSeoRow(type, key);
//   if (!r?.schemaJson) return null;
//   try {
//     return JSON.parse(r.schemaJson);
//   } catch {
//     return null;
//   }
// }

// export async function organizationSchema() {
//   const [s, base, b] = await Promise.all([getSettings(), getSiteUrl(), getBranding()]);
//   return {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     name: s.company_name,
//     legalName: s.company_name,
//     alternateName: s.brand_name,
//     url: base,
//     logo: b.logoUrl.startsWith("http") ? b.logoUrl : `${base}${b.logoUrl}`,
//     email: s.contact_email || undefined,
//     telephone: s.contact_phone || undefined,
//     sameAs: [s.linkedin_url, s.twitter_url, s.facebook_url, s.youtube_url].filter(Boolean),
//   };
// }

// export const breadcrumbSchema = (base: string, trail: { name: string; path: string }[]) => ({
//   "@context": "https://schema.org",
//   "@type": "BreadcrumbList",
//   itemListElement: trail.map((t, idx) => ({ "@type": "ListItem", position: idx + 1, name: t.name, item: `${base}${t.path}` })),
// });





// new new code 








import type { Metadata } from "next";
import { headers } from "next/headers";
import { and, asc, desc, eq, inArray, isNull, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  brandingSettings, siteSettings, pages, pageSections, services, serviceFeatures, serviceBenefits, serviceFaqs,
  news, newsCategories, newsImages, jobs, seoMetadata, universities, boards, qualifications, jobRoles, marketplaces,
} from "@/db/schema";
import { SECTION_DEFAULTS, SETTINGS_DEFAULTS, type SectionDefault } from "@/lib/content";

/* ---------- tiny TTL cache (cleared on every admin write) ---------- */
const store = new Map<string, { v: unknown; exp: number }>();
export function clearCache() {
  store.clear();
}
async function memo<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && hit.exp > Date.now()) return hit.v as T;
  const v = await fn();
  store.set(key, { v, exp: Date.now() + ttlMs });
  return v;
}

/* ---------- branding / settings ---------- */
export type Branding = { logoUrl: string; mobileLogoUrl: string; darkLogoUrl: string; faviconUrl: string };
const FALLBACK_BRAND: Branding = { logoUrl: "/brand/logo.svg", mobileLogoUrl: "", darkLogoUrl: "/brand/logo-dark.svg", faviconUrl: "/brand/favicon.svg" };

export async function getBranding(): Promise<Branding> {
  return memo("branding", 15000, async () => {
    try {
      const [b] = await db.select().from(brandingSettings).orderBy(asc(brandingSettings.id)).limit(1);
      if (!b) return FALLBACK_BRAND;
      const logoUrl = b.logoUrl || FALLBACK_BRAND.logoUrl;
      return {
        logoUrl,
        mobileLogoUrl: b.mobileLogoUrl || logoUrl,
        darkLogoUrl: b.darkLogoUrl || b.logoUrl || FALLBACK_BRAND.darkLogoUrl,
        faviconUrl: b.faviconUrl || b.logoUrl || FALLBACK_BRAND.faviconUrl,
      };
    } catch {
      return FALLBACK_BRAND;
    }
  });
}

export async function getSettings(): Promise<Record<string, string>> {
  return memo("settings", 15000, async () => {
    const out = { ...SETTINGS_DEFAULTS };
    try {
      const rows = await db.select().from(siteSettings);
      for (const r of rows) if (r.value !== "") out[r.key] = r.value;
    } catch {
      /* defaults */
    }
    return out;
  });
}

export async function getSiteUrl(): Promise<string> {
  const s = await getSettings();
  if (s.site_url) return s.site_url.replace(/\/$/, "");
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
    const proto = h.get("x-forwarded-proto") || (host.startsWith("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  } catch {
    return "http://localhost:3000";
  }
}

/* ---------- hero ---------- */
export type Hero = {
  eyebrow: string; title: string; description: string;
  primaryText: string; primaryUrl: string; secondaryText: string; secondaryUrl: string;
  type: "image" | "video"; imageUrl: string; mobileImageUrl: string; videoUrl: string; posterUrl: string;
  overlayColor: string; overlayOpacity: number; align: "left" | "center" | "right"; height: number;
  posDesktop: string; posMobile: string; animate: boolean; parallax: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function heroFromRow(r: any, fallbackTitle = ""): Hero {
  return {
    eyebrow: r.heroEyebrow || "",
    title: r.heroTitle || fallbackTitle,
    description: r.heroDescription || "",
    primaryText: r.heroPrimaryText || "",
    primaryUrl: r.heroPrimaryUrl || "",
    secondaryText: r.heroSecondaryText || "",
    secondaryUrl: r.heroSecondaryUrl || "",
    type: r.heroType === "video" ? "video" : "image",
    imageUrl: r.heroImageUrl || "",
    mobileImageUrl: r.heroMobileImageUrl || "",
    videoUrl: r.heroVideoUrl || "",
    posterUrl: r.heroPosterUrl || "",
    overlayColor: r.heroOverlayColor || "#0A1F44",
    overlayOpacity: Number(r.heroOverlayOpacity ?? 78),
    align: (["left", "center", "right"].includes(r.heroAlign) ? r.heroAlign : "left") as Hero["align"],
    height: Number(r.heroHeight || 640),
    posDesktop: r.heroPosDesktop || "center center",
    posMobile: r.heroPosMobile || "center center",
    animate: r.heroAnimate !== false,
    parallax: r.heroParallax !== false,
  };
}

export async function getPage(slug: string) {
  return memo(`page:${slug}`, 10000, async () => {
    try {
      const [p] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
      return p ?? null;
    } catch {
      return null;
    }
  });
}

export async function getPageHero(slug: string): Promise<Hero> {
  const p = await getPage(slug);
  return heroFromRow(p ?? {}, p?.title);
}

/* ---------- sections ---------- */
export type Section = Required<Omit<SectionDefault, "items">> & { items: { title: string; text: string }[]; isActive: boolean };

export async function getSections(pageSlug: string): Promise<Record<string, Section>> {
  const rows = await memo(`sections:${pageSlug}`, 10000, async () => {
    try {
      return await db.select().from(pageSections).where(eq(pageSections.pageSlug, pageSlug));
    } catch {
      return [];
    }
  });
  const defs = SECTION_DEFAULTS[pageSlug] ?? {};
  const out: Record<string, Section> = {};
  const keys = new Set([...Object.keys(defs), ...rows.map((r) => r.sectionKey)]);
  for (const k of keys) {
    const d = defs[k] ?? {};
    const r = rows.find((x) => x.sectionKey === k);
    const dbItems = Array.isArray((r?.data as { items?: unknown })?.items) ? ((r!.data as { items: { title: string; text: string }[] }).items) : null;
    out[k] = {
      eyebrow: r?.eyebrow || d.eyebrow || "",
      title: r?.title || d.title || "",
      body: r?.body || d.body || "",
      imageUrl: r?.imageUrl || d.imageUrl || "",
      videoUrl: r?.videoUrl || d.videoUrl || "",
      buttonText: r?.buttonText || d.buttonText || "",
      buttonUrl: r?.buttonUrl || d.buttonUrl || "",
      items: dbItems && dbItems.length ? dbItems : d.items ?? [],
      isActive: r ? r.isActive : true,
    };
  }
  return out;
}

/* ---------- services ---------- */
export type ServiceRow = typeof services.$inferSelect;

export async function listServices(): Promise<ServiceRow[]> {
  return memo("services", 10000, async () => {
    try {
      return await db.select().from(services).where(eq(services.isPublished, true)).orderBy(asc(services.sortOrder), asc(services.id));
    } catch {
      return [];
    }
  });
}

export async function getService(category: string, slug: string) {
  const all = await listServices();
  const svc = all.find((s) => s.slug === slug && s.category === category);
  if (!svc) return null;
  const [feats, bens, faqs] = await Promise.all([
    db.select().from(serviceFeatures).where(eq(serviceFeatures.serviceId, svc.id)).orderBy(asc(serviceFeatures.sortOrder), asc(serviceFeatures.id)),
    db.select().from(serviceBenefits).where(eq(serviceBenefits.serviceId, svc.id)).orderBy(asc(serviceBenefits.sortOrder), asc(serviceBenefits.id)),
    db.select().from(serviceFaqs).where(eq(serviceFaqs.serviceId, svc.id)).orderBy(asc(serviceFaqs.sortOrder), asc(serviceFaqs.id)),
  ]);
  return {
    svc,
    features: feats.filter((f) => f.kind === "feature"),
    process: feats.filter((f) => f.kind === "process"),
    benefits: bens,
    faqs,
    related: all.filter((s) => s.category === category && s.slug !== slug && !(s.parentSlug && s.parentSlug !== svc.parentSlug && s.parentSlug !== svc.slug)).slice(0, 4),
  };
}

/* ---------- marketplaces (client products carousel) ---------- */
export type MarketplaceRow = typeof marketplaces.$inferSelect;

// Active products only, ordered by sortOrder (cache is cleared on every admin write)
export async function getMarketplaces(): Promise<MarketplaceRow[]> {
  return memo("marketplaces", 10000, async () => {
    try {
      return await db.select().from(marketplaces).where(eq(marketplaces.isActive, true)).orderBy(asc(marketplaces.sortOrder), asc(marketplaces.id));
    } catch {
      return [];
    }
  });
}

/* ---------- news ---------- */
const publishedCond = () =>
  and(inArray(news.status, ["published", "scheduled"]), or(isNull(news.publishedAt), lte(news.publishedAt, new Date())));

export async function listNews(limit = 50, offset = 0) {
  try {
    return await db
      .select({ n: news, categoryName: newsCategories.name })
      .from(news)
      .leftJoin(newsCategories, eq(newsCategories.id, news.categoryId))
      .where(publishedCond())
      .orderBy(desc(news.isFeatured), desc(sql`coalesce(${news.publishedAt}, ${news.createdAt})`))
      .limit(limit)
      .offset(offset);
  } catch {
    return [];
  }
}

export async function getNewsBySlug(slug: string) {
  try {
    const [row] = await db
      .select({ n: news, categoryName: newsCategories.name })
      .from(news)
      .leftJoin(newsCategories, eq(newsCategories.id, news.categoryId))
      .where(and(eq(news.slug, slug), publishedCond()))
      .limit(1);
    if (!row) return null;
    const gallery = await db.select().from(newsImages).where(eq(newsImages.newsId, row.n.id)).orderBy(asc(newsImages.sortOrder), asc(newsImages.id));
    return { ...row, gallery };
  } catch {
    return null;
  }
}

/* ---------- jobs / masters ---------- */
export async function listOpenJobs() {
  try {
    return await db.select().from(jobs).where(eq(jobs.status, "active")).orderBy(desc(jobs.createdAt));
  } catch {
    return [];
  }
}
export async function getJobBySlug(slug: string) {
  try {
    const [j] = await db.select().from(jobs).where(eq(jobs.slug, slug)).limit(1);
    return j && j.status !== "inactive" ? j : null;
  } catch {
    return null;
  }
}
export async function getMasters() {
  return memo("masters", 20000, async () => {
    const pick = async (t: typeof universities) =>
      (await db.select({ name: t.name }).from(t).where(eq(t.isActive, true)).orderBy(asc(t.sortOrder), asc(t.name))).map((r) => r.name);
    const [u, b, q, r] = await Promise.all([pick(universities), pick(boards), pick(qualifications), pick(jobRoles)]);
    return { universities: u, boards: b, qualifications: q, roles: r };
  });
}

/* ---------- SEO ---------- */
export type SeoInput = {
  type: "page" | "service" | "news" | "job";
  key: string;
  fallbackTitle: string;
  fallbackDescription: string;
  path: string;
  image?: string;
  ogType?: "website" | "article";
};

export async function getSeoRow(type: string, key: string) {
  try {
    const [r] = await db.select().from(seoMetadata).where(and(eq(seoMetadata.entityType, type), eq(seoMetadata.entityKey, key))).limit(1);
    return r ?? null;
  } catch {
    return null;
  }
}

export async function buildMetadata(i: SeoInput): Promise<Metadata> {
  const [seo, site, base] = await Promise.all([getSeoRow(i.type, i.key), getSettings(), getSiteUrl()]);
  const brand = site.brand_name || "2CCloud";
  const title = seo?.title || `${i.fallbackTitle} | ${brand}`;
  const description = seo?.description || i.fallbackDescription || site.tagline;
  const abs = (u: string) => (u.startsWith("http") ? u : `${base}${u.startsWith("/") ? "" : "/"}${u}`);
  const canonical = seo?.canonical || `${base}${i.path}`;
  const og = abs(seo?.ogImage || i.image || site.default_og_image);
  const tw = abs(seo?.twitterImage || seo?.ogImage || i.image || site.default_og_image);
  const robots = seo?.robots || "index,follow";
  return {
    title: { absolute: title },
    description,
    metadataBase: new URL(base),
    alternates: { canonical },
    robots: { index: !robots.includes("noindex"), follow: !robots.includes("nofollow") },
    openGraph: { title, description, url: canonical, siteName: site.company_name, type: i.ogType ?? "website", images: [{ url: og }] },
    twitter: { card: "summary_large_image", title, description, images: [tw] },
  };
}

export async function customSchema(type: string, key: string): Promise<unknown | null> {
  const r = await getSeoRow(type, key);
  if (!r?.schemaJson) return null;
  try {
    return JSON.parse(r.schemaJson);
  } catch {
    return null;
  }
}

export async function organizationSchema() {
  const [s, base, b] = await Promise.all([getSettings(), getSiteUrl(), getBranding()]);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.company_name,
    legalName: s.company_name,
    alternateName: s.brand_name,
    url: base,
    logo: b.logoUrl.startsWith("http") ? b.logoUrl : `${base}${b.logoUrl}`,
    email: s.contact_email || undefined,
    telephone: s.contact_phone || undefined,
    sameAs: [s.linkedin_url, s.twitter_url, s.facebook_url, s.youtube_url].filter(Boolean),
  };
}

export const breadcrumbSchema = (base: string, trail: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((t, idx) => ({ "@type": "ListItem", position: idx + 1, name: t.name, item: `${base}${t.path}` })),
});
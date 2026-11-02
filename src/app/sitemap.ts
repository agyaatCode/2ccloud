// // src/sitemap.ts

// import type { MetadataRoute } from "next";
// import { getSiteUrl, listNews, listOpenJobs, listServices } from "@/lib/data";

// export const dynamic = "force-dynamic";

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const base = await getSiteUrl();
//   const [svcs, items, jobs] = await Promise.all([listServices(), listNews(200), listOpenJobs()]);
//   const now = new Date();
//   const staticPages = ["", "/about", "/vision", "/mission", "/news", "/careers", "/contact", "/register"].map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 }));
//   return [
//     ...staticPages,
//     ...svcs.map((s) => ({ url: `${base}/${s.category}/${s.slug}`, lastModified: s.updatedAt, changeFrequency: "monthly" as const, priority: 0.8 })),
//     ...items.map((n) => ({ url: `${base}/news/${n.n.slug}`, lastModified: n.n.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
//     ...jobs.map((j) => ({ url: `${base}/careers/${j.slug}`, lastModified: j.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 })),
//   ];
// }





// new code  




// src/sitemap.ts

import type { MetadataRoute } from "next";
import { getSiteUrl, listNews, listOpenJobs, listServices } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = await getSiteUrl();
  const [svcs, items, jobs] = await Promise.all([listServices(), listNews(200), listOpenJobs()]);
  const now = new Date();
  const staticPages = ["", "/about", "/vision", "/mission", "/gallery", "/news", "/careers", "/contact", "/register"].map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.7 }));
  return [
    ...staticPages,
    ...svcs.map((s) => ({ url: `${base}/${s.category}/${s.slug}`, lastModified: s.updatedAt, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...items.map((n) => ({ url: `${base}/news/${n.n.slug}`, lastModified: n.n.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...jobs.map((j) => ({ url: `${base}/careers/${j.slug}`, lastModified: j.updatedAt, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
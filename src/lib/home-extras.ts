// // /**
// //  * FILE: src/lib/home-extras.ts
// //  * TYPE: Server-only data helpers
// //  * INCLUDES: getWhoWeAre() and getGalleryItems() for the home page
// //  */
// // import { asc, eq } from "drizzle-orm";
// // import { db } from "@/db";
// // import * as t from "@/db/schema";
// // import { normAspect, normFocus } from "@/lib/home-media";

// // export type WhoWeAreData = {
// //   eyebrow: string;
// //   title: string;
// //   paragraphs: string[];
// //   highlights: string[];
// //   stats: { value: string; label: string }[];
// //   imageUrl: string;
// //   imageSide: "left" | "right";
// //   imageAspect: string; // portrait | landscape | square
// //   imageFocus: string; // CSS object-position
// //   badgeText: string;
// //   buttonText: string;
// //   buttonUrl: string;
// // };

// // export type GalleryItemView = {
// //   id: number;
// //   kind: "image" | "video";
// //   title: string;
// //   caption: string;
// //   imageUrl: string;
// //   videoUrl: string;
// //   aspect: string; // portrait | landscape | square | tall
// //   focus: string; // CSS object-position
// // };

// // const lines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

// // export async function getWhoWeAre(): Promise<WhoWeAreData | null> {
// //   try {
// //     const [row] = await db
// //       .select()
// //       .from(t.whoWeAre)
// //       .where(eq(t.whoWeAre.isActive, true))
// //       .orderBy(asc(t.whoWeAre.sortOrder), asc(t.whoWeAre.id))
// //       .limit(1);
// //     if (!row) return null;

// //     const stats = lines(row.stats)
// //       .map((l) => {
// //         const i = l.indexOf("|");
// //         return i > 0 ? { value: l.slice(0, i).trim(), label: l.slice(i + 1).trim() } : null;
// //       })
// //       .filter((s): s is { value: string; label: string } => !!s && !!s.value && !!s.label)
// //       .slice(0, 4);

// //     // "tall" is not offered for this section, fall back to portrait
// //     const aspect = normAspect(row.imageAspect);

// //     return {
// //       eyebrow: row.eyebrow || "Who We Are",
// //       title: row.title,
// //       paragraphs: row.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
// //       highlights: lines(row.highlights).slice(0, 6),
// //       stats,
// //       imageUrl: row.imageUrl,
// //       imageSide: row.imageSide === "left" ? "left" : "right",
// //       imageAspect: aspect === "tall" ? "portrait" : aspect,
// //       imageFocus: normFocus(row.imageFocus),
// //       badgeText: row.badgeText,
// //       buttonText: row.buttonText,
// //       buttonUrl: row.buttonUrl,
// //     };
// //   } catch (e) {
// //     // Never break the home page if the table is not migrated yet
// //     console.error("[home] who we are", e);
// //     return null;
// //   }
// // }

// // export async function getGalleryItems(): Promise<GalleryItemView[]> {
// //   try {
// //     const rows = await db
// //       .select()
// //       .from(t.galleryItems)
// //       .where(eq(t.galleryItems.isActive, true))
// //       .orderBy(asc(t.galleryItems.sortOrder), asc(t.galleryItems.id))
// //       .limit(40);

// //     return rows
// //       .map((r) => ({
// //         id: r.id,
// //         kind: (r.kind === "video" ? "video" : "image") as "image" | "video",
// //         title: r.title,
// //         caption: r.caption,
// //         imageUrl: r.imageUrl,
// //         videoUrl: r.videoUrl,
// //         aspect: normAspect(r.aspect),
// //         focus: normFocus(r.focus),
// //       }))
// //       // Skip items that have no usable media
// //       .filter((i) => (i.kind === "video" ? !!i.videoUrl : !!i.imageUrl));
// //   } catch (e) {
// //     console.error("[home] gallery", e);
// //     return [];
// //   }
// // }



// // new new code 




// /**
//  * FILE: src/lib/home-extras.ts
//  * TYPE: Server-only data helpers
//  * INCLUDES: getWhoWeAre() and getGalleryItems(limit) for the home page and the /gallery page
//  */
// import { asc, eq } from "drizzle-orm";
// import { db } from "@/db";
// import * as t from "@/db/schema";
// import { normAspect, normFocus } from "@/lib/home-media";

// export type WhoWeAreData = {
//   eyebrow: string;
//   title: string;
//   paragraphs: string[];
//   highlights: string[];
//   stats: { value: string; label: string }[];
//   imageUrl: string;
//   imageSide: "left" | "right";
//   imageAspect: string; // portrait | landscape | square
//   imageFocus: string; // CSS object-position
//   badgeText: string;
//   buttonText: string;
//   buttonUrl: string;
// };

// export type GalleryItemView = {
//   id: number;
//   kind: "image" | "video";
//   group: string; // image group title ("" = no group)
//   title: string;
//   caption: string;
//   imageUrl: string;
//   videoUrl: string;
//   aspect: string; // portrait | landscape | square | tall
//   focus: string; // CSS object-position
// };

// const lines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

// export async function getWhoWeAre(): Promise<WhoWeAreData | null> {
//   try {
//     const [row] = await db
//       .select()
//       .from(t.whoWeAre)
//       .where(eq(t.whoWeAre.isActive, true))
//       .orderBy(asc(t.whoWeAre.sortOrder), asc(t.whoWeAre.id))
//       .limit(1);
//     if (!row) return null;

//     const stats = lines(row.stats)
//       .map((l) => {
//         const i = l.indexOf("|");
//         return i > 0 ? { value: l.slice(0, i).trim(), label: l.slice(i + 1).trim() } : null;
//       })
//       .filter((s): s is { value: string; label: string } => !!s && !!s.value && !!s.label)
//       .slice(0, 4);

//     // "tall" is not offered for this section, fall back to portrait
//     const aspect = normAspect(row.imageAspect);

//     return {
//       eyebrow: row.eyebrow || "Who We Are",
//       title: row.title,
//       paragraphs: row.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
//       highlights: lines(row.highlights).slice(0, 6),
//       stats,
//       imageUrl: row.imageUrl,
//       imageSide: row.imageSide === "left" ? "left" : "right",
//       imageAspect: aspect === "tall" ? "portrait" : aspect,
//       imageFocus: normFocus(row.imageFocus),
//       badgeText: row.badgeText,
//       buttonText: row.buttonText,
//       buttonUrl: row.buttonUrl,
//     };
//   } catch (e) {
//     // Never break the home page if the table is not migrated yet
//     console.error("[home] who we are", e);
//     return null;
//   }
// }

// /** Active gallery items in admin order. The home page uses the default (120), the /gallery page asks for more. */
// export async function getGalleryItems(limit = 120): Promise<GalleryItemView[]> {
//   try {
//     const rows = await db
//       .select()
//       .from(t.galleryItems)
//       .where(eq(t.galleryItems.isActive, true))
//       .orderBy(asc(t.galleryItems.sortOrder), asc(t.galleryItems.id))
//       .limit(limit);

//     return rows
//       .map((r) => ({
//         id: r.id,
//         kind: (r.kind === "video" ? "video" : "image") as "image" | "video",
//         group: (r.groupTitle || "").replace(/\s+/g, " ").trim(),
//         title: r.title,
//         caption: r.caption,
//         imageUrl: r.imageUrl,
//         videoUrl: r.videoUrl,
//         aspect: normAspect(r.aspect),
//         focus: normFocus(r.focus),
//       }))
//       // Skip items that have no usable media
//       .filter((i) => (i.kind === "video" ? !!i.videoUrl : !!i.imageUrl));
//   } catch (e) {
//     console.error("[home] gallery", e);
//     return [];
//   }
// }





// new code 



/**
 * FILE: src/lib/home-extras.ts
 * TYPE: Server-only data helpers
 * INCLUDES: getWhoWeAre(), getGalleryItems(limit) and getSophos() for the home page / gallery page
 */
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import * as t from "@/db/schema";
import { normAspect, normFocus } from "@/lib/home-media";

export type WhoWeAreData = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  highlights: string[];
  stats: { value: string; label: string }[];
  imageUrl: string;
  imageSide: "left" | "right";
  imageAspect: string; // portrait | landscape | square
  imageFocus: string; // CSS object-position
  badgeText: string;
  buttonText: string;
  buttonUrl: string;
};

export type GalleryItemView = {
  id: number;
  kind: "image" | "video";
  group: string; // image group title ("" = no group)
  title: string;
  caption: string;
  imageUrl: string;
  videoUrl: string;
  aspect: string; // portrait | landscape | square | tall
  focus: string; // CSS object-position
};

/** One tab of the Sophos section. Same shape the PlatformTabs component expects. */
export type SophosItem = {
  id: string;
  title: string;
  kicker: string;
  description: string;
  image: string;
  href: string;
  points: string[];
};

export type SophosData = {
  eyebrow: string;
  title: string;
  body: string;
  note: string;
  items: SophosItem[];
};

const lines = (s: string) => s.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);

export async function getWhoWeAre(): Promise<WhoWeAreData | null> {
  try {
    const [row] = await db
      .select()
      .from(t.whoWeAre)
      .where(eq(t.whoWeAre.isActive, true))
      .orderBy(asc(t.whoWeAre.sortOrder), asc(t.whoWeAre.id))
      .limit(1);
    if (!row) return null;

    const stats = lines(row.stats)
      .map((l) => {
        const i = l.indexOf("|");
        return i > 0 ? { value: l.slice(0, i).trim(), label: l.slice(i + 1).trim() } : null;
      })
      .filter((s): s is { value: string; label: string } => !!s && !!s.value && !!s.label)
      .slice(0, 4);

    // "tall" is not offered for this section, fall back to portrait
    const aspect = normAspect(row.imageAspect);

    return {
      eyebrow: row.eyebrow || "Who We Are",
      title: row.title,
      paragraphs: row.body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
      highlights: lines(row.highlights).slice(0, 6),
      stats,
      imageUrl: row.imageUrl,
      imageSide: row.imageSide === "left" ? "left" : "right",
      imageAspect: aspect === "tall" ? "portrait" : aspect,
      imageFocus: normFocus(row.imageFocus),
      badgeText: row.badgeText,
      buttonText: row.buttonText,
      buttonUrl: row.buttonUrl,
    };
  } catch (e) {
    // Never break the home page if the table is not migrated yet
    console.error("[home] who we are", e);
    return null;
  }
}

/** Active gallery items in admin order. The home page uses the default (120), the /gallery page asks for more. */
export async function getGalleryItems(limit = 120): Promise<GalleryItemView[]> {
  try {
    const rows = await db
      .select()
      .from(t.galleryItems)
      .where(eq(t.galleryItems.isActive, true))
      .orderBy(asc(t.galleryItems.sortOrder), asc(t.galleryItems.id))
      .limit(limit);

    return rows
      .map((r) => ({
        id: r.id,
        kind: (r.kind === "video" ? "video" : "image") as "image" | "video",
        group: (r.groupTitle || "").replace(/\s+/g, " ").trim(),
        title: r.title,
        caption: r.caption,
        imageUrl: r.imageUrl,
        videoUrl: r.videoUrl,
        aspect: normAspect(r.aspect),
        focus: normFocus(r.focus),
      }))
      // Skip items that have no usable media
      .filter((i) => (i.kind === "video" ? !!i.videoUrl : !!i.imageUrl));
  } catch (e) {
    console.error("[home] gallery", e);
    return [];
  }
}

/**
 * Sophos section for the home page: heading from "Sophos section" + tabs from "Sophos products".
 * Returns null (section hidden) when the section is switched off, missing, or has no active product.
 */
export async function getSophos(): Promise<SophosData | null> {
  try {
    const [sec] = await db
      .select()
      .from(t.sophosSection)
      .where(eq(t.sophosSection.isActive, true))
      .orderBy(asc(t.sophosSection.sortOrder), asc(t.sophosSection.id))
      .limit(1);
    if (!sec) return null;

    const rows = await db
      .select()
      .from(t.sophosProducts)
      .where(eq(t.sophosProducts.isActive, true))
      .orderBy(asc(t.sophosProducts.sortOrder), asc(t.sophosProducts.id))
      .limit(24);

    const items: SophosItem[] = rows.map((r) => ({
      id: `sophos-${r.id}`,
      title: r.name,
      kicker: r.kicker || "SAP",
      description: r.description,
      image: r.imageUrl || "/images/hero/firewall-rack.jpg",
      // no link set: send the visitor to the contact form for this product
      href: r.linkUrl || `/contact?service=${encodeURIComponent(r.name)}`,
      points: lines(r.points).slice(0, 4),
    }));
    if (!items.length) return null;

    return {
      eyebrow: sec.eyebrow || "Sophos security",
      title: sec.title,
      body: sec.body,
      note: sec.note,
      items,
    };
  } catch (e) {
    // Never break the home page if the tables are not created yet
    console.error("[home] sophos", e);
    return null;
  }
}
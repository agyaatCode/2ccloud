/**
 * FILE: src/app/(site)/gallery/page.tsx
 * TYPE: Server Component (route: /gallery)
 * INCLUDES: Full gallery page. Loads every active photo and video and hands them to the client view.
 */
import type { Metadata } from "next";
import { JsonLd } from "@/components/ui";
import { GalleryPageView } from "@/components/home/GalleryPageView";
import { breadcrumbSchema, buildMetadata, getSiteUrl } from "@/lib/data";
import { getGalleryItems } from "@/lib/home-extras";

// Keep the page fresh so admin changes show up immediately
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    type: "page",
    key: "gallery",
    path: "/gallery",
    fallbackTitle: "Gallery — Photos & Videos",
    fallbackDescription: "Browse our photo and video gallery: events, team moments and milestones, organised by group.",
  });
}

export default async function GalleryPage() {
  const [items, base] = await Promise.all([getGalleryItems(500), getSiteUrl()]);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema(base, [
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
      <GalleryPageView items={items} />
    </>
  );
}
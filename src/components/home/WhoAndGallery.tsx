/**
 * FILE: src/components/home/WhoAndGallery.tsx
 * TYPE: Server Component
 * INCLUDES: Fetches data and renders "Who We Are" followed by the Gallery slider.
 * Place it on the home page right before the Marketplaces section.
 */
import { WhoWeAreView } from "@/components/home/WhoWeAreView";
import { GallerySlider } from "@/components/home/GallerySlider";
import { getGalleryItems, getWhoWeAre } from "@/lib/home-extras";

export async function WhoAndGallery() {
  const [who, items] = await Promise.all([getWhoWeAre(), getGalleryItems()]);
  return (
    <>
      {who && <WhoWeAreView data={who} />}
      {items.length > 0 && <GallerySlider items={items} />}
    </>
  );
}
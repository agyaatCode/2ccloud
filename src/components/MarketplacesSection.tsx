import { Reveal } from "@/components/motion";
import { MarketplaceCarousel } from "@/components/MarketplaceCarousel";
import { getMarketplaces, getSections } from "@/lib/data";

export async function MarketplacesSection() {
  const [items, sec] = await Promise.all([getMarketplaces(), getSections("home")]);
  const head = sec.marketplaces; // optional: editable from Admin > Pages > Home

  // Hide section when switched off in admin or when there are no active products
  if (items.length === 0 || (head && !head.isActive)) return null;

  const eyebrow = head?.eyebrow || "Our Marketplaces";
  const title = head?.title || "Products trusted by our clients";
  const body = head?.body || "";

  return (
    <section className="bg-mist py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="mb-10 max-w-2xl">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="h-section text-balance">{title}</h2>
          {body && <p className="mt-4 leading-relaxed text-slate-soft">{body}</p>}
        </Reveal>
        <MarketplaceCarousel items={items} />
      </div>
    </section>
  );
}
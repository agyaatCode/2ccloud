import { CATEGORY_LABEL, NAV, PAGES, SERVICES } from "@/lib/content";

export type SearchResultType = "Service" | "Page" | "Section";

export type SearchResult = {
  type: SearchResultType;
  title: string;
  href: string;
  category: string;
  desc: string;
  haystack: string;
};

/* Maps each service category to its top-level navbar menu, so menu names are searchable too. */
const MENU_BY_CATEGORY: Record<string, string> = {
  cloud: "Products",
  workplace: "Products",
  services: "Solutions",
  security: "Security",
};

const norm = (s: string) => s.toLowerCase();

export function buildSearchIndex(): SearchResult[] {
  const index: SearchResult[] = [];
  const seen = new Set<string>();

  const push = (item: SearchResult) => {
    if (seen.has(item.href)) return;
    seen.add(item.href);
    index.push(item);
  };

  /* every service page: title, eyebrow, hero copy, short + long description and all features */
  for (const s of SERVICES) {
    const menu = MENU_BY_CATEGORY[s.category] ?? s.category;
    push({
      type: "Service",
      title: s.title,
      href: `/${s.category}/${s.slug}`,
      category: menu,
      desc: s.short,
      haystack: norm(
        [
          menu,
          CATEGORY_LABEL[s.category] ?? s.category,
          s.title,
          s.eyebrow,
          s.heroTitle,
          s.heroDesc,
          s.short,
          s.long,
          ...s.features.map((f) => `${f[0]} ${f[1]}`),
        ].join(" ")
      ),
    });
  }

  /* every static page */
  for (const p of PAGES) {
    push({
      type: "Page",
      title: p.title,
      href: p.slug === "home" ? "/" : `/${p.slug}`,
      category: "Page",
      desc: p.heroDesc,
      haystack: norm([p.title, p.eyebrow, p.heroTitle, p.heroDesc].join(" ")),
    });
  }

  /* every navbar dropdown link (kept only when its URL is not already covered above) */
  for (const n of NAV) {
    if (!n.columns) continue;
    for (const col of n.columns) {
      for (const l of col.links) {
        push({
          type: "Section",
          title: l.label,
          href: l.href,
          category: n.label,
          desc: l.desc ?? "",
          haystack: norm([l.label, l.desc ?? "", n.label, col.title].join(" ")),
        });
      }
    }
  }

  return index;
}

export const SEARCH_INDEX: SearchResult[] = buildSearchIndex();

export function searchSite(query: string, limit = 8): SearchResult[] {
  const q = norm(query).trim();
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  return SEARCH_INDEX.map((item) => {
    let score = 0;
    const title = norm(item.title);
    const category = norm(item.category);
    for (const term of terms) {
      if (title === term) score += 100;
      else if (title.startsWith(term)) score += 60;
      else if (title.includes(term)) score += 35;
      if (item.haystack.includes(term)) score += 10;
      if (category.includes(term)) score += 5;
    }
    return { item, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((x) => x.item);
}

export const SEARCH_HINTS = ["cloud migration", "managed services", "ddos protection", "microsoft 365", "contact"];

import Link from "next/link";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { pages } from "@/db/schema";
import { requireAdminPage } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PagesList() {
  await requireAdminPage("pages.manage");
  const rows = await db.select().from(pages).orderBy(asc(pages.id));
  return (
    <div>
      <h1 className="mb-1 text-lg font-bold">Pages</h1>
      <p className="mb-4 text-slate-500">Edit hero settings (image or video, overlay, alignment) and section content for each page. Service pages are edited under <Link className="font-semibold text-[#0f5cab] underline" href="/admin/r/services">Services</Link>.</p>
      <div className="a-card overflow-hidden">
        <table className="a-table">
          <thead><tr><th>Preview</th><th>Page</th><th>Hero type</th><th>Headline</th><th /></tr></thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id}>
                <td>{/* eslint-disable-next-line @next/next/no-img-element */}{p.heroImageUrl ? <img src={p.heroImageUrl} alt="" className="h-9 w-16 rounded object-cover" /> : null}</td>
                <td className="font-semibold">{p.title}<span className="block text-[12px] font-normal text-slate-500">/{p.slug === "home" ? "" : p.slug}</span></td>
                <td><span className="a-pill info">{p.heroType}</span></td><td className="max-w-xs truncate text-slate-600">{p.heroTitle}</td>
                <td className="text-right"><Link className="a-btn" href={`/admin/pages/${p.slug}`}>Edit hero &amp; content</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

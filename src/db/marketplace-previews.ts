import { eq } from "drizzle-orm";
import { db } from "@/db";
import * as t from "@/db/schema";
import { fetchSitePreview } from "@/lib/admin/preview";

// Fills the cover image for products that have a link but no image yet
async function run() {
  const rows = await db.select().from(t.marketplaces);
  let done = 0;
  for (const r of rows) {
    if (r.imageUrl || !r.linkUrl) continue;
    const shot = await fetchSitePreview(r.linkUrl);
    if (!shot) {
      console.log(`- ${r.name}: skipped (no public link or preview failed)`);
      continue;
    }
    await db.update(t.marketplaces).set({ imageUrl: shot }).where(eq(t.marketplaces.id, r.id));
    console.log(`- ${r.name}: preview saved`);
    done++;
  }
  console.log(`Done. ${done} preview(s) saved.`);
}

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
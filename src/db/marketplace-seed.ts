import { count } from "drizzle-orm";
import { db } from "@/db";
import * as t from "@/db/schema";

/* ---------- Marketplaces (Our Marketplaces carousel demo data) ---------- */
const MARKETPLACE_SEEDS = [
  { name: "CBO ERP", category: "ERP", tagline: "One platform for finance, inventory and operations", description: "A cloud-ready ERP that connects accounting, procurement, inventory, sales and HR in a single system, with real-time dashboards and role-based access.", linkText: "Visit CBO ERP", linkUrl: "https://example.com/cbo-erp", sortOrder: 1 },
  { name: "ZEDX Software", category: "Business Software", tagline: "Custom business software built for scale", description: "Workflow automation, billing and customer management tools hosted on secure, monitored infrastructure with 24x7 support.", linkText: "Visit ZEDX", linkUrl: "https://example.com/zedx", sortOrder: 2 },
  { name: "HRMS Pro", category: "HRMS", tagline: "Attendance, payroll and leave in one place", description: "Automates onboarding, attendance, leave and payroll with statutory compliance reports and an employee self-service portal.", linkText: "Learn more", linkUrl: "https://example.com/hrms-pro", sortOrder: 3 },
  { name: "SchoolSync", category: "Education", tagline: "Campus management for schools and colleges", description: "Admissions, fee collection, timetables, exams and parent communication on one secure cloud platform.", linkText: "Learn more", linkUrl: "https://example.com/schoolsync", sortOrder: 4 },
  { name: "RetailEdge POS", category: "Retail", tagline: "Billing and stock control for multi-store retail", description: "Fast point-of-sale billing, barcode inventory, GST invoicing and centralised reporting across all your outlets.", linkText: "Learn more", linkUrl: "https://example.com/retailedge", sortOrder: 5 },
  { name: "CloudDesk Support", category: "Helpdesk", tagline: "Ticketing and SLA tracking for IT teams", description: "Omnichannel ticketing with SLA timers, automation rules, a knowledge base and customer satisfaction tracking.", linkText: "Learn more", linkUrl: "/contact", sortOrder: 6 },
];

// Seeds only when the table is empty, so admin edits are never overwritten
async function seedMarketplaces() {
  const [{ c }] = await db.select({ c: count() }).from(t.marketplaces);
  if (Number(c) > 0) {
    console.log(`Marketplaces table already has ${c} row(s). Skipping seed.`);
    return;
  }
  await db.insert(t.marketplaces).values(
    MARKETPLACE_SEEDS.map((m) => ({ ...m, logoUrl: "", imageUrl: "", isActive: true }))
  );
  console.log(`Seeded ${MARKETPLACE_SEEDS.length} marketplace products`);
}

// Entry point: run the seed and exit
seedMarketplaces()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Marketplace seed failed:", e);
    process.exit(1);
  });
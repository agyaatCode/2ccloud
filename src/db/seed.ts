import { count } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db } from "@/db";
import * as t from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { MASTER_SEEDS, PAGES, SERVICES, SETTINGS_DEFAULTS, serviceExtras } from "@/lib/content";

const PERMS: [string, string][] = [
  ["branding.manage", "Edit logo and favicon"], ["settings.manage", "Edit site settings"], ["pages.manage", "Edit pages, heroes and sections"],
  ["services.manage", "Manage services"], ["news.manage", "Manage news"], ["media.manage", "Manage media library"], ["seo.manage", "Manage SEO"],
  ["jobs.manage", "Manage jobs"], ["applicants.manage", "Manage applicants"], ["masters.manage", "Manage universities, boards, qualifications, roles"],
  ["customers.view", "View and manage customers"], ["contacts.manage", "Manage contact enquiries"], ["audit.view", "View audit logs"], ["admins.manage", "Manage admin users"],
];
const ROLE_MAP: Record<string, { name: string; perms: string[] }> = {
  super_admin: { name: "Super Admin", perms: PERMS.map((p) => p[0]) },
  content_editor: { name: "Content Editor", perms: ["pages.manage", "services.manage", "news.manage", "media.manage", "seo.manage"] },
  hr_manager: { name: "HR Manager", perms: ["jobs.manage", "applicants.manage", "masters.manage", "media.manage"] },
  support: { name: "Support", perms: ["customers.view", "contacts.manage"] },
};

const NEWS_SEED = [
  { slug: "five-questions-before-a-cloud-migration", title: "Five questions to answer before a cloud migration", cat: "Insights", image: "/images/hero/migration-hall.jpg", featured: true, days: 6,
    excerpt: "Most migration problems are decided before the first server moves. These are the questions we ask in discovery.",
    content: "Cloud migrations rarely fail because of the target platform. They fail because of surprises: an undocumented dependency, an undersized database, a cutover with no way back.\n\nBefore planning any move, we work through five questions with the client.\n\n1. What do you actually run? A reliable inventory of servers, applications and data stores is the foundation of every plan.\n\n2. What talks to what? Dependency mapping shows which systems must move together and which can wait.\n\n3. What does downtime cost? The answer sets the migration method, from a weekend cutover to continuous replication.\n\n4. How will we know it worked? Define validation checks for data and function in advance.\n\n5. How do we go back? A rehearsed rollback plan turns a risky window into a routine one.\n\nAnswering these early makes the rest of the project calmer, cheaper and faster." },
  { slug: "backups-you-have-never-restored", title: "Backups you have never restored are not backups", cat: "Engineering", image: "/images/stock/continuity.jpg", featured: false, days: 18,
    excerpt: "Recovery testing is the difference between having a backup job and having a recovery capability.",
    content: "A green tick on a backup dashboard confirms that a job ran. It does not confirm that your business can recover.\n\nGood recovery practice has three parts: agreed recovery objectives, copies that survive the failure modes you actually face, and regular tests that prove it works.\n\nStart by agreeing a recovery time objective and recovery point objective for each system with the people who rely on it. Keep at least one copy offsite and immutable, so ransomware cannot encrypt it. Then schedule a restore drill, time it, and write down what went wrong.\n\nThe first drill almost always finds a gap. Better to find it on a Tuesday afternoon than during an incident." },
  { slug: "layered-ddos-defence", title: "Layered DDoS defence: what actually helps", cat: "Security", image: "/images/hero/firewall-rack.jpg", featured: false, days: 33,
    excerpt: "No single product stops every attack. A layered approach keeps services reachable under pressure.",
    content: "Denial-of-service attacks come in different shapes: large floods that saturate bandwidth, protocol attacks that exhaust connection tables, and application-layer floods that look like ordinary users.\n\nEffective defence is layered. Upstream scrubbing absorbs volumetric attacks before they reach your network. Rate limiting and a web application firewall handle application-layer floods. Sensible architecture, with caching and redundancy, reduces how much any one component can be hurt.\n\nJust as important is preparation: know your normal traffic, document who to call, and rehearse the response. Detection is only useful if someone acts on it." },
];

const JOBS_SEED = [
  { slug: "cloud-engineer", title: "Cloud Engineer", department: "Engineering", location: "India (hybrid)", type: "Full-time", exp: "2–5 years", summary: "Design, migrate and operate customer workloads on AWS, Azure and Google Cloud.", image: "/images/stock/careers.jpg",
    description: "You will join our cloud team to design environments, run migrations and keep production healthy for managed-services customers.",
    resp: "Design and build cloud environments using infrastructure as code\nPlan and execute server and application migrations\nMonitor, patch and improve customer environments\nDocument architecture and runbooks",
    req: "Hands-on experience with at least one major cloud platform\nSolid Linux and networking fundamentals\nExperience with Terraform or similar tooling\nClear written and spoken communication" },
  { slug: "devops-engineer", title: "DevOps Engineer", department: "Engineering", location: "India (hybrid)", type: "Full-time", exp: "3–6 years", summary: "Build CI/CD pipelines, platform automation and observability for client engineering teams.", image: "/images/stock/devops.jpg",
    description: "Work with client teams to automate delivery and improve reliability across their platforms.",
    resp: "Build and maintain CI/CD pipelines\nContainerise applications and operate Kubernetes clusters\nImplement monitoring, logging and alerting\nAutomate infrastructure with code",
    req: "Experience with Git-based CI/CD tooling\nContainers and Kubernetes experience\nScripting in Bash or Python\nUnderstanding of security basics in pipelines" },
  { slug: "security-analyst", title: "Security Analyst", department: "Security", location: "India (on-site)", type: "Full-time", exp: "2–4 years", summary: "Run vulnerability assessments, monitor security tooling and support incident response.", image: "/images/stock/vapt.jpg",
    description: "Support our security services including VAPT, endpoint protection and DDoS response.",
    resp: "Perform vulnerability assessments and report findings\nMonitor security alerts and triage incidents\nSupport customer remediation\nMaintain security documentation",
    req: "Understanding of networking and common attack techniques\nExperience with scanning and testing tools\nStructured, accurate reporting\nCertifications such as CEH or Security+ are a plus" },
];

async function empty(table: PgTable) {
  const [r] = await db.select({ c: count() }).from(table);
  return Number(r.c) === 0;
}

export async function seedIfNeeded() {
  // ---- RBAC ----
  if (await empty(t.roles)) {
    const permRows = await db.insert(t.permissions).values(PERMS.map(([key, description]) => ({ key, description }))).returning();
    for (const [key, def] of Object.entries(ROLE_MAP)) {
      const [role] = await db.insert(t.roles).values({ key, name: def.name }).returning();
      const ids = permRows.filter((p) => def.perms.includes(p.key)).map((p) => ({ roleId: role.id, permissionId: p.id }));
      if (ids.length) await db.insert(t.rolePermissions).values(ids);
    }
  }
  if (await empty(t.admins)) {
    const [sa] = await db.select().from(t.roles).limit(100).then((rs) => rs.filter((r) => r.key === "super_admin"));
    await db.insert(t.admins).values({
      name: "Site Administrator",
      email: (process.env.ADMIN_EMAIL || "admin@2ccloud.com").toLowerCase(),
      passwordHash: hashPassword(process.env.ADMIN_PASSWORD || "Admin@12345"),
      roleId: sa?.id ?? null,
    });
  }

  // ---- branding + settings ----
  if (await empty(t.brandingSettings)) {
    await db.insert(t.brandingSettings).values({ logoUrl: "/brand/logo.svg", mobileLogoUrl: "/brand/logo.svg", darkLogoUrl: "/brand/logo-dark.svg", faviconUrl: "/brand/favicon.svg" });
  }
  if (await empty(t.siteSettings)) {
    await db.insert(t.siteSettings).values(Object.entries(SETTINGS_DEFAULTS).map(([key, value]) => ({ key, value })));
  }

  // ---- pages ----
  if (await empty(t.pages)) {
    await db.insert(t.pages).values(
      PAGES.map((p) => ({
        slug: p.slug, title: p.title, heroEyebrow: p.eyebrow, heroTitle: p.heroTitle, heroDescription: p.heroDesc,
        heroPrimaryText: p.primary?.[0] ?? "", heroPrimaryUrl: p.primary?.[1] ?? "", heroSecondaryText: p.secondary?.[0] ?? "", heroSecondaryUrl: p.secondary?.[1] ?? "",
        heroImageUrl: p.image, heroPosDesktop: p.pos ?? "center center", heroOverlayOpacity: p.opacity ?? 78,
        heroHeight: p.slug === "home" ? 720 : p.slug === "register" || p.slug === "login" ? 440 : 600,
      })),
    );
  }

  // ---- services ----
  if (await empty(t.services)) {
    let order = 0;
    for (const s of SERVICES) {
      const [row] = await db.insert(t.services).values({
        slug: s.slug, category: s.category, parentSlug: s.parent ?? "", title: s.title, shortDescription: s.short, longDescription: s.long,
        icon: s.icon, diagram: s.diagram, cardImageUrl: s.image, sectionImageUrl: s.image, isFeatured: !!s.featured, sortOrder: order++,
        ctaTitle: `Talk to an expert about ${s.title}`, ctaText: "Share a few details about your environment and an engineer will get back to you within one business day.",
        ctaButtonText: "Start a Conversation", ctaButtonUrl: `/contact?service=${encodeURIComponent(s.title)}`,
        heroEyebrow: s.eyebrow, heroTitle: s.heroTitle, heroDescription: s.heroDesc, heroPrimaryText: "Start a Conversation", heroPrimaryUrl: `/contact?service=${encodeURIComponent(s.title)}`,
        heroSecondaryText: "Request a Callback", heroSecondaryUrl: "/contact", heroImageUrl: s.image, heroPosDesktop: s.pos ?? "center center", heroPosMobile: s.posM ?? s.pos ?? "center center",
        heroOverlayColor: s.overlay ?? (s.category === "security" ? "#071A33" : "#0A1F44"), heroOverlayOpacity: s.opacity ?? 80, heroHeight: 600,
      }).returning();
      const x = serviceExtras(s);
      await db.insert(t.serviceFeatures).values([
        ...s.features.map(([title, description], i) => ({ serviceId: row.id, kind: "feature", title, description, sortOrder: i })),
        ...x.process.map(([title, description], i) => ({ serviceId: row.id, kind: "process", title, description, sortOrder: i })),
      ]);
      await db.insert(t.serviceBenefits).values(x.benefits.map(([title, description], i) => ({ serviceId: row.id, title, description, sortOrder: i })));
      await db.insert(t.serviceFaqs).values(x.faqs.map(([question, answer], i) => ({ serviceId: row.id, question, answer, sortOrder: i })));
    }
  }

  // ---- news ----
  if (await empty(t.newsCategories)) {
    const cats = await db.insert(t.newsCategories).values([{ name: "Insights", slug: "insights" }, { name: "Engineering", slug: "engineering" }, { name: "Security", slug: "security" }, { name: "Company", slug: "company" }]).returning();
    if (await empty(t.news)) {
      for (const n of NEWS_SEED) {
        await db.insert(t.news).values({
          slug: n.slug, title: n.title, excerpt: n.excerpt, content: n.content, categoryId: cats.find((c) => c.name === n.cat)?.id ?? null,
          author: "Editorial Team", featuredImageUrl: n.image, status: "published", isFeatured: n.featured, publishedAt: new Date(Date.now() - n.days * 86400000),
        });
      }
    }
  }

  // ---- HR masters + jobs ----
  const seedMaster = async (table: typeof t.universities, names: string[]) => {
    if (await empty(table)) await db.insert(table).values(names.map((name, i) => ({ name, sortOrder: i })));
  };
  await seedMaster(t.universities, MASTER_SEEDS.universities);
  await seedMaster(t.boards, MASTER_SEEDS.boards);
  await seedMaster(t.qualifications, MASTER_SEEDS.qualifications);
  await seedMaster(t.jobRoles, MASTER_SEEDS.jobRoles);
  if (await empty(t.jobs)) {
    await db.insert(t.jobs).values(
      JOBS_SEED.map((j) => ({ slug: j.slug, title: j.title, department: j.department, location: j.location, employmentType: j.type, experience: j.exp, summary: j.summary, description: j.description, responsibilities: j.resp, requirements: j.req, heroImageUrl: j.image })),
    );
  }

  // ---- media library (index the bundled imagery) ----
  if (await empty(t.media)) {
    const fs = await import("node:fs");
    const path = await import("node:path");
    const rows: (typeof t.media.$inferInsert)[] = [];
    for (const dir of ["images/hero", "images/stock", "brand"]) {
      const abs = path.join(process.cwd(), "public", dir);
      if (!fs.existsSync(abs)) continue;
      for (const f of fs.readdirSync(abs)) {
        const ext = path.extname(f).toLowerCase();
        if (![".jpg", ".png", ".svg", ".webp"].includes(ext)) continue;
        const title = f.replace(ext, "").replace(/[-_]/g, " ");
        rows.push({ title, altText: title, kind: "image", source: "upload", url: `/${dir}/${f}`, mimeType: ext === ".svg" ? "image/svg+xml" : `image/${ext.slice(1) === "jpg" ? "jpeg" : ext.slice(1)}`, size: fs.statSync(path.join(abs, f)).size });
      }
    }
    if (rows.length) await db.insert(t.media).values(rows);
  }
}

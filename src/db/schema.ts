import { config } from "dotenv";
config({ path: ".env.local" });

import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  date,
  index,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/pg-core";

const ts = () => ({
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** Hero settings shared by pages and services (fully CMS-controlled). */
const heroCols = () => ({
  heroEyebrow: text("hero_eyebrow").notNull().default(""),
  heroTitle: text("hero_title").notNull().default(""),
  heroDescription: text("hero_description").notNull().default(""),
  heroPrimaryText: text("hero_primary_text").notNull().default(""),
  heroPrimaryUrl: text("hero_primary_url").notNull().default(""),
  heroSecondaryText: text("hero_secondary_text").notNull().default(""),
  heroSecondaryUrl: text("hero_secondary_url").notNull().default(""),
  heroType: varchar("hero_type", { length: 10 }).notNull().default("image"),
  heroImageUrl: text("hero_image_url").notNull().default(""),
  heroMobileImageUrl: text("hero_mobile_image_url").notNull().default(""),
  heroVideoUrl: text("hero_video_url").notNull().default(""),
  heroPosterUrl: text("hero_poster_url").notNull().default(""),
  heroOverlayColor: varchar("hero_overlay_color", { length: 9 }).notNull().default("#0A1F44"),
  heroOverlayOpacity: integer("hero_overlay_opacity").notNull().default(78),
  heroAlign: varchar("hero_align", { length: 10 }).notNull().default("left"),
  heroHeight: integer("hero_height").notNull().default(640),
  heroPosDesktop: varchar("hero_pos_desktop", { length: 40 }).notNull().default("center center"),
  heroPosMobile: varchar("hero_pos_mobile", { length: 40 }).notNull().default("center center"),
  heroAnimate: boolean("hero_animate").notNull().default(true),
  heroParallax: boolean("hero_parallax").notNull().default(true),
});

/* ------------------------------ RBAC / auth ------------------------------ */
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 40 }).notNull().unique(),
  name: varchar("name", { length: 80 }).notNull(),
  ...ts(),
});

export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 60 }).notNull().unique(),
  description: text("description").notNull().default(""),
});

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: integer("role_id").notNull().references(() => roles.id, { onDelete: "cascade" }),
    permissionId: integer("permission_id").notNull().references(() => permissions.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.roleId, t.permissionId] })],
);

export const admins = pgTable(
  "admins",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 120 }).notNull(),
    email: varchar("email", { length: 190 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    roleId: integer("role_id").references(() => roles.id, { onDelete: "set null" }),
    isActive: boolean("is_active").notNull().default(true),
    lastLoginAt: timestamp("last_login_at"),
    ...ts(),
  },
  (t) => [index("admins_role_idx").on(t.roleId)],
);

/** Customers. */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 140 }).notNull(),
  company: varchar("company", { length: 160 }).notNull().default(""),
  email: varchar("email", { length: 190 }).notNull().unique(),
  mobile: varchar("mobile", { length: 30 }).notNull().default(""),
  passwordHash: text("password_hash").notNull(),
  country: varchar("country", { length: 80 }).notNull().default(""),
  state: varchar("state", { length: 80 }).notNull().default(""),
  city: varchar("city", { length: 80 }).notNull().default(""),
  address: text("address").notNull().default(""),
  serviceInterest: varchar("service_interest", { length: 120 }).notNull().default(""),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  ...ts(),
});

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 64 }).primaryKey(), // sha256 of the cookie token
    kind: varchar("kind", { length: 10 }).notNull(), // admin | user
    subjectId: integer("subject_id").notNull(),
    csrfToken: varchar("csrf_token", { length: 64 }).notNull(),
    ip: varchar("ip", { length: 64 }).notNull().default(""),
    userAgent: text("user_agent").notNull().default(""),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("sessions_subject_idx").on(t.kind, t.subjectId), index("sessions_exp_idx").on(t.expiresAt)],
);

/* ------------------------------ Branding / settings ------------------------------ */
export const brandingSettings = pgTable("branding_settings", {
  id: serial("id").primaryKey(),
  logoUrl: text("logo_url").notNull().default(""),
  mobileLogoUrl: text("mobile_logo_url").notNull().default(""),
  darkLogoUrl: text("dark_logo_url").notNull().default(""),
  faviconUrl: text("favicon_url").notNull().default(""),
  ...ts(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 80 }).notNull().unique(),
  value: text("value").notNull().default(""),
  ...ts(),
});

/* ------------------------------ CMS ------------------------------ */
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  title: varchar("title", { length: 160 }).notNull(),
  isPublished: boolean("is_published").notNull().default(true),
  ...heroCols(),
  ...ts(),
});

export const pageSections = pgTable(
  "page_sections",
  {
    id: serial("id").primaryKey(),
    pageSlug: varchar("page_slug", { length: 80 }).notNull().references(() => pages.slug, { onDelete: "cascade", onUpdate: "cascade" }),
    sectionKey: varchar("section_key", { length: 60 }).notNull(),
    eyebrow: text("eyebrow").notNull().default(""),
    title: text("title").notNull().default(""),
    body: text("body").notNull().default(""),
    imageUrl: text("image_url").notNull().default(""),
    videoUrl: text("video_url").notNull().default(""),
    buttonText: text("button_text").notNull().default(""),
    buttonUrl: text("button_url").notNull().default(""),
    data: jsonb("data").$type<Record<string, unknown>>().notNull().default({}),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    ...ts(),
  },
  (t) => [uniqueIndex("page_sections_uq").on(t.pageSlug, t.sectionKey)],
);

export const services = pgTable(
  "services",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 80 }).notNull().unique(),
    category: varchar("category", { length: 20 }).notNull(), // cloud | workplace | services | security
    parentSlug: varchar("parent_slug", { length: 80 }).notNull().default(""),
    title: varchar("title", { length: 160 }).notNull(),
    shortDescription: text("short_description").notNull().default(""),
    longDescription: text("long_description").notNull().default(""),
    icon: varchar("icon", { length: 40 }).notNull().default("cloud"),
    cardImageUrl: text("card_image_url").notNull().default(""),
    sectionImageUrl: text("section_image_url").notNull().default(""),
    diagram: varchar("diagram", { length: 30 }).notNull().default("cloud"),
    ctaTitle: text("cta_title").notNull().default(""),
    ctaText: text("cta_text").notNull().default(""),
    ctaButtonText: text("cta_button_text").notNull().default(""),
    ctaButtonUrl: text("cta_button_url").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    isFeatured: boolean("is_featured").notNull().default(false),
    isPublished: boolean("is_published").notNull().default(true),
    ...heroCols(),
    ...ts(),
  },
  (t) => [index("services_cat_idx").on(t.category, t.sortOrder)],
);

export const serviceFeatures = pgTable(
  "service_features",
  {
    id: serial("id").primaryKey(),
    serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
    kind: varchar("kind", { length: 10 }).notNull().default("feature"), // feature | process
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("service_features_idx").on(t.serviceId, t.kind)],
);

export const serviceBenefits = pgTable(
  "service_benefits",
  {
    id: serial("id").primaryKey(),
    serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("service_benefits_idx").on(t.serviceId)],
);

export const serviceFaqs = pgTable(
  "service_faqs",
  {
    id: serial("id").primaryKey(),
    serviceId: integer("service_id").notNull().references(() => services.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    answer: text("answer").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("service_faqs_idx").on(t.serviceId)],
);

/* ------------------------------ News ------------------------------ */
export const newsCategories = pgTable("news_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 80 }).notNull(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  ...ts(),
});

export const news = pgTable(
  "news",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    title: varchar("title", { length: 220 }).notNull(),
    excerpt: text("excerpt").notNull().default(""),
    content: text("content").notNull().default(""),
    categoryId: integer("category_id").references(() => newsCategories.id, { onDelete: "set null" }),
    author: varchar("author", { length: 120 }).notNull().default(""),
    featuredImageUrl: text("featured_image_url").notNull().default(""),
    videoUrl: text("video_url").notNull().default(""),
    posterUrl: text("poster_url").notNull().default(""),
    heroPosDesktop: varchar("hero_pos_desktop", { length: 40 }).notNull().default("center center"),
    status: varchar("status", { length: 12 }).notNull().default("draft"), // draft | published | scheduled
    publishedAt: timestamp("published_at"),
    isFeatured: boolean("is_featured").notNull().default(false),
    ...ts(),
  },
  (t) => [index("news_status_idx").on(t.status, t.publishedAt), index("news_cat_idx").on(t.categoryId)],
);

export const newsImages = pgTable(
  "news_images",
  {
    id: serial("id").primaryKey(),
    newsId: integer("news_id").notNull().references(() => news.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    caption: text("caption").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("news_images_idx").on(t.newsId)],
);

/* ------------------------------ HR ------------------------------ */
const master = (name: string) =>
  pgTable(name, {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 200 }).notNull().unique(),
    isActive: boolean("is_active").notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    ...ts(),
  });

export const universities = master("universities");
export const boards = master("boards");
export const qualifications = master("qualifications");
export const jobRoles = master("job_roles");

export const jobs = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    department: varchar("department", { length: 120 }).notNull().default(""),
    location: varchar("location", { length: 160 }).notNull().default(""),
    employmentType: varchar("employment_type", { length: 40 }).notNull().default("Full-time"),
    experience: varchar("experience", { length: 80 }).notNull().default(""),
    openings: integer("openings").notNull().default(1),
    summary: text("summary").notNull().default(""),
    description: text("description").notNull().default(""),
    responsibilities: text("responsibilities").notNull().default(""),
    requirements: text("requirements").notNull().default(""),
    salaryRange: varchar("salary_range", { length: 120 }).notNull().default(""),
    heroImageUrl: text("hero_image_url").notNull().default(""),
    heroVideoUrl: text("hero_video_url").notNull().default(""),
    status: varchar("status", { length: 10 }).notNull().default("active"), // active | inactive | closed
    closingDate: date("closing_date"),
    ...ts(),
  },
  (t) => [index("jobs_status_idx").on(t.status)],
);

export const jobApplications = pgTable(
  "job_applications",
  {
    id: serial("id").primaryKey(),
    referenceNo: varchar("reference_no", { length: 24 }).notNull().unique(),
    jobId: integer("job_id").references(() => jobs.id, { onDelete: "set null" }),
    roleName: varchar("role_name", { length: 200 }).notNull().default(""),
    roleOther: varchar("role_other", { length: 200 }).notNull().default(""),
    fullName: varchar("full_name", { length: 140 }).notNull(),
    fatherName: varchar("father_name", { length: 140 }).notNull().default(""),
    email: varchar("email", { length: 190 }).notNull(),
    mobile: varchar("mobile", { length: 30 }).notNull(),
    dob: date("dob"),
    gender: varchar("gender", { length: 20 }).notNull().default(""),
    address: text("address").notNull().default(""),
    city: varchar("city", { length: 80 }).notNull().default(""),
    state: varchar("state", { length: 80 }).notNull().default(""),
    country: varchar("country", { length: 80 }).notNull().default(""),
    pin: varchar("pin", { length: 12 }).notNull().default(""),
    highestQualification: varchar("highest_qualification", { length: 120 }).notNull().default(""),
    qualificationOther: varchar("qualification_other", { length: 160 }).notNull().default(""),
    status: varchar("status", { length: 20 }).notNull().default("applied"),
    notes: text("notes").notNull().default(""),
    ip: varchar("ip", { length: 64 }).notNull().default(""),
    ...ts(),
  },
  (t) => [index("apps_job_idx").on(t.jobId), index("apps_status_idx").on(t.status), index("apps_email_idx").on(t.email)],
);

export const applicantEducation = pgTable(
  "applicant_education",
  {
    id: serial("id").primaryKey(),
    applicationId: integer("application_id").notNull().references(() => jobApplications.id, { onDelete: "cascade" }),
    level: varchar("level", { length: 30 }).notNull(), // matric | intermediate | diploma | graduation | postgraduation | phd
    institution: varchar("institution", { length: 220 }).notNull().default(""),
    year: varchar("year", { length: 8 }).notNull().default(""),
    score: varchar("score", { length: 20 }).notNull().default(""),
  },
  (t) => [index("edu_app_idx").on(t.applicationId)],
);

export const applicantDocuments = pgTable(
  "applicant_documents",
  {
    id: serial("id").primaryKey(),
    applicationId: integer("application_id").notNull().references(() => jobApplications.id, { onDelete: "cascade" }),
    docType: varchar("doc_type", { length: 20 }).notNull(), // cv | marksheet | additional
    originalName: text("original_name").notNull(),
    storedPath: text("stored_path").notNull(),
    mimeType: varchar("mime_type", { length: 100 }).notNull(),
    size: integer("size").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("docs_app_idx").on(t.applicationId)],
);

/* ------------------------------ Media / contact / SEO / audit ------------------------------ */
export const media = pgTable(
  "media",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 200 }).notNull().default(""),
    altText: varchar("alt_text", { length: 300 }).notNull().default(""),
    kind: varchar("kind", { length: 10 }).notNull(), // image | video | pdf
    source: varchar("source", { length: 10 }).notNull().default("upload"), // upload | url
    url: text("url").notNull(),
    storagePath: text("storage_path").notNull().default(""),
    mimeType: varchar("mime_type", { length: 100 }).notNull().default(""),
    size: integer("size").notNull().default(0),
    uploadedBy: integer("uploaded_by"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("media_kind_idx").on(t.kind)],
);

export const contactQueries = pgTable(
  "contact_queries",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id, { onDelete: "set null" }),
    name: varchar("name", { length: 140 }).notNull(),
    email: varchar("email", { length: 190 }).notNull(),
    phone: varchar("phone", { length: 30 }).notNull().default(""),
    company: varchar("company", { length: 160 }).notNull().default(""),
    subject: varchar("subject", { length: 200 }).notNull().default(""),
    serviceInterest: varchar("service_interest", { length: 120 }).notNull().default(""),
    message: text("message").notNull(),
    status: varchar("status", { length: 12 }).notNull().default("new"), // new | in_progress | resolved | spam
    notes: text("notes").notNull().default(""),
    ip: varchar("ip", { length: 64 }).notNull().default(""),
    ...ts(),
  },
  (t) => [index("contact_status_idx").on(t.status, t.createdAt)],
);

export const seoMetadata = pgTable(
  "seo_metadata",
  {
    id: serial("id").primaryKey(),
    entityType: varchar("entity_type", { length: 20 }).notNull(), // page | service | news | job
    entityKey: varchar("entity_key", { length: 200 }).notNull(),
    title: text("title").notNull().default(""),
    description: text("description").notNull().default(""),
    canonical: text("canonical").notNull().default(""),
    ogImage: text("og_image").notNull().default(""),
    twitterImage: text("twitter_image").notNull().default(""),
    robots: varchar("robots", { length: 40 }).notNull().default("index,follow"),
    schemaJson: text("schema_json").notNull().default(""),
    ...ts(),
  },
  (t) => [uniqueIndex("seo_uq").on(t.entityType, t.entityKey)],
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: serial("id").primaryKey(),
    actorType: varchar("actor_type", { length: 10 }).notNull().default("admin"),
    actorId: integer("actor_id"),
    actorName: varchar("actor_name", { length: 140 }).notNull().default(""),
    action: varchar("action", { length: 60 }).notNull(),
    entityType: varchar("entity_type", { length: 60 }).notNull().default(""),
    entityId: varchar("entity_id", { length: 60 }).notNull().default(""),
    details: text("details").notNull().default(""),
    ip: varchar("ip", { length: 64 }).notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("audit_created_idx").on(t.createdAt)],
);

export const emailLogs = pgTable("email_logs", {
  id: serial("id").primaryKey(),
  toEmail: varchar("to_email", { length: 190 }).notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull().default(""),
  status: varchar("status", { length: 12 }).notNull().default("queued"), // sent | logged | failed
  error: text("error").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});


export const marketplaces = pgTable("marketplaces", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  category: varchar("category", { length: 80 }).default(""),
  tagline: varchar("tagline", { length: 220 }).default(""),
  description: text("description").default(""),
  logoUrl: text("logo_url").default(""),
  imageUrl: text("image_url").default(""),
  linkText: varchar("link_text", { length: 80 }).default(""),
  linkUrl: text("link_url").default(""),
  sortOrder: integer("sort_order").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


export * from "./chat-schema";

export * from "./team-schema";

export * from "./home-schema";
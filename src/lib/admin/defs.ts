
// // // /* Pure data — shared by the admin UI (client) and the generic CRUD API (server). */
// // // export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "media" | "datetime" | "date" | "color" | "password" | "email";
// // // export type Opt = { value: string; label: string };
// // // export type FieldDef = {
// // //   name: string; label: string; type: FieldType; options?: Opt[]; optionsFrom?: string; numeric?: boolean; required?: boolean;
// // //   help?: string; wide?: boolean; mediaKind?: "image" | "video"; group?: string; readOnly?: boolean; max?: number; rows?: number;
// // // };
// // // export type ChildDef = { name: string; label: string; fields: FieldDef[]; help?: string };
// // // export type ResourceDef = {
// // //   key: string; label: string; singular: string; perm: string; titleField: string;
// // //   columns: { name: string; label: string; type?: "badge" | "bool" | "date" | "media" | "mono" }[];
// // //   fields: FieldDef[]; children?: ChildDef[]; filters?: { name: string; label: string; options: Opt[] }[];
// // //   searchFields: string[]; sort?: { name: string; dir: "asc" | "desc" }; canCreate?: boolean; canDelete?: boolean; slugFrom?: string; groups?: string[];
// // // };

// // // const o = (...v: string[]): Opt[] => v.map((x) => ({ value: x, label: x }));
// // // const ol = (v: [string, string][]): Opt[] => v.map(([value, label]) => ({ value, label }));

// // // /* Preset suggestions (kept for reference / help text). Position fields are now free text,
// // //    so any valid CSS background-position works (e.g. "center 580px", "50% 30%"). */
// // // export const POSITIONS = o("center center", "center top", "center bottom", "left center", "right center", "center 25%", "center 40%", "center 60%", "center 75%", "left top", "right top");

// // // /* Help text shown under the free-text position fields */
// // // export const POSITION_HELP =
// // //   "Any CSS background-position. Examples: center center, center top, center 25%, 50% 30%, center 580px. " +
// // //   "Note: a single value like 580px only sets the horizontal position; use 'center 580px' for vertical.";

// // // export const HERO_FIELDS: FieldDef[] = [
// // //   { name: "heroEyebrow", label: "Eyebrow / category", type: "text", group: "Hero" },
// // //   { name: "heroTitle", label: "Hero title", type: "text", group: "Hero", wide: true, max: 220 },
// // //   { name: "heroDescription", label: "Hero description", type: "textarea", group: "Hero", wide: true, rows: 3 },
// // //   { name: "heroPrimaryText", label: "Primary button text", type: "text", group: "Hero" },
// // //   { name: "heroPrimaryUrl", label: "Primary button URL", type: "text", group: "Hero" },
// // //   { name: "heroSecondaryText", label: "Secondary button text", type: "text", group: "Hero" },
// // //   { name: "heroSecondaryUrl", label: "Secondary button URL", type: "text", group: "Hero" },
// // //   { name: "heroType", label: "Hero media type", type: "select", options: ol([["image", "Image"], ["video", "Video"]]), group: "Hero media", help: "Video heroes always keep the poster/image as a fallback and on mobile." },
// // //   { name: "heroImageUrl", label: "Hero image (upload or URL)", type: "media", mediaKind: "image", group: "Hero media", wide: true },
// // //   { name: "heroMobileImageUrl", label: "Mobile hero image (optional)", type: "media", mediaKind: "image", group: "Hero media", wide: true },
// // //   { name: "heroVideoUrl", label: "Hero video (MP4/WebM upload or URL)", type: "media", mediaKind: "video", group: "Hero media", wide: true },
// // //   { name: "heroPosterUrl", label: "Video poster image", type: "media", mediaKind: "image", group: "Hero media", wide: true },
// // //   { name: "heroOverlayColor", label: "Overlay colour", type: "color", group: "Hero style" },
// // //   { name: "heroOverlayOpacity", label: "Overlay opacity (0–100)", type: "number", group: "Hero style" },
// // //   { name: "heroAlign", label: "Text alignment", type: "select", options: ol([["left", "Left"], ["center", "Center"], ["right", "Right"]]), group: "Hero style" },
// // //   { name: "heroHeight", label: "Hero height (px, 440–780)", type: "number", group: "Hero style" },
// // //   { name: "heroPosDesktop", label: "Desktop background position", type: "text", group: "Hero style", wide: true, help: POSITION_HELP },
// // //   { name: "heroPosMobile", label: "Mobile background position", type: "text", group: "Hero style", wide: true, help: POSITION_HELP },
// // //   { name: "heroAnimate", label: "Enable hero animation", type: "boolean", group: "Hero style" },
// // //   { name: "heroParallax", label: "Enable parallax", type: "boolean", group: "Hero style" },
// // // ];

// // // export const ICONS = o("cloud", "server", "hybrid", "mail", "migrate", "pipeline", "monitor", "backup", "shield", "lock", "scan", "endpoint", "identity");
// // // export const DIAGRAMS = o("cloud", "private", "hybrid", "email", "migration", "devops", "monitoring", "continuity", "ddos", "datasec", "vapt", "endpoint", "identity");

// // // const master = (key: string, label: string, singular: string): ResourceDef => ({
// // //   key, label, singular, perm: "masters.manage", titleField: "name", searchFields: ["name"], sort: { name: "sortOrder", dir: "asc" },
// // //   columns: [{ name: "name", label: "Name" }, { name: "isActive", label: "Active", type: "bool" }, { name: "sortOrder", label: "Order" }],
// // //   fields: [{ name: "name", label: "Name", type: "text", required: true, wide: true }, { name: "isActive", label: "Active", type: "boolean" }, { name: "sortOrder", label: "Sort order", type: "number" }],
// // // });

// // // export const RESOURCES: Record<string, ResourceDef> = {
// // //   services: {
// // //     key: "services", label: "Services", singular: "service", perm: "services.manage", titleField: "title", slugFrom: "title", searchFields: ["title", "slug", "shortDescription"],
// // //     sort: { name: "sortOrder", dir: "asc" }, groups: ["Content", "Visuals", "Hero", "Hero media", "Hero style", "Call to action", "Lists"],
// // //     filters: [{ name: "category", label: "Category", options: ol([["cloud", "Cloud"], ["workplace", "Workplace Mobility"], ["services", "Services"], ["security", "Security"]]) }],
// // //     columns: [{ name: "cardImageUrl", label: "", type: "media" }, { name: "title", label: "Title" }, { name: "category", label: "Category", type: "badge" }, { name: "slug", label: "Slug", type: "mono" }, { name: "isPublished", label: "Live", type: "bool" }],
// // //     fields: [
// // //       { name: "title", label: "Title", type: "text", required: true, group: "Content" },
// // //       { name: "slug", label: "Slug (URL)", type: "text", group: "Content", help: "Auto-generated from the title when empty." },
// // //       { name: "category", label: "Category", type: "select", required: true, group: "Content", options: ol([["cloud", "Cloud"], ["workplace", "Workplace Mobility"], ["services", "Services"], ["security", "Security"]]) },
// // //       { name: "parentSlug", label: "Parent service slug", type: "text", group: "Content", help: "e.g. public-cloud for AWS/Azure/Google Cloud." },
// // //       { name: "shortDescription", label: "Short description", type: "textarea", group: "Content", wide: true, rows: 2 },
// // //       { name: "longDescription", label: "Long description", type: "textarea", group: "Content", wide: true, rows: 8, help: "Separate paragraphs with a blank line." },
// // //       { name: "icon", label: "Animated icon", type: "select", options: ICONS, group: "Visuals" },
// // //       { name: "diagram", label: "Architecture diagram", type: "select", options: DIAGRAMS, group: "Visuals" },
// // //       { name: "cardImageUrl", label: "Card image", type: "media", mediaKind: "image", group: "Visuals", wide: true },
// // //       { name: "sectionImageUrl", label: "Section image", type: "media", mediaKind: "image", group: "Visuals", wide: true },
// // //       ...HERO_FIELDS,
// // //       { name: "ctaTitle", label: "CTA title", type: "text", group: "Call to action", wide: true },
// // //       { name: "ctaText", label: "CTA text", type: "textarea", group: "Call to action", wide: true, rows: 2 },
// // //       { name: "ctaButtonText", label: "CTA button text", type: "text", group: "Call to action" },
// // //       { name: "ctaButtonUrl", label: "CTA button URL", type: "text", group: "Call to action" },
// // //       { name: "sortOrder", label: "Sort order", type: "number", group: "Content" },
// // //       { name: "isFeatured", label: "Featured", type: "boolean", group: "Content" },
// // //       { name: "isPublished", label: "Published", type: "boolean", group: "Content" },
// // //     ],
// // //     children: [
// // //       { name: "features", label: "Features / capabilities", fields: [{ name: "title", label: "Title", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
// // //       { name: "process", label: "Process steps", fields: [{ name: "title", label: "Step", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
// // //       { name: "benefits", label: "Benefits", fields: [{ name: "title", label: "Title", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
// // //       { name: "faqs", label: "FAQs", fields: [{ name: "question", label: "Question", type: "text", required: true }, { name: "answer", label: "Answer", type: "textarea", rows: 3 }] },
// // //     ],
// // //   },
// // //   news: {
// // //     key: "news", label: "News", singular: "article", perm: "news.manage", titleField: "title", slugFrom: "title", searchFields: ["title", "excerpt"], groups: ["Article", "Media", "Publishing"],
// // //     filters: [{ name: "status", label: "Status", options: o("draft", "published", "scheduled") }],
// // //     columns: [{ name: "featuredImageUrl", label: "", type: "media" }, { name: "title", label: "Title" }, { name: "status", label: "Status", type: "badge" }, { name: "publishedAt", label: "Publish date", type: "date" }, { name: "isFeatured", label: "Featured", type: "bool" }],
// // //     fields: [
// // //       { name: "title", label: "Title", type: "text", required: true, wide: true, group: "Article", max: 220 },
// // //       { name: "slug", label: "Slug", type: "text", group: "Article" },
// // //       { name: "categoryId", label: "Category", type: "select", optionsFrom: "news_categories", numeric: true, group: "Article" },
// // //       { name: "author", label: "Author", type: "text", group: "Article" },
// // //       { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2, wide: true, group: "Article" },
// // //       { name: "content", label: "Content", type: "textarea", rows: 14, wide: true, group: "Article", help: "Separate paragraphs with a blank line." },
// // //       { name: "featuredImageUrl", label: "Featured image (hero)", type: "media", mediaKind: "image", wide: true, group: "Media" },
// // //       { name: "videoUrl", label: "Hero video (optional)", type: "media", mediaKind: "video", wide: true, group: "Media" },
// // //       { name: "posterUrl", label: "Video poster", type: "media", mediaKind: "image", wide: true, group: "Media" },
// // //       { name: "heroPosDesktop", label: "Hero image position", type: "text", group: "Media", wide: true, help: POSITION_HELP },
// // //       { name: "status", label: "Status", type: "select", options: o("draft", "published", "scheduled"), required: true, group: "Publishing", help: "Scheduled posts go live automatically at the publish date." },
// // //       { name: "publishedAt", label: "Publish date / time", type: "datetime", group: "Publishing" },
// // //       { name: "isFeatured", label: "Featured (pinned first)", type: "boolean", group: "Publishing" },
// // //     ],
// // //     children: [{ name: "images", label: "Gallery images", fields: [{ name: "url", label: "Image", type: "media", mediaKind: "image", required: true }, { name: "caption", label: "Caption", type: "text" }] }],
// // //   },
// // //   news_categories: {
// // //     key: "news_categories", label: "News categories", singular: "category", perm: "news.manage", titleField: "name", slugFrom: "name", searchFields: ["name"],
// // //     columns: [{ name: "name", label: "Name" }, { name: "slug", label: "Slug", type: "mono" }],
// // //     fields: [{ name: "name", label: "Name", type: "text", required: true }, { name: "slug", label: "Slug", type: "text" }],
// // //   },
// // //   jobs: {
// // //     key: "jobs", label: "Jobs", singular: "job", perm: "jobs.manage", titleField: "title", slugFrom: "title", searchFields: ["title", "department", "location"], groups: ["Role", "Details", "Hero"],
// // //     filters: [{ name: "status", label: "Status", options: o("active", "inactive", "closed") }],
// // //     columns: [{ name: "title", label: "Title" }, { name: "department", label: "Department" }, { name: "location", label: "Location" }, { name: "status", label: "Status", type: "badge" }],
// // //     fields: [
// // //       { name: "title", label: "Job title", type: "text", required: true, group: "Role" }, { name: "slug", label: "Slug", type: "text", group: "Role" },
// // //       { name: "department", label: "Department", type: "text", group: "Role" }, { name: "location", label: "Location", type: "text", group: "Role" },
// // //       { name: "employmentType", label: "Employment type", type: "select", options: o("Full-time", "Part-time", "Contract", "Internship", "Temporary"), group: "Role" },
// // //       { name: "experience", label: "Experience", type: "text", group: "Role" }, { name: "openings", label: "Openings", type: "number", group: "Role" }, { name: "salaryRange", label: "Salary range (optional)", type: "text", group: "Role" },
// // //       { name: "status", label: "Status", type: "select", options: o("active", "inactive", "closed"), required: true, group: "Role" }, { name: "closingDate", label: "Closing date", type: "date", group: "Role" },
// // //       { name: "summary", label: "Summary", type: "textarea", rows: 2, wide: true, group: "Details" },
// // //       { name: "description", label: "Description", type: "textarea", rows: 6, wide: true, group: "Details" },
// // //       { name: "responsibilities", label: "Responsibilities (one per line)", type: "textarea", rows: 6, wide: true, group: "Details" },
// // //       { name: "requirements", label: "Requirements (one per line)", type: "textarea", rows: 6, wide: true, group: "Details" },
// // //       { name: "heroImageUrl", label: "Hero image", type: "media", mediaKind: "image", wide: true, group: "Hero" },
// // //       { name: "heroVideoUrl", label: "Hero video (optional)", type: "media", mediaKind: "video", wide: true, group: "Hero" },
// // //     ],
// // //   },
// // //   universities: master("universities", "Universities", "university"),
// // //   boards: master("boards", "Boards", "board"),
// // //   qualifications: master("qualifications", "Qualifications", "qualification"),
// // //   job_roles: master("job_roles", "Job roles", "job role"),
// // //   customers: {
// // //     key: "customers", label: "Customers", singular: "customer", perm: "customers.view", titleField: "fullName", searchFields: ["fullName", "email", "company", "mobile"], canCreate: false,
// // //     columns: [{ name: "fullName", label: "Name" }, { name: "company", label: "Company" }, { name: "email", label: "Email" }, { name: "serviceInterest", label: "Interest" }, { name: "isActive", label: "Active", type: "bool" }, { name: "createdAt", label: "Joined", type: "date" }],
// // //     fields: [
// // //       { name: "fullName", label: "Full name", type: "text", required: true }, { name: "company", label: "Company", type: "text" }, { name: "email", label: "Email", type: "email", readOnly: true },
// // //       { name: "mobile", label: "Mobile", type: "text" }, { name: "country", label: "Country", type: "text" }, { name: "state", label: "State", type: "text" }, { name: "city", label: "City", type: "text" },
// // //       { name: "serviceInterest", label: "Service interest", type: "text" }, { name: "address", label: "Address", type: "textarea", wide: true, rows: 2 }, { name: "isActive", label: "Account active", type: "boolean" },
// // //     ],
// // //   },
// // //   contacts: {
// // //     key: "contacts", label: "Contact enquiries", singular: "enquiry", perm: "contacts.manage", titleField: "name", searchFields: ["name", "email", "subject", "message", "company"], canCreate: false,
// // //     filters: [{ name: "status", label: "Status", options: o("new", "in_progress", "resolved", "spam") }],
// // //     columns: [{ name: "name", label: "Name" }, { name: "email", label: "Email" }, { name: "serviceInterest", label: "Service" }, { name: "status", label: "Status", type: "badge" }, { name: "createdAt", label: "Received", type: "date" }],
// // //     fields: [
// // //       { name: "name", label: "Name", type: "text", readOnly: true }, { name: "email", label: "Email", type: "text", readOnly: true }, { name: "phone", label: "Phone", type: "text", readOnly: true }, { name: "company", label: "Company", type: "text", readOnly: true },
// // //       { name: "serviceInterest", label: "Service", type: "text", readOnly: true }, { name: "subject", label: "Subject", type: "text", readOnly: true }, { name: "message", label: "Message", type: "textarea", readOnly: true, wide: true, rows: 6 },
// // //       { name: "status", label: "Status", type: "select", options: o("new", "in_progress", "resolved", "spam"), required: true }, { name: "notes", label: "Internal notes", type: "textarea", wide: true, rows: 3 },
// // //     ],
// // //   },
// // //   seo: {
// // //     key: "seo", label: "SEO metadata", singular: "SEO record", perm: "seo.manage", titleField: "entityKey", searchFields: ["entityKey", "title"], groups: ["Target", "Meta", "Social"],
// // //     columns: [{ name: "entityType", label: "Type", type: "badge" }, { name: "entityKey", label: "Key", type: "mono" }, { name: "title", label: "Title" }, { name: "robots", label: "Robots" }],
// // //     fields: [
// // //       { name: "entityType", label: "Entity type", type: "select", options: o("page", "service", "news", "job"), required: true, group: "Target", help: "page: home, about, news… · service: slug · news: slug · job: slug" },
// // //       { name: "entityKey", label: "Entity key (slug)", type: "text", required: true, group: "Target" },
// // //       { name: "title", label: "Meta title", type: "text", wide: true, group: "Meta", max: 200 }, { name: "description", label: "Meta description", type: "textarea", rows: 3, wide: true, group: "Meta" },
// // //       { name: "canonical", label: "Canonical URL", type: "text", wide: true, group: "Meta" }, { name: "robots", label: "Robots", type: "select", options: o("index,follow", "noindex,follow", "index,nofollow", "noindex,nofollow"), group: "Meta" },
// // //       { name: "ogImage", label: "Open Graph image", type: "media", mediaKind: "image", wide: true, group: "Social" }, { name: "twitterImage", label: "Twitter image", type: "media", mediaKind: "image", wide: true, group: "Social" },
// // //       { name: "schemaJson", label: "Custom JSON-LD schema (optional)", type: "textarea", rows: 6, wide: true, group: "Social" },
// // //     ],
// // //   },
// // //   admins: {
// // //     key: "admins", label: "Admin users", singular: "admin", perm: "admins.manage", titleField: "name", searchFields: ["name", "email"],
// // //     columns: [{ name: "name", label: "Name" }, { name: "email", label: "Email" }, { name: "isActive", label: "Active", type: "bool" }, { name: "lastLoginAt", label: "Last login", type: "date" }],
// // //     fields: [
// // //       { name: "name", label: "Name", type: "text", required: true }, { name: "email", label: "Email", type: "email", required: true },
// // //       { name: "roleId", label: "Role", type: "select", optionsFrom: "roles", numeric: true, required: true }, { name: "password", label: "Password", type: "password", help: "Required for new admins. Leave blank to keep the current password. Min 8 chars, letters + numbers." },
// // //       { name: "isActive", label: "Active", type: "boolean" },
// // //     ],
// // //   },
// // // };

// // // export const APPLICANT_STATUSES = ["applied", "under_review", "shortlisted", "interview", "selected", "rejected", "on_hold"] as const;
// // // export const statusLabel = (s: string) => s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());





// // // new code 




// // /* Pure data — shared by the admin UI (client) and the generic CRUD API (server). */
// // export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "media" | "datetime" | "date" | "color" | "password" | "email";
// // export type Opt = { value: string; label: string };
// // export type FieldDef = {
// //   name: string; label: string; type: FieldType; options?: Opt[]; optionsFrom?: string; numeric?: boolean; required?: boolean;
// //   help?: string; wide?: boolean; mediaKind?: "image" | "video"; group?: string; readOnly?: boolean; max?: number; rows?: number;
// // };
// // export type ChildDef = { name: string; label: string; fields: FieldDef[]; help?: string };
// // export type ResourceDef = {
// //   key: string; label: string; singular: string; perm: string; titleField: string;
// //   columns: { name: string; label: string; type?: "badge" | "bool" | "date" | "media" | "mono" }[];
// //   fields: FieldDef[]; children?: ChildDef[]; filters?: { name: string; label: string; options: Opt[] }[];
// //   searchFields: string[]; sort?: { name: string; dir: "asc" | "desc" }; canCreate?: boolean; canDelete?: boolean; slugFrom?: string; groups?: string[];
// // };

// // const o = (...v: string[]): Opt[] => v.map((x) => ({ value: x, label: x }));
// // const ol = (v: [string, string][]): Opt[] => v.map(([value, label]) => ({ value, label }));

// // /* Preset suggestions (kept for reference / help text). Position fields are now free text,
// //    so any valid CSS background-position works (e.g. "center 580px", "50% 30%"). */
// // export const POSITIONS = o("center center", "center top", "center bottom", "left center", "right center", "center 25%", "center 40%", "center 60%", "center 75%", "left top", "right top");

// // /* Help text shown under the free-text position fields */
// // export const POSITION_HELP =
// //   "Any CSS background-position. Examples: center center, center top, center 25%, 50% 30%, center 580px. " +
// //   "Note: a single value like 580px only sets the horizontal position; use 'center 580px' for vertical.";

// // export const HERO_FIELDS: FieldDef[] = [
// //   { name: "heroEyebrow", label: "Eyebrow / category", type: "text", group: "Hero" },
// //   { name: "heroTitle", label: "Hero title", type: "text", group: "Hero", wide: true, max: 220 },
// //   { name: "heroDescription", label: "Hero description", type: "textarea", group: "Hero", wide: true, rows: 3 },
// //   { name: "heroPrimaryText", label: "Primary button text", type: "text", group: "Hero" },
// //   { name: "heroPrimaryUrl", label: "Primary button URL", type: "text", group: "Hero" },
// //   { name: "heroSecondaryText", label: "Secondary button text", type: "text", group: "Hero" },
// //   { name: "heroSecondaryUrl", label: "Secondary button URL", type: "text", group: "Hero" },
// //   { name: "heroType", label: "Hero media type", type: "select", options: ol([["image", "Image"], ["video", "Video"]]), group: "Hero media", help: "Video heroes always keep the poster/image as a fallback and on mobile." },
// //   { name: "heroImageUrl", label: "Hero image (upload or URL)", type: "media", mediaKind: "image", group: "Hero media", wide: true },
// //   { name: "heroMobileImageUrl", label: "Mobile hero image (optional)", type: "media", mediaKind: "image", group: "Hero media", wide: true },
// //   { name: "heroVideoUrl", label: "Hero video (MP4/WebM upload or URL)", type: "media", mediaKind: "video", group: "Hero media", wide: true },
// //   { name: "heroPosterUrl", label: "Video poster image", type: "media", mediaKind: "image", group: "Hero media", wide: true },
// //   { name: "heroOverlayColor", label: "Overlay colour", type: "color", group: "Hero style" },
// //   { name: "heroOverlayOpacity", label: "Overlay opacity (0–100)", type: "number", group: "Hero style" },
// //   { name: "heroAlign", label: "Text alignment", type: "select", options: ol([["left", "Left"], ["center", "Center"], ["right", "Right"]]), group: "Hero style" },
// //   { name: "heroHeight", label: "Hero height (px, 440–780)", type: "number", group: "Hero style" },
// //   { name: "heroPosDesktop", label: "Desktop background position", type: "text", group: "Hero style", wide: true, help: POSITION_HELP },
// //   { name: "heroPosMobile", label: "Mobile background position", type: "text", group: "Hero style", wide: true, help: POSITION_HELP },
// //   { name: "heroAnimate", label: "Enable hero animation", type: "boolean", group: "Hero style" },
// //   { name: "heroParallax", label: "Enable parallax", type: "boolean", group: "Hero style" },
// // ];

// // export const ICONS = o("cloud", "server", "hybrid", "mail", "migrate", "pipeline", "monitor", "backup", "shield", "lock", "scan", "endpoint", "identity");
// // export const DIAGRAMS = o("cloud", "private", "hybrid", "email", "migration", "devops", "monitoring", "continuity", "ddos", "datasec", "vapt", "endpoint", "identity");

// // const master = (key: string, label: string, singular: string): ResourceDef => ({
// //   key, label, singular, perm: "masters.manage", titleField: "name", searchFields: ["name"], sort: { name: "sortOrder", dir: "asc" },
// //   columns: [{ name: "name", label: "Name" }, { name: "isActive", label: "Active", type: "bool" }, { name: "sortOrder", label: "Order" }],
// //   fields: [{ name: "name", label: "Name", type: "text", required: true, wide: true }, { name: "isActive", label: "Active", type: "boolean" }, { name: "sortOrder", label: "Sort order", type: "number" }],
// // });

// // export const RESOURCES: Record<string, ResourceDef> = {
// //   services: {
// //     key: "services", label: "Services", singular: "service", perm: "services.manage", titleField: "title", slugFrom: "title", searchFields: ["title", "slug", "shortDescription"],
// //     sort: { name: "sortOrder", dir: "asc" }, groups: ["Content", "Visuals", "Hero", "Hero media", "Hero style", "Call to action", "Lists"],
// //     filters: [{ name: "category", label: "Category", options: ol([["cloud", "Cloud"], ["workplace", "Workplace Mobility"], ["services", "Services"], ["security", "Security"]]) }],
// //     columns: [{ name: "cardImageUrl", label: "", type: "media" }, { name: "title", label: "Title" }, { name: "category", label: "Category", type: "badge" }, { name: "slug", label: "Slug", type: "mono" }, { name: "isPublished", label: "Live", type: "bool" }],
// //     fields: [
// //       { name: "title", label: "Title", type: "text", required: true, group: "Content" },
// //       { name: "slug", label: "Slug (URL)", type: "text", group: "Content", help: "Auto-generated from the title when empty." },
// //       { name: "category", label: "Category", type: "select", required: true, group: "Content", options: ol([["cloud", "Cloud"], ["workplace", "Workplace Mobility"], ["services", "Services"], ["security", "Security"]]) },
// //       { name: "parentSlug", label: "Parent service slug", type: "text", group: "Content", help: "e.g. public-cloud for AWS/Azure/Google Cloud." },
// //       { name: "shortDescription", label: "Short description", type: "textarea", group: "Content", wide: true, rows: 2 },
// //       { name: "longDescription", label: "Long description", type: "textarea", group: "Content", wide: true, rows: 8, help: "Separate paragraphs with a blank line." },
// //       { name: "icon", label: "Animated icon", type: "select", options: ICONS, group: "Visuals" },
// //       { name: "diagram", label: "Architecture diagram", type: "select", options: DIAGRAMS, group: "Visuals" },
// //       { name: "cardImageUrl", label: "Card image", type: "media", mediaKind: "image", group: "Visuals", wide: true },
// //       { name: "sectionImageUrl", label: "Section image", type: "media", mediaKind: "image", group: "Visuals", wide: true },
// //       ...HERO_FIELDS,
// //       { name: "ctaTitle", label: "CTA title", type: "text", group: "Call to action", wide: true },
// //       { name: "ctaText", label: "CTA text", type: "textarea", group: "Call to action", wide: true, rows: 2 },
// //       { name: "ctaButtonText", label: "CTA button text", type: "text", group: "Call to action" },
// //       { name: "ctaButtonUrl", label: "CTA button URL", type: "text", group: "Call to action" },
// //       { name: "sortOrder", label: "Sort order", type: "number", group: "Content" },
// //       { name: "isFeatured", label: "Featured", type: "boolean", group: "Content" },
// //       { name: "isPublished", label: "Published", type: "boolean", group: "Content" },
// //     ],
// //     children: [
// //       { name: "features", label: "Features / capabilities", fields: [{ name: "title", label: "Title", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
// //       { name: "process", label: "Process steps", fields: [{ name: "title", label: "Step", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
// //       { name: "benefits", label: "Benefits", fields: [{ name: "title", label: "Title", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
// //       { name: "faqs", label: "FAQs", fields: [{ name: "question", label: "Question", type: "text", required: true }, { name: "answer", label: "Answer", type: "textarea", rows: 3 }] },
// //     ],
// //   },
// //   /* NEW: "Our Marketplaces" carousel items (client products such as CBO ERP, ZEDX Software) */
// //   marketplaces: {
// //     key: "marketplaces", label: "Marketplaces", singular: "product", perm: "services.manage", titleField: "name", searchFields: ["name", "tagline", "category"],
// //     sort: { name: "sortOrder", dir: "asc" }, groups: ["Product", "Visuals", "Link", "Publishing"],
// //     columns: [{ name: "logoUrl", label: "", type: "media" }, { name: "name", label: "Product" }, { name: "category", label: "Category", type: "badge" }, { name: "sortOrder", label: "Order" }, { name: "isActive", label: "Live", type: "bool" }],
// //     fields: [
// //       { name: "name", label: "Product name", type: "text", required: true, group: "Product", max: 160, help: "e.g. CBO ERP, ZEDX Software" },
// //       { name: "category", label: "Category / badge", type: "text", group: "Product", help: "e.g. ERP, Banking, HRMS" },
// //       { name: "tagline", label: "Tagline", type: "text", wide: true, group: "Product", max: 220 },
// //       { name: "description", label: "Short description", type: "textarea", wide: true, rows: 3, group: "Product" },
// //       { name: "logoUrl", label: "Logo", type: "media", mediaKind: "image", wide: true, group: "Visuals", help: "Transparent PNG/SVG works best." },
// //       { name: "imageUrl", label: "Cover image (optional)", type: "media", mediaKind: "image", wide: true, group: "Visuals" },
// //       { name: "linkText", label: "Button text", type: "text", group: "Link", help: "Default: Visit product" },
// //       { name: "linkUrl", label: "Product URL", type: "text", group: "Link", wide: true, help: "Full URL (https://...) or internal path (/contact)." },
// //       { name: "sortOrder", label: "Sort order", type: "number", group: "Publishing" },
// //       { name: "isActive", label: "Show on website", type: "boolean", group: "Publishing" },
// //     ],
// //   },
// //   news: {
// //     key: "news", label: "News", singular: "article", perm: "news.manage", titleField: "title", slugFrom: "title", searchFields: ["title", "excerpt"], groups: ["Article", "Media", "Publishing"],
// //     filters: [{ name: "status", label: "Status", options: o("draft", "published", "scheduled") }],
// //     columns: [{ name: "featuredImageUrl", label: "", type: "media" }, { name: "title", label: "Title" }, { name: "status", label: "Status", type: "badge" }, { name: "publishedAt", label: "Publish date", type: "date" }, { name: "isFeatured", label: "Featured", type: "bool" }],
// //     fields: [
// //       { name: "title", label: "Title", type: "text", required: true, wide: true, group: "Article", max: 220 },
// //       { name: "slug", label: "Slug", type: "text", group: "Article" },
// //       { name: "categoryId", label: "Category", type: "select", optionsFrom: "news_categories", numeric: true, group: "Article" },
// //       { name: "author", label: "Author", type: "text", group: "Article" },
// //       { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2, wide: true, group: "Article" },
// //       { name: "content", label: "Content", type: "textarea", rows: 14, wide: true, group: "Article", help: "Separate paragraphs with a blank line." },
// //       { name: "featuredImageUrl", label: "Featured image (hero)", type: "media", mediaKind: "image", wide: true, group: "Media" },
// //       { name: "videoUrl", label: "Hero video (optional)", type: "media", mediaKind: "video", wide: true, group: "Media" },
// //       { name: "posterUrl", label: "Video poster", type: "media", mediaKind: "image", wide: true, group: "Media" },
// //       { name: "heroPosDesktop", label: "Hero image position", type: "text", group: "Media", wide: true, help: POSITION_HELP },
// //       { name: "status", label: "Status", type: "select", options: o("draft", "published", "scheduled"), required: true, group: "Publishing", help: "Scheduled posts go live automatically at the publish date." },
// //       { name: "publishedAt", label: "Publish date / time", type: "datetime", group: "Publishing" },
// //       { name: "isFeatured", label: "Featured (pinned first)", type: "boolean", group: "Publishing" },
// //     ],
// //     children: [{ name: "images", label: "Gallery images", fields: [{ name: "url", label: "Image", type: "media", mediaKind: "image", required: true }, { name: "caption", label: "Caption", type: "text" }] }],
// //   },
// //   news_categories: {
// //     key: "news_categories", label: "News categories", singular: "category", perm: "news.manage", titleField: "name", slugFrom: "name", searchFields: ["name"],
// //     columns: [{ name: "name", label: "Name" }, { name: "slug", label: "Slug", type: "mono" }],
// //     fields: [{ name: "name", label: "Name", type: "text", required: true }, { name: "slug", label: "Slug", type: "text" }],
// //   },
// //   jobs: {
// //     key: "jobs", label: "Jobs", singular: "job", perm: "jobs.manage", titleField: "title", slugFrom: "title", searchFields: ["title", "department", "location"], groups: ["Role", "Details", "Hero"],
// //     filters: [{ name: "status", label: "Status", options: o("active", "inactive", "closed") }],
// //     columns: [{ name: "title", label: "Title" }, { name: "department", label: "Department" }, { name: "location", label: "Location" }, { name: "status", label: "Status", type: "badge" }],
// //     fields: [
// //       { name: "title", label: "Job title", type: "text", required: true, group: "Role" }, { name: "slug", label: "Slug", type: "text", group: "Role" },
// //       { name: "department", label: "Department", type: "text", group: "Role" }, { name: "location", label: "Location", type: "text", group: "Role" },
// //       { name: "employmentType", label: "Employment type", type: "select", options: o("Full-time", "Part-time", "Contract", "Internship", "Temporary"), group: "Role" },
// //       { name: "experience", label: "Experience", type: "text", group: "Role" }, { name: "openings", label: "Openings", type: "number", group: "Role" }, { name: "salaryRange", label: "Salary range (optional)", type: "text", group: "Role" },
// //       { name: "status", label: "Status", type: "select", options: o("active", "inactive", "closed"), required: true, group: "Role" }, { name: "closingDate", label: "Closing date", type: "date", group: "Role" },
// //       { name: "summary", label: "Summary", type: "textarea", rows: 2, wide: true, group: "Details" },
// //       { name: "description", label: "Description", type: "textarea", rows: 6, wide: true, group: "Details" },
// //       { name: "responsibilities", label: "Responsibilities (one per line)", type: "textarea", rows: 6, wide: true, group: "Details" },
// //       { name: "requirements", label: "Requirements (one per line)", type: "textarea", rows: 6, wide: true, group: "Details" },
// //       { name: "heroImageUrl", label: "Hero image", type: "media", mediaKind: "image", wide: true, group: "Hero" },
// //       { name: "heroVideoUrl", label: "Hero video (optional)", type: "media", mediaKind: "video", wide: true, group: "Hero" },
// //     ],
// //   },
// //   universities: master("universities", "Universities", "university"),
// //   boards: master("boards", "Boards", "board"),
// //   qualifications: master("qualifications", "Qualifications", "qualification"),
// //   job_roles: master("job_roles", "Job roles", "job role"),
// //   customers: {
// //     key: "customers", label: "Customers", singular: "customer", perm: "customers.view", titleField: "fullName", searchFields: ["fullName", "email", "company", "mobile"], canCreate: false,
// //     columns: [{ name: "fullName", label: "Name" }, { name: "company", label: "Company" }, { name: "email", label: "Email" }, { name: "serviceInterest", label: "Interest" }, { name: "isActive", label: "Active", type: "bool" }, { name: "createdAt", label: "Joined", type: "date" }],
// //     fields: [
// //       { name: "fullName", label: "Full name", type: "text", required: true }, { name: "company", label: "Company", type: "text" }, { name: "email", label: "Email", type: "email", readOnly: true },
// //       { name: "mobile", label: "Mobile", type: "text" }, { name: "country", label: "Country", type: "text" }, { name: "state", label: "State", type: "text" }, { name: "city", label: "City", type: "text" },
// //       { name: "serviceInterest", label: "Service interest", type: "text" }, { name: "address", label: "Address", type: "textarea", wide: true, rows: 2 }, { name: "isActive", label: "Account active", type: "boolean" },
// //     ],
// //   },
// //   contacts: {
// //     key: "contacts", label: "Contact enquiries", singular: "enquiry", perm: "contacts.manage", titleField: "name", searchFields: ["name", "email", "subject", "message", "company"], canCreate: false,
// //     filters: [{ name: "status", label: "Status", options: o("new", "in_progress", "resolved", "spam") }],
// //     columns: [{ name: "name", label: "Name" }, { name: "email", label: "Email" }, { name: "serviceInterest", label: "Service" }, { name: "status", label: "Status", type: "badge" }, { name: "createdAt", label: "Received", type: "date" }],
// //     fields: [
// //       { name: "name", label: "Name", type: "text", readOnly: true }, { name: "email", label: "Email", type: "text", readOnly: true }, { name: "phone", label: "Phone", type: "text", readOnly: true }, { name: "company", label: "Company", type: "text", readOnly: true },
// //       { name: "serviceInterest", label: "Service", type: "text", readOnly: true }, { name: "subject", label: "Subject", type: "text", readOnly: true }, { name: "message", label: "Message", type: "textarea", readOnly: true, wide: true, rows: 6 },
// //       { name: "status", label: "Status", type: "select", options: o("new", "in_progress", "resolved", "spam"), required: true }, { name: "notes", label: "Internal notes", type: "textarea", wide: true, rows: 3 },
// //     ],
// //   },
// //   seo: {
// //     key: "seo", label: "SEO metadata", singular: "SEO record", perm: "seo.manage", titleField: "entityKey", searchFields: ["entityKey", "title"], groups: ["Target", "Meta", "Social"],
// //     columns: [{ name: "entityType", label: "Type", type: "badge" }, { name: "entityKey", label: "Key", type: "mono" }, { name: "title", label: "Title" }, { name: "robots", label: "Robots" }],
// //     fields: [
// //       { name: "entityType", label: "Entity type", type: "select", options: o("page", "service", "news", "job"), required: true, group: "Target", help: "page: home, about, news… · service: slug · news: slug · job: slug" },
// //       { name: "entityKey", label: "Entity key (slug)", type: "text", required: true, group: "Target" },
// //       { name: "title", label: "Meta title", type: "text", wide: true, group: "Meta", max: 200 }, { name: "description", label: "Meta description", type: "textarea", rows: 3, wide: true, group: "Meta" },
// //       { name: "canonical", label: "Canonical URL", type: "text", wide: true, group: "Meta" }, { name: "robots", label: "Robots", type: "select", options: o("index,follow", "noindex,follow", "index,nofollow", "noindex,nofollow"), group: "Meta" },
// //       { name: "ogImage", label: "Open Graph image", type: "media", mediaKind: "image", wide: true, group: "Social" }, { name: "twitterImage", label: "Twitter image", type: "media", mediaKind: "image", wide: true, group: "Social" },
// //       { name: "schemaJson", label: "Custom JSON-LD schema (optional)", type: "textarea", rows: 6, wide: true, group: "Social" },
// //     ],
// //   },
// //   admins: {
// //     key: "admins", label: "Admin users", singular: "admin", perm: "admins.manage", titleField: "name", searchFields: ["name", "email"],
// //     columns: [{ name: "name", label: "Name" }, { name: "email", label: "Email" }, { name: "isActive", label: "Active", type: "bool" }, { name: "lastLoginAt", label: "Last login", type: "date" }],
// //     fields: [
// //       { name: "name", label: "Name", type: "text", required: true }, { name: "email", label: "Email", type: "email", required: true },
// //       { name: "roleId", label: "Role", type: "select", optionsFrom: "roles", numeric: true, required: true }, { name: "password", label: "Password", type: "password", help: "Required for new admins. Leave blank to keep the current password. Min 8 chars, letters + numbers." },
// //       { name: "isActive", label: "Active", type: "boolean" },
// //     ],
// //   },
// // };

// // export const APPLICANT_STATUSES = ["applied", "under_review", "shortlisted", "interview", "selected", "rejected", "on_hold"] as const;
// // export const statusLabel = (s: string) => s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());







// // new new code 



// //src/lib/defs.ts
// /* Pure data — shared by the admin UI (client) and the generic CRUD API (server). */
// import { TEAM_RESOURCES } from "@/lib/admin/team-defs";

// export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "media" | "datetime" | "date" | "color" | "password" | "email";
// export type Opt = { value: string; label: string };
// export type FieldDef = {
//   name: string; label: string; type: FieldType; options?: Opt[]; optionsFrom?: string; numeric?: boolean; required?: boolean;
//   help?: string; wide?: boolean; mediaKind?: "image" | "video"; group?: string; readOnly?: boolean; max?: number; rows?: number;
// };
// export type ChildDef = { name: string; label: string; fields: FieldDef[]; help?: string };
// export type ResourceDef = {
//   key: string; label: string; singular: string; perm: string; titleField: string;
//   columns: { name: string; label: string; type?: "badge" | "bool" | "date" | "media" | "mono" }[];
//   fields: FieldDef[]; children?: ChildDef[]; filters?: { name: string; label: string; options: Opt[] }[];
//   searchFields: string[]; sort?: { name: string; dir: "asc" | "desc" }; canCreate?: boolean; canDelete?: boolean; slugFrom?: string; groups?: string[];
// };

// const o = (...v: string[]): Opt[] => v.map((x) => ({ value: x, label: x }));
// const ol = (v: [string, string][]): Opt[] => v.map(([value, label]) => ({ value, label }));

// /* Preset suggestions (kept for reference / help text). Position fields are now free text,
//    so any valid CSS background-position works (e.g. "center 580px", "50% 30%"). */
// export const POSITIONS = o("center center", "center top", "center bottom", "left center", "right center", "center 25%", "center 40%", "center 60%", "center 75%", "left top", "right top");

// /* Help text shown under the free-text position fields */
// export const POSITION_HELP =
//   "Any CSS background-position. Examples: center center, center top, center 25%, 50% 30%, center 580px. " +
//   "Note: a single value like 580px only sets the horizontal position; use 'center 580px' for vertical.";

// export const HERO_FIELDS: FieldDef[] = [
//   { name: "heroEyebrow", label: "Eyebrow / category", type: "text", group: "Hero" },
//   { name: "heroTitle", label: "Hero title", type: "text", group: "Hero", wide: true, max: 220 },
//   { name: "heroDescription", label: "Hero description", type: "textarea", group: "Hero", wide: true, rows: 3 },
//   { name: "heroPrimaryText", label: "Primary button text", type: "text", group: "Hero" },
//   { name: "heroPrimaryUrl", label: "Primary button URL", type: "text", group: "Hero" },
//   { name: "heroSecondaryText", label: "Secondary button text", type: "text", group: "Hero" },
//   { name: "heroSecondaryUrl", label: "Secondary button URL", type: "text", group: "Hero" },
//   { name: "heroType", label: "Hero media type", type: "select", options: ol([["image", "Image"], ["video", "Video"]]), group: "Hero media", help: "Video heroes always keep the poster/image as a fallback and on mobile." },
//   { name: "heroImageUrl", label: "Hero image (upload or URL)", type: "media", mediaKind: "image", group: "Hero media", wide: true },
//   { name: "heroMobileImageUrl", label: "Mobile hero image (optional)", type: "media", mediaKind: "image", group: "Hero media", wide: true },
//   { name: "heroVideoUrl", label: "Hero video (MP4/WebM upload or URL)", type: "media", mediaKind: "video", group: "Hero media", wide: true },
//   { name: "heroPosterUrl", label: "Video poster image", type: "media", mediaKind: "image", group: "Hero media", wide: true },
//   { name: "heroOverlayColor", label: "Overlay colour", type: "color", group: "Hero style" },
//   { name: "heroOverlayOpacity", label: "Overlay opacity (0–100)", type: "number", group: "Hero style" },
//   { name: "heroAlign", label: "Text alignment", type: "select", options: ol([["left", "Left"], ["center", "Center"], ["right", "Right"]]), group: "Hero style" },
//   { name: "heroHeight", label: "Hero height (px, 440–780)", type: "number", group: "Hero style" },
//   { name: "heroPosDesktop", label: "Desktop background position", type: "text", group: "Hero style", wide: true, help: POSITION_HELP },
//   { name: "heroPosMobile", label: "Mobile background position", type: "text", group: "Hero style", wide: true, help: POSITION_HELP },
//   { name: "heroAnimate", label: "Enable hero animation", type: "boolean", group: "Hero style" },
//   { name: "heroParallax", label: "Enable parallax", type: "boolean", group: "Hero style" },
// ];

// export const ICONS = o("cloud", "server", "hybrid", "mail", "migrate", "pipeline", "monitor", "backup", "shield", "lock", "scan", "endpoint", "identity");
// export const DIAGRAMS = o("cloud", "private", "hybrid", "email", "migration", "devops", "monitoring", "continuity", "ddos", "datasec", "vapt", "endpoint", "identity");

// const master = (key: string, label: string, singular: string): ResourceDef => ({
//   key, label, singular, perm: "masters.manage", titleField: "name", searchFields: ["name"], sort: { name: "sortOrder", dir: "asc" },
//   columns: [{ name: "name", label: "Name" }, { name: "isActive", label: "Active", type: "bool" }, { name: "sortOrder", label: "Order" }],
//   fields: [{ name: "name", label: "Name", type: "text", required: true, wide: true }, { name: "isActive", label: "Active", type: "boolean" }, { name: "sortOrder", label: "Sort order", type: "number" }],
// });

// export const RESOURCES: Record<string, ResourceDef> = {
//   services: {
//     key: "services", label: "Services", singular: "service", perm: "services.manage", titleField: "title", slugFrom: "title", searchFields: ["title", "slug", "shortDescription"],
//     sort: { name: "sortOrder", dir: "asc" }, groups: ["Content", "Visuals", "Hero", "Hero media", "Hero style", "Call to action", "Lists"],
//     filters: [{ name: "category", label: "Category", options: ol([["cloud", "Cloud"], ["workplace", "Workplace Mobility"], ["services", "Services"], ["security", "Security"]]) }],
//     columns: [{ name: "cardImageUrl", label: "", type: "media" }, { name: "title", label: "Title" }, { name: "category", label: "Category", type: "badge" }, { name: "slug", label: "Slug", type: "mono" }, { name: "isPublished", label: "Live", type: "bool" }],
//     fields: [
//       { name: "title", label: "Title", type: "text", required: true, group: "Content" },
//       { name: "slug", label: "Slug (URL)", type: "text", group: "Content", help: "Auto-generated from the title when empty." },
//       { name: "category", label: "Category", type: "select", required: true, group: "Content", options: ol([["cloud", "Cloud"], ["workplace", "Workplace Mobility"], ["services", "Services"], ["security", "Security"]]) },
//       { name: "parentSlug", label: "Parent service slug", type: "text", group: "Content", help: "e.g. public-cloud for AWS/Azure/Google Cloud." },
//       { name: "shortDescription", label: "Short description", type: "textarea", group: "Content", wide: true, rows: 2 },
//       { name: "longDescription", label: "Long description", type: "textarea", group: "Content", wide: true, rows: 8, help: "Separate paragraphs with a blank line." },
//       { name: "icon", label: "Animated icon", type: "select", options: ICONS, group: "Visuals" },
//       { name: "diagram", label: "Architecture diagram", type: "select", options: DIAGRAMS, group: "Visuals" },
//       { name: "cardImageUrl", label: "Card image", type: "media", mediaKind: "image", group: "Visuals", wide: true },
//       { name: "sectionImageUrl", label: "Section image", type: "media", mediaKind: "image", group: "Visuals", wide: true },
//       ...HERO_FIELDS,
//       { name: "ctaTitle", label: "CTA title", type: "text", group: "Call to action", wide: true },
//       { name: "ctaText", label: "CTA text", type: "textarea", group: "Call to action", wide: true, rows: 2 },
//       { name: "ctaButtonText", label: "CTA button text", type: "text", group: "Call to action" },
//       { name: "ctaButtonUrl", label: "CTA button URL", type: "text", group: "Call to action" },
//       { name: "sortOrder", label: "Sort order", type: "number", group: "Content" },
//       { name: "isFeatured", label: "Featured", type: "boolean", group: "Content" },
//       { name: "isPublished", label: "Published", type: "boolean", group: "Content" },
//     ],
//     children: [
//       { name: "features", label: "Features / capabilities", fields: [{ name: "title", label: "Title", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
//       { name: "process", label: "Process steps", fields: [{ name: "title", label: "Step", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
//       { name: "benefits", label: "Benefits", fields: [{ name: "title", label: "Title", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
//       { name: "faqs", label: "FAQs", fields: [{ name: "question", label: "Question", type: "text", required: true }, { name: "answer", label: "Answer", type: "textarea", rows: 3 }] },
//     ],
//   },
//   /* "Our Marketplaces" carousel on the home page (client products such as CBO ERP, ZEDX Software) */
//   marketplaces: {
//     key: "marketplaces", label: "Marketplaces", singular: "product", perm: "services.manage", titleField: "name", searchFields: ["name", "tagline", "category"],
//     sort: { name: "sortOrder", dir: "asc" }, groups: ["Product", "Visuals", "Link", "Publishing"],
//     columns: [{ name: "imageUrl", label: "", type: "media" }, { name: "name", label: "Product" }, { name: "category", label: "Category", type: "badge" }, { name: "sortOrder", label: "Order" }, { name: "isActive", label: "Live", type: "bool" }],
//     fields: [
//       { name: "name", label: "Product name", type: "text", required: true, group: "Product", max: 160, help: "e.g. CBO ERP, ZEDX Software" },
//       { name: "category", label: "Category / label", type: "text", group: "Product", max: 80, help: "Small label above the title, e.g. ERP, HRMS, Education." },
//       { name: "tagline", label: "Tagline", type: "text", wide: true, group: "Product", max: 220, help: "One short line under the product name." },
//       { name: "description", label: "Short description", type: "textarea", wide: true, rows: 3, group: "Product" },
//       { name: "highlights", label: "Bullet points", type: "textarea", wide: true, rows: 5, group: "Product", help: "One point per line (up to 6). Shown as bullets next to the image." },
//       { name: "tags", label: "Image tags", type: "text", wide: true, group: "Product", max: 300, help: "Comma separated, e.g. ERP, Cloud, SaaS. Shown on the cover image." },
//       // { name: "imageUrl", label: "Cover image", type: "media", mediaKind: "image", wide: true, group: "Visuals", help: "Large image on the left of the slide. Landscape works best (around 1600 x 1000)." },
//       { name: "imageUrl", label: "Cover image (optional)", type: "media", mediaKind: "image", wide: true, group: "Visuals", help: "Leave empty and save: a preview of the website's home page is fetched automatically from the Product link (takes a few seconds). To refresh it, clear this field and save again. Upload an image to override it." },

//       { name: "logoUrl", label: "Logo", type: "media", mediaKind: "image", wide: true, group: "Visuals", help: "Small square box above the title. Transparent PNG/SVG works best." },
//       { name: "linkText", label: "Link text", type: "text", group: "Link", max: 80, help: "e.g. Visit CBO ERP. Default: Visit product." },
//       // { name: "linkUrl", label: "Product link (URL)", type: "text", wide: true, group: "Link", max: 500, help: "Full URL starting with https:// (opens in a new tab) or an internal path like /contact." },
//             { name: "linkUrl", label: "Product link (URL)", type: "text", wide: true, group: "Link", max: 500, help: "Company website, e.g. https://www.company.com. Used for the button and for the automatic home page preview." },
            
//       { name: "sortOrder", label: "Sort order", type: "number", group: "Publishing", help: "Lower numbers show first." },
//       { name: "isActive", label: "Show on website", type: "boolean", group: "Publishing" },
//     ],
//   },
//   news: {
//     key: "news", label: "News", singular: "article", perm: "news.manage", titleField: "title", slugFrom: "title", searchFields: ["title", "excerpt"], groups: ["Article", "Media", "Publishing"],
//     filters: [{ name: "status", label: "Status", options: o("draft", "published", "scheduled") }],
//     columns: [{ name: "featuredImageUrl", label: "", type: "media" }, { name: "title", label: "Title" }, { name: "status", label: "Status", type: "badge" }, { name: "publishedAt", label: "Publish date", type: "date" }, { name: "isFeatured", label: "Featured", type: "bool" }],
//     fields: [
//       { name: "title", label: "Title", type: "text", required: true, wide: true, group: "Article", max: 220 },
//       { name: "slug", label: "Slug", type: "text", group: "Article" },
//       { name: "categoryId", label: "Category", type: "select", optionsFrom: "news_categories", numeric: true, group: "Article" },
//       { name: "author", label: "Author", type: "text", group: "Article" },
//       { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2, wide: true, group: "Article" },
//       { name: "content", label: "Content", type: "textarea", rows: 14, wide: true, group: "Article", help: "Separate paragraphs with a blank line." },
//       { name: "featuredImageUrl", label: "Featured image (hero)", type: "media", mediaKind: "image", wide: true, group: "Media" },
//       { name: "videoUrl", label: "Hero video (optional)", type: "media", mediaKind: "video", wide: true, group: "Media" },
//       { name: "posterUrl", label: "Video poster", type: "media", mediaKind: "image", wide: true, group: "Media" },
//       { name: "heroPosDesktop", label: "Hero image position", type: "text", group: "Media", wide: true, help: POSITION_HELP },
//       { name: "status", label: "Status", type: "select", options: o("draft", "published", "scheduled"), required: true, group: "Publishing", help: "Scheduled posts go live automatically at the publish date." },
//       { name: "publishedAt", label: "Publish date / time", type: "datetime", group: "Publishing" },
//       { name: "isFeatured", label: "Featured (pinned first)", type: "boolean", group: "Publishing" },
//     ],
//     children: [{ name: "images", label: "Gallery images", fields: [{ name: "url", label: "Image", type: "media", mediaKind: "image", required: true }, { name: "caption", label: "Caption", type: "text" }] }],
//   },
//   news_categories: {
//     key: "news_categories", label: "News categories", singular: "category", perm: "news.manage", titleField: "name", slugFrom: "name", searchFields: ["name"],
//     columns: [{ name: "name", label: "Name" }, { name: "slug", label: "Slug", type: "mono" }],
//     fields: [{ name: "name", label: "Name", type: "text", required: true }, { name: "slug", label: "Slug", type: "text" }],
//   },
//   jobs: {
//     key: "jobs", label: "Jobs", singular: "job", perm: "jobs.manage", titleField: "title", slugFrom: "title", searchFields: ["title", "department", "location"], groups: ["Role", "Details", "Hero"],
//     filters: [{ name: "status", label: "Status", options: o("active", "inactive", "closed") }],
//     columns: [{ name: "title", label: "Title" }, { name: "department", label: "Department" }, { name: "location", label: "Location" }, { name: "status", label: "Status", type: "badge" }],
//     fields: [
//       { name: "title", label: "Job title", type: "text", required: true, group: "Role" }, { name: "slug", label: "Slug", type: "text", group: "Role" },
//       { name: "department", label: "Department", type: "text", group: "Role" }, { name: "location", label: "Location", type: "text", group: "Role" },
//       { name: "employmentType", label: "Employment type", type: "select", options: o("Full-time", "Part-time", "Contract", "Internship", "Temporary"), group: "Role" },
//       { name: "experience", label: "Experience", type: "text", group: "Role" }, { name: "openings", label: "Openings", type: "number", group: "Role" }, { name: "salaryRange", label: "Salary range (optional)", type: "text", group: "Role" },
//       { name: "status", label: "Status", type: "select", options: o("active", "inactive", "closed"), required: true, group: "Role" }, { name: "closingDate", label: "Closing date", type: "date", group: "Role" },
//       { name: "summary", label: "Summary", type: "textarea", rows: 2, wide: true, group: "Details" },
//       { name: "description", label: "Description", type: "textarea", rows: 6, wide: true, group: "Details" },
//       { name: "responsibilities", label: "Responsibilities (one per line)", type: "textarea", rows: 6, wide: true, group: "Details" },
//       { name: "requirements", label: "Requirements (one per line)", type: "textarea", rows: 6, wide: true, group: "Details" },
//       { name: "heroImageUrl", label: "Hero image", type: "media", mediaKind: "image", wide: true, group: "Hero" },
//       { name: "heroVideoUrl", label: "Hero video (optional)", type: "media", mediaKind: "video", wide: true, group: "Hero" },
//     ],
//   },
//   universities: master("universities", "Universities", "university"),
//   boards: master("boards", "Boards", "board"),
//   qualifications: master("qualifications", "Qualifications", "qualification"),
//   job_roles: master("job_roles", "Job roles", "job role"),
//   customers: {
//     key: "customers", label: "Customers", singular: "customer", perm: "customers.view", titleField: "fullName", searchFields: ["fullName", "email", "company", "mobile"], canCreate: false,
//     columns: [{ name: "fullName", label: "Name" }, { name: "company", label: "Company" }, { name: "email", label: "Email" }, { name: "serviceInterest", label: "Interest" }, { name: "isActive", label: "Active", type: "bool" }, { name: "createdAt", label: "Joined", type: "date" }],
//     fields: [
//       { name: "fullName", label: "Full name", type: "text", required: true }, { name: "company", label: "Company", type: "text" }, { name: "email", label: "Email", type: "email", readOnly: true },
//       { name: "mobile", label: "Mobile", type: "text" }, { name: "country", label: "Country", type: "text" }, { name: "state", label: "State", type: "text" }, { name: "city", label: "City", type: "text" },
//       { name: "serviceInterest", label: "Service interest", type: "text" }, { name: "address", label: "Address", type: "textarea", wide: true, rows: 2 }, { name: "isActive", label: "Account active", type: "boolean" },
//     ],
//   },
//   contacts: {
//     key: "contacts", label: "Contact enquiries", singular: "enquiry", perm: "contacts.manage", titleField: "name", searchFields: ["name", "email", "subject", "message", "company"], canCreate: false,
//     filters: [{ name: "status", label: "Status", options: o("new", "in_progress", "resolved", "spam") }],
//     columns: [{ name: "name", label: "Name" }, { name: "email", label: "Email" }, { name: "serviceInterest", label: "Service" }, { name: "status", label: "Status", type: "badge" }, { name: "createdAt", label: "Received", type: "date" }],
//     fields: [
//       { name: "name", label: "Name", type: "text", readOnly: true }, { name: "email", label: "Email", type: "text", readOnly: true }, { name: "phone", label: "Phone", type: "text", readOnly: true }, { name: "company", label: "Company", type: "text", readOnly: true },
//       { name: "serviceInterest", label: "Service", type: "text", readOnly: true }, { name: "subject", label: "Subject", type: "text", readOnly: true }, { name: "message", label: "Message", type: "textarea", readOnly: true, wide: true, rows: 6 },
//       { name: "status", label: "Status", type: "select", options: o("new", "in_progress", "resolved", "spam"), required: true }, { name: "notes", label: "Internal notes", type: "textarea", wide: true, rows: 3 },
//     ],
//   },
//   seo: {
//     key: "seo", label: "SEO metadata", singular: "SEO record", perm: "seo.manage", titleField: "entityKey", searchFields: ["entityKey", "title"], groups: ["Target", "Meta", "Social"],
//     columns: [{ name: "entityType", label: "Type", type: "badge" }, { name: "entityKey", label: "Key", type: "mono" }, { name: "title", label: "Title" }, { name: "robots", label: "Robots" }],
//     fields: [
//       { name: "entityType", label: "Entity type", type: "select", options: o("page", "service", "news", "job"), required: true, group: "Target", help: "page: home, about, news… · service: slug · news: slug · job: slug" },
//       { name: "entityKey", label: "Entity key (slug)", type: "text", required: true, group: "Target" },
//       { name: "title", label: "Meta title", type: "text", wide: true, group: "Meta", max: 200 }, { name: "description", label: "Meta description", type: "textarea", rows: 3, wide: true, group: "Meta" },
//       { name: "canonical", label: "Canonical URL", type: "text", wide: true, group: "Meta" }, { name: "robots", label: "Robots", type: "select", options: o("index,follow", "noindex,follow", "index,nofollow", "noindex,nofollow"), group: "Meta" },
//       { name: "ogImage", label: "Open Graph image", type: "media", mediaKind: "image", wide: true, group: "Social" }, { name: "twitterImage", label: "Twitter image", type: "media", mediaKind: "image", wide: true, group: "Social" },
//       { name: "schemaJson", label: "Custom JSON-LD schema (optional)", type: "textarea", rows: 6, wide: true, group: "Social" },
//     ],
//   },
//   admins: {
//     key: "admins", label: "Admin users", singular: "admin", perm: "admins.manage", titleField: "name", searchFields: ["name", "email"],
//     columns: [{ name: "name", label: "Name" }, { name: "email", label: "Email" }, { name: "isActive", label: "Active", type: "bool" }, { name: "lastLoginAt", label: "Last login", type: "date" }],
//     fields: [
//       { name: "name", label: "Name", type: "text", required: true }, { name: "email", label: "Email", type: "email", required: true },
//       { name: "roleId", label: "Role", type: "select", optionsFrom: "roles", numeric: true, required: true }, { name: "password", label: "Password", type: "password", help: "Required for new admins. Leave blank to keep the current password. Min 8 chars, letters + numbers." },
//       { name: "isActive", label: "Active", type: "boolean" },
//     ],
//   },
// };

// export const APPLICANT_STATUSES = ["applied", "under_review", "shortlisted", "interview", "selected", "rejected", "on_hold"] as const;
// export const statusLabel = (s: string) => s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());






// new new code 








//src/lib/admin/defs.ts
/* Pure data — shared by the admin UI (client) and the generic CRUD API (server). */
import { TEAM_RESOURCES } from "@/lib/admin/team-defs";

export type FieldType = "text" | "textarea" | "number" | "boolean" | "select" | "media" | "datetime" | "date" | "color" | "password" | "email";
export type Opt = { value: string; label: string };
export type FieldDef = {
  name: string; label: string; type: FieldType; options?: Opt[]; optionsFrom?: string; numeric?: boolean; required?: boolean;
  help?: string; wide?: boolean; mediaKind?: "image" | "video"; group?: string; readOnly?: boolean; max?: number; rows?: number;
};
export type ChildDef = { name: string; label: string; fields: FieldDef[]; help?: string };
export type ResourceDef = {
  key: string; label: string; singular: string; perm: string; titleField: string;
  columns: { name: string; label: string; type?: "badge" | "bool" | "date" | "media" | "mono" }[];
  fields: FieldDef[]; children?: ChildDef[]; filters?: { name: string; label: string; options: Opt[] }[];
  searchFields: string[]; sort?: { name: string; dir: "asc" | "desc" }; canCreate?: boolean; canDelete?: boolean; slugFrom?: string; groups?: string[];
};

const o = (...v: string[]): Opt[] => v.map((x) => ({ value: x, label: x }));
const ol = (v: [string, string][]): Opt[] => v.map(([value, label]) => ({ value, label }));

/* Preset suggestions (kept for reference / help text). Position fields are now free text,
   so any valid CSS background-position works (e.g. "center 580px", "50% 30%"). */
export const POSITIONS = o("center center", "center top", "center bottom", "left center", "right center", "center 25%", "center 40%", "center 60%", "center 75%", "left top", "right top");

/* Help text shown under the free-text position fields */
export const POSITION_HELP =
  "Any CSS background-position. Examples: center center, center top, center 25%, 50% 30%, center 580px. " +
  "Note: a single value like 580px only sets the horizontal position; use 'center 580px' for vertical.";

export const HERO_FIELDS: FieldDef[] = [
  { name: "heroEyebrow", label: "Eyebrow / category", type: "text", group: "Hero" },
  { name: "heroTitle", label: "Hero title", type: "text", group: "Hero", wide: true, max: 220 },
  { name: "heroDescription", label: "Hero description", type: "textarea", group: "Hero", wide: true, rows: 3 },
  { name: "heroPrimaryText", label: "Primary button text", type: "text", group: "Hero" },
  { name: "heroPrimaryUrl", label: "Primary button URL", type: "text", group: "Hero" },
  { name: "heroSecondaryText", label: "Secondary button text", type: "text", group: "Hero" },
  { name: "heroSecondaryUrl", label: "Secondary button URL", type: "text", group: "Hero" },
  { name: "heroType", label: "Hero media type", type: "select", options: ol([["image", "Image"], ["video", "Video"]]), group: "Hero media", help: "Video heroes always keep the poster/image as a fallback and on mobile." },
  { name: "heroImageUrl", label: "Hero image (upload or URL)", type: "media", mediaKind: "image", group: "Hero media", wide: true },
  { name: "heroMobileImageUrl", label: "Mobile hero image (optional)", type: "media", mediaKind: "image", group: "Hero media", wide: true },
  { name: "heroVideoUrl", label: "Hero video (MP4/WebM upload or URL)", type: "media", mediaKind: "video", group: "Hero media", wide: true },
  { name: "heroPosterUrl", label: "Video poster image", type: "media", mediaKind: "image", group: "Hero media", wide: true },
  { name: "heroOverlayColor", label: "Overlay colour", type: "color", group: "Hero style" },
  { name: "heroOverlayOpacity", label: "Overlay opacity (0–100)", type: "number", group: "Hero style" },
  { name: "heroAlign", label: "Text alignment", type: "select", options: ol([["left", "Left"], ["center", "Center"], ["right", "Right"]]), group: "Hero style" },
  { name: "heroHeight", label: "Hero height (px, 440–780)", type: "number", group: "Hero style" },
  { name: "heroPosDesktop", label: "Desktop background position", type: "text", group: "Hero style", wide: true, help: POSITION_HELP },
  { name: "heroPosMobile", label: "Mobile background position", type: "text", group: "Hero style", wide: true, help: POSITION_HELP },
  { name: "heroAnimate", label: "Enable hero animation", type: "boolean", group: "Hero style" },
  { name: "heroParallax", label: "Enable parallax", type: "boolean", group: "Hero style" },
];

export const ICONS = o("cloud", "server", "hybrid", "mail", "migrate", "pipeline", "monitor", "backup", "shield", "lock", "scan", "endpoint", "identity");
export const DIAGRAMS = o("cloud", "private", "hybrid", "email", "migration", "devops", "monitoring", "continuity", "ddos", "datasec", "vapt", "endpoint", "identity");

const master = (key: string, label: string, singular: string): ResourceDef => ({
  key, label, singular, perm: "masters.manage", titleField: "name", searchFields: ["name"], sort: { name: "sortOrder", dir: "asc" },
  columns: [{ name: "name", label: "Name" }, { name: "isActive", label: "Active", type: "bool" }, { name: "sortOrder", label: "Order" }],
  fields: [{ name: "name", label: "Name", type: "text", required: true, wide: true }, { name: "isActive", label: "Active", type: "boolean" }, { name: "sortOrder", label: "Sort order", type: "number" }],
});

export const RESOURCES: Record<string, ResourceDef> = {
  // Team management: "team_groups" + "team_members" (defined in team-defs.ts)
  ...TEAM_RESOURCES,

  services: {
    key: "services", label: "Services", singular: "service", perm: "services.manage", titleField: "title", slugFrom: "title", searchFields: ["title", "slug", "shortDescription"],
    sort: { name: "sortOrder", dir: "asc" }, groups: ["Content", "Visuals", "Hero", "Hero media", "Hero style", "Call to action", "Lists"],
    filters: [{ name: "category", label: "Category", options: ol([["cloud", "Cloud"], ["workplace", "Workplace Mobility"], ["services", "Services"], ["security", "Security"]]) }],
    columns: [{ name: "cardImageUrl", label: "", type: "media" }, { name: "title", label: "Title" }, { name: "category", label: "Category", type: "badge" }, { name: "slug", label: "Slug", type: "mono" }, { name: "isPublished", label: "Live", type: "bool" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, group: "Content" },
      { name: "slug", label: "Slug (URL)", type: "text", group: "Content", help: "Auto-generated from the title when empty." },
      { name: "category", label: "Category", type: "select", required: true, group: "Content", options: ol([["cloud", "Cloud"], ["workplace", "Workplace Mobility"], ["services", "Services"], ["security", "Security"]]) },
      { name: "parentSlug", label: "Parent service slug", type: "text", group: "Content", help: "e.g. public-cloud for AWS/Azure/Google Cloud." },
      { name: "shortDescription", label: "Short description", type: "textarea", group: "Content", wide: true, rows: 2 },
      { name: "longDescription", label: "Long description", type: "textarea", group: "Content", wide: true, rows: 8, help: "Separate paragraphs with a blank line." },
      { name: "icon", label: "Animated icon", type: "select", options: ICONS, group: "Visuals" },
      { name: "diagram", label: "Architecture diagram", type: "select", options: DIAGRAMS, group: "Visuals" },
      { name: "cardImageUrl", label: "Card image", type: "media", mediaKind: "image", group: "Visuals", wide: true },
      { name: "sectionImageUrl", label: "Section image", type: "media", mediaKind: "image", group: "Visuals", wide: true },
      ...HERO_FIELDS,
      { name: "ctaTitle", label: "CTA title", type: "text", group: "Call to action", wide: true },
      { name: "ctaText", label: "CTA text", type: "textarea", group: "Call to action", wide: true, rows: 2 },
      { name: "ctaButtonText", label: "CTA button text", type: "text", group: "Call to action" },
      { name: "ctaButtonUrl", label: "CTA button URL", type: "text", group: "Call to action" },
      { name: "sortOrder", label: "Sort order", type: "number", group: "Content" },
      { name: "isFeatured", label: "Featured", type: "boolean", group: "Content" },
      { name: "isPublished", label: "Published", type: "boolean", group: "Content" },
    ],
    children: [
      { name: "features", label: "Features / capabilities", fields: [{ name: "title", label: "Title", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
      { name: "process", label: "Process steps", fields: [{ name: "title", label: "Step", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
      { name: "benefits", label: "Benefits", fields: [{ name: "title", label: "Title", type: "text", required: true }, { name: "description", label: "Description", type: "textarea", rows: 2 }] },
      { name: "faqs", label: "FAQs", fields: [{ name: "question", label: "Question", type: "text", required: true }, { name: "answer", label: "Answer", type: "textarea", rows: 3 }] },
    ],
  },
  /* "Our Marketplaces" carousel on the home page (client products such as CBO ERP, ZEDX Software) */
  marketplaces: {
    key: "marketplaces", label: "Marketplaces", singular: "product", perm: "services.manage", titleField: "name", searchFields: ["name", "tagline", "category"],
    sort: { name: "sortOrder", dir: "asc" }, groups: ["Product", "Visuals", "Link", "Publishing"],
    columns: [{ name: "imageUrl", label: "", type: "media" }, { name: "name", label: "Product" }, { name: "category", label: "Category", type: "badge" }, { name: "sortOrder", label: "Order" }, { name: "isActive", label: "Live", type: "bool" }],
    fields: [
      { name: "name", label: "Product name", type: "text", required: true, group: "Product", max: 160, help: "e.g. CBO ERP, ZEDX Software" },
      { name: "category", label: "Category / label", type: "text", group: "Product", max: 80, help: "Small label above the title, e.g. ERP, HRMS, Education." },
      { name: "tagline", label: "Tagline", type: "text", wide: true, group: "Product", max: 220, help: "One short line under the product name." },
      { name: "description", label: "Short description", type: "textarea", wide: true, rows: 3, group: "Product" },
      { name: "highlights", label: "Bullet points", type: "textarea", wide: true, rows: 5, group: "Product", help: "One point per line (up to 6). Shown as bullets next to the image." },
      { name: "tags", label: "Image tags", type: "text", wide: true, group: "Product", max: 300, help: "Comma separated, e.g. ERP, Cloud, SaaS. Shown on the cover image." },
      { name: "imageUrl", label: "Cover image (optional)", type: "media", mediaKind: "image", wide: true, group: "Visuals", help: "Leave empty and save: a preview of the website's home page is fetched automatically from the Product link (takes a few seconds). To refresh it, clear this field and save again. Upload an image to override it." },
      { name: "logoUrl", label: "Logo", type: "media", mediaKind: "image", wide: true, group: "Visuals", help: "Small square box above the title. Transparent PNG/SVG works best." },
      { name: "linkText", label: "Link text", type: "text", group: "Link", max: 80, help: "e.g. Visit CBO ERP. Default: Visit product." },
      { name: "linkUrl", label: "Product link (URL)", type: "text", wide: true, group: "Link", max: 500, help: "Company website, e.g. https://www.company.com. Used for the button and for the automatic home page preview." },
      { name: "sortOrder", label: "Sort order", type: "number", group: "Publishing", help: "Lower numbers show first." },
      { name: "isActive", label: "Show on website", type: "boolean", group: "Publishing" },
    ],
  },
  news: {
    key: "news", label: "News", singular: "article", perm: "news.manage", titleField: "title", slugFrom: "title", searchFields: ["title", "excerpt"], groups: ["Article", "Media", "Publishing"],
    filters: [{ name: "status", label: "Status", options: o("draft", "published", "scheduled") }],
    columns: [{ name: "featuredImageUrl", label: "", type: "media" }, { name: "title", label: "Title" }, { name: "status", label: "Status", type: "badge" }, { name: "publishedAt", label: "Publish date", type: "date" }, { name: "isFeatured", label: "Featured", type: "bool" }],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, wide: true, group: "Article", max: 220 },
      { name: "slug", label: "Slug", type: "text", group: "Article" },
      { name: "categoryId", label: "Category", type: "select", optionsFrom: "news_categories", numeric: true, group: "Article" },
      { name: "author", label: "Author", type: "text", group: "Article" },
      { name: "excerpt", label: "Excerpt", type: "textarea", rows: 2, wide: true, group: "Article" },
      { name: "content", label: "Content", type: "textarea", rows: 14, wide: true, group: "Article", help: "Separate paragraphs with a blank line." },
      { name: "featuredImageUrl", label: "Featured image (hero)", type: "media", mediaKind: "image", wide: true, group: "Media" },
      { name: "videoUrl", label: "Hero video (optional)", type: "media", mediaKind: "video", wide: true, group: "Media" },
      { name: "posterUrl", label: "Video poster", type: "media", mediaKind: "image", wide: true, group: "Media" },
      { name: "heroPosDesktop", label: "Hero image position", type: "text", group: "Media", wide: true, help: POSITION_HELP },
      { name: "status", label: "Status", type: "select", options: o("draft", "published", "scheduled"), required: true, group: "Publishing", help: "Scheduled posts go live automatically at the publish date." },
      { name: "publishedAt", label: "Publish date / time", type: "datetime", group: "Publishing" },
      { name: "isFeatured", label: "Featured (pinned first)", type: "boolean", group: "Publishing" },
    ],
    children: [{ name: "images", label: "Gallery images", fields: [{ name: "url", label: "Image", type: "media", mediaKind: "image", required: true }, { name: "caption", label: "Caption", type: "text" }] }],
  },
  news_categories: {
    key: "news_categories", label: "News categories", singular: "category", perm: "news.manage", titleField: "name", slugFrom: "name", searchFields: ["name"],
    columns: [{ name: "name", label: "Name" }, { name: "slug", label: "Slug", type: "mono" }],
    fields: [{ name: "name", label: "Name", type: "text", required: true }, { name: "slug", label: "Slug", type: "text" }],
  },
  jobs: {
    key: "jobs", label: "Jobs", singular: "job", perm: "jobs.manage", titleField: "title", slugFrom: "title", searchFields: ["title", "department", "location"], groups: ["Role", "Details", "Hero"],
    filters: [{ name: "status", label: "Status", options: o("active", "inactive", "closed") }],
    columns: [{ name: "title", label: "Title" }, { name: "department", label: "Department" }, { name: "location", label: "Location" }, { name: "status", label: "Status", type: "badge" }],
    fields: [
      { name: "title", label: "Job title", type: "text", required: true, group: "Role" }, { name: "slug", label: "Slug", type: "text", group: "Role" },
      { name: "department", label: "Department", type: "text", group: "Role" }, { name: "location", label: "Location", type: "text", group: "Role" },
      { name: "employmentType", label: "Employment type", type: "select", options: o("Full-time", "Part-time", "Contract", "Internship", "Temporary"), group: "Role" },
      { name: "experience", label: "Experience", type: "text", group: "Role" }, { name: "openings", label: "Openings", type: "number", group: "Role" }, { name: "salaryRange", label: "Salary range (optional)", type: "text", group: "Role" },
      { name: "status", label: "Status", type: "select", options: o("active", "inactive", "closed"), required: true, group: "Role" }, { name: "closingDate", label: "Closing date", type: "date", group: "Role" },
      { name: "summary", label: "Summary", type: "textarea", rows: 2, wide: true, group: "Details" },
      { name: "description", label: "Description", type: "textarea", rows: 6, wide: true, group: "Details" },
      { name: "responsibilities", label: "Responsibilities (one per line)", type: "textarea", rows: 6, wide: true, group: "Details" },
      { name: "requirements", label: "Requirements (one per line)", type: "textarea", rows: 6, wide: true, group: "Details" },
      { name: "heroImageUrl", label: "Hero image", type: "media", mediaKind: "image", wide: true, group: "Hero" },
      { name: "heroVideoUrl", label: "Hero video (optional)", type: "media", mediaKind: "video", wide: true, group: "Hero" },
    ],
  },
  universities: master("universities", "Universities", "university"),
  boards: master("boards", "Boards", "board"),
  qualifications: master("qualifications", "Qualifications", "qualification"),
  job_roles: master("job_roles", "Job roles", "job role"),
  customers: {
    key: "customers", label: "Customers", singular: "customer", perm: "customers.view", titleField: "fullName", searchFields: ["fullName", "email", "company", "mobile"], canCreate: false,
    columns: [{ name: "fullName", label: "Name" }, { name: "company", label: "Company" }, { name: "email", label: "Email" }, { name: "serviceInterest", label: "Interest" }, { name: "isActive", label: "Active", type: "bool" }, { name: "createdAt", label: "Joined", type: "date" }],
    fields: [
      { name: "fullName", label: "Full name", type: "text", required: true }, { name: "company", label: "Company", type: "text" }, { name: "email", label: "Email", type: "email", readOnly: true },
      { name: "mobile", label: "Mobile", type: "text" }, { name: "country", label: "Country", type: "text" }, { name: "state", label: "State", type: "text" }, { name: "city", label: "City", type: "text" },
      { name: "serviceInterest", label: "Service interest", type: "text" }, { name: "address", label: "Address", type: "textarea", wide: true, rows: 2 }, { name: "isActive", label: "Account active", type: "boolean" },
    ],
  },
  contacts: {
    key: "contacts", label: "Contact enquiries", singular: "enquiry", perm: "contacts.manage", titleField: "name", searchFields: ["name", "email", "subject", "message", "company"], canCreate: false,
    filters: [{ name: "status", label: "Status", options: o("new", "in_progress", "resolved", "spam") }],
    columns: [{ name: "name", label: "Name" }, { name: "email", label: "Email" }, { name: "serviceInterest", label: "Service" }, { name: "status", label: "Status", type: "badge" }, { name: "createdAt", label: "Received", type: "date" }],
    fields: [
      { name: "name", label: "Name", type: "text", readOnly: true }, { name: "email", label: "Email", type: "text", readOnly: true }, { name: "phone", label: "Phone", type: "text", readOnly: true }, { name: "company", label: "Company", type: "text", readOnly: true },
      { name: "serviceInterest", label: "Service", type: "text", readOnly: true }, { name: "subject", label: "Subject", type: "text", readOnly: true }, { name: "message", label: "Message", type: "textarea", readOnly: true, wide: true, rows: 6 },
      { name: "status", label: "Status", type: "select", options: o("new", "in_progress", "resolved", "spam"), required: true }, { name: "notes", label: "Internal notes", type: "textarea", wide: true, rows: 3 },
    ],
  },
  seo: {
    key: "seo", label: "SEO metadata", singular: "SEO record", perm: "seo.manage", titleField: "entityKey", searchFields: ["entityKey", "title"], groups: ["Target", "Meta", "Social"],
    columns: [{ name: "entityType", label: "Type", type: "badge" }, { name: "entityKey", label: "Key", type: "mono" }, { name: "title", label: "Title" }, { name: "robots", label: "Robots" }],
    fields: [
      { name: "entityType", label: "Entity type", type: "select", options: o("page", "service", "news", "job"), required: true, group: "Target", help: "page: home, about, news… · service: slug · news: slug · job: slug" },
      { name: "entityKey", label: "Entity key (slug)", type: "text", required: true, group: "Target" },
      { name: "title", label: "Meta title", type: "text", wide: true, group: "Meta", max: 200 }, { name: "description", label: "Meta description", type: "textarea", rows: 3, wide: true, group: "Meta" },
      { name: "canonical", label: "Canonical URL", type: "text", wide: true, group: "Meta" }, { name: "robots", label: "Robots", type: "select", options: o("index,follow", "noindex,follow", "index,nofollow", "noindex,nofollow"), group: "Meta" },
      { name: "ogImage", label: "Open Graph image", type: "media", mediaKind: "image", wide: true, group: "Social" }, { name: "twitterImage", label: "Twitter image", type: "media", mediaKind: "image", wide: true, group: "Social" },
      { name: "schemaJson", label: "Custom JSON-LD schema (optional)", type: "textarea", rows: 6, wide: true, group: "Social" },
    ],
  },
  admins: {
    key: "admins", label: "Admin users", singular: "admin", perm: "admins.manage", titleField: "name", searchFields: ["name", "email"],
    columns: [{ name: "name", label: "Name" }, { name: "email", label: "Email" }, { name: "isActive", label: "Active", type: "bool" }, { name: "lastLoginAt", label: "Last login", type: "date" }],
    fields: [
      { name: "name", label: "Name", type: "text", required: true }, { name: "email", label: "Email", type: "email", required: true },
      { name: "roleId", label: "Role", type: "select", optionsFrom: "roles", numeric: true, required: true }, { name: "password", label: "Password", type: "password", help: "Required for new admins. Leave blank to keep the current password. Min 8 chars, letters + numbers." },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },
};

export const APPLICANT_STATUSES = ["applied", "under_review", "shortlisted", "interview", "selected", "rejected", "on_hold"] as const;
export const statusLabel = (s: string) => s.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
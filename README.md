# 2CCloud — Enterprise Cloud / Server / DevOps / Security Website + CMS

Legal entity: **Cirrostratus Services Pvt. Ltd.** · Trading name: **2CCloud**

A complete public website, CMS, admin panel, customer portal and HR/recruitment system for a cloud, server, DevOps,
security, migration, email and managed-services company.

> **Stack note.** The brief mentions PHP + MySQL. This project is delivered on the stack this workspace runs:
> **Next.js 16 (App Router, Node.js REST API routes) + PostgreSQL via Drizzle ORM**. Every requirement
> (REST API, RBAC, CSRF, prepared statements, secure uploads, CMS, HR…) is implemented there. For teams that must run on
> MySQL/phpMyAdmin, `database/schema.mysql.sql` is a generated MySQL 8 mirror of the same 30-table schema
> (regenerate any time with `python3 database/generate_mysql.py`).

---

## 1. Quick start (local)

```bash
cp .env.example .env            # edit DATABASE_URL etc.
npm install
npx drizzle-kit push            # creates all tables from src/db/schema.ts
npm run build && npm run start  # the first server start seeds demo content automatically
# or, to seed without starting the server:
npx tsx src/db/seed-cli.ts
```

* Website: `http://localhost:3000`
* Admin: `http://localhost:3000/admin` — default login **admin@2ccloud.com / Admin@12345**
  (the dashboard warns you until it is changed).
* The seed is idempotent: it only fills **empty** tables, so your edits are never overwritten.

## 2. What is included

| Area | Highlights |
|---|---|
| **Public site** | Cinematic page-specific heroes for every page, sticky header with mega menus (hover/click/keyboard, mobile accordion), 18 service pages, About / Vision / Mission, News, Careers, Contact |
| **Heroes** | Image **or** video background per page; poster + mobile fallback; overlay colour/opacity; text alignment; height; desktop & mobile focal position; parallax / animation toggles; all editable in **Admin → Pages** and **Admin → Services** |
| **Dynamic logo** | Primary, mobile, dark logo and favicon stored in `branding_settings`, served by `/api/branding`. **Image only — no name text is ever rendered beside the logo.** Replace it in **Admin → Branding** (upload or URL) |
| **CMS** | Pages + sections, Services (features, process, benefits, FAQs, CTA), News (categories, gallery, video, draft/publish/schedule), Jobs, Media library, SEO records, Site settings |
| **HR** | Admin-managed roles / qualifications / boards / universities; full application form (conditional “Other” fields, education by level, CV + marksheet + additional documents); applicant search, filter, status workflow, notes, document view/download, email |
| **Customers** | Registration → session → dashboard (profile, service requests, history), login/logout |
| **Admin** | Role-based sidebar, dashboard, generic resource manager, audit logs, media picker everywhere (upload or URL) |
| **Graphics** | Animated SVG architecture diagrams (data-flow), animated service icons, CI/CD terminal, and a **real-time 3D server-rack scene (React Three Fiber)** on capable desktops with a static photographic fallback on mobile / reduced-motion / data-saver |
| **SEO** | Per-page title, description, canonical, OG/Twitter image, robots; JSON-LD: Organization, Service, FAQPage, Article, JobPosting, BreadcrumbList; `sitemap.xml`, `robots.txt` |

## 3. Admin guide

* **Change the logo** → Admin → Branding → upload/paste URL → Save. It updates the whole site instantly.
* **Edit a hero** → Admin → Pages → *Edit hero & content* (or Admin → Services → *Hero* tab). Choose **Image** or **Video**.
  Videos: upload MP4/WebM (≤ 80 MB) or paste a URL, and always set a poster image. Videos load lazily after idle,
  pause off-screen, and are replaced by the poster on mobile, reduced-motion and data-saver.
* **Home page** → Admin → Home (hero + every home section’s text, image and button).
* **Services** → Admin → Services (or the Cloud / Workplace / Security filtered views).
* **News** → Admin → News: set *Status* to Draft / Published / Scheduled and a publish date.
* **Hiring** → Admin → Jobs (Active / Inactive / Closed) → candidates appear in Admin → Applicants.
* **Dropdown data** → Admin → Universities / Boards / Qualifications / Job roles feed the public application form.

### Roles & permissions (RBAC)

| Role | Permissions |
|---|---|
| Super Admin | everything |
| Content Editor | pages, services, news, media, SEO |
| HR Manager | jobs, applicants, masters, media |
| Support | customers, contact enquiries |

Tables: `roles`, `permissions`, `role_permissions`, `admins`. Assign a role to each admin in **Admin → Admin users**.

## 4. Security

* Passwords hashed with **scrypt** (per-user salt); constant-work login to resist user enumeration
* Sessions: random 256-bit tokens, only the **SHA-256 hash** is stored; `HttpOnly`, `SameSite=Lax`, `Secure` on HTTPS
* **CSRF**: per-session token header (`x-csrf-token`) + same-origin check on every state-changing request
* All SQL through Drizzle (parameterised); server-side validation and field whitelisting on every endpoint (no mass assignment)
* **Uploads**: extension allow-list, declared-MIME check, **magic-byte signature check**, size limits, random server-side file names;
  SVG is rejected if it contains scripts/handlers; uploads served with `nosniff` (+ CSP sandbox for SVG)
* Applicant documents are stored **outside the public folder** and streamed only to authorised admins (every download is audit-logged)
* Rate limiting on login, registration, contact and applications; honeypot field on public forms
* XSS: React escaping, JSON-LD is `<`-escaped, no `dangerouslySetInnerHTML` with user content
* Security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`)
* Audit log of every admin write, login, upload and document download

## 5. Performance

Server-rendered pages; `next/image` (AVIF/WebP, responsive sizes, priority for the hero only); lazy video with poster;
`IntersectionObserver` pauses off-screen video, SVG/SMIL and 3D; 3D is code-split and desktop-only; animations use
`transform`/`opacity`; full `prefers-reduced-motion` support; in-memory TTL cache for branding/settings/pages that is
cleared on every admin write.

## 6. Deployment

### A. Any Node host / VPS (recommended)
```bash
git clone … && cd project && npm ci
cp .env.example .env && nano .env
npx drizzle-kit push
npm run build
npm run start            # behind nginx/Apache or a process manager (pm2 / systemd), set PORT as needed
```
Put the site behind HTTPS and set `NEXT_PUBLIC_SITE_URL`. Persist and back up `STORAGE_DIR`.

### B. cPanel (with “Setup Node.js App”)
1. **Databases** → create a **PostgreSQL** database + user (cPanel *PostgreSQL Databases*). If your host only offers MySQL, see section C.
2. Upload the project (zip → *File Manager* → extract) to e.g. `~/2ccloud`, **excluding** `node_modules` and `.next`.
3. **Setup Node.js App** → *Create application*: Node 20+, application root `2ccloud`, startup file `server.js` (create it with the content below), mode *Production*.
4. Add the environment variables from `.env.example` (*Environment variables* section), then **Run NPM Install**.
5. In the cPanel terminal: `source ~/nodevenv/2ccloud/20/bin/activate && cd ~/2ccloud && npx drizzle-kit push && npm run build`.
6. Restart the app. Visit `/admin`, sign in and change the default password.

`server.js` (startup file for cPanel/Passenger):
```js
const { createServer } = require("http");
const next = require("next");
const app = next({ dev: false });
const handle = app.getRequestHandler();
app.prepare().then(() => createServer((req, res) => handle(req, res)).listen(process.env.PORT || 3000));
```

### C. phpMyAdmin / MySQL
The running application talks to PostgreSQL. `database/schema.mysql.sql` is provided so that MySQL-only environments
can review/import the identical table structure (phpMyAdmin → *Import*). To run the app itself on MySQL you would swap
`drizzle-orm/pg-core` for `drizzle-orm/mysql-core` in `src/db/schema.ts` and the driver in `src/db/index.ts`.
To inspect PostgreSQL visually use phpPgAdmin, Adminer, DBeaver or `psql`.

### Database files
| File | Purpose |
|---|---|
| `database/schema.postgres.sql` | `pg_dump` schema (alternative to `drizzle-kit push`) |
| `database/seed.postgres.sql` | demo data (services, pages, news, jobs, masters, RBAC, admin, media index) |
| `database/schema.mysql.sql` | MySQL 8 / MariaDB mirror of the schema |

## 7. Project structure
```
src/app/(site)/…        public pages (home, services [category]/[slug], about, news, careers, contact, register, dashboard)
src/app/admin/…         admin panel
src/app/api/…           REST API (public, customer, admin)
src/app/uploads/…       range-capable file server for uploaded media
src/components/…        Hero, Header (mega menu), graphics (SVG/3D), forms, admin UI
src/lib/…               auth/RBAC/CSRF, data layer, SEO, files, mailer, admin CRUD engine
src/db/…                Drizzle schema, seed, instrumentation hook
public/images|brand     bundled imagery and the placeholder logo
```

## 8. Imagery & logo notes
* The bundled logo files in `public/brand/` are **placeholders** (image only). Upload your real logo in **Admin → Branding**.
* Hero photography is a mix of licensed stock (Pexels) and generated data-centre imagery, stored locally in `public/images`.
  Replace any of it from the admin without touching code. Platform names (AWS, Azure, Google Cloud, Microsoft 365, Google Workspace)
  are used descriptively; the site states that no official partnership is implied.
* Set real contact details in **Admin → Settings** (email, phone, address, social links, site URL).

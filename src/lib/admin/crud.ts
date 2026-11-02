
// // // // // /* eslint-disable @typescript-eslint/no-explicit-any */
// // // // // import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
// // // // // import { db } from "@/db";
// // // // // import * as t from "@/db/schema";
// // // // // import { hashPassword, passwordIssue, slugify } from "@/lib/auth";
// // // // // import { clearCache } from "@/lib/data";
// // // // // import { RESOURCES, type FieldDef, type ResourceDef } from "@/lib/admin/defs";

// // // // // type ChildCfg = { table: any; fk: string; kind?: string };
// // // // // type Cfg = { table: any; children?: Record<string, ChildCfg>; optionLoaders?: Record<string, () => Promise<{ value: string; label: string }[]>> };

// // // // // export const TABLES: Record<string, Cfg> = {
// // // // //   services: { table: t.services, children: { features: { table: t.serviceFeatures, fk: "serviceId", kind: "feature" }, process: { table: t.serviceFeatures, fk: "serviceId", kind: "process" }, benefits: { table: t.serviceBenefits, fk: "serviceId" }, faqs: { table: t.serviceFaqs, fk: "serviceId" } } },
// // // // //   // Client products shown in the "Our Marketplaces" carousel on the home page
// // // // //   marketplaces: { table: t.marketplaces },
// // // // //   news: { table: t.news, children: { images: { table: t.newsImages, fk: "newsId" } } },
// // // // //   news_categories: { table: t.newsCategories },
// // // // //   jobs: { table: t.jobs },
// // // // //   universities: { table: t.universities },
// // // // //   boards: { table: t.boards },
// // // // //   qualifications: { table: t.qualifications },
// // // // //   job_roles: { table: t.jobRoles },
// // // // //   customers: { table: t.users },
// // // // //   contacts: { table: t.contactQueries },
// // // // //   seo: { table: t.seoMetadata },
// // // // //   admins: { table: t.admins },
// // // // // };

// // // // // export async function loadOptions(from: string) {
// // // // //   if (from === "news_categories") return (await db.select().from(t.newsCategories).orderBy(asc(t.newsCategories.name))).map((c) => ({ value: String(c.id), label: c.name }));
// // // // //   if (from === "roles") return (await db.select().from(t.roles).orderBy(asc(t.roles.name))).map((c) => ({ value: String(c.id), label: c.name }));
// // // // //   return [];
// // // // // }

// // // // // const STRIP = ["passwordHash"];
// // // // // const clean = (row: any) => {
// // // // //   const r = { ...row };
// // // // //   for (const k of STRIP) delete r[k];
// // // // //   return r;
// // // // // };

// // // // // export class ValidationError extends Error {
// // // // //   status: number;
// // // // //   constructor(m: string, status = 400) {
// // // // //     super(m);
// // // // //     this.status = status;
// // // // //   }
// // // // // }

// // // // // /** Coerce + validate raw input against field definitions (mass-assignment safe). */
// // // // // export function coerce(fields: FieldDef[], input: Record<string, any>, isNew: boolean, partial = false): Record<string, any> {
// // // // //   const out: Record<string, any> = {};
// // // // //   for (const f of fields) {
// // // // //     if (f.readOnly && !isNew) continue;
// // // // //     if (f.readOnly) continue;
// // // // //     if (!(f.name in input)) {
// // // // //       if (f.required && isNew && !partial && f.type !== "password") throw new ValidationError(`${f.label} is required.`);
// // // // //       continue;
// // // // //     }
// // // // //     const raw = input[f.name];
// // // // //     let v: any;
// // // // //     switch (f.type) {
// // // // //       case "number": {
// // // // //         const n = parseInt(String(raw ?? ""), 10);
// // // // //         v = Number.isNaN(n) ? 0 : n;
// // // // //         break;
// // // // //       }
// // // // //       case "boolean":
// // // // //         v = raw === true || raw === "true" || raw === 1;
// // // // //         break;
// // // // //       case "datetime": {
// // // // //         if (!raw) v = null;
// // // // //         else {
// // // // //           const d = new Date(String(raw));
// // // // //           if (Number.isNaN(d.getTime())) throw new ValidationError(`${f.label} is not a valid date.`);
// // // // //           v = d;
// // // // //         }
// // // // //         break;
// // // // //       }
// // // // //       case "date":
// // // // //         v = raw ? String(raw).slice(0, 10) : null;
// // // // //         if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new ValidationError(`${f.label} is not a valid date.`);
// // // // //         break;
// // // // //       case "password": {
// // // // //         const pw = String(raw ?? "");
// // // // //         if (!pw) {
// // // // //           if (isNew) throw new ValidationError("A password is required for new admins.");
// // // // //           continue;
// // // // //         }
// // // // //         const issue = passwordIssue(pw);
// // // // //         if (issue) throw new ValidationError(issue);
// // // // //         out.passwordHash = hashPassword(pw);
// // // // //         continue;
// // // // //       }
// // // // //       default: {
// // // // //         v = String(raw ?? "").trim().slice(0, f.max ?? (f.type === "textarea" ? 60000 : f.type === "media" ? 2000 : 600));
// // // // //         if (f.numeric) {
// // // // //           if (v === "") v = null;
// // // // //           else {
// // // // //             v = parseInt(v, 10);
// // // // //             if (Number.isNaN(v)) v = null;
// // // // //           }
// // // // //         }
// // // // //         if (f.type === "select" && f.options && v && !f.options.some((o) => o.value === v)) throw new ValidationError(`${f.label}: invalid choice.`);
// // // // //         if (f.type === "media" && v && !/^(https?:\/\/|\/)/i.test(v)) throw new ValidationError(`${f.label} must be an uploaded file or an http(s) URL.`);
// // // // //         if (f.type === "color" && v && !/^#[0-9a-f]{3,8}$/i.test(v)) throw new ValidationError(`${f.label} must be a hex colour.`);
// // // // //       }
// // // // //     }
// // // // //     if (f.required && (v === "" || v === null || v === undefined) && f.type !== "boolean") throw new ValidationError(`${f.label} is required.`);
// // // // //     out[f.name] = v;
// // // // //   }
// // // // //   return out;
// // // // // }

// // // // // export async function listRows(def: ResourceDef, cfg: Cfg, q: URLSearchParams) {
// // // // //   const table = cfg.table;
// // // // //   const page = Math.max(1, parseInt(q.get("page") || "1", 10));
// // // // //   const limit = Math.min(100, Math.max(5, parseInt(q.get("limit") || "20", 10)));
// // // // //   const conds: any[] = [];
// // // // //   const term = (q.get("q") || "").trim();
// // // // //   if (term) conds.push(or(...def.searchFields.map((c) => ilike(table[c], `%${term.replace(/[%_]/g, "\\$&")}%`))));
// // // // //   for (const f of def.filters ?? []) {
// // // // //     const v = q.get(`f_${f.name}`);
// // // // //     if (v && f.options.some((o) => o.value === v)) conds.push(eq(table[f.name], v));
// // // // //   }
// // // // //   const where = conds.length ? and(...conds) : undefined;
// // // // //   const sort = def.sort ?? { name: "id", dir: "desc" as const };
// // // // //   const order = sort.dir === "asc" ? asc(table[sort.name]) : desc(table[sort.name]);
// // // // //   const [rows, [{ c }]] = await Promise.all([
// // // // //     db.select().from(table).where(where).orderBy(order, desc(table.id)).limit(limit).offset((page - 1) * limit),
// // // // //     db.select({ c: sql<number>`count(*)` }).from(table).where(where),
// // // // //   ]);
// // // // //   return { rows: rows.map(clean), total: Number(c), page, limit };
// // // // // }

// // // // // export async function getRow(def: ResourceDef, cfg: Cfg, id: number) {
// // // // //   const [row] = await db.select().from(cfg.table).where(eq(cfg.table.id, id)).limit(1);
// // // // //   if (!row) return null;
// // // // //   const children: Record<string, any[]> = {};
// // // // //   for (const [name, c] of Object.entries(cfg.children ?? {})) {
// // // // //     const conds = [eq(c.table[c.fk], id)];
// // // // //     if (c.kind) conds.push(eq(c.table.kind, c.kind));
// // // // //     children[name] = await db.select().from(c.table).where(and(...conds)).orderBy(asc(c.table.sortOrder), asc(c.table.id));
// // // // //   }
// // // // //   return { row: clean(row), children };
// // // // // }

// // // // // async function saveChildren(def: ResourceDef, cfg: Cfg, id: number, input: Record<string, any>) {
// // // // //   for (const cd of def.children ?? []) {
// // // // //     const c = cfg.children?.[cd.name];
// // // // //     const list = input.children?.[cd.name];
// // // // //     if (!c || !Array.isArray(list)) continue;
// // // // //     const conds = [eq(c.table[c.fk], id)];
// // // // //     if (c.kind) conds.push(eq(c.table.kind, c.kind));
// // // // //     await db.delete(c.table).where(and(...conds));
// // // // //     const rows = list.slice(0, 100).flatMap((item: any, i: number) => {
// // // // //       const v = coerce(cd.fields, item ?? {}, true);
// // // // //       const first = cd.fields[0].name;
// // // // //       if (!v[first]) return [];
// // // // //       return [{ ...v, [c.fk]: id, ...(c.kind ? { kind: c.kind } : {}), sortOrder: i }];
// // // // //     });
// // // // //     if (rows.length) await db.insert(c.table).values(rows);
// // // // //   }
// // // // // }

// // // // // export async function createRow(def: ResourceDef, cfg: Cfg, input: Record<string, any>) {
// // // // //   const values = coerce(def.fields, input, true);
// // // // //   if (def.slugFrom && "slug" in cfg.table) values.slug = slugify(values.slug || values[def.slugFrom] || "");
// // // // //   if (def.slugFrom && !values.slug) throw new ValidationError("A slug could not be generated. Please enter a title or slug.");
// // // // //   const inserted = (await db.insert(cfg.table).values(values).returning()) as any[];
// // // // //   const row = inserted[0];
// // // // //   await saveChildren(def, cfg, row.id, input);
// // // // //   clearCache();
// // // // //   return clean(row);
// // // // // }

// // // // // export async function updateRow(def: ResourceDef, cfg: Cfg, id: number, input: Record<string, any>) {
// // // // //   const values = coerce(def.fields, input, false);
// // // // //   if (def.slugFrom && "slug" in values) {
// // // // //     values.slug = slugify(values.slug || input[def.slugFrom] || "");
// // // // //     if (!values.slug) delete values.slug;
// // // // //   }
// // // // //   if ("updatedAt" in cfg.table) values.updatedAt = new Date();
// // // // //   let rows: any[];
// // // // //   if (Object.keys(values).length) rows = (await db.update(cfg.table).set(values).where(eq(cfg.table.id, id)).returning()) as any[];
// // // // //   else rows = (await db.select().from(cfg.table).where(eq(cfg.table.id, id)).limit(1)) as any[];
// // // // //   const row = rows[0];
// // // // //   if (!row) return null;
// // // // //   await saveChildren(def, cfg, id, input);
// // // // //   clearCache();
// // // // //   return clean(row);
// // // // // }

// // // // // export async function deleteRow(cfg: Cfg, id: number) {
// // // // //   const res = await db.delete(cfg.table).where(eq(cfg.table.id, id)).returning({ id: cfg.table.id });
// // // // //   clearCache();
// // // // //   return res.length > 0;
// // // // // }

// // // // // export const getResource = (key: string) => {
// // // // //   const def = RESOURCES[key];
// // // // //   const cfg = TABLES[key];
// // // // //   return def && cfg ? { def, cfg } : null;
// // // // // };

// // // // // export function dbError(e: unknown): { message: string; status: number } {
// // // // //   if (e instanceof ValidationError) return { message: e.message, status: e.status };
// // // // //   const code = (e as { code?: string; cause?: { code?: string } })?.code ?? (e as { cause?: { code?: string } })?.cause?.code;
// // // // //   if (code === "23505") return { message: "That value already exists (slug, email or name must be unique).", status: 409 };
// // // // //   if (code === "23503") return { message: "This record is in use by other records and cannot be removed.", status: 409 };
// // // // //   console.error("[admin]", e);
// // // // //   return { message: "Something went wrong while saving.", status: 500 };
// // // // // }





// // // // // new code 




// // // // //src/lib/admin/crud.ts

// // // // /* eslint-disable @typescript-eslint/no-explicit-any */
// // // // import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
// // // // import { db } from "@/db";
// // // // import * as t from "@/db/schema";
// // // // import { hashPassword, passwordIssue, slugify } from "@/lib/auth";
// // // // import { clearCache } from "@/lib/data";
// // // // import { RESOURCES, type FieldDef, type ResourceDef } from "@/lib/admin/defs";
// // // // import { fetchSitePreview } from "@/lib/admin/preview";

// // // // type ChildCfg = { table: any; fk: string; kind?: string };
// // // // type Cfg = { table: any; children?: Record<string, ChildCfg>; optionLoaders?: Record<string, () => Promise<{ value: string; label: string }[]>> };

// // // // export const TABLES: Record<string, Cfg> = {
// // // //   services: { table: t.services, children: { features: { table: t.serviceFeatures, fk: "serviceId", kind: "feature" }, process: { table: t.serviceFeatures, fk: "serviceId", kind: "process" }, benefits: { table: t.serviceBenefits, fk: "serviceId" }, faqs: { table: t.serviceFaqs, fk: "serviceId" } } },
// // // //   // Client products shown in the "Our Marketplaces" carousel on the home page
// // // //   marketplaces: { table: t.marketplaces },
// // // //   news: { table: t.news, children: { images: { table: t.newsImages, fk: "newsId" } } },
// // // //   news_categories: { table: t.newsCategories },
// // // //   jobs: { table: t.jobs },
// // // //   universities: { table: t.universities },
// // // //   boards: { table: t.boards },
// // // //   qualifications: { table: t.qualifications },
// // // //   job_roles: { table: t.jobRoles },
// // // //   customers: { table: t.users },
// // // //   contacts: { table: t.contactQueries },
// // // //   seo: { table: t.seoMetadata },
// // // //   admins: { table: t.admins },
// // // // };

// // // // export async function loadOptions(from: string) {
// // // //   if (from === "news_categories") return (await db.select().from(t.newsCategories).orderBy(asc(t.newsCategories.name))).map((c) => ({ value: String(c.id), label: c.name }));
// // // //   if (from === "roles") return (await db.select().from(t.roles).orderBy(asc(t.roles.name))).map((c) => ({ value: String(c.id), label: c.name }));
// // // //   return [];
// // // // }

// // // // const STRIP = ["passwordHash"];
// // // // const clean = (row: any) => {
// // // //   const r = { ...row };
// // // //   for (const k of STRIP) delete r[k];
// // // //   return r;
// // // // };

// // // // export class ValidationError extends Error {
// // // //   status: number;
// // // //   constructor(m: string, status = 400) {
// // // //     super(m);
// // // //     this.status = status;
// // // //   }
// // // // }

// // // // /** Coerce + validate raw input against field definitions (mass-assignment safe). */
// // // // export function coerce(fields: FieldDef[], input: Record<string, any>, isNew: boolean, partial = false): Record<string, any> {
// // // //   const out: Record<string, any> = {};
// // // //   for (const f of fields) {
// // // //     if (f.readOnly && !isNew) continue;
// // // //     if (f.readOnly) continue;
// // // //     if (!(f.name in input)) {
// // // //       if (f.required && isNew && !partial && f.type !== "password") throw new ValidationError(`${f.label} is required.`);
// // // //       continue;
// // // //     }
// // // //     const raw = input[f.name];
// // // //     let v: any;
// // // //     switch (f.type) {
// // // //       case "number": {
// // // //         const n = parseInt(String(raw ?? ""), 10);
// // // //         v = Number.isNaN(n) ? 0 : n;
// // // //         break;
// // // //       }
// // // //       case "boolean":
// // // //         v = raw === true || raw === "true" || raw === 1;
// // // //         break;
// // // //       case "datetime": {
// // // //         if (!raw) v = null;
// // // //         else {
// // // //           const d = new Date(String(raw));
// // // //           if (Number.isNaN(d.getTime())) throw new ValidationError(`${f.label} is not a valid date.`);
// // // //           v = d;
// // // //         }
// // // //         break;
// // // //       }
// // // //       case "date":
// // // //         v = raw ? String(raw).slice(0, 10) : null;
// // // //         if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new ValidationError(`${f.label} is not a valid date.`);
// // // //         break;
// // // //       case "password": {
// // // //         const pw = String(raw ?? "");
// // // //         if (!pw) {
// // // //           if (isNew) throw new ValidationError("A password is required for new admins.");
// // // //           continue;
// // // //         }
// // // //         const issue = passwordIssue(pw);
// // // //         if (issue) throw new ValidationError(issue);
// // // //         out.passwordHash = hashPassword(pw);
// // // //         continue;
// // // //       }
// // // //       default: {
// // // //         v = String(raw ?? "").trim().slice(0, f.max ?? (f.type === "textarea" ? 60000 : f.type === "media" ? 2000 : 600));
// // // //         if (f.numeric) {
// // // //           if (v === "") v = null;
// // // //           else {
// // // //             v = parseInt(v, 10);
// // // //             if (Number.isNaN(v)) v = null;
// // // //           }
// // // //         }
// // // //         if (f.type === "select" && f.options && v && !f.options.some((o) => o.value === v)) throw new ValidationError(`${f.label}: invalid choice.`);
// // // //         if (f.type === "media" && v && !/^(https?:\/\/|\/)/i.test(v)) throw new ValidationError(`${f.label} must be an uploaded file or an http(s) URL.`);
// // // //         if (f.type === "color" && v && !/^#[0-9a-f]{3,8}$/i.test(v)) throw new ValidationError(`${f.label} must be a hex colour.`);
// // // //       }
// // // //     }
// // // //     if (f.required && (v === "" || v === null || v === undefined) && f.type !== "boolean") throw new ValidationError(`${f.label} is required.`);
// // // //     out[f.name] = v;
// // // //   }
// // // //   return out;
// // // // }

// // // // /**
// // // //  * Marketplaces: when a product has a website link but no cover image,
// // // //  * generate a home page screenshot once and store it as the cover image.
// // // //  * Visitors then get a normal, fast image. Clear the Cover image field to refresh it.
// // // //  */
// // // // async function autoPreview(def: ResourceDef, values: Record<string, any>) {
// // // //   if (def.key !== "marketplaces") return;
// // // //   if (!("imageUrl" in values) || values.imageUrl) return; // admin uploaded an image, or field not sent
// // // //   if (!values.linkUrl) return;
// // // //   const shot = await fetchSitePreview(String(values.linkUrl));
// // // //   if (shot) values.imageUrl = shot;
// // // // }

// // // // export async function listRows(def: ResourceDef, cfg: Cfg, q: URLSearchParams) {
// // // //   const table = cfg.table;
// // // //   const page = Math.max(1, parseInt(q.get("page") || "1", 10));
// // // //   const limit = Math.min(100, Math.max(5, parseInt(q.get("limit") || "20", 10)));
// // // //   const conds: any[] = [];
// // // //   const term = (q.get("q") || "").trim();
// // // //   if (term) conds.push(or(...def.searchFields.map((c) => ilike(table[c], `%${term.replace(/[%_]/g, "\\$&")}%`))));
// // // //   for (const f of def.filters ?? []) {
// // // //     const v = q.get(`f_${f.name}`);
// // // //     if (v && f.options.some((o) => o.value === v)) conds.push(eq(table[f.name], v));
// // // //   }
// // // //   const where = conds.length ? and(...conds) : undefined;
// // // //   const sort = def.sort ?? { name: "id", dir: "desc" as const };
// // // //   const order = sort.dir === "asc" ? asc(table[sort.name]) : desc(table[sort.name]);
// // // //   const [rows, [{ c }]] = await Promise.all([
// // // //     db.select().from(table).where(where).orderBy(order, desc(table.id)).limit(limit).offset((page - 1) * limit),
// // // //     db.select({ c: sql<number>`count(*)` }).from(table).where(where),
// // // //   ]);
// // // //   return { rows: rows.map(clean), total: Number(c), page, limit };
// // // // }

// // // // export async function getRow(def: ResourceDef, cfg: Cfg, id: number) {
// // // //   const [row] = await db.select().from(cfg.table).where(eq(cfg.table.id, id)).limit(1);
// // // //   if (!row) return null;
// // // //   const children: Record<string, any[]> = {};
// // // //   for (const [name, c] of Object.entries(cfg.children ?? {})) {
// // // //     const conds = [eq(c.table[c.fk], id)];
// // // //     if (c.kind) conds.push(eq(c.table.kind, c.kind));
// // // //     children[name] = await db.select().from(c.table).where(and(...conds)).orderBy(asc(c.table.sortOrder), asc(c.table.id));
// // // //   }
// // // //   return { row: clean(row), children };
// // // // }

// // // // async function saveChildren(def: ResourceDef, cfg: Cfg, id: number, input: Record<string, any>) {
// // // //   for (const cd of def.children ?? []) {
// // // //     const c = cfg.children?.[cd.name];
// // // //     const list = input.children?.[cd.name];
// // // //     if (!c || !Array.isArray(list)) continue;
// // // //     const conds = [eq(c.table[c.fk], id)];
// // // //     if (c.kind) conds.push(eq(c.table.kind, c.kind));
// // // //     await db.delete(c.table).where(and(...conds));
// // // //     const rows = list.slice(0, 100).flatMap((item: any, i: number) => {
// // // //       const v = coerce(cd.fields, item ?? {}, true);
// // // //       const first = cd.fields[0].name;
// // // //       if (!v[first]) return [];
// // // //       return [{ ...v, [c.fk]: id, ...(c.kind ? { kind: c.kind } : {}), sortOrder: i }];
// // // //     });
// // // //     if (rows.length) await db.insert(c.table).values(rows);
// // // //   }
// // // // }

// // // // export async function createRow(def: ResourceDef, cfg: Cfg, input: Record<string, any>) {
// // // //   const values = coerce(def.fields, input, true);
// // // //   if (def.slugFrom && "slug" in cfg.table) values.slug = slugify(values.slug || values[def.slugFrom] || "");
// // // //   if (def.slugFrom && !values.slug) throw new ValidationError("A slug could not be generated. Please enter a title or slug.");
// // // //   await autoPreview(def, values);
// // // //   const inserted = (await db.insert(cfg.table).values(values).returning()) as any[];
// // // //   const row = inserted[0];
// // // //   await saveChildren(def, cfg, row.id, input);
// // // //   clearCache();
// // // //   return clean(row);
// // // // }

// // // // export async function updateRow(def: ResourceDef, cfg: Cfg, id: number, input: Record<string, any>) {
// // // //   const values = coerce(def.fields, input, false);
// // // //   if (def.slugFrom && "slug" in values) {
// // // //     values.slug = slugify(values.slug || input[def.slugFrom] || "");
// // // //     if (!values.slug) delete values.slug;
// // // //   }
// // // //   await autoPreview(def, values);
// // // //   if ("updatedAt" in cfg.table) values.updatedAt = new Date();
// // // //   let rows: any[];
// // // //   if (Object.keys(values).length) rows = (await db.update(cfg.table).set(values).where(eq(cfg.table.id, id)).returning()) as any[];
// // // //   else rows = (await db.select().from(cfg.table).where(eq(cfg.table.id, id)).limit(1)) as any[];
// // // //   const row = rows[0];
// // // //   if (!row) return null;
// // // //   await saveChildren(def, cfg, id, input);
// // // //   clearCache();
// // // //   return clean(row);
// // // // }

// // // // export async function deleteRow(cfg: Cfg, id: number) {
// // // //   const res = await db.delete(cfg.table).where(eq(cfg.table.id, id)).returning({ id: cfg.table.id });
// // // //   clearCache();
// // // //   return res.length > 0;
// // // // }

// // // // export const getResource = (key: string) => {
// // // //   const def = RESOURCES[key];
// // // //   const cfg = TABLES[key];
// // // //   return def && cfg ? { def, cfg } : null;
// // // // };

// // // // export function dbError(e: unknown): { message: string; status: number } {
// // // //   if (e instanceof ValidationError) return { message: e.message, status: e.status };
// // // //   const code = (e as { code?: string; cause?: { code?: string } })?.code ?? (e as { cause?: { code?: string } })?.cause?.code;
// // // //   if (code === "23505") return { message: "That value already exists (slug, email or name must be unique).", status: 409 };
// // // //   if (code === "23503") return { message: "This record is in use by other records and cannot be removed.", status: 409 };
// // // //   console.error("[admin]", e);
// // // //   return { message: "Something went wrong while saving.", status: 500 };
// // // // }






// // // // new code 




// // // //src/lib/admin/crud.ts

// // // /* eslint-disable @typescript-eslint/no-explicit-any */
// // // import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
// // // import { db } from "@/db";
// // // import * as t from "@/db/schema";
// // // import { hashPassword, passwordIssue, slugify } from "@/lib/auth";
// // // import { clearCache } from "@/lib/data";
// // // import { RESOURCES, type FieldDef, type ResourceDef } from "@/lib/admin/defs";
// // // import { fetchSitePreview } from "@/lib/admin/preview";

// // // type ChildCfg = { table: any; fk: string; kind?: string };
// // // type Cfg = { table: any; children?: Record<string, ChildCfg>; optionLoaders?: Record<string, () => Promise<{ value: string; label: string }[]>> };

// // // export const TABLES: Record<string, Cfg> = {
// // //   services: { table: t.services, children: { features: { table: t.serviceFeatures, fk: "serviceId", kind: "feature" }, process: { table: t.serviceFeatures, fk: "serviceId", kind: "process" }, benefits: { table: t.serviceBenefits, fk: "serviceId" }, faqs: { table: t.serviceFaqs, fk: "serviceId" } } },
// // //   // Client products shown in the "Our Marketplaces" carousel on the home page
// // //   marketplaces: { table: t.marketplaces },
// // //   news: { table: t.news, children: { images: { table: t.newsImages, fk: "newsId" } } },
// // //   news_categories: { table: t.newsCategories },
// // //   jobs: { table: t.jobs },
// // //   universities: { table: t.universities },
// // //   boards: { table: t.boards },
// // //   qualifications: { table: t.qualifications },
// // //   job_roles: { table: t.jobRoles },
// // //   customers: { table: t.users },
// // //   contacts: { table: t.contactQueries },
// // //   seo: { table: t.seoMetadata },
// // //   admins: { table: t.admins },
// // //   // Team management (Admin + HR)
// // //   team_groups: { table: t.teamGroups },
// // //   team_members: { table: t.teamMembers },
// // // };

// // // export async function loadOptions(from: string) {
// // //   if (from === "news_categories") return (await db.select().from(t.newsCategories).orderBy(asc(t.newsCategories.name))).map((c) => ({ value: String(c.id), label: c.name }));
// // //   if (from === "roles") return (await db.select().from(t.roles).orderBy(asc(t.roles.name))).map((c) => ({ value: String(c.id), label: c.name }));
// // //   // Dropdown of groups shown in the team member form
// // //   if (from === "team_groups")
// // //     return (await db.select().from(t.teamGroups).orderBy(asc(t.teamGroups.sortOrder), asc(t.teamGroups.name))).map((g) => ({ value: String(g.id), label: g.name }));
// // //   return [];
// // // }

// // // const STRIP = ["passwordHash"];
// // // const clean = (row: any) => {
// // //   const r = { ...row };
// // //   for (const k of STRIP) delete r[k];
// // //   return r;
// // // };

// // // export class ValidationError extends Error {
// // //   status: number;
// // //   constructor(m: string, status = 400) {
// // //     super(m);
// // //     this.status = status;
// // //   }
// // // }

// // // /** Coerce + validate raw input against field definitions (mass-assignment safe). */
// // // export function coerce(fields: FieldDef[], input: Record<string, any>, isNew: boolean, partial = false): Record<string, any> {
// // //   const out: Record<string, any> = {};
// // //   for (const f of fields) {
// // //     if (f.readOnly && !isNew) continue;
// // //     if (f.readOnly) continue;
// // //     if (!(f.name in input)) {
// // //       if (f.required && isNew && !partial && f.type !== "password") throw new ValidationError(`${f.label} is required.`);
// // //       continue;
// // //     }
// // //     const raw = input[f.name];
// // //     let v: any;
// // //     switch (f.type) {
// // //       case "number": {
// // //         const n = parseInt(String(raw ?? ""), 10);
// // //         v = Number.isNaN(n) ? 0 : n;
// // //         break;
// // //       }
// // //       case "boolean":
// // //         v = raw === true || raw === "true" || raw === 1;
// // //         break;
// // //       case "datetime": {
// // //         if (!raw) v = null;
// // //         else {
// // //           const d = new Date(String(raw));
// // //           if (Number.isNaN(d.getTime())) throw new ValidationError(`${f.label} is not a valid date.`);
// // //           v = d;
// // //         }
// // //         break;
// // //       }
// // //       case "date":
// // //         v = raw ? String(raw).slice(0, 10) : null;
// // //         if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new ValidationError(`${f.label} is not a valid date.`);
// // //         break;
// // //       case "password": {
// // //         const pw = String(raw ?? "");
// // //         if (!pw) {
// // //           if (isNew) throw new ValidationError("A password is required for new admins.");
// // //           continue;
// // //         }
// // //         const issue = passwordIssue(pw);
// // //         if (issue) throw new ValidationError(issue);
// // //         out.passwordHash = hashPassword(pw);
// // //         continue;
// // //       }
// // //       default: {
// // //         v = String(raw ?? "").trim().slice(0, f.max ?? (f.type === "textarea" ? 60000 : f.type === "media" ? 2000 : 600));
// // //         if (f.numeric) {
// // //           if (v === "") v = null;
// // //           else {
// // //             v = parseInt(v, 10);
// // //             if (Number.isNaN(v)) v = null;
// // //           }
// // //         }
// // //         if (f.type === "select" && f.options && v && !f.options.some((o) => o.value === v)) throw new ValidationError(`${f.label}: invalid choice.`);
// // //         if (f.type === "media" && v && !/^(https?:\/\/|\/)/i.test(v)) throw new ValidationError(`${f.label} must be an uploaded file or an http(s) URL.`);
// // //         if (f.type === "color" && v && !/^#[0-9a-f]{3,8}$/i.test(v)) throw new ValidationError(`${f.label} must be a hex colour.`);
// // //       }
// // //     }
// // //     if (f.required && (v === "" || v === null || v === undefined) && f.type !== "boolean") throw new ValidationError(`${f.label} is required.`);
// // //     out[f.name] = v;
// // //   }
// // //   return out;
// // // }

// // // /**
// // //  * Marketplaces: when a product has a website link but no cover image,
// // //  * generate a home page screenshot once and store it as the cover image.
// // //  * Visitors then get a normal, fast image. Clear the Cover image field to refresh it.
// // //  */
// // // async function autoPreview(def: ResourceDef, values: Record<string, any>) {
// // //   if (def.key !== "marketplaces") return;
// // //   if (!("imageUrl" in values) || values.imageUrl) return; // admin uploaded an image, or field not sent
// // //   if (!values.linkUrl) return;
// // //   const shot = await fetchSitePreview(String(values.linkUrl));
// // //   if (shot) values.imageUrl = shot;
// // // }

// // // export async function listRows(def: ResourceDef, cfg: Cfg, q: URLSearchParams) {
// // //   const table = cfg.table;
// // //   const page = Math.max(1, parseInt(q.get("page") || "1", 10));
// // //   const limit = Math.min(100, Math.max(5, parseInt(q.get("limit") || "20", 10)));
// // //   const conds: any[] = [];
// // //   const term = (q.get("q") || "").trim();
// // //   if (term) conds.push(or(...def.searchFields.map((c) => ilike(table[c], `%${term.replace(/[%_]/g, "\\$&")}%`))));
// // //   for (const f of def.filters ?? []) {
// // //     const v = q.get(`f_${f.name}`);
// // //     if (v && f.options.some((o) => o.value === v)) conds.push(eq(table[f.name], v));
// // //   }
// // //   const where = conds.length ? and(...conds) : undefined;
// // //   const sort = def.sort ?? { name: "id", dir: "desc" as const };
// // //   const order = sort.dir === "asc" ? asc(table[sort.name]) : desc(table[sort.name]);
// // //   const [rows, [{ c }]] = await Promise.all([
// // //     db.select().from(table).where(where).orderBy(order, desc(table.id)).limit(limit).offset((page - 1) * limit),
// // //     db.select({ c: sql<number>`count(*)` }).from(table).where(where),
// // //   ]);
// // //   return { rows: rows.map(clean), total: Number(c), page, limit };
// // // }

// // // export async function getRow(def: ResourceDef, cfg: Cfg, id: number) {
// // //   const [row] = await db.select().from(cfg.table).where(eq(cfg.table.id, id)).limit(1);
// // //   if (!row) return null;
// // //   const children: Record<string, any[]> = {};
// // //   for (const [name, c] of Object.entries(cfg.children ?? {})) {
// // //     const conds = [eq(c.table[c.fk], id)];
// // //     if (c.kind) conds.push(eq(c.table.kind, c.kind));
// // //     children[name] = await db.select().from(c.table).where(and(...conds)).orderBy(asc(c.table.sortOrder), asc(c.table.id));
// // //   }
// // //   return { row: clean(row), children };
// // // }

// // // async function saveChildren(def: ResourceDef, cfg: Cfg, id: number, input: Record<string, any>) {
// // //   for (const cd of def.children ?? []) {
// // //     const c = cfg.children?.[cd.name];
// // //     const list = input.children?.[cd.name];
// // //     if (!c || !Array.isArray(list)) continue;
// // //     const conds = [eq(c.table[c.fk], id)];
// // //     if (c.kind) conds.push(eq(c.table.kind, c.kind));
// // //     await db.delete(c.table).where(and(...conds));
// // //     const rows = list.slice(0, 100).flatMap((item: any, i: number) => {
// // //       const v = coerce(cd.fields, item ?? {}, true);
// // //       const first = cd.fields[0].name;
// // //       if (!v[first]) return [];
// // //       return [{ ...v, [c.fk]: id, ...(c.kind ? { kind: c.kind } : {}), sortOrder: i }];
// // //     });
// // //     if (rows.length) await db.insert(c.table).values(rows);
// // //   }
// // // }

// // // export async function createRow(def: ResourceDef, cfg: Cfg, input: Record<string, any>) {
// // //   const values = coerce(def.fields, input, true);
// // //   if (def.slugFrom && "slug" in cfg.table) values.slug = slugify(values.slug || values[def.slugFrom] || "");
// // //   if (def.slugFrom && !values.slug) throw new ValidationError("A slug could not be generated. Please enter a title or slug.");
// // //   await autoPreview(def, values);
// // //   const inserted = (await db.insert(cfg.table).values(values).returning()) as any[];
// // //   const row = inserted[0];
// // //   await saveChildren(def, cfg, row.id, input);
// // //   clearCache();
// // //   return clean(row);
// // // }

// // // export async function updateRow(def: ResourceDef, cfg: Cfg, id: number, input: Record<string, any>) {
// // //   const values = coerce(def.fields, input, false);
// // //   if (def.slugFrom && "slug" in values) {
// // //     values.slug = slugify(values.slug || input[def.slugFrom] || "");
// // //     if (!values.slug) delete values.slug;
// // //   }
// // //   await autoPreview(def, values);
// // //   if ("updatedAt" in cfg.table) values.updatedAt = new Date();
// // //   let rows: any[];
// // //   if (Object.keys(values).length) rows = (await db.update(cfg.table).set(values).where(eq(cfg.table.id, id)).returning()) as any[];
// // //   else rows = (await db.select().from(cfg.table).where(eq(cfg.table.id, id)).limit(1)) as any[];
// // //   const row = rows[0];
// // //   if (!row) return null;
// // //   await saveChildren(def, cfg, id, input);
// // //   clearCache();
// // //   return clean(row);
// // // }

// // // export async function deleteRow(cfg: Cfg, id: number) {
// // //   const res = await db.delete(cfg.table).where(eq(cfg.table.id, id)).returning({ id: cfg.table.id });
// // //   clearCache();
// // //   return res.length > 0;
// // // }

// // // export const getResource = (key: string) => {
// // //   const def = RESOURCES[key];
// // //   const cfg = TABLES[key];
// // //   return def && cfg ? { def, cfg } : null;
// // // };

// // // export function dbError(e: unknown): { message: string; status: number } {
// // //   if (e instanceof ValidationError) return { message: e.message, status: e.status };
// // //   const code = (e as { code?: string; cause?: { code?: string } })?.code ?? (e as { cause?: { code?: string } })?.cause?.code;
// // //   if (code === "23505") return { message: "That value already exists (slug, email or name must be unique).", status: 409 };
// // //   if (code === "23503") return { message: "This record is in use by other records and cannot be removed.", status: 409 };
// // //   console.error("[admin]", e);
// // //   return { message: "Something went wrong while saving.", status: 500 };
// // // }






// // // new code 




// // //src/lib/admin/crud.ts

// // /* eslint-disable @typescript-eslint/no-explicit-any */
// // import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
// // import { db } from "@/db";
// // import * as t from "@/db/schema";
// // import { hashPassword, passwordIssue, slugify } from "@/lib/auth";
// // import { clearCache } from "@/lib/data";
// // import { RESOURCES, type FieldDef, type ResourceDef } from "@/lib/admin/defs";
// // import { fetchSitePreview } from "@/lib/admin/preview";

// // type ChildCfg = { table: any; fk: string; kind?: string };
// // type Cfg = { table: any; children?: Record<string, ChildCfg>; optionLoaders?: Record<string, () => Promise<{ value: string; label: string }[]>> };

// // export const TABLES: Record<string, Cfg> = {
// //   services: { table: t.services, children: { features: { table: t.serviceFeatures, fk: "serviceId", kind: "feature" }, process: { table: t.serviceFeatures, fk: "serviceId", kind: "process" }, benefits: { table: t.serviceBenefits, fk: "serviceId" }, faqs: { table: t.serviceFaqs, fk: "serviceId" } } },
// //   // Client products shown in the "Our Marketplaces" carousel on the home page
// //   marketplaces: { table: t.marketplaces },
// //   news: { table: t.news, children: { images: { table: t.newsImages, fk: "newsId" } } },
// //   news_categories: { table: t.newsCategories },
// //   jobs: { table: t.jobs },
// //   universities: { table: t.universities },
// //   boards: { table: t.boards },
// //   qualifications: { table: t.qualifications },
// //   job_roles: { table: t.jobRoles },
// //   customers: { table: t.users },
// //   contacts: { table: t.contactQueries },
// //   seo: { table: t.seoMetadata },
// //   admins: { table: t.admins },
// //   // Team management (Admin + HR)
// //   team_groups: { table: t.teamGroups },
// //   team_members: { table: t.teamMembers },
// //   // Home page sections
// //   who_we_are: { table: t.whoWeAre },
// //   gallery: { table: t.galleryItems },
// // };

// // export async function loadOptions(from: string) {
// //   if (from === "news_categories") return (await db.select().from(t.newsCategories).orderBy(asc(t.newsCategories.name))).map((c) => ({ value: String(c.id), label: c.name }));
// //   if (from === "roles") return (await db.select().from(t.roles).orderBy(asc(t.roles.name))).map((c) => ({ value: String(c.id), label: c.name }));
// //   // Dropdown of groups shown in the team member form
// //   if (from === "team_groups")
// //     return (await db.select().from(t.teamGroups).orderBy(asc(t.teamGroups.sortOrder), asc(t.teamGroups.name))).map((g) => ({ value: String(g.id), label: g.name }));
// //   return [];
// // }

// // const STRIP = ["passwordHash"];
// // const clean = (row: any) => {
// //   const r = { ...row };
// //   for (const k of STRIP) delete r[k];
// //   return r;
// // };

// // export class ValidationError extends Error {
// //   status: number;
// //   constructor(m: string, status = 400) {
// //     super(m);
// //     this.status = status;
// //   }
// // }

// // /** Coerce + validate raw input against field definitions (mass-assignment safe). */
// // export function coerce(fields: FieldDef[], input: Record<string, any>, isNew: boolean, partial = false): Record<string, any> {
// //   const out: Record<string, any> = {};
// //   for (const f of fields) {
// //     if (f.readOnly && !isNew) continue;
// //     if (f.readOnly) continue;
// //     if (!(f.name in input)) {
// //       if (f.required && isNew && !partial && f.type !== "password") throw new ValidationError(`${f.label} is required.`);
// //       continue;
// //     }
// //     const raw = input[f.name];
// //     let v: any;
// //     switch (f.type) {
// //       case "number": {
// //         const n = parseInt(String(raw ?? ""), 10);
// //         v = Number.isNaN(n) ? 0 : n;
// //         break;
// //       }
// //       case "boolean":
// //         v = raw === true || raw === "true" || raw === 1;
// //         break;
// //       case "datetime": {
// //         if (!raw) v = null;
// //         else {
// //           const d = new Date(String(raw));
// //           if (Number.isNaN(d.getTime())) throw new ValidationError(`${f.label} is not a valid date.`);
// //           v = d;
// //         }
// //         break;
// //       }
// //       case "date":
// //         v = raw ? String(raw).slice(0, 10) : null;
// //         if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new ValidationError(`${f.label} is not a valid date.`);
// //         break;
// //       case "password": {
// //         const pw = String(raw ?? "");
// //         if (!pw) {
// //           if (isNew) throw new ValidationError("A password is required for new admins.");
// //           continue;
// //         }
// //         const issue = passwordIssue(pw);
// //         if (issue) throw new ValidationError(issue);
// //         out.passwordHash = hashPassword(pw);
// //         continue;
// //       }
// //       default: {
// //         v = String(raw ?? "").trim().slice(0, f.max ?? (f.type === "textarea" ? 60000 : f.type === "media" ? 2000 : 600));
// //         if (f.numeric) {
// //           if (v === "") v = null;
// //           else {
// //             v = parseInt(v, 10);
// //             if (Number.isNaN(v)) v = null;
// //           }
// //         }
// //         if (f.type === "select" && f.options && v && !f.options.some((o) => o.value === v)) throw new ValidationError(`${f.label}: invalid choice.`);
// //         if (f.type === "media" && v && !/^(https?:\/\/|\/)/i.test(v)) throw new ValidationError(`${f.label} must be an uploaded file or an http(s) URL.`);
// //         if (f.type === "color" && v && !/^#[0-9a-f]{3,8}$/i.test(v)) throw new ValidationError(`${f.label} must be a hex colour.`);
// //       }
// //     }
// //     if (f.required && (v === "" || v === null || v === undefined) && f.type !== "boolean") throw new ValidationError(`${f.label} is required.`);
// //     out[f.name] = v;
// //   }
// //   return out;
// // }

// // /**
// //  * Marketplaces: when a product has a website link but no cover image,
// //  * generate a home page screenshot once and store it as the cover image.
// //  * Visitors then get a normal, fast image. Clear the Cover image field to refresh it.
// //  */
// // async function autoPreview(def: ResourceDef, values: Record<string, any>) {
// //   if (def.key !== "marketplaces") return;
// //   if (!("imageUrl" in values) || values.imageUrl) return; // admin uploaded an image, or field not sent
// //   if (!values.linkUrl) return;
// //   const shot = await fetchSitePreview(String(values.linkUrl));
// //   if (shot) values.imageUrl = shot;
// // }

// // export async function listRows(def: ResourceDef, cfg: Cfg, q: URLSearchParams) {
// //   const table = cfg.table;
// //   const page = Math.max(1, parseInt(q.get("page") || "1", 10));
// //   const limit = Math.min(100, Math.max(5, parseInt(q.get("limit") || "20", 10)));
// //   const conds: any[] = [];
// //   const term = (q.get("q") || "").trim();
// //   if (term) conds.push(or(...def.searchFields.map((c) => ilike(table[c], `%${term.replace(/[%_]/g, "\\$&")}%`))));
// //   for (const f of def.filters ?? []) {
// //     const v = q.get(`f_${f.name}`);
// //     if (v && f.options.some((o) => o.value === v)) conds.push(eq(table[f.name], v));
// //   }
// //   const where = conds.length ? and(...conds) : undefined;
// //   const sort = def.sort ?? { name: "id", dir: "desc" as const };
// //   const order = sort.dir === "asc" ? asc(table[sort.name]) : desc(table[sort.name]);
// //   const [rows, [{ c }]] = await Promise.all([
// //     db.select().from(table).where(where).orderBy(order, desc(table.id)).limit(limit).offset((page - 1) * limit),
// //     db.select({ c: sql<number>`count(*)` }).from(table).where(where),
// //   ]);
// //   return { rows: rows.map(clean), total: Number(c), page, limit };
// // }

// // export async function getRow(def: ResourceDef, cfg: Cfg, id: number) {
// //   const [row] = await db.select().from(cfg.table).where(eq(cfg.table.id, id)).limit(1);
// //   if (!row) return null;
// //   const children: Record<string, any[]> = {};
// //   for (const [name, c] of Object.entries(cfg.children ?? {})) {
// //     const conds = [eq(c.table[c.fk], id)];
// //     if (c.kind) conds.push(eq(c.table.kind, c.kind));
// //     children[name] = await db.select().from(c.table).where(and(...conds)).orderBy(asc(c.table.sortOrder), asc(c.table.id));
// //   }
// //   return { row: clean(row), children };
// // }

// // async function saveChildren(def: ResourceDef, cfg: Cfg, id: number, input: Record<string, any>) {
// //   for (const cd of def.children ?? []) {
// //     const c = cfg.children?.[cd.name];
// //     const list = input.children?.[cd.name];
// //     if (!c || !Array.isArray(list)) continue;
// //     const conds = [eq(c.table[c.fk], id)];
// //     if (c.kind) conds.push(eq(c.table.kind, c.kind));
// //     await db.delete(c.table).where(and(...conds));
// //     const rows = list.slice(0, 100).flatMap((item: any, i: number) => {
// //       const v = coerce(cd.fields, item ?? {}, true);
// //       const first = cd.fields[0].name;
// //       if (!v[first]) return [];
// //       return [{ ...v, [c.fk]: id, ...(c.kind ? { kind: c.kind } : {}), sortOrder: i }];
// //     });
// //     if (rows.length) await db.insert(c.table).values(rows);
// //   }
// // }

// // export async function createRow(def: ResourceDef, cfg: Cfg, input: Record<string, any>) {
// //   const values = coerce(def.fields, input, true);
// //   if (def.slugFrom && "slug" in cfg.table) values.slug = slugify(values.slug || values[def.slugFrom] || "");
// //   if (def.slugFrom && !values.slug) throw new ValidationError("A slug could not be generated. Please enter a title or slug.");
// //   await autoPreview(def, values);
// //   const inserted = (await db.insert(cfg.table).values(values).returning()) as any[];
// //   const row = inserted[0];
// //   await saveChildren(def, cfg, row.id, input);
// //   clearCache();
// //   return clean(row);
// // }

// // export async function updateRow(def: ResourceDef, cfg: Cfg, id: number, input: Record<string, any>) {
// //   const values = coerce(def.fields, input, false);
// //   if (def.slugFrom && "slug" in values) {
// //     values.slug = slugify(values.slug || input[def.slugFrom] || "");
// //     if (!values.slug) delete values.slug;
// //   }
// //   await autoPreview(def, values);
// //   if ("updatedAt" in cfg.table) values.updatedAt = new Date();
// //   let rows: any[];
// //   if (Object.keys(values).length) rows = (await db.update(cfg.table).set(values).where(eq(cfg.table.id, id)).returning()) as any[];
// //   else rows = (await db.select().from(cfg.table).where(eq(cfg.table.id, id)).limit(1)) as any[];
// //   const row = rows[0];
// //   if (!row) return null;
// //   await saveChildren(def, cfg, id, input);
// //   clearCache();
// //   return clean(row);
// // }

// // export async function deleteRow(cfg: Cfg, id: number) {
// //   const res = await db.delete(cfg.table).where(eq(cfg.table.id, id)).returning({ id: cfg.table.id });
// //   clearCache();
// //   return res.length > 0;
// // }

// // export const getResource = (key: string) => {
// //   const def = RESOURCES[key];
// //   const cfg = TABLES[key];
// //   return def && cfg ? { def, cfg } : null;
// // };

// // export function dbError(e: unknown): { message: string; status: number } {
// //   if (e instanceof ValidationError) return { message: e.message, status: e.status };
// //   const code = (e as { code?: string; cause?: { code?: string } })?.code ?? (e as { cause?: { code?: string } })?.cause?.code;
// //   if (code === "23505") return { message: "That value already exists (slug, email or name must be unique).", status: 409 };
// //   if (code === "23503") return { message: "This record is in use by other records and cannot be removed.", status: 409 };
// //   console.error("[admin]", e);
// //   return { message: "Something went wrong while saving.", status: 500 };
// // }





// // new new code 




// //src/lib/admin/crud.ts

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
// import { db } from "@/db";
// import * as t from "@/db/schema";
// import { hashPassword, passwordIssue, slugify } from "@/lib/auth";
// import { clearCache } from "@/lib/data";
// import { RESOURCES, type FieldDef, type ResourceDef } from "@/lib/admin/defs";
// import { fetchSitePreview } from "@/lib/admin/preview";

// type ChildCfg = { table: any; fk: string; kind?: string };
// type Cfg = { table: any; children?: Record<string, ChildCfg>; optionLoaders?: Record<string, () => Promise<{ value: string; label: string }[]>> };

// export const TABLES: Record<string, Cfg> = {
//   services: { table: t.services, children: { features: { table: t.serviceFeatures, fk: "serviceId", kind: "feature" }, process: { table: t.serviceFeatures, fk: "serviceId", kind: "process" }, benefits: { table: t.serviceBenefits, fk: "serviceId" }, faqs: { table: t.serviceFaqs, fk: "serviceId" } } },
//   // Client products shown in the "Our Marketplaces" carousel on the home page
//   marketplaces: { table: t.marketplaces },
//   news: { table: t.news, children: { images: { table: t.newsImages, fk: "newsId" } } },
//   news_categories: { table: t.newsCategories },
//   jobs: { table: t.jobs },
//   universities: { table: t.universities },
//   boards: { table: t.boards },
//   qualifications: { table: t.qualifications },
//   job_roles: { table: t.jobRoles },
//   customers: { table: t.users },
//   contacts: { table: t.contactQueries },
//   seo: { table: t.seoMetadata },
//   admins: { table: t.admins },
//   // Team management (Admin + HR)
//   team_groups: { table: t.teamGroups },
//   team_members: { table: t.teamMembers },
//   // Home page sections
//   who_we_are: { table: t.whoWeAre },
//   gallery: { table: t.galleryItems },
// };

// export async function loadOptions(from: string) {
//   if (from === "news_categories") return (await db.select().from(t.newsCategories).orderBy(asc(t.newsCategories.name))).map((c) => ({ value: String(c.id), label: c.name }));
//   if (from === "roles") return (await db.select().from(t.roles).orderBy(asc(t.roles.name))).map((c) => ({ value: String(c.id), label: c.name }));
//   // Dropdown of groups shown in the team member form
//   if (from === "team_groups")
//     return (await db.select().from(t.teamGroups).orderBy(asc(t.teamGroups.sortOrder), asc(t.teamGroups.name))).map((g) => ({ value: String(g.id), label: g.name }));
//   // Suggestions for the Gallery "Image group title" field: every group name already in use
//   if (from === "gallery_groups") {
//     const rows = await db.selectDistinct({ g: t.galleryItems.groupTitle }).from(t.galleryItems).orderBy(asc(t.galleryItems.groupTitle));
//     return rows
//       .map((r) => String(r.g ?? "").trim())
//       .filter(Boolean)
//       .map((g) => ({ value: g, label: g }));
//   }
//   return [];
// }

// const STRIP = ["passwordHash"];
// const clean = (row: any) => {
//   const r = { ...row };
//   for (const k of STRIP) delete r[k];
//   return r;
// };

// export class ValidationError extends Error {
//   status: number;
//   constructor(m: string, status = 400) {
//     super(m);
//     this.status = status;
//   }
// }

// /** Coerce + validate raw input against field definitions (mass-assignment safe). */
// export function coerce(fields: FieldDef[], input: Record<string, any>, isNew: boolean, partial = false): Record<string, any> {
//   const out: Record<string, any> = {};
//   for (const f of fields) {
//     if (f.readOnly && !isNew) continue;
//     if (f.readOnly) continue;
//     if (!(f.name in input)) {
//       if (f.required && isNew && !partial && f.type !== "password") throw new ValidationError(`${f.label} is required.`);
//       continue;
//     }
//     const raw = input[f.name];
//     let v: any;
//     switch (f.type) {
//       case "number": {
//         const n = parseInt(String(raw ?? ""), 10);
//         v = Number.isNaN(n) ? 0 : n;
//         break;
//       }
//       case "boolean":
//         v = raw === true || raw === "true" || raw === 1;
//         break;
//       case "datetime": {
//         if (!raw) v = null;
//         else {
//           const d = new Date(String(raw));
//           if (Number.isNaN(d.getTime())) throw new ValidationError(`${f.label} is not a valid date.`);
//           v = d;
//         }
//         break;
//       }
//       case "date":
//         v = raw ? String(raw).slice(0, 10) : null;
//         if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new ValidationError(`${f.label} is not a valid date.`);
//         break;
//       case "password": {
//         const pw = String(raw ?? "");
//         if (!pw) {
//           if (isNew) throw new ValidationError("A password is required for new admins.");
//           continue;
//         }
//         const issue = passwordIssue(pw);
//         if (issue) throw new ValidationError(issue);
//         out.passwordHash = hashPassword(pw);
//         continue;
//       }
//       default: {
//         v = String(raw ?? "").trim().slice(0, f.max ?? (f.type === "textarea" ? 60000 : f.type === "media" ? 2000 : 600));
//         if (f.numeric) {
//           if (v === "") v = null;
//           else {
//             v = parseInt(v, 10);
//             if (Number.isNaN(v)) v = null;
//           }
//         }
//         if (f.type === "select" && f.options && v && !f.options.some((o) => o.value === v)) throw new ValidationError(`${f.label}: invalid choice.`);
//         if (f.type === "media" && v && !/^(https?:\/\/|\/)/i.test(v)) throw new ValidationError(`${f.label} must be an uploaded file or an http(s) URL.`);
//         if (f.type === "color" && v && !/^#[0-9a-f]{3,8}$/i.test(v)) throw new ValidationError(`${f.label} must be a hex colour.`);
//       }
//     }
//     if (f.required && (v === "" || v === null || v === undefined) && f.type !== "boolean") throw new ValidationError(`${f.label} is required.`);
//     out[f.name] = v;
//   }
//   return out;
// }

// /**
//  * Marketplaces: when a product has a website link but no cover image,
//  * generate a home page screenshot once and store it as the cover image.
//  * Visitors then get a normal, fast image. Clear the Cover image field to refresh it.
//  */
// async function autoPreview(def: ResourceDef, values: Record<string, any>) {
//   if (def.key !== "marketplaces") return;
//   if (!("imageUrl" in values) || values.imageUrl) return; // admin uploaded an image, or field not sent
//   if (!values.linkUrl) return;
//   const shot = await fetchSitePreview(String(values.linkUrl));
//   if (shot) values.imageUrl = shot;
// }

// export async function listRows(def: ResourceDef, cfg: Cfg, q: URLSearchParams) {
//   const table = cfg.table;
//   const page = Math.max(1, parseInt(q.get("page") || "1", 10));
//   const limit = Math.min(100, Math.max(5, parseInt(q.get("limit") || "20", 10)));
//   const conds: any[] = [];
//   const term = (q.get("q") || "").trim();
//   if (term) conds.push(or(...def.searchFields.map((c) => ilike(table[c], `%${term.replace(/[%_]/g, "\\$&")}%`))));
//   for (const f of def.filters ?? []) {
//     const v = q.get(`f_${f.name}`);
//     if (v && f.options.some((o) => o.value === v)) conds.push(eq(table[f.name], v));
//   }
//   const where = conds.length ? and(...conds) : undefined;
//   const sort = def.sort ?? { name: "id", dir: "desc" as const };
//   const order = sort.dir === "asc" ? asc(table[sort.name]) : desc(table[sort.name]);
//   const [rows, [{ c }]] = await Promise.all([
//     db.select().from(table).where(where).orderBy(order, desc(table.id)).limit(limit).offset((page - 1) * limit),
//     db.select({ c: sql<number>`count(*)` }).from(table).where(where),
//   ]);
//   return { rows: rows.map(clean), total: Number(c), page, limit };
// }

// export async function getRow(def: ResourceDef, cfg: Cfg, id: number) {
//   const [row] = await db.select().from(cfg.table).where(eq(cfg.table.id, id)).limit(1);
//   if (!row) return null;
//   const children: Record<string, any[]> = {};
//   for (const [name, c] of Object.entries(cfg.children ?? {})) {
//     const conds = [eq(c.table[c.fk], id)];
//     if (c.kind) conds.push(eq(c.table.kind, c.kind));
//     children[name] = await db.select().from(c.table).where(and(...conds)).orderBy(asc(c.table.sortOrder), asc(c.table.id));
//   }
//   return { row: clean(row), children };
// }

// async function saveChildren(def: ResourceDef, cfg: Cfg, id: number, input: Record<string, any>) {
//   for (const cd of def.children ?? []) {
//     const c = cfg.children?.[cd.name];
//     const list = input.children?.[cd.name];
//     if (!c || !Array.isArray(list)) continue;
//     const conds = [eq(c.table[c.fk], id)];
//     if (c.kind) conds.push(eq(c.table.kind, c.kind));
//     await db.delete(c.table).where(and(...conds));
//     const rows = list.slice(0, 100).flatMap((item: any, i: number) => {
//       const v = coerce(cd.fields, item ?? {}, true);
//       const first = cd.fields[0].name;
//       if (!v[first]) return [];
//       return [{ ...v, [c.fk]: id, ...(c.kind ? { kind: c.kind } : {}), sortOrder: i }];
//     });
//     if (rows.length) await db.insert(c.table).values(rows);
//   }
// }

// export async function createRow(def: ResourceDef, cfg: Cfg, input: Record<string, any>) {
//   const values = coerce(def.fields, input, true);
//   if (def.slugFrom && "slug" in cfg.table) values.slug = slugify(values.slug || values[def.slugFrom] || "");
//   if (def.slugFrom && !values.slug) throw new ValidationError("A slug could not be generated. Please enter a title or slug.");
//   await autoPreview(def, values);
//   const inserted = (await db.insert(cfg.table).values(values).returning()) as any[];
//   const row = inserted[0];
//   await saveChildren(def, cfg, row.id, input);
//   clearCache();
//   return clean(row);
// }

// export async function updateRow(def: ResourceDef, cfg: Cfg, id: number, input: Record<string, any>) {
//   const values = coerce(def.fields, input, false);
//   if (def.slugFrom && "slug" in values) {
//     values.slug = slugify(values.slug || input[def.slugFrom] || "");
//     if (!values.slug) delete values.slug;
//   }
//   await autoPreview(def, values);
//   if ("updatedAt" in cfg.table) values.updatedAt = new Date();
//   let rows: any[];
//   if (Object.keys(values).length) rows = (await db.update(cfg.table).set(values).where(eq(cfg.table.id, id)).returning()) as any[];
//   else rows = (await db.select().from(cfg.table).where(eq(cfg.table.id, id)).limit(1)) as any[];
//   const row = rows[0];
//   if (!row) return null;
//   await saveChildren(def, cfg, id, input);
//   clearCache();
//   return clean(row);
// }

// export async function deleteRow(cfg: Cfg, id: number) {
//   const res = await db.delete(cfg.table).where(eq(cfg.table.id, id)).returning({ id: cfg.table.id });
//   clearCache();
//   return res.length > 0;
// }

// export const getResource = (key: string) => {
//   const def = RESOURCES[key];
//   const cfg = TABLES[key];
//   return def && cfg ? { def, cfg } : null;
// };

// export function dbError(e: unknown): { message: string; status: number } {
//   if (e instanceof ValidationError) return { message: e.message, status: e.status };
//   const code = (e as { code?: string; cause?: { code?: string } })?.code ?? (e as { cause?: { code?: string } })?.cause?.code;
//   if (code === "23505") return { message: "That value already exists (slug, email or name must be unique).", status: 409 };
//   if (code === "23503") return { message: "This record is in use by other records and cannot be removed.", status: 409 };
//   console.error("[admin]", e);
//   return { message: "Something went wrong while saving.", status: 500 };
// }







// new code 




//src/lib/admin/crud.ts

/* eslint-disable @typescript-eslint/no-explicit-any */
import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import * as t from "@/db/schema";
import { hashPassword, passwordIssue, slugify } from "@/lib/auth";
import { clearCache } from "@/lib/data";
import { RESOURCES, type FieldDef, type ResourceDef } from "@/lib/admin/defs";
import { fetchSitePreview } from "@/lib/admin/preview";

type ChildCfg = { table: any; fk: string; kind?: string };
type Cfg = { table: any; children?: Record<string, ChildCfg>; optionLoaders?: Record<string, () => Promise<{ value: string; label: string }[]>> };

export const TABLES: Record<string, Cfg> = {
  services: { table: t.services, children: { features: { table: t.serviceFeatures, fk: "serviceId", kind: "feature" }, process: { table: t.serviceFeatures, fk: "serviceId", kind: "process" }, benefits: { table: t.serviceBenefits, fk: "serviceId" }, faqs: { table: t.serviceFaqs, fk: "serviceId" } } },
  // Client products shown in the "Our Marketplaces" carousel on the home page
  marketplaces: { table: t.marketplaces },
  news: { table: t.news, children: { images: { table: t.newsImages, fk: "newsId" } } },
  news_categories: { table: t.newsCategories },
  jobs: { table: t.jobs },
  universities: { table: t.universities },
  boards: { table: t.boards },
  qualifications: { table: t.qualifications },
  job_roles: { table: t.jobRoles },
  customers: { table: t.users },
  contacts: { table: t.contactQueries },
  seo: { table: t.seoMetadata },
  admins: { table: t.admins },
  // Team management (Admin + HR)
  team_groups: { table: t.teamGroups },
  team_members: { table: t.teamMembers },
  // Home page sections
  who_we_are: { table: t.whoWeAre },
  gallery: { table: t.galleryItems },
  sophos_section: { table: t.sophosSection },
  sophos_products: { table: t.sophosProducts },
};

export async function loadOptions(from: string) {
  if (from === "news_categories") return (await db.select().from(t.newsCategories).orderBy(asc(t.newsCategories.name))).map((c) => ({ value: String(c.id), label: c.name }));
  if (from === "roles") return (await db.select().from(t.roles).orderBy(asc(t.roles.name))).map((c) => ({ value: String(c.id), label: c.name }));
  // Dropdown of groups shown in the team member form
  if (from === "team_groups")
    return (await db.select().from(t.teamGroups).orderBy(asc(t.teamGroups.sortOrder), asc(t.teamGroups.name))).map((g) => ({ value: String(g.id), label: g.name }));
  // Suggestions for the Gallery "Image group title" field: every group name already in use
  if (from === "gallery_groups") {
    const rows = await db.selectDistinct({ g: t.galleryItems.groupTitle }).from(t.galleryItems).orderBy(asc(t.galleryItems.groupTitle));
    return rows
      .map((r) => String(r.g ?? "").trim())
      .filter(Boolean)
      .map((g) => ({ value: g, label: g }));
  }
  return [];
}

const STRIP = ["passwordHash"];
const clean = (row: any) => {
  const r = { ...row };
  for (const k of STRIP) delete r[k];
  return r;
};

export class ValidationError extends Error {
  status: number;
  constructor(m: string, status = 400) {
    super(m);
    this.status = status;
  }
}

/** Coerce + validate raw input against field definitions (mass-assignment safe). */
export function coerce(fields: FieldDef[], input: Record<string, any>, isNew: boolean, partial = false): Record<string, any> {
  const out: Record<string, any> = {};
  for (const f of fields) {
    if (f.readOnly && !isNew) continue;
    if (f.readOnly) continue;
    if (!(f.name in input)) {
      if (f.required && isNew && !partial && f.type !== "password") throw new ValidationError(`${f.label} is required.`);
      continue;
    }
    const raw = input[f.name];
    let v: any;
    switch (f.type) {
      case "number": {
        const n = parseInt(String(raw ?? ""), 10);
        v = Number.isNaN(n) ? 0 : n;
        break;
      }
      case "boolean":
        v = raw === true || raw === "true" || raw === 1;
        break;
      case "datetime": {
        if (!raw) v = null;
        else {
          const d = new Date(String(raw));
          if (Number.isNaN(d.getTime())) throw new ValidationError(`${f.label} is not a valid date.`);
          v = d;
        }
        break;
      }
      case "date":
        v = raw ? String(raw).slice(0, 10) : null;
        if (v && !/^\d{4}-\d{2}-\d{2}$/.test(v)) throw new ValidationError(`${f.label} is not a valid date.`);
        break;
      case "password": {
        const pw = String(raw ?? "");
        if (!pw) {
          if (isNew) throw new ValidationError("A password is required for new admins.");
          continue;
        }
        const issue = passwordIssue(pw);
        if (issue) throw new ValidationError(issue);
        out.passwordHash = hashPassword(pw);
        continue;
      }
      default: {
        v = String(raw ?? "").trim().slice(0, f.max ?? (f.type === "textarea" ? 60000 : f.type === "media" ? 2000 : 600));
        if (f.numeric) {
          if (v === "") v = null;
          else {
            v = parseInt(v, 10);
            if (Number.isNaN(v)) v = null;
          }
        }
        if (f.type === "select" && f.options && v && !f.options.some((o) => o.value === v)) throw new ValidationError(`${f.label}: invalid choice.`);
        if (f.type === "media" && v && !/^(https?:\/\/|\/)/i.test(v)) throw new ValidationError(`${f.label} must be an uploaded file or an http(s) URL.`);
        if (f.type === "color" && v && !/^#[0-9a-f]{3,8}$/i.test(v)) throw new ValidationError(`${f.label} must be a hex colour.`);
      }
    }
    if (f.required && (v === "" || v === null || v === undefined) && f.type !== "boolean") throw new ValidationError(`${f.label} is required.`);
    out[f.name] = v;
  }
  return out;
}

/**
 * Marketplaces: when a product has a website link but no cover image,
 * generate a home page screenshot once and store it as the cover image.
 * Visitors then get a normal, fast image. Clear the Cover image field to refresh it.
 */
async function autoPreview(def: ResourceDef, values: Record<string, any>) {
  if (def.key !== "marketplaces") return;
  if (!("imageUrl" in values) || values.imageUrl) return; // admin uploaded an image, or field not sent
  if (!values.linkUrl) return;
  const shot = await fetchSitePreview(String(values.linkUrl));
  if (shot) values.imageUrl = shot;
}

export async function listRows(def: ResourceDef, cfg: Cfg, q: URLSearchParams) {
  const table = cfg.table;
  const page = Math.max(1, parseInt(q.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(5, parseInt(q.get("limit") || "20", 10)));
  const conds: any[] = [];
  const term = (q.get("q") || "").trim();
  if (term) conds.push(or(...def.searchFields.map((c) => ilike(table[c], `%${term.replace(/[%_]/g, "\\$&")}%`))));
  for (const f of def.filters ?? []) {
    const v = q.get(`f_${f.name}`);
    if (v && f.options.some((o) => o.value === v)) conds.push(eq(table[f.name], v));
  }
  const where = conds.length ? and(...conds) : undefined;
  const sort = def.sort ?? { name: "id", dir: "desc" as const };
  const order = sort.dir === "asc" ? asc(table[sort.name]) : desc(table[sort.name]);
  const [rows, [{ c }]] = await Promise.all([
    db.select().from(table).where(where).orderBy(order, desc(table.id)).limit(limit).offset((page - 1) * limit),
    db.select({ c: sql<number>`count(*)` }).from(table).where(where),
  ]);
  return { rows: rows.map(clean), total: Number(c), page, limit };
}

export async function getRow(def: ResourceDef, cfg: Cfg, id: number) {
  const [row] = await db.select().from(cfg.table).where(eq(cfg.table.id, id)).limit(1);
  if (!row) return null;
  const children: Record<string, any[]> = {};
  for (const [name, c] of Object.entries(cfg.children ?? {})) {
    const conds = [eq(c.table[c.fk], id)];
    if (c.kind) conds.push(eq(c.table.kind, c.kind));
    children[name] = await db.select().from(c.table).where(and(...conds)).orderBy(asc(c.table.sortOrder), asc(c.table.id));
  }
  return { row: clean(row), children };
}

async function saveChildren(def: ResourceDef, cfg: Cfg, id: number, input: Record<string, any>) {
  for (const cd of def.children ?? []) {
    const c = cfg.children?.[cd.name];
    const list = input.children?.[cd.name];
    if (!c || !Array.isArray(list)) continue;
    const conds = [eq(c.table[c.fk], id)];
    if (c.kind) conds.push(eq(c.table.kind, c.kind));
    await db.delete(c.table).where(and(...conds));
    const rows = list.slice(0, 100).flatMap((item: any, i: number) => {
      const v = coerce(cd.fields, item ?? {}, true);
      const first = cd.fields[0].name;
      if (!v[first]) return [];
      return [{ ...v, [c.fk]: id, ...(c.kind ? { kind: c.kind } : {}), sortOrder: i }];
    });
    if (rows.length) await db.insert(c.table).values(rows);
  }
}

export async function createRow(def: ResourceDef, cfg: Cfg, input: Record<string, any>) {
  const values = coerce(def.fields, input, true);
  if (def.slugFrom && "slug" in cfg.table) values.slug = slugify(values.slug || values[def.slugFrom] || "");
  if (def.slugFrom && !values.slug) throw new ValidationError("A slug could not be generated. Please enter a title or slug.");
  await autoPreview(def, values);
  const inserted = (await db.insert(cfg.table).values(values).returning()) as any[];
  const row = inserted[0];
  await saveChildren(def, cfg, row.id, input);
  clearCache();
  return clean(row);
}

export async function updateRow(def: ResourceDef, cfg: Cfg, id: number, input: Record<string, any>) {
  const values = coerce(def.fields, input, false);
  if (def.slugFrom && "slug" in values) {
    values.slug = slugify(values.slug || input[def.slugFrom] || "");
    if (!values.slug) delete values.slug;
  }
  await autoPreview(def, values);
  if ("updatedAt" in cfg.table) values.updatedAt = new Date();
  let rows: any[];
  if (Object.keys(values).length) rows = (await db.update(cfg.table).set(values).where(eq(cfg.table.id, id)).returning()) as any[];
  else rows = (await db.select().from(cfg.table).where(eq(cfg.table.id, id)).limit(1)) as any[];
  const row = rows[0];
  if (!row) return null;
  await saveChildren(def, cfg, id, input);
  clearCache();
  return clean(row);
}

export async function deleteRow(cfg: Cfg, id: number) {
  const res = await db.delete(cfg.table).where(eq(cfg.table.id, id)).returning({ id: cfg.table.id });
  clearCache();
  return res.length > 0;
}

export const getResource = (key: string) => {
  const def = RESOURCES[key];
  const cfg = TABLES[key];
  return def && cfg ? { def, cfg } : null;
};

export function dbError(e: unknown): { message: string; status: number } {
  if (e instanceof ValidationError) return { message: e.message, status: e.status };
  const code = (e as { code?: string; cause?: { code?: string } })?.code ?? (e as { cause?: { code?: string } })?.cause?.code;
  if (code === "23505") return { message: "That value already exists (slug, email or name must be unique).", status: 409 };
  if (code === "23503") return { message: "This record is in use by other records and cannot be removed.", status: 409 };
  console.error("[admin]", e);
  return { message: "Something went wrong while saving.", status: 500 };
}
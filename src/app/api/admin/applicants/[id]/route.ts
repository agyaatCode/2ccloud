import fs from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { applicantDocuments, applicantEducation, jobApplications, jobs } from "@/db/schema";
import { audit, fail, guardAdmin, json, str } from "@/lib/auth";
import { APPLICANT_STATUSES } from "@/lib/admin/defs";
import { PRIVATE_DOCS } from "@/lib/files";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: Ctx) {
  const g = await guardAdmin(req, "applicants.manage");
  if ("error" in g) return g.error;
  const id = parseInt((await params).id, 10);
  const [app] = await db.select().from(jobApplications).where(eq(jobApplications.id, id)).limit(1);
  if (!app) return fail("Not found.", 404);
  const [education, documents, job] = await Promise.all([
    db.select().from(applicantEducation).where(eq(applicantEducation.applicationId, id)),
    db.select({ id: applicantDocuments.id, docType: applicantDocuments.docType, originalName: applicantDocuments.originalName, mimeType: applicantDocuments.mimeType, size: applicantDocuments.size }).from(applicantDocuments).where(eq(applicantDocuments.applicationId, id)),
    app.jobId ? db.select({ title: jobs.title }).from(jobs).where(eq(jobs.id, app.jobId)).limit(1) : Promise.resolve([]),
  ]);
  return json({ ok: true, application: app, education, documents, jobTitle: job[0]?.title ?? "" });
}

export async function PATCH(req: Request, { params }: Ctx) {
  const g = await guardAdmin(req, "applicants.manage");
  if ("error" in g) return g.error;
  const id = parseInt((await params).id, 10);
  const b = await req.json().catch(() => null);
  const set: Record<string, unknown> = { updatedAt: new Date() };
  if (b && "status" in b) {
    if (!(APPLICANT_STATUSES as readonly string[]).includes(b.status)) return fail("Invalid status.");
    set.status = b.status;
  }
  if (b && "notes" in b) set.notes = str(b.notes, 10000);
  const [row] = await db.update(jobApplications).set(set).where(eq(jobApplications.id, id)).returning({ id: jobApplications.id, ref: jobApplications.referenceNo });
  if (!row) return fail("Not found.", 404);
  await audit({ id: g.admin.id, name: g.admin.name }, "applicant.update", "job_application", id, `${row.ref} ${set.status ?? "notes"}`, req);
  return json({ ok: true });
}

export async function DELETE(req: Request, { params }: Ctx) {
  const g = await guardAdmin(req, "applicants.manage");
  if ("error" in g) return g.error;
  const id = parseInt((await params).id, 10);
  const [row] = await db.delete(jobApplications).where(eq(jobApplications.id, id)).returning({ ref: jobApplications.referenceNo });
  if (!row) return fail("Not found.", 404);
  await fs.rm(path.join(PRIVATE_DOCS, String(id)), { recursive: true, force: true }).catch(() => {});
  await audit({ id: g.admin.id, name: g.admin.name }, "applicant.delete", "job_application", id, row.ref, req);
  return json({ ok: true });
}

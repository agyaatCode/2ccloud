import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { jobApplications, jobs } from "@/db/schema";
import { fail, guardAdmin, json } from "@/lib/auth";
import { APPLICANT_STATUSES } from "@/lib/admin/defs";

export async function GET(req: Request) {
  const g = await guardAdmin(req, "applicants.manage");
  if ("error" in g) return g.error;
  const q = new URL(req.url).searchParams;
  const page = Math.max(1, parseInt(q.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(5, parseInt(q.get("limit") || "20", 10)));
  const conds = [];
  const term = (q.get("q") || "").trim();
  if (term) {
    const l = `%${term}%`;
    conds.push(or(ilike(jobApplications.fullName, l), ilike(jobApplications.email, l), ilike(jobApplications.mobile, l), ilike(jobApplications.referenceNo, l), ilike(jobApplications.roleName, l), ilike(jobApplications.city, l)));
  }
  const status = q.get("status");
  if (status && (APPLICANT_STATUSES as readonly string[]).includes(status)) conds.push(eq(jobApplications.status, status));
  const jobId = parseInt(q.get("jobId") || "", 10);
  if (jobId) conds.push(eq(jobApplications.jobId, jobId));
  const where = conds.length ? and(...conds) : undefined;
  const [rows, [{ c }], jobList] = await Promise.all([
    db.select({
      id: jobApplications.id, referenceNo: jobApplications.referenceNo, fullName: jobApplications.fullName, email: jobApplications.email, mobile: jobApplications.mobile,
      roleName: jobApplications.roleName, roleOther: jobApplications.roleOther, status: jobApplications.status, city: jobApplications.city, highestQualification: jobApplications.highestQualification,
      createdAt: jobApplications.createdAt, jobTitle: jobs.title,
    }).from(jobApplications).leftJoin(jobs, eq(jobs.id, jobApplications.jobId)).where(where).orderBy(desc(jobApplications.createdAt)).limit(limit).offset((page - 1) * limit),
    db.select({ c: sql<number>`count(*)` }).from(jobApplications).where(where),
    db.select({ id: jobs.id, title: jobs.title }).from(jobs).orderBy(jobs.title),
  ]);
  if (!rows) return fail("Failed.", 500);
  return json({ ok: true, rows, total: Number(c), page, limit, jobs: jobList });
}

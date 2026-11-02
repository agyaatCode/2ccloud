"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client";
import { APPLICANT_STATUSES, statusLabel } from "@/lib/admin/defs";
import { fmtSize } from "@/components/admin/fields";

type Row = { id: number; referenceNo: string; fullName: string; email: string; mobile: string; roleName: string; roleOther: string; status: string; city: string; highestQualification: string; createdAt: string; jobTitle: string | null };
type Detail = {
  application: Record<string, string | number | null>;
  education: { id: number; level: string; institution: string; year: string; score: string }[];
  documents: { id: number; docType: string; originalName: string; mimeType: string; size: number }[];
  jobTitle: string;
};
const tone = (s: string) => (s === "selected" ? "ok" : s === "rejected" ? "crit" : s === "shortlisted" || s === "interview" ? "info" : s === "on_hold" ? "warn" : "");
const LEVEL: Record<string, string> = { matric: "Matric", intermediate: "Intermediate", diploma: "Diploma", graduation: "Graduation", postgraduation: "Post Graduation", phd: "PhD" };

export function ApplicantsManager() {
  const [rows, setRows] = useState<Row[]>([]);
  const [jobs, setJobs] = useState<{ id: number; title: string }[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [jobId, setJobId] = useState("");
  const [d, setD] = useState<Detail | null>(null);
  const [notes, setNotes] = useState("");
  const [mail, setMail] = useState({ subject: "", message: "" });
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    const r = await api<{ rows: Row[]; total: number; jobs: { id: number; title: string }[] }>(`/api/admin/applicants?page=${page}&q=${encodeURIComponent(q)}&status=${status}&jobId=${jobId}`);
    if (r.ok) { setRows(r.rows as Row[]); setTotal(r.total as number); setJobs(r.jobs as { id: number; title: string }[]); }
  }, [page, q, status, jobId]);
  useEffect(() => { const t = setTimeout(load, 180); return () => clearTimeout(t); }, [load]);

  async function open(id: number) {
    setMsg(null);
    const r = await api<Detail>(`/api/admin/applicants/${id}`);
    if (r.ok) { setD(r as unknown as Detail); setNotes(String((r as unknown as Detail).application.notes ?? "")); setMail({ subject: "", message: "" }); }
  }
  async function patch(body: Record<string, string>) {
    if (!d) return;
    const r = await api(`/api/admin/applicants/${d.application.id}`, { method: "PATCH", json: body });
    setMsg(r.ok ? { kind: "ok", text: "Updated." } : { kind: "err", text: r.error || "Failed." });
    if (r.ok) { if (body.status) setD({ ...d, application: { ...d.application, status: body.status } }); load(); }
  }
  async function sendMail() {
    if (!d) return;
    const r = await api(`/api/admin/applicants/${d.application.id}/email`, { json: mail });
    setMsg(r.ok ? { kind: "ok", text: "Email sent (or logged if SMTP is not configured)." } : { kind: "err", text: r.error || "Failed." });
    if (r.ok) setMail({ subject: "", message: "" });
  }
  async function del() {
    if (!d || !confirm("Delete this application and all uploaded documents permanently?")) return;
    const r = await api(`/api/admin/applicants/${d.application.id}`, { method: "DELETE" });
    if (r.ok) { setD(null); load(); } else setMsg({ kind: "err", text: r.error || "Failed." });
  }
  const pages = Math.max(1, Math.ceil(total / 20));
  const a = d?.application;

  if (d && a) {
    const field = (l: string, v: unknown) => <div><dt className="a-label">{l}</dt><dd className="mb-2">{String(v ?? "") || "—"}</dd></div>;
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button className="a-btn" onClick={() => setD(null)}>← Applicants</button>
          <h1 className="text-lg font-bold">{String(a.fullName)}</h1><code className="text-[12px] text-slate-500">{String(a.referenceNo)}</code>
          <div className="ml-auto flex items-center gap-2">
            <label className="sr-only" htmlFor="st">Status</label>
            <select id="st" className="a-input !w-44" value={String(a.status)} onChange={(e) => patch({ status: e.target.value })}>{APPLICANT_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}</select>
            <button className="a-btn a-btn-danger" onClick={del}>Delete</button>
          </div>
        </div>
        {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-4 rounded border px-3 py-2 text-[13px] font-semibold ${msg.kind === "err" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{msg.text}</p>}
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            <div className="a-card p-5"><h2 className="mb-3 text-sm font-bold">Applicant</h2>
              <dl className="grid gap-x-6 sm:grid-cols-2">
                {field("Role applied for", a.roleName === "Other" ? `Other: ${a.roleOther}` : a.roleName)}{field("Job posting", d.jobTitle || "General application")}
                {field("Email", a.email)}{field("Mobile", a.mobile)}{field("Father's name", a.fatherName)}{field("Date of birth", a.dob)}{field("Gender", a.gender)}
                {field("Address", `${a.address}, ${a.city}, ${a.state}, ${a.country} – ${a.pin}`)}
                {field("Highest qualification", a.highestQualification === "Other" ? `Other: ${a.qualificationOther}` : a.highestQualification)}{field("Applied on", new Date(String(a.createdAt)).toLocaleString("en-GB"))}
              </dl>
            </div>
            <div className="a-card p-5"><h2 className="mb-3 text-sm font-bold">Education</h2>
              {d.education.length === 0 ? <p className="text-slate-500">No education details supplied.</p> : (
                <table className="a-table"><thead><tr><th>Level</th><th>Board / institution</th><th>Year</th><th>Score</th></tr></thead><tbody>{d.education.map((e) => <tr key={e.id}><td>{LEVEL[e.level] ?? e.level}</td><td>{e.institution}</td><td>{e.year || "—"}</td><td>{e.score || "—"}</td></tr>)}</tbody></table>
              )}
            </div>
            <div className="a-card p-5"><h2 className="mb-3 text-sm font-bold">Documents</h2>
              <ul className="divide-y divide-slate-200">
                {d.documents.map((x) => (
                  <li key={x.id} className="flex flex-wrap items-center gap-3 py-2.5"><span className="a-pill info">{x.docType}</span><span className="min-w-0 flex-1 truncate">{x.originalName}</span><span className="text-[12px] text-slate-500">{fmtSize(x.size)}</span>
                    {["application/pdf", "image/jpeg", "image/png"].includes(x.mimeType) && <a className="a-btn" target="_blank" rel="noreferrer" href={`/api/admin/applicants/${a.id}/documents/${x.id}?inline=1`}>View</a>}
                    <a className="a-btn" href={`/api/admin/applicants/${a.id}/documents/${x.id}`}>Download</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-5">
            <div className="a-card p-5"><h2 className="mb-2 text-sm font-bold">Internal notes</h2><textarea className="a-input" rows={6} value={notes} aria-label="Notes" onChange={(e) => setNotes(e.target.value)} /><button className="a-btn a-btn-primary mt-2" onClick={() => patch({ notes })}>Save notes</button></div>
            <div className="a-card p-5"><h2 className="mb-2 text-sm font-bold">Email applicant</h2>
              <label className="a-label" htmlFor="ms">Subject</label><input id="ms" className="a-input mb-2" value={mail.subject} onChange={(e) => setMail({ ...mail, subject: e.target.value })} />
              <label className="a-label" htmlFor="mm">Message</label><textarea id="mm" className="a-input" rows={5} value={mail.message} onChange={(e) => setMail({ ...mail, message: e.target.value })} />
              <button className="a-btn a-btn-primary mt-2" onClick={sendMail}>Send email</button><p className="a-help">Sent to {String(a.email)}.</p></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold">Applicants</h1><span className="a-pill">{total}</span>
        <div className="ml-auto flex flex-wrap gap-2">
          <input className="a-input !w-56" placeholder="Search name, email, ref…" aria-label="Search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          <select className="a-input !w-40" aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}><option value="">All statuses</option>{APPLICANT_STATUSES.map((s) => <option key={s} value={s}>{statusLabel(s)}</option>)}</select>
          <select className="a-input !w-48" aria-label="Job" value={jobId} onChange={(e) => { setJobId(e.target.value); setPage(1); }}><option value="">All jobs</option>{jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}</select>
        </div>
      </div>
      <div className="a-card admin-scroll overflow-x-auto">
        <table className="a-table">
          <thead><tr><th>Applicant</th><th>Role</th><th>Qualification</th><th>City</th><th>Status</th><th>Applied</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="cursor-pointer" onClick={() => open(r.id)}>
                <td><button className="text-left" onClick={(e) => { e.stopPropagation(); open(r.id); }}><span className="block font-semibold">{r.fullName}</span><span className="text-[12px] text-slate-500">{r.email} · {r.mobile}</span></button></td>
                <td>{r.roleName === "Other" ? r.roleOther : r.roleName}{r.jobTitle ? <span className="block text-[12px] text-slate-500">{r.jobTitle}</span> : null}</td>
                <td>{r.highestQualification}</td><td>{r.city}</td>
                <td><span className={`a-pill ${tone(r.status)}`}>{statusLabel(r.status)}</span></td>
                <td className="whitespace-nowrap">{new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="py-10 text-center text-slate-500">No applications found.</td></tr>}
          </tbody>
        </table>
      </div>
      {pages > 1 && <div className="mt-4 flex items-center justify-between text-[13px]"><span className="text-slate-500">Page {page} of {pages}</span><div className="flex gap-2"><button className="a-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><button className="a-btn" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button></div></div>}
    </div>
  );
}

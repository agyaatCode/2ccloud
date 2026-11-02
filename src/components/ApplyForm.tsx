"use client";
import { useMemo, useState, type FormEvent } from "react";
import { api } from "@/lib/client";
import { Alert, Field } from "@/components/forms";

type Masters = { universities: string[]; boards: string[]; qualifications: string[]; roles: string[] };
type Props = { masters: Masters; job?: { id: number; title: string } | null };

const LEVELS = [
  { key: "matric", label: "Matric board", field: "Board", order: 1, list: "boards" },
  { key: "intermediate", label: "Intermediate board", field: "Board", order: 2, list: "boards" },
  { key: "diploma", label: "Diploma institution", field: "Institution", order: 2.5, list: "" },
  { key: "graduation", label: "Graduation university", field: "University", order: 3, list: "universities" },
  { key: "postgraduation", label: "Post graduation university", field: "University", order: 4, list: "universities" },
  { key: "phd", label: "PhD university", field: "University", order: 5, list: "universities" },
] as const;

function orderOf(q: string): number {
  const s = q.toLowerCase();
  if (s.includes("phd")) return 5;
  if (s.includes("post")) return 4;
  if (s.includes("graduation")) return 3;
  if (s.includes("diploma")) return 2.5;
  if (s.includes("inter")) return 2;
  if (s.includes("matric")) return 1;
  return 99; // Other / unknown → show everything
}

const MAX = 5 * 1024 * 1024;

export function ApplyForm({ masters, job }: Props) {
  const [qual, setQual] = useState("");
  const [role, setRole] = useState(() => (job ? (masters.roles.find((r) => r.toLowerCase() === job.title.toLowerCase()) ?? "Other") : ""));
  const [state, setState] = useState<{ busy: boolean; error?: string; ref?: string }>({ busy: false });
  const max = orderOf(qual);
  const levels = useMemo(() => LEVELS.filter((l) => qual && (l.order <= max || l.key === "diploma")), [qual, max]);
  const roles = masters.roles.includes("Other") ? masters.roles : [...masters.roles, "Other"];
  const quals = masters.qualifications.includes("Other") ? masters.qualifications : [...masters.qualifications, "Other"];

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    for (const k of ["cv", "marksheet"]) {
      const f = fd.get(k);
      if (!(f instanceof File) || f.size === 0) return setState({ busy: false, error: k === "cv" ? "Please attach your CV." : "Please attach your highest qualification marksheet." });
    }
    for (const [k, v] of fd.entries()) if (v instanceof File && v.size > MAX) return setState({ busy: false, error: `${v.name} is larger than 5 MB.` });
    if (job) fd.set("jobId", String(job.id));
    setState({ busy: true });
    const r = await api<{ reference?: string }>("/api/applications", { form: fd });
    if (r.ok) {
      setState({ busy: false, ref: r.reference });
      form.reset();
    } else setState({ busy: false, error: r.error });
  }

  if (state.ref)
    return (
      <Alert kind="ok">
        <strong>Application submitted.</strong> Your reference number is <span className="font-mono font-semibold">{state.ref}</span>. A confirmation has been sent to your email; our HR team will review your application and contact you.
      </Alert>
    );

  return (
    <form onSubmit={onSubmit} className="space-y-10" encType="multipart/form-data">
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="eyebrow mb-4">Personal details</legend>
        <Field label="Full name" id="a-name" required><input id="a-name" name="fullName" className="input" required maxLength={140} autoComplete="name" /></Field>
        <Field label="Father's name" id="a-father" required><input id="a-father" name="fatherName" className="input" required maxLength={140} /></Field>
        <Field label="Email" id="a-email" required><input id="a-email" name="email" type="email" className="input" required autoComplete="email" /></Field>
        <Field label="Mobile" id="a-mobile" required><input id="a-mobile" name="mobile" type="tel" className="input" required maxLength={30} autoComplete="tel" /></Field>
        <Field label="Date of birth" id="a-dob" required><input id="a-dob" name="dob" type="date" className="input" required max={new Date().toISOString().slice(0, 10)} autoComplete="bday" /></Field>
        <Field label="Gender" id="a-gender" required>
          <select id="a-gender" name="gender" className="input" required defaultValue=""><option value="" disabled>Select…</option><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to say</option></select>
        </Field>
        <Field label="Address" id="a-address" required className="sm:col-span-2"><textarea id="a-address" name="address" className="input !min-h-[84px]" required maxLength={500} autoComplete="street-address" /></Field>
        <Field label="City" id="a-city" required><input id="a-city" name="city" className="input" required maxLength={80} autoComplete="address-level2" /></Field>
        <Field label="State" id="a-state" required><input id="a-state" name="state" className="input" required maxLength={80} autoComplete="address-level1" /></Field>
        <Field label="Country" id="a-country" required><input id="a-country" name="country" className="input" required maxLength={80} defaultValue="India" autoComplete="country-name" /></Field>
        <Field label="PIN / postal code" id="a-pin" required><input id="a-pin" name="pin" className="input" required maxLength={12} autoComplete="postal-code" /></Field>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="eyebrow mb-4">Education</legend>
        <Field label="Highest qualification" id="a-qual" required>
          <select id="a-qual" name="highestQualification" className="input" required value={qual} onChange={(e) => setQual(e.target.value)}>
            <option value="" disabled>Select…</option>
            {quals.map((q) => <option key={q}>{q}</option>)}
          </select>
        </Field>
        {qual === "Other" && <Field label="Specify qualification" id="a-qual-o" required><input id="a-qual-o" name="qualificationOther" className="input" required maxLength={160} /></Field>}
        {levels.map((l) => (
          <div key={l.key} className="grid gap-3 border-l-2 border-brand-200 pl-4 sm:col-span-2 sm:grid-cols-[1fr_7rem_7rem]">
            <Field label={`${l.label}${l.key === "diploma" ? " (if applicable)" : ""}`} id={`e-${l.key}`} required={l.key !== "diploma" && l.order === Math.min(max, l.order) && l.order <= max}>
              <input id={`e-${l.key}`} name={`edu_${l.key}`} className="input" list={l.list ? `dl-${l.list}` : undefined} maxLength={220} required={l.key !== "diploma" && l.order <= max} placeholder={`${l.field} name`} />
            </Field>
            <Field label="Year" id={`y-${l.key}`}><input id={`y-${l.key}`} name={`year_${l.key}`} className="input" inputMode="numeric" maxLength={4} placeholder="YYYY" /></Field>
            <Field label="Score" id={`s-${l.key}`}><input id={`s-${l.key}`} name={`score_${l.key}`} className="input" maxLength={20} placeholder="% / CGPA" /></Field>
          </div>
        ))}
        <datalist id="dl-boards">{masters.boards.map((b) => <option key={b} value={b} />)}</datalist>
        <datalist id="dl-universities">{masters.universities.map((b) => <option key={b} value={b} />)}</datalist>
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="eyebrow mb-4">Role</legend>
        {job && <p className="text-[14.5px] sm:col-span-2">Applying for: <strong>{job.title}</strong></p>}
        <Field label="Role applying for" id="a-role" required>
          <select id="a-role" name="roleName" className="input" required value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="" disabled>Select…</option>
            {roles.map((r) => <option key={r}>{r}</option>)}
          </select>
        </Field>
        {role === "Other" && <Field label="Specify role" id="a-role-o" required><input id="a-role-o" name="roleOther" className="input" required maxLength={200} defaultValue={job && !masters.roles.some((r) => r.toLowerCase() === job.title.toLowerCase()) ? job.title : ""} /></Field>}
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="eyebrow mb-4">Documents</legend>
        <Field label="CV / Résumé" id="d-cv" required hint="PDF, DOC, DOCX — max 5 MB"><input id="d-cv" name="cv" type="file" accept=".pdf,.doc,.docx" className="input !p-2" required /></Field>
        <Field label="Highest qualification marksheet" id="d-ms" required hint="PDF, JPG, PNG — max 5 MB"><input id="d-ms" name="marksheet" type="file" accept=".pdf,.jpg,.jpeg,.png" className="input !p-2" required /></Field>
        <Field label="Additional documents" id="d-add" hint="Optional — certificates, portfolio. Up to 5 files." className="sm:col-span-2"><input id="d-add" name="additional" type="file" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="input !p-2" /></Field>
      </fieldset>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state.error && <Alert kind="error">{state.error}</Alert>}
      <div className="flex flex-wrap items-center gap-4">
        <button className="btn btn-primary" disabled={state.busy}>{state.busy ? "Submitting application…" : "Submit application"}</button>
        <p className="text-[12.5px] text-slate-soft">By submitting you consent to us processing your details for recruitment.</p>
      </div>
    </form>
  );
}

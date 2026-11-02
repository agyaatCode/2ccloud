"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { api } from "@/lib/client";

export function Field({ label, id, required, hint, children, className = "" }: { label: string; id: string; required?: boolean; hint?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`field ${className}`}>
      <label htmlFor={id}>{label}{required && <span className="text-crit" aria-hidden="true"> *</span>}</label>
      {children}
      {hint && <p className="mt-1 text-[12px] text-slate-soft">{hint}</p>}
    </div>
  );
}

export function Alert({ kind, children }: { kind: "error" | "ok"; children: ReactNode }) {
  return (
    <div role={kind === "error" ? "alert" : "status"} className={`border-l-4 px-4 py-3 text-[14px] ${kind === "error" ? "border-crit bg-red-50 text-red-900" : "border-ok bg-green-50 text-green-900"}`}>
      {children}
    </div>
  );
}

const SERVICE_OPTIONS = ["Public Cloud", "Private Cloud", "Hybrid Cloud", "Microsoft 365", "Google Workspace", "Zimbra Email", "Cloud Migration", "DevOps", "Managed Services", "Business Continuity", "DDoS Protection", "Data Security", "VAPT", "Anti-Virus", "Active Directory", "Other"];

export function ServiceSelect({ id, name, defaultValue = "", required }: { id: string; name: string; defaultValue?: string; required?: boolean }) {
  return (
    <select id={id} name={name} className="input" defaultValue={defaultValue} required={required}>
      <option value="">Select a service…</option>
      {SERVICE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
    </select>
  );
}

function formJson(e: FormEvent<HTMLFormElement>) {
  return Object.fromEntries(new FormData(e.currentTarget).entries());
}

/* ------------------------------ contact ------------------------------ */
export function ContactForm({ defaultService = "", user }: { defaultService?: string; user?: { name: string; email: string } | null }) {
  const [state, setState] = useState<{ busy: boolean; error?: string; done?: boolean }>({ busy: false });
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ busy: true });
    const r = await api("/api/contact", { json: formJson(e) });
    setState({ busy: false, error: r.ok ? undefined : r.error, done: r.ok });
    if (r.ok) (e.target as HTMLFormElement).reset();
  }
  if (state.done) return <Alert kind="ok"><strong>Thank you.</strong> Your message has been received and an engineer will respond within one business day.</Alert>;
  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2" noValidate={false}>
      <Field label="Full name" id="c-name" required><input id="c-name" name="name" className="input" required maxLength={140} autoComplete="name" defaultValue={user?.name} /></Field>
      <Field label="Work email" id="c-email" required><input id="c-email" name="email" type="email" className="input" required autoComplete="email" defaultValue={user?.email} /></Field>
      <Field label="Phone" id="c-phone"><input id="c-phone" name="phone" type="tel" className="input" autoComplete="tel" maxLength={30} /></Field>
      <Field label="Company" id="c-company"><input id="c-company" name="company" className="input" autoComplete="organization" maxLength={160} /></Field>
      <Field label="Service of interest" id="c-service"><ServiceSelect id="c-service" name="serviceInterest" defaultValue={defaultService} /></Field>
      <Field label="Subject" id="c-subject"><input id="c-subject" name="subject" className="input" maxLength={200} /></Field>
      <Field label="How can we help?" id="c-message" required className="sm:col-span-2"><textarea id="c-message" name="message" className="input" required minLength={10} maxLength={4000} /></Field>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state.error && <div className="sm:col-span-2"><Alert kind="error">{state.error}</Alert></div>}
      <div className="sm:col-span-2"><button className="btn btn-primary" disabled={state.busy}>{state.busy ? "Sending…" : "Send message"}</button></div>
    </form>
  );
}

/* ------------------------------ register ------------------------------ */
export function RegisterForm() {
  const router = useRouter();
  const [state, setState] = useState<{ busy: boolean; error?: string }>({ busy: false });
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = formJson(e);
    if (data.password !== data.confirmPassword) return setState({ busy: false, error: "Passwords do not match." });
    setState({ busy: true });
    const r = await api("/api/auth/register", { json: data });
    if (r.ok) {
      router.push("/dashboard");
      router.refresh();
    } else setState({ busy: false, error: r.error });
  }
  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <Field label="Full name" id="r-name" required><input id="r-name" name="fullName" className="input" required maxLength={140} autoComplete="name" /></Field>
      <Field label="Company" id="r-company"><input id="r-company" name="company" className="input" maxLength={160} autoComplete="organization" /></Field>
      <Field label="Email" id="r-email" required><input id="r-email" name="email" type="email" className="input" required autoComplete="email" /></Field>
      <Field label="Mobile" id="r-mobile" required><input id="r-mobile" name="mobile" type="tel" className="input" required maxLength={30} autoComplete="tel" /></Field>
      <Field label="Password" id="r-pw" required hint="At least 8 characters, with letters and numbers."><input id="r-pw" name="password" type="password" className="input" required minLength={8} autoComplete="new-password" /></Field>
      <Field label="Confirm password" id="r-pw2" required><input id="r-pw2" name="confirmPassword" type="password" className="input" required minLength={8} autoComplete="new-password" /></Field>
      <Field label="Country" id="r-country" required><input id="r-country" name="country" className="input" required maxLength={80} autoComplete="country-name" /></Field>
      <Field label="State" id="r-state"><input id="r-state" name="state" className="input" maxLength={80} autoComplete="address-level1" /></Field>
      <Field label="City" id="r-city"><input id="r-city" name="city" className="input" maxLength={80} autoComplete="address-level2" /></Field>
      <Field label="Service interest" id="r-service"><ServiceSelect id="r-service" name="serviceInterest" /></Field>
      <Field label="Address" id="r-address" className="sm:col-span-2"><textarea id="r-address" name="address" className="input !min-h-[84px]" maxLength={500} autoComplete="street-address" /></Field>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state.error && <div className="sm:col-span-2"><Alert kind="error">{state.error}</Alert></div>}
      <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
        <button className="btn btn-primary" disabled={state.busy}>{state.busy ? "Creating account…" : "Create account"}</button>
        <span className="text-[14px] text-slate-soft">Already registered? <Link href="/login" className="font-semibold text-brand-600 hover:underline">Sign in</Link></span>
      </div>
    </form>
  );
}

/* ------------------------------ login ------------------------------ */
export function LoginForm({ next = "/dashboard" }: { next?: string }) {
  const router = useRouter();
  const [state, setState] = useState<{ busy: boolean; error?: string }>({ busy: false });
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ busy: true });
    const r = await api("/api/auth/login", { json: formJson(e) });
    if (r.ok) {
      router.push(next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard");
      router.refresh();
    } else setState({ busy: false, error: r.error });
  }
  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <Field label="Email" id="l-email" required><input id="l-email" name="email" type="email" className="input" required autoComplete="email" /></Field>
      <Field label="Password" id="l-pw" required><input id="l-pw" name="password" type="password" className="input" required autoComplete="current-password" /></Field>
      {state.error && <Alert kind="error">{state.error}</Alert>}
      <div className="flex flex-wrap items-center gap-4">
        <button className="btn btn-primary" disabled={state.busy}>{state.busy ? "Signing in…" : "Sign in"}</button>
        <span className="text-[14px] text-slate-soft">New here? <Link href="/register" className="font-semibold text-brand-600 hover:underline">Create an account</Link></span>
      </div>
    </form>
  );
}

/* ------------------------------ dashboard actions ------------------------------ */
export type Profile = { fullName: string; company: string; email: string; mobile: string; country: string; state: string; city: string; address: string; serviceInterest: string };

export function ProfileForm({ profile }: { profile: Profile }) {
  const [state, setState] = useState<{ busy: boolean; error?: string; ok?: boolean }>({ busy: false });
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ busy: true });
    const r = await api("/api/customer/profile", { method: "PUT", json: formJson(e) });
    setState({ busy: false, error: r.ok ? undefined : r.error, ok: r.ok });
  }
  const v = profile;
  return (
    <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <Field label="Full name" id="p-name" required><input id="p-name" name="fullName" className="input" defaultValue={v.fullName} required /></Field>
      <Field label="Company" id="p-company"><input id="p-company" name="company" className="input" defaultValue={v.company} /></Field>
      <Field label="Email" id="p-email"><input id="p-email" className="input bg-mist" value={v.email} readOnly /></Field>
      <Field label="Mobile" id="p-mobile" required><input id="p-mobile" name="mobile" className="input" defaultValue={v.mobile} required /></Field>
      <Field label="Country" id="p-country"><input id="p-country" name="country" className="input" defaultValue={v.country} /></Field>
      <Field label="State" id="p-state"><input id="p-state" name="state" className="input" defaultValue={v.state} /></Field>
      <Field label="City" id="p-city"><input id="p-city" name="city" className="input" defaultValue={v.city} /></Field>
      <Field label="Service interest" id="p-service"><ServiceSelect id="p-service" name="serviceInterest" defaultValue={v.serviceInterest} /></Field>
      <Field label="Address" id="p-address" className="sm:col-span-2"><textarea id="p-address" name="address" className="input !min-h-[80px]" defaultValue={v.address} /></Field>
      {state.error && <div className="sm:col-span-2"><Alert kind="error">{state.error}</Alert></div>}
      {state.ok && <div className="sm:col-span-2"><Alert kind="ok">Profile updated.</Alert></div>}
      <div className="sm:col-span-2"><button className="btn btn-primary" disabled={state.busy}>{state.busy ? "Saving…" : "Save changes"}</button></div>
    </form>
  );
}

export function RequestForm() {
  const router = useRouter();
  const [state, setState] = useState<{ busy: boolean; error?: string; ok?: boolean }>({ busy: false });
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ busy: true });
    const r = await api("/api/customer/requests", { json: formJson(e) });
    setState({ busy: false, error: r.ok ? undefined : r.error, ok: r.ok });
    if (r.ok) {
      form.reset();
      router.refresh();
    }
  }
  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <Field label="Service" id="q-service"><ServiceSelect id="q-service" name="serviceInterest" /></Field>
      <Field label="Subject" id="q-subject" required><input id="q-subject" name="subject" className="input" required maxLength={200} /></Field>
      <Field label="Details" id="q-message" required><textarea id="q-message" name="message" className="input" required minLength={10} maxLength={4000} /></Field>
      {state.error && <Alert kind="error">{state.error}</Alert>}
      {state.ok && <Alert kind="ok">Request submitted. We will be in touch shortly.</Alert>}
      <div><button className="btn btn-primary" disabled={state.busy}>{state.busy ? "Submitting…" : "Submit request"}</button></div>
    </form>
  );
}

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      className="btn btn-ghost-light !min-h-10"
      onClick={async () => {
        await api("/api/auth/logout", { method: "POST", json: {} });
        router.push("/");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}

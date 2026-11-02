"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/client";

export default function AdminLogin() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [logo, setLogo] = useState("/brand/logo.svg");
  useEffect(() => {
    fetch("/api/branding").then((r) => r.json()).then((b) => b.logoUrl && setLogo(b.logoUrl)).catch(() => {});
  }, []);
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const r = await api("/api/admin/login", { json: Object.fromEntries(new FormData(e.currentTarget).entries()) });
    if (r.ok) { router.push("/admin"); router.refresh(); } else { setErr(r.error || "Sign-in failed."); setBusy(false); }
  }
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#061429] lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/hero/home-datacenter.jpg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#061429] via-[#0a1f44]/60 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-sky-300">Administration</p>
          <p className="mt-3 max-w-sm font-display text-2xl font-semibold leading-snug">Manage content, branding, careers and customers from one place.</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-white p-6">
        <form onSubmit={onSubmit} className="w-full max-w-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="Logo" className="mb-10 h-12 w-auto max-w-[220px] object-contain" />
          <h1 className="mb-1 text-xl font-bold">Sign in</h1>
          <p className="mb-6 text-[13px] text-slate-500">Authorised administrators only.</p>
          <label className="a-label" htmlFor="ae">Email</label>
          <input id="ae" name="email" type="email" required autoComplete="username" className="a-input mb-4" />
          <label className="a-label" htmlFor="ap">Password</label>
          <input id="ap" name="password" type="password" required autoComplete="current-password" className="a-input mb-4" />
          {err && <p role="alert" className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] font-semibold text-red-800">{err}</p>}
          <button className="a-btn a-btn-primary w-full !min-h-10" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>
      </div>
    </div>
  );
}

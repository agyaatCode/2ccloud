"use client";

export function getCookie(name: string): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.split("; ").find((c) => c.startsWith(name + "="));
  return m ? decodeURIComponent(m.split("=").slice(1).join("=")) : "";
}

export type ApiResult<T = Record<string, unknown>> = { ok: boolean; error?: string } & T;

export async function api<T = Record<string, unknown>>(url: string, opts: { method?: string; json?: unknown; form?: FormData } = {}): Promise<ApiResult<T>> {
  const headers: Record<string, string> = { "x-csrf-token": getCookie("csrf_token") };
  let body: BodyInit | undefined;
  if (opts.form) body = opts.form;
  else if (opts.json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opts.json);
  }
  try {
    const res = await fetch(url, { method: opts.method ?? (body ? "POST" : "GET"), headers, body, credentials: "same-origin" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: data.error || `Request failed (${res.status})`, ...data };
    return { ok: true, ...data };
  } catch {
    return { ok: false, error: "Network error. Please check your connection and try again." } as ApiResult<T>;
  }
}

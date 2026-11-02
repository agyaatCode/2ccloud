// "use client";
// import { useState } from "react";
// import { api } from "@/lib/client";
// import { FieldInput } from "@/components/admin/fields";

// const GROUPS: { title: string; fields: { key: string; label: string; area?: boolean; media?: boolean; help?: string }[] }[] = [
//   { title: "Company", fields: [
//     { key: "company_name", label: "Company legal name", help: "Used in the footer, schema.org and emails." },
//     { key: "brand_name", label: "Brand / trading name", help: "Used in page titles and metadata — never rendered next to the logo." },
//     { key: "tagline", label: "Tagline" }, { key: "footer_blurb", label: "Footer description", area: true } ] },
//   { title: "Contact", fields: [
//     { key: "contact_email", label: "Public contact email" }, { key: "contact_phone", label: "Phone" }, { key: "address", label: "Address", area: true },
//     { key: "notify_email", label: "Notification email", help: "Receives contact enquiries and job applications. Defaults to the contact email." } ] },
//   { title: "Header", fields: [{ key: "header_cta_text", label: "Header button text" }, { key: "header_cta_url", label: "Header button URL" }] },
//   { title: "Social", fields: [{ key: "linkedin_url", label: "LinkedIn URL" }, { key: "twitter_url", label: "X / Twitter URL" }, { key: "facebook_url", label: "Facebook URL" }, { key: "youtube_url", label: "YouTube URL" }] },
//   { title: "SEO", fields: [{ key: "site_url", label: "Canonical site URL", help: "e.g. https://www.example.com — used for canonical links, sitemap and schema." }, { key: "default_og_image", label: "Default social share image", media: true }] },
// ];

// export function SettingsForm({ initial }: { initial: Record<string, string> }) {
//   const [v, setV] = useState(initial);
//   const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
//   const [busy, setBusy] = useState(false);
//   async function save() {
//     setBusy(true);
//     const r = await api("/api/admin/settings", { method: "PUT", json: v });
//     setBusy(false);
//     setMsg(r.ok ? { kind: "ok", text: "Settings saved." } : { kind: "err", text: r.error || "Save failed." });
//   }
//   return (
//     <div>
//       <div className="mb-4 flex items-center gap-3"><h1 className="text-lg font-bold">Site settings</h1><button className="a-btn a-btn-primary ml-auto" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save settings"}</button></div>
//       {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-4 rounded border px-3 py-2 text-[13px] font-semibold ${msg.kind === "err" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{msg.text}</p>}
//       <div className="space-y-5">
//         {GROUPS.map((g) => (
//           <section key={g.title} className="a-card p-5"><h2 className="mb-4 text-sm font-bold">{g.title}</h2>
//             <div className="grid gap-4 md:grid-cols-2">
//               {g.fields.map((f) => (
//                 <div key={f.key} className={f.area || f.media ? "md:col-span-2" : ""}>
//                   <FieldInput idPrefix="set" f={{ name: f.key, label: f.label, help: f.help, type: f.media ? "media" : f.area ? "textarea" : "text", mediaKind: f.media ? "image" : undefined, rows: 3 }} value={v[f.key] ?? ""} onChange={(x) => setV({ ...v, [f.key]: String(x) })} />
//                 </div>
//               ))}
//             </div>
//           </section>
//         ))}
//       </div>
//     </div>
//   );
// }






// new code 




"use client";
import { useState } from "react";
import { api } from "@/lib/client";
import { FieldInput } from "@/components/admin/fields";

type Entry = { label: string; value: string };

const GROUPS: { title: string; fields: { key: string; label: string; area?: boolean; media?: boolean; help?: string }[] }[] = [
  { title: "Company", fields: [
    { key: "company_name", label: "Company legal name", help: "Used in the footer, schema.org and emails." },
    { key: "brand_name", label: "Brand / trading name", help: "Used in page titles and metadata — never rendered next to the logo." },
    { key: "tagline", label: "Tagline" }, { key: "footer_blurb", label: "Footer description", area: true } ] },
  // contact_email / contact_phone are now managed by the multi-entry editors below
  { title: "Contact", fields: [
    { key: "address", label: "Address", area: true },
    { key: "notify_email", label: "Notification email", help: "Receives contact enquiries and job applications. Defaults to the primary contact email." } ] },
  { title: "Header", fields: [{ key: "header_cta_text", label: "Header button text" }, { key: "header_cta_url", label: "Header button URL" }] },
  { title: "Social", fields: [{ key: "linkedin_url", label: "LinkedIn URL" }, { key: "twitter_url", label: "X / Twitter URL" }, { key: "facebook_url", label: "Facebook URL" }, { key: "youtube_url", label: "YouTube URL" }] },
  { title: "SEO", fields: [{ key: "site_url", label: "Canonical site URL", help: "e.g. https://www.example.com — used for canonical links, sitemap and schema." }, { key: "default_og_image", label: "Default social share image", media: true }] },
];

const INPUT = "w-full rounded border border-slate-300 bg-white px-3 py-2 text-[13px] outline-none focus:border-blue-500";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[\d\s\-().]{6,20}$/;

const EMAIL_LABELS = ["General", "Sales", "Support", "HR / Careers", "Billing", "Info"];
const PHONE_LABELS = ["Main", "Sales", "Support", "HR", "WhatsApp", "Toll free"];

/** Read a JSON list from settings; fall back to the old single value so existing data still shows up. */
function parseList(raw: string | undefined, legacy: string | undefined, defaultLabel: string): Entry[] {
  try {
    const arr = JSON.parse(raw || "[]");
    if (Array.isArray(arr)) {
      const list = arr
        .filter((x) => x && typeof x === "object")
        .map((x) => ({ label: String(x.label ?? ""), value: String(x.value ?? "") }))
        .filter((x) => x.value || x.label);
      if (list.length) return list;
    }
  } catch {
    /* fall through */
  }
  if (legacy) return [{ label: defaultLabel, value: legacy }];
  return [{ label: "", value: "" }];
}

function EntryList({
  title, hint, entries, setEntries, kind, labels, placeholder,
}: {
  title: string; hint: string; entries: Entry[]; setEntries: (e: Entry[]) => void;
  kind: "email" | "tel"; labels: string[]; placeholder: string;
}) {
  const listId = `labels-${kind}`;
  const update = (i: number, patch: Partial<Entry>) => setEntries(entries.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const remove = (i: number) => {
    const next = entries.filter((_, idx) => idx !== i);
    setEntries(next.length ? next : [{ label: "", value: "" }]);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= entries.length) return;
    const next = [...entries];
    [next[i], next[j]] = [next[j], next[i]];
    setEntries(next);
  };
  return (
    <div>
      <div className="mb-1 flex items-center gap-2">
        <span className="text-[13px] font-semibold">{title}</span>
        <button type="button" className="a-btn ml-auto" onClick={() => setEntries([...entries, { label: "", value: "" }])}>+ Add</button>
      </div>
      <p className="mb-2 text-[12px] text-slate-500">{hint}</p>
      <datalist id={listId}>{labels.map((l) => <option key={l} value={l} />)}</datalist>
      <div className="space-y-2">
        {entries.map((e, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 md:flex-nowrap">
            <input
              className={`${INPUT} md:w-44 md:flex-none`}
              list={listId}
              placeholder="Label (e.g. Sales)"
              aria-label={`${title} label ${i + 1}`}
              value={e.label}
              maxLength={60}
              onChange={(ev) => update(i, { label: ev.target.value })}
            />
            <input
              className={`${INPUT} min-w-0 flex-1`}
              type={kind}
              inputMode={kind === "tel" ? "tel" : "email"}
              placeholder={placeholder}
              aria-label={`${title} ${i + 1}`}
              value={e.value}
              maxLength={190}
              onChange={(ev) => update(i, { value: ev.target.value })}
            />
            {i === 0 && <span className="rounded bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-700">Primary</span>}
            <button type="button" className="a-btn" title="Move up" aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
            <button type="button" className="a-btn" title="Move down" aria-label="Move down" disabled={i === entries.length - 1} onClick={() => move(i, 1)}>↓</button>
            <button type="button" className="a-btn" title="Remove" aria-label="Remove" onClick={() => remove(i)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsForm({ initial }: { initial: Record<string, string> }) {
  const [v, setV] = useState(initial);
  const [emails, setEmails] = useState<Entry[]>(() => parseList(initial.contact_emails, initial.contact_email, "General"));
  const [phones, setPhones] = useState<Entry[]>(() => parseList(initial.contact_phones, initial.contact_phone, "Main"));
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function save() {
    const cleanEmails = emails.map((e) => ({ label: e.label.trim(), value: e.value.trim() })).filter((e) => e.value);
    const cleanPhones = phones.map((e) => ({ label: e.label.trim(), value: e.value.trim() })).filter((e) => e.value);

    const badEmail = cleanEmails.find((e) => !EMAIL_RE.test(e.value));
    if (badEmail) return setMsg({ kind: "err", text: `"${badEmail.value}" is not a valid email address.` });
    const badPhone = cleanPhones.find((e) => !PHONE_RE.test(e.value));
    if (badPhone) return setMsg({ kind: "err", text: `"${badPhone.value}" is not a valid phone number.` });

    setBusy(true);
    const payload = {
      ...v,
      contact_emails: JSON.stringify(cleanEmails),
      contact_phones: JSON.stringify(cleanPhones),
      // keep the legacy single-value keys in sync (primary = first entry)
      contact_email: cleanEmails[0]?.value ?? "",
      contact_phone: cleanPhones[0]?.value ?? "",
    };
    const r = await api("/api/admin/settings", { method: "PUT", json: payload });
    setBusy(false);
    if (r.ok) {
      setV(payload);
      setEmails(cleanEmails.length ? cleanEmails : [{ label: "", value: "" }]);
      setPhones(cleanPhones.length ? cleanPhones : [{ label: "", value: "" }]);
      setMsg({ kind: "ok", text: "Settings saved." });
    } else {
      setMsg({ kind: "err", text: r.error || "Save failed." });
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3"><h1 className="text-lg font-bold">Site settings</h1><button className="a-btn a-btn-primary ml-auto" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save settings"}</button></div>
      {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-4 rounded border px-3 py-2 text-[13px] font-semibold ${msg.kind === "err" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{msg.text}</p>}
      <div className="space-y-5">
        {GROUPS.map((g) => (
          <section key={g.title} className="a-card p-5"><h2 className="mb-4 text-sm font-bold">{g.title}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {g.title === "Contact" && (
                <>
                  <div className="md:col-span-2">
                    <EntryList
                      title="Contact emails"
                      hint="Add as many as you need, each with a label. The first one is the primary email."
                      entries={emails}
                      setEntries={setEmails}
                      kind="email"
                      labels={EMAIL_LABELS}
                      placeholder="name@example.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <EntryList
                      title="Contact phone numbers"
                      hint="Add as many as you need, each with a label. The first one is the primary number."
                      entries={phones}
                      setEntries={setPhones}
                      kind="tel"
                      labels={PHONE_LABELS}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </>
              )}
              {g.fields.map((f) => (
                <div key={f.key} className={f.area || f.media ? "md:col-span-2" : ""}>
                  <FieldInput idPrefix="set" f={{ name: f.key, label: f.label, help: f.help, type: f.media ? "media" : f.area ? "textarea" : "text", mediaKind: f.media ? "image" : undefined, rows: 3 }} value={v[f.key] ?? ""} onChange={(x) => setV({ ...v, [f.key]: String(x) })} />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
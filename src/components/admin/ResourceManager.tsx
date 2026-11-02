// // "use client";
// // import { useCallback, useEffect, useState } from "react";
// // import { api } from "@/lib/client";
// // import type { ChildDef, FieldDef, Opt, ResourceDef } from "@/lib/admin/defs";
// // import { FieldInput, Thumb } from "@/components/admin/fields";

// // type Row = Record<string, unknown> & { id: number };
// // type Children = Record<string, Record<string, unknown>[]>;

// // const TRUE_DEFAULTS = ["isActive", "isPublished", "heroAnimate", "heroParallax"];
// // function defaultsFor(def: ResourceDef, filters: Record<string, string>) {
// //   const v: Record<string, unknown> = {};
// //   for (const f of def.fields) {
// //     if (f.type === "boolean") v[f.name] = TRUE_DEFAULTS.includes(f.name);
// //     else if (f.type === "number") v[f.name] = f.name === "heroOverlayOpacity" ? 78 : f.name === "heroHeight" ? 600 : f.name === "openings" ? 1 : 0;
// //     else if (f.type === "color") v[f.name] = "#0A1F44";
// //     else if (f.type === "select" && f.options && (f.required || f.name.startsWith("hero") || f.name === "icon" || f.name === "diagram" || f.name === "employmentType" || f.name === "robots"))
// //       v[f.name] = f.name === "heroPosDesktop" || f.name === "heroPosMobile" ? "center center" : f.options[0].value;
// //     else v[f.name] = "";
// //   }
// //   for (const [k, val] of Object.entries(filters)) if (val && k in v) v[k] = val;
// //   return v;
// // }

// // function ChildEditor({ def, items, onChange }: { def: ChildDef; items: Record<string, unknown>[]; onChange: (v: Record<string, unknown>[]) => void }) {
// //   const move = (i: number, d: number) => {
// //     const n = [...items];
// //     const j = i + d;
// //     if (j < 0 || j >= n.length) return;
// //     [n[i], n[j]] = [n[j], n[i]];
// //     onChange(n);
// //   };
// //   return (
// //     <div className="mb-6">
// //       <div className="mb-2 flex items-center justify-between"><h4 className="text-[13px] font-bold">{def.label} <span className="font-normal text-slate-500">({items.length})</span></h4><button type="button" className="a-btn" onClick={() => onChange([...items, {}])}>+ Add</button></div>
// //       <div className="space-y-2">
// //         {items.map((it, i) => (
// //           <div key={i} className="grid gap-3 rounded border border-slate-200 bg-slate-50/60 p-3 sm:grid-cols-[1fr_auto]">
// //             <div className="grid gap-3 md:grid-cols-2">
// //               {def.fields.map((f) => (
// //                 <div key={f.name} className={f.type === "textarea" || f.type === "media" ? "md:col-span-2" : ""}>
// //                   <FieldInput f={f} idPrefix={`${def.name}-${i}`} value={it[f.name]} onChange={(val) => onChange(items.map((x, k) => (k === i ? { ...x, [f.name]: val } : x)))} />
// //                 </div>
// //               ))}
// //             </div>
// //             <div className="flex gap-1 sm:flex-col">
// //               <button type="button" className="a-btn !px-2" onClick={() => move(i, -1)} aria-label="Move up">↑</button>
// //               <button type="button" className="a-btn !px-2" onClick={() => move(i, 1)} aria-label="Move down">↓</button>
// //               <button type="button" className="a-btn a-btn-danger !px-2" onClick={() => onChange(items.filter((_, k) => k !== i))} aria-label="Remove">✕</button>
// //             </div>
// //           </div>
// //         ))}
// //         {items.length === 0 && <p className="text-[12.5px] text-slate-500">None yet.</p>}
// //       </div>
// //     </div>
// //   );
// // }

// // function Cell({ c, row, def }: { c: ResourceDef["columns"][number]; row: Row; def: ResourceDef }) {
// //   const v = row[c.name];
// //   if (c.type === "media") return v ? <Thumb item={{ kind: "image", url: String(v), title: "" }} className="h-9 w-14 rounded" /> : <span className="block h-9 w-14 rounded bg-slate-100" />;
// //   if (c.type === "bool") return <span className={v ? "text-emerald-700" : "text-slate-400"}>{v ? "● Yes" : "○ No"}</span>;
// //   if (c.type === "date") return <>{v ? new Date(String(v)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</>;
// //   if (c.type === "badge") {
// //     const s = String(v ?? "");
// //     const cls = ["published", "active", "resolved"].includes(s) ? "ok" : ["draft", "inactive", "new", "scheduled", "in_progress"].includes(s) ? "warn" : s === "closed" || s === "spam" ? "crit" : "info";
// //     return <span className={`a-pill ${cls}`}>{s.replace(/_/g, " ")}</span>;
// //   }
// //   if (c.type === "mono") return <code className="text-[12px] text-slate-600">{String(v ?? "")}</code>;
// //   return <span className={c.name === def.titleField ? "font-semibold" : ""}>{String(v ?? "") || "—"}</span>;
// // }

// // export function ResourceManager({ def, optionsMap, initialFilters }: { def: ResourceDef; optionsMap: Record<string, Opt[]>; initialFilters: Record<string, string> }) {
// //   const [rows, setRows] = useState<Row[]>([]);
// //   const [total, setTotal] = useState(0);
// //   const [page, setPage] = useState(1);
// //   const [q, setQ] = useState("");
// //   const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
// //   const [loading, setLoading] = useState(true);
// //   const [edit, setEdit] = useState<{ id: number | null } | null>(null);
// //   const [values, setValues] = useState<Record<string, unknown>>({});
// //   const [children, setChildren] = useState<Children>({});
// //   const [tab, setTab] = useState("");
// //   const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
// //   const [saving, setSaving] = useState(false);
// //   const limit = 20;

// //   const load = useCallback(async () => {
// //     setLoading(true);
// //     const qs = new URLSearchParams({ page: String(page), limit: String(limit), q });
// //     for (const [k, v] of Object.entries(filters)) if (v) qs.set(`f_${k}`, v);
// //     const r = await api<{ rows: Row[]; total: number }>(`/api/admin/r/${def.key}?${qs}`);
// //     if (r.ok) { setRows(r.rows as Row[]); setTotal(r.total as number); }
// //     else setMsg({ kind: "err", text: r.error || "Could not load." });
// //     setLoading(false);
// //   }, [def.key, page, q, filters]);
// //   useEffect(() => { const t = setTimeout(load, 180); return () => clearTimeout(t); }, [load]);

// //   const groups = def.groups ?? [];
// //   const hasChildren = (def.children?.length ?? 0) > 0;
// //   const tabs = hasChildren ? [...groups.filter((g) => def.fields.some((f) => f.group === g)), "Lists"] : groups.filter((g) => def.fields.some((f) => f.group === g));

// //   async function open(id: number | null) {
// //     setMsg(null);
// //     setTab(tabs[0] ?? "");
// //     if (id === null) {
// //       setValues(defaultsFor(def, filters));
// //       setChildren(Object.fromEntries((def.children ?? []).map((c) => [c.name, []])));
// //       setEdit({ id: null });
// //       return;
// //     }
// //     const r = await api<{ row: Row; children: Children }>(`/api/admin/r/${def.key}/${id}`);
// //     if (!r.ok) return setMsg({ kind: "err", text: r.error || "Could not load record." });
// //     const row = { ...(r.row as Row) };
// //     for (const f of def.fields) if (f.numeric && row[f.name] != null) row[f.name] = String(row[f.name]);
// //     setValues(row);
// //     setChildren(r.children as Children);
// //     setEdit({ id });
// //   }

// //   async function save() {
// //     setSaving(true);
// //     setMsg(null);
// //     const body = { ...values, children };
// //     const r = await api(edit?.id ? `/api/admin/r/${def.key}/${edit.id}` : `/api/admin/r/${def.key}`, { method: edit?.id ? "PUT" : "POST", json: body });
// //     setSaving(false);
// //     if (!r.ok) return setMsg({ kind: "err", text: r.error || "Save failed." });
// //     setMsg({ kind: "ok", text: `${def.singular[0].toUpperCase()}${def.singular.slice(1)} saved.` });
// //     setEdit(null);
// //     load();
// //   }

// //   async function remove() {
// //     if (!edit?.id || !confirm(`Delete this ${def.singular}? This cannot be undone.`)) return;
// //     const r = await api(`/api/admin/r/${def.key}/${edit.id}`, { method: "DELETE" });
// //     if (!r.ok) return setMsg({ kind: "err", text: r.error || "Delete failed." });
// //     setMsg({ kind: "ok", text: "Deleted." });
// //     setEdit(null);
// //     load();
// //   }

// //   const renderFields = (list: FieldDef[]) => (
// //     <div className="grid gap-4 md:grid-cols-2">
// //       {list.map((f) => (
// //         <div key={f.name} className={f.wide || f.type === "textarea" || f.type === "media" ? "md:col-span-2" : ""}>
// //           <FieldInput f={f} value={values[f.name]} options={f.optionsFrom ? optionsMap[f.optionsFrom] : undefined} onChange={(v) => setValues((p) => ({ ...p, [f.name]: v }))} />
// //         </div>
// //       ))}
// //     </div>
// //   );

// //   /* ------------------------------ editor ------------------------------ */
// //   if (edit) {
// //     const current = tabs.length ? tab || tabs[0] : "";
// //     const shown = tabs.length ? def.fields.filter((f) => f.group === current) : def.fields;
// //     return (
// //       <div>
// //         <div className="mb-4 flex flex-wrap items-center gap-3">
// //           <button className="a-btn" onClick={() => setEdit(null)}>← Back</button>
// //           <h1 className="text-lg font-bold">{edit.id ? `Edit ${def.singular}` : `New ${def.singular}`}</h1>
// //           <div className="ml-auto flex gap-2">
// //             {edit.id && def.canDelete !== false && <button className="a-btn a-btn-danger" onClick={remove}>Delete</button>}
// //             <button className="a-btn a-btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
// //           </div>
// //         </div>
// //         {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-4 rounded border px-3 py-2 text-[13px] font-semibold ${msg.kind === "err" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{msg.text}</p>}
// //         <div className="a-card">
// //           {tabs.length > 1 && (
// //             <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-slate-200 px-3 pt-2">
// //               {tabs.map((t) => (
// //                 <button key={t} role="tab" aria-selected={current === t} onClick={() => setTab(t)} className={`whitespace-nowrap border-b-2 px-3 py-2 text-[13px] font-semibold ${current === t ? "border-[#0f5cab] text-[#0f5cab]" : "border-transparent text-slate-500 hover:text-slate-800"}`}>{t}</button>
// //               ))}
// //             </div>
// //           )}
// //           <div className="p-5">
// //             {current === "Lists" ? (def.children ?? []).map((c) => <ChildEditor key={c.name} def={c} items={children[c.name] ?? []} onChange={(v) => setChildren((p) => ({ ...p, [c.name]: v }))} />) : renderFields(shown)}
// //             {!tabs.length && hasChildren && (def.children ?? []).map((c) => <div key={c.name} className="mt-6"><ChildEditor def={c} items={children[c.name] ?? []} onChange={(v) => setChildren((p) => ({ ...p, [c.name]: v }))} /></div>)}
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   /* ------------------------------ list ------------------------------ */
// //   const pages = Math.max(1, Math.ceil(total / limit));
// //   return (
// //     <div>
// //       <div className="mb-4 flex flex-wrap items-center gap-3">
// //         <h1 className="text-lg font-bold">{def.label}</h1>
// //         <span className="a-pill">{total}</span>
// //         <div className="ml-auto flex flex-wrap items-center gap-2">
// //           <input className="a-input !w-56" placeholder="Search…" aria-label="Search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
// //           {(def.filters ?? []).map((f) => (
// //             <select key={f.name} aria-label={f.label} className="a-input !w-40" value={filters[f.name] ?? ""} onChange={(e) => { setFilters((p) => ({ ...p, [f.name]: e.target.value })); setPage(1); }}>
// //               <option value="">All {f.label.toLowerCase()}</option>
// //               {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
// //             </select>
// //           ))}
// //           {def.canCreate !== false && <button className="a-btn a-btn-primary" onClick={() => open(null)}>+ New {def.singular}</button>}
// //         </div>
// //       </div>
// //       {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-4 rounded border px-3 py-2 text-[13px] font-semibold ${msg.kind === "err" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{msg.text}</p>}
// //       <div className="a-card admin-scroll overflow-x-auto">
// //         <table className="a-table">
// //           <thead><tr>{def.columns.map((c) => <th key={c.name}>{c.label}</th>)}<th /></tr></thead>
// //           <tbody>
// //             {rows.map((r) => (
// //               <tr key={r.id} className="cursor-pointer" onClick={() => open(r.id)}>
// //                 {def.columns.map((c) => <td key={c.name}><Cell c={c} row={r} def={def} /></td>)}
// //                 <td className="text-right"><button className="a-btn" onClick={(e) => { e.stopPropagation(); open(r.id); }} aria-label={`Edit ${String(r[def.titleField] ?? "")}`}>Edit</button></td>
// //               </tr>
// //             ))}
// //             {!loading && rows.length === 0 && <tr><td colSpan={def.columns.length + 1} className="py-10 text-center text-slate-500">Nothing here yet.</td></tr>}
// //             {loading && rows.length === 0 && <tr><td colSpan={def.columns.length + 1} className="py-10 text-center text-slate-500">Loading…</td></tr>}
// //           </tbody>
// //         </table>
// //       </div>
// //       {pages > 1 && (
// //         <div className="mt-4 flex items-center justify-between text-[13px]">
// //           <span className="text-slate-500">Page {page} of {pages}</span>
// //           <div className="flex gap-2"><button className="a-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><button className="a-btn" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button></div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }





// // new code 



// "use client";
// import { useCallback, useEffect, useState } from "react";
// import { api } from "@/lib/client";
// import type { ChildDef, FieldDef, Opt, ResourceDef } from "@/lib/admin/defs";
// import { FieldInput, Thumb } from "@/components/admin/fields";

// type Row = Record<string, unknown> & { id: number };
// type Children = Record<string, Record<string, unknown>[]>;

// const TRUE_DEFAULTS = ["isActive", "isPublished", "heroAnimate", "heroParallax"];

// // Fields whose select value must always be one of the available options
// function isManagedSelect(f: FieldDef) {
//   return (
//     f.type === "select" &&
//     !!f.options &&
//     f.options.length > 0 &&
//     (!!f.required || f.name.startsWith("hero") || f.name === "icon" || f.name === "diagram" || f.name === "employmentType" || f.name === "robots")
//   );
// }

// // Pick a safe default option for a select field
// function selectDefault(f: FieldDef): string {
//   const opts = f.options ?? [];
//   if (f.name === "heroPosDesktop" || f.name === "heroPosMobile") {
//     const center = opts.find((o) => o.value === "center center") ?? opts.find((o) => o.value === "center");
//     if (center) return center.value;
//   }
//   return opts[0]?.value ?? "";
// }

// // Replace empty / outdated select values with a valid option so the server never rejects them
// function fixSelects(def: ResourceDef, row: Record<string, unknown>) {
//   for (const f of def.fields) {
//     if (!isManagedSelect(f)) continue;
//     const cur = String(row[f.name] ?? "");
//     if (!(f.options ?? []).some((o) => o.value === cur)) row[f.name] = selectDefault(f);
//   }
//   return row;
// }

// function defaultsFor(def: ResourceDef, filters: Record<string, string>) {
//   const v: Record<string, unknown> = {};
//   for (const f of def.fields) {
//     if (f.type === "boolean") v[f.name] = TRUE_DEFAULTS.includes(f.name);
//     else if (f.type === "number") v[f.name] = f.name === "heroOverlayOpacity" ? 78 : f.name === "heroHeight" ? 600 : f.name === "openings" ? 1 : 0;
//     else if (f.type === "color") v[f.name] = "#0A1F44";
//     else if (isManagedSelect(f)) v[f.name] = selectDefault(f);
//     else v[f.name] = "";
//   }
//   for (const [k, val] of Object.entries(filters)) if (val && k in v) v[k] = val;
//   return v;
// }

// function ChildEditor({ def, items, onChange }: { def: ChildDef; items: Record<string, unknown>[]; onChange: (v: Record<string, unknown>[]) => void }) {
//   const move = (i: number, d: number) => {
//     const n = [...items];
//     const j = i + d;
//     if (j < 0 || j >= n.length) return;
//     [n[i], n[j]] = [n[j], n[i]];
//     onChange(n);
//   };
//   return (
//     <div className="mb-6">
//       <div className="mb-2 flex items-center justify-between"><h4 className="text-[13px] font-bold">{def.label} <span className="font-normal text-slate-500">({items.length})</span></h4><button type="button" className="a-btn" onClick={() => onChange([...items, {}])}>+ Add</button></div>
//       <div className="space-y-2">
//         {items.map((it, i) => (
//           <div key={i} className="grid gap-3 rounded border border-slate-200 bg-slate-50/60 p-3 sm:grid-cols-[1fr_auto]">
//             <div className="grid gap-3 md:grid-cols-2">
//               {def.fields.map((f) => (
//                 <div key={f.name} className={f.type === "textarea" || f.type === "media" ? "md:col-span-2" : ""}>
//                   <FieldInput f={f} idPrefix={`${def.name}-${i}`} value={it[f.name]} onChange={(val) => onChange(items.map((x, k) => (k === i ? { ...x, [f.name]: val } : x)))} />
//                 </div>
//               ))}
//             </div>
//             <div className="flex gap-1 sm:flex-col">
//               <button type="button" className="a-btn !px-2" onClick={() => move(i, -1)} aria-label="Move up">↑</button>
//               <button type="button" className="a-btn !px-2" onClick={() => move(i, 1)} aria-label="Move down">↓</button>
//               <button type="button" className="a-btn a-btn-danger !px-2" onClick={() => onChange(items.filter((_, k) => k !== i))} aria-label="Remove">✕</button>
//             </div>
//           </div>
//         ))}
//         {items.length === 0 && <p className="text-[12.5px] text-slate-500">None yet.</p>}
//       </div>
//     </div>
//   );
// }

// function Cell({ c, row, def }: { c: ResourceDef["columns"][number]; row: Row; def: ResourceDef }) {
//   const v = row[c.name];
//   if (c.type === "media") return v ? <Thumb item={{ kind: "image", url: String(v), title: "" }} className="h-9 w-14 rounded" /> : <span className="block h-9 w-14 rounded bg-slate-100" />;
//   if (c.type === "bool") return <span className={v ? "text-emerald-700" : "text-slate-400"}>{v ? "● Yes" : "○ No"}</span>;
//   if (c.type === "date") return <>{v ? new Date(String(v)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</>;
//   if (c.type === "badge") {
//     const s = String(v ?? "");
//     const cls = ["published", "active", "resolved"].includes(s) ? "ok" : ["draft", "inactive", "new", "scheduled", "in_progress"].includes(s) ? "warn" : s === "closed" || s === "spam" ? "crit" : "info";
//     return <span className={`a-pill ${cls}`}>{s.replace(/_/g, " ")}</span>;
//   }
//   if (c.type === "mono") return <code className="text-[12px] text-slate-600">{String(v ?? "")}</code>;
//   return <span className={c.name === def.titleField ? "font-semibold" : ""}>{String(v ?? "") || "—"}</span>;
// }

// export function ResourceManager({ def, optionsMap, initialFilters }: { def: ResourceDef; optionsMap: Record<string, Opt[]>; initialFilters: Record<string, string> }) {
//   const [rows, setRows] = useState<Row[]>([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [q, setQ] = useState("");
//   const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
//   const [loading, setLoading] = useState(true);
//   const [edit, setEdit] = useState<{ id: number | null } | null>(null);
//   const [values, setValues] = useState<Record<string, unknown>>({});
//   const [children, setChildren] = useState<Children>({});
//   const [tab, setTab] = useState("");
//   const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
//   const [saving, setSaving] = useState(false);
//   const limit = 20;

//   const load = useCallback(async () => {
//     setLoading(true);
//     const qs = new URLSearchParams({ page: String(page), limit: String(limit), q });
//     for (const [k, v] of Object.entries(filters)) if (v) qs.set(`f_${k}`, v);
//     const r = await api<{ rows: Row[]; total: number }>(`/api/admin/r/${def.key}?${qs}`);
//     if (r.ok) { setRows(r.rows as Row[]); setTotal(r.total as number); }
//     else setMsg({ kind: "err", text: r.error || "Could not load." });
//     setLoading(false);
//   }, [def.key, page, q, filters]);
//   useEffect(() => { const t = setTimeout(load, 180); return () => clearTimeout(t); }, [load]);

//   const groups = def.groups ?? [];
//   const hasChildren = (def.children?.length ?? 0) > 0;
//   const tabs = hasChildren ? [...groups.filter((g) => def.fields.some((f) => f.group === g)), "Lists"] : groups.filter((g) => def.fields.some((f) => f.group === g));

//   async function open(id: number | null) {
//     setMsg(null);
//     setTab(tabs[0] ?? "");
//     if (id === null) {
//       setValues(defaultsFor(def, filters));
//       setChildren(Object.fromEntries((def.children ?? []).map((c) => [c.name, []])));
//       setEdit({ id: null });
//       return;
//     }
//     const r = await api<{ row: Row; children: Children }>(`/api/admin/r/${def.key}/${id}`);
//     if (!r.ok) return setMsg({ kind: "err", text: r.error || "Could not load record." });
//     const row = { ...(r.row as Row) };
//     for (const f of def.fields) if (f.numeric && row[f.name] != null) row[f.name] = String(row[f.name]);
//     // Fix empty / outdated select values coming from old DB rows
//     fixSelects(def, row);
//     setValues(row);
//     setChildren(r.children as Children);
//     setEdit({ id });
//   }

//   async function save() {
//     setSaving(true);
//     setMsg(null);
//     // Last safety net: make sure every managed select has a valid option before sending
//     const body = { ...fixSelects(def, { ...values }), children };
//     const r = await api(edit?.id ? `/api/admin/r/${def.key}/${edit.id}` : `/api/admin/r/${def.key}`, { method: edit?.id ? "PUT" : "POST", json: body });
//     setSaving(false);
//     if (!r.ok) return setMsg({ kind: "err", text: r.error || "Save failed." });
//     setMsg({ kind: "ok", text: `${def.singular[0].toUpperCase()}${def.singular.slice(1)} saved.` });
//     setEdit(null);
//     load();
//   }

//   async function remove() {
//     if (!edit?.id || !confirm(`Delete this ${def.singular}? This cannot be undone.`)) return;
//     const r = await api(`/api/admin/r/${def.key}/${edit.id}`, { method: "DELETE" });
//     if (!r.ok) return setMsg({ kind: "err", text: r.error || "Delete failed." });
//     setMsg({ kind: "ok", text: "Deleted." });
//     setEdit(null);
//     load();
//   }

//   const renderFields = (list: FieldDef[]) => (
//     <div className="grid gap-4 md:grid-cols-2">
//       {list.map((f) => (
//         <div key={f.name} className={f.wide || f.type === "textarea" || f.type === "media" ? "md:col-span-2" : ""}>
//           <FieldInput f={f} value={values[f.name]} options={f.optionsFrom ? optionsMap[f.optionsFrom] : undefined} onChange={(v) => setValues((p) => ({ ...p, [f.name]: v }))} />
//         </div>
//       ))}
//     </div>
//   );

//   /* ------------------------------ editor ------------------------------ */
//   if (edit) {
//     const current = tabs.length ? tab || tabs[0] : "";
//     const shown = tabs.length ? def.fields.filter((f) => f.group === current) : def.fields;
//     return (
//       <div>
//         <div className="mb-4 flex flex-wrap items-center gap-3">
//           <button className="a-btn" onClick={() => setEdit(null)}>← Back</button>
//           <h1 className="text-lg font-bold">{edit.id ? `Edit ${def.singular}` : `New ${def.singular}`}</h1>
//           <div className="ml-auto flex gap-2">
//             {edit.id && def.canDelete !== false && <button className="a-btn a-btn-danger" onClick={remove}>Delete</button>}
//             <button className="a-btn a-btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
//           </div>
//         </div>
//         {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-4 rounded border px-3 py-2 text-[13px] font-semibold ${msg.kind === "err" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{msg.text}</p>}
//         <div className="a-card">
//           {tabs.length > 1 && (
//             <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-slate-200 px-3 pt-2">
//               {tabs.map((t) => (
//                 <button key={t} role="tab" aria-selected={current === t} onClick={() => setTab(t)} className={`whitespace-nowrap border-b-2 px-3 py-2 text-[13px] font-semibold ${current === t ? "border-[#0f5cab] text-[#0f5cab]" : "border-transparent text-slate-500 hover:text-slate-800"}`}>{t}</button>
//               ))}
//             </div>
//           )}
//           <div className="p-5">
//             {current === "Lists" ? (def.children ?? []).map((c) => <ChildEditor key={c.name} def={c} items={children[c.name] ?? []} onChange={(v) => setChildren((p) => ({ ...p, [c.name]: v }))} />) : renderFields(shown)}
//             {!tabs.length && hasChildren && (def.children ?? []).map((c) => <div key={c.name} className="mt-6"><ChildEditor def={c} items={children[c.name] ?? []} onChange={(v) => setChildren((p) => ({ ...p, [c.name]: v }))} /></div>)}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* ------------------------------ list ------------------------------ */
//   const pages = Math.max(1, Math.ceil(total / limit));
//   return (
//     <div>
//       <div className="mb-4 flex flex-wrap items-center gap-3">
//         <h1 className="text-lg font-bold">{def.label}</h1>
//         <span className="a-pill">{total}</span>
//         <div className="ml-auto flex flex-wrap items-center gap-2">
//           <input className="a-input !w-56" placeholder="Search…" aria-label="Search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
//           {(def.filters ?? []).map((f) => (
//             <select key={f.name} aria-label={f.label} className="a-input !w-40" value={filters[f.name] ?? ""} onChange={(e) => { setFilters((p) => ({ ...p, [f.name]: e.target.value })); setPage(1); }}>
//               <option value="">All {f.label.toLowerCase()}</option>
//               {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
//             </select>
//           ))}
//           {def.canCreate !== false && <button className="a-btn a-btn-primary" onClick={() => open(null)}>+ New {def.singular}</button>}
//         </div>
//       </div>
//       {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-4 rounded border px-3 py-2 text-[13px] font-semibold ${msg.kind === "err" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{msg.text}</p>}
//       <div className="a-card admin-scroll overflow-x-auto">
//         <table className="a-table">
//           <thead><tr>{def.columns.map((c) => <th key={c.name}>{c.label}</th>)}<th /></tr></thead>
//           <tbody>
//             {rows.map((r) => (
//               <tr key={r.id} className="cursor-pointer" onClick={() => open(r.id)}>
//                 {def.columns.map((c) => <td key={c.name}><Cell c={c} row={r} def={def} /></td>)}
//                 <td className="text-right"><button className="a-btn" onClick={(e) => { e.stopPropagation(); open(r.id); }} aria-label={`Edit ${String(r[def.titleField] ?? "")}`}>Edit</button></td>
//               </tr>
//             ))}
//             {!loading && rows.length === 0 && <tr><td colSpan={def.columns.length + 1} className="py-10 text-center text-slate-500">Nothing here yet.</td></tr>}
//             {loading && rows.length === 0 && <tr><td colSpan={def.columns.length + 1} className="py-10 text-center text-slate-500">Loading…</td></tr>}
//           </tbody>
//         </table>
//       </div>
//       {pages > 1 && (
//         <div className="mt-4 flex items-center justify-between text-[13px]">
//           <span className="text-slate-500">Page {page} of {pages}</span>
//           <div className="flex gap-2"><button className="a-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><button className="a-btn" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button></div>
//         </div>
//       )}
//     </div>
//   );
// }





// new code 




"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/client";
import type { ChildDef, FieldDef, Opt, ResourceDef } from "@/lib/admin/defs";
import { FieldInput, Thumb } from "@/components/admin/fields";
import { GalleryBulkUpload } from "@/components/admin/GalleryBulkUpload";
import { ImageOptimizer } from "@/components/admin/ImageOptimizer";

type Row = Record<string, unknown> & { id: number };
type Children = Record<string, Record<string, unknown>[]>;

const TRUE_DEFAULTS = ["isActive", "isPublished", "heroAnimate", "heroParallax"];

// Sections whose existing pictures can be shrunk in one click: resource key -> longest side (px)
const OPTIMIZABLE: Record<string, number> = { gallery: 1280, who_we_are: 1400 };

// Fields whose select value must always be one of the available options
function isManagedSelect(f: FieldDef) {
  return (
    f.type === "select" &&
    !!f.options &&
    f.options.length > 0 &&
    (!!f.required || f.name.startsWith("hero") || f.name === "icon" || f.name === "diagram" || f.name === "employmentType" || f.name === "robots")
  );
}

// Pick a safe default option for a select field
function selectDefault(f: FieldDef): string {
  const opts = f.options ?? [];
  if (f.name === "heroPosDesktop" || f.name === "heroPosMobile") {
    const center = opts.find((o) => o.value === "center center") ?? opts.find((o) => o.value === "center");
    if (center) return center.value;
  }
  return opts[0]?.value ?? "";
}

// Replace empty / outdated select values with a valid option so the server never rejects them
function fixSelects(def: ResourceDef, row: Record<string, unknown>) {
  for (const f of def.fields) {
    if (!isManagedSelect(f)) continue;
    const cur = String(row[f.name] ?? "");
    if (!(f.options ?? []).some((o) => o.value === cur)) row[f.name] = selectDefault(f);
  }
  return row;
}

function defaultsFor(def: ResourceDef, filters: Record<string, string>) {
  const v: Record<string, unknown> = {};
  for (const f of def.fields) {
    if (f.type === "boolean") v[f.name] = TRUE_DEFAULTS.includes(f.name);
    else if (f.type === "number") v[f.name] = f.name === "heroOverlayOpacity" ? 78 : f.name === "heroHeight" ? 600 : f.name === "openings" ? 1 : 0;
    else if (f.type === "color") v[f.name] = "#0A1F44";
    else if (isManagedSelect(f)) v[f.name] = selectDefault(f);
    else v[f.name] = "";
  }
  for (const [k, val] of Object.entries(filters)) if (val && k in v) v[k] = val;
  return v;
}

function ChildEditor({ def, items, onChange }: { def: ChildDef; items: Record<string, unknown>[]; onChange: (v: Record<string, unknown>[]) => void }) {
  const move = (i: number, d: number) => {
    const n = [...items];
    const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center justify-between"><h4 className="text-[13px] font-bold">{def.label} <span className="font-normal text-slate-500">({items.length})</span></h4><button type="button" className="a-btn" onClick={() => onChange([...items, {}])}>+ Add</button></div>
      <div className="space-y-2">
        {items.map((it, i) => (
          <div key={i} className="grid gap-3 rounded border border-slate-200 bg-slate-50/60 p-3 sm:grid-cols-[1fr_auto]">
            <div className="grid gap-3 md:grid-cols-2">
              {def.fields.map((f) => (
                <div key={f.name} className={f.type === "textarea" || f.type === "media" ? "md:col-span-2" : ""}>
                  <FieldInput f={f} idPrefix={`${def.name}-${i}`} value={it[f.name]} onChange={(val) => onChange(items.map((x, k) => (k === i ? { ...x, [f.name]: val } : x)))} />
                </div>
              ))}
            </div>
            <div className="flex gap-1 sm:flex-col">
              <button type="button" className="a-btn !px-2" onClick={() => move(i, -1)} aria-label="Move up">↑</button>
              <button type="button" className="a-btn !px-2" onClick={() => move(i, 1)} aria-label="Move down">↓</button>
              <button type="button" className="a-btn a-btn-danger !px-2" onClick={() => onChange(items.filter((_, k) => k !== i))} aria-label="Remove">✕</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-[12.5px] text-slate-500">None yet.</p>}
      </div>
    </div>
  );
}

function Cell({ c, row, def }: { c: ResourceDef["columns"][number]; row: Row; def: ResourceDef }) {
  const v = row[c.name];
  if (c.type === "media") return v ? <Thumb item={{ kind: "image", url: String(v), title: "" }} className="h-9 w-14 rounded" /> : <span className="block h-9 w-14 rounded bg-slate-100" />;
  if (c.type === "bool") return <span className={v ? "text-emerald-700" : "text-slate-400"}>{v ? "● Yes" : "○ No"}</span>;
  if (c.type === "date") return <>{v ? new Date(String(v)).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—"}</>;
  if (c.type === "badge") {
    const s = String(v ?? "");
    const cls = ["published", "active", "resolved"].includes(s) ? "ok" : ["draft", "inactive", "new", "scheduled", "in_progress"].includes(s) ? "warn" : s === "closed" || s === "spam" ? "crit" : "info";
    return <span className={`a-pill ${cls}`}>{s.replace(/_/g, " ")}</span>;
  }
  if (c.type === "mono") return <code className="text-[12px] text-slate-600">{String(v ?? "")}</code>;
  return <span className={c.name === def.titleField ? "font-semibold" : ""}>{String(v ?? "") || "—"}</span>;
}

export function ResourceManager({ def, optionsMap, initialFilters }: { def: ResourceDef; optionsMap: Record<string, Opt[]>; initialFilters: Record<string, string> }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<{ id: number | null } | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const [children, setChildren] = useState<Children>({});
  const [tab, setTab] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  // Gallery only: "Upload multiple" dialog
  const [bulk, setBulk] = useState(false);
  // Gallery / Who We Are: "Optimize images" dialog
  const [optimize, setOptimize] = useState(false);
  const limit = 20;

  const load = useCallback(async () => {
    setLoading(true);
    const qs = new URLSearchParams({ page: String(page), limit: String(limit), q });
    for (const [k, v] of Object.entries(filters)) if (v) qs.set(`f_${k}`, v);
    const r = await api<{ rows: Row[]; total: number }>(`/api/admin/r/${def.key}?${qs}`);
    if (r.ok) { setRows(r.rows as Row[]); setTotal(r.total as number); }
    else setMsg({ kind: "err", text: r.error || "Could not load." });
    setLoading(false);
  }, [def.key, page, q, filters]);
  useEffect(() => { const t = setTimeout(load, 180); return () => clearTimeout(t); }, [load]);

  const groups = def.groups ?? [];
  const hasChildren = (def.children?.length ?? 0) > 0;
  const tabs = hasChildren ? [...groups.filter((g) => def.fields.some((f) => f.group === g)), "Lists"] : groups.filter((g) => def.fields.some((f) => f.group === g));

  async function open(id: number | null) {
    setMsg(null);
    setTab(tabs[0] ?? "");
    if (id === null) {
      setValues(defaultsFor(def, filters));
      setChildren(Object.fromEntries((def.children ?? []).map((c) => [c.name, []])));
      setEdit({ id: null });
      return;
    }
    const r = await api<{ row: Row; children: Children }>(`/api/admin/r/${def.key}/${id}`);
    if (!r.ok) return setMsg({ kind: "err", text: r.error || "Could not load record." });
    const row = { ...(r.row as Row) };
    for (const f of def.fields) if (f.numeric && row[f.name] != null) row[f.name] = String(row[f.name]);
    // Fix empty / outdated select values coming from old DB rows
    fixSelects(def, row);
    setValues(row);
    setChildren(r.children as Children);
    setEdit({ id });
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    // Last safety net: make sure every managed select has a valid option before sending
    const body = { ...fixSelects(def, { ...values }), children };
    const r = await api(edit?.id ? `/api/admin/r/${def.key}/${edit.id}` : `/api/admin/r/${def.key}`, { method: edit?.id ? "PUT" : "POST", json: body });
    setSaving(false);
    if (!r.ok) return setMsg({ kind: "err", text: r.error || "Save failed." });
    setMsg({ kind: "ok", text: `${def.singular[0].toUpperCase()}${def.singular.slice(1)} saved.` });
    setEdit(null);
    load();
  }

  async function remove() {
    if (!edit?.id || !confirm(`Delete this ${def.singular}? This cannot be undone.`)) return;
    const r = await api(`/api/admin/r/${def.key}/${edit.id}`, { method: "DELETE" });
    if (!r.ok) return setMsg({ kind: "err", text: r.error || "Delete failed." });
    setMsg({ kind: "ok", text: "Deleted." });
    setEdit(null);
    load();
  }

  const renderFields = (list: FieldDef[]) => (
    <div className="grid gap-4 md:grid-cols-2">
      {list.map((f) => (
        <div key={f.name} className={f.wide || f.type === "textarea" || f.type === "media" ? "md:col-span-2" : ""}>
          <FieldInput f={f} value={values[f.name]} options={f.optionsFrom ? optionsMap[f.optionsFrom] : undefined} onChange={(v) => setValues((p) => ({ ...p, [f.name]: v }))} />
        </div>
      ))}
    </div>
  );

  /* ------------------------------ editor ------------------------------ */
  if (edit) {
    const current = tabs.length ? tab || tabs[0] : "";
    const shown = tabs.length ? def.fields.filter((f) => f.group === current) : def.fields;
    return (
      <div>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <button className="a-btn" onClick={() => setEdit(null)}>← Back</button>
          <h1 className="text-lg font-bold">{edit.id ? `Edit ${def.singular}` : `New ${def.singular}`}</h1>
          <div className="ml-auto flex gap-2">
            {edit.id && def.canDelete !== false && <button className="a-btn a-btn-danger" onClick={remove}>Delete</button>}
            <button className="a-btn a-btn-primary" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</button>
          </div>
        </div>
        {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-4 rounded border px-3 py-2 text-[13px] font-semibold ${msg.kind === "err" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{msg.text}</p>}
        <div className="a-card">
          {tabs.length > 1 && (
            <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-slate-200 px-3 pt-2">
              {tabs.map((t) => (
                <button key={t} role="tab" aria-selected={current === t} onClick={() => setTab(t)} className={`whitespace-nowrap border-b-2 px-3 py-2 text-[13px] font-semibold ${current === t ? "border-[#0f5cab] text-[#0f5cab]" : "border-transparent text-slate-500 hover:text-slate-800"}`}>{t}</button>
              ))}
            </div>
          )}
          <div className="p-5">
            {current === "Lists" ? (def.children ?? []).map((c) => <ChildEditor key={c.name} def={c} items={children[c.name] ?? []} onChange={(v) => setChildren((p) => ({ ...p, [c.name]: v }))} />) : renderFields(shown)}
            {!tabs.length && hasChildren && (def.children ?? []).map((c) => <div key={c.name} className="mt-6"><ChildEditor def={c} items={children[c.name] ?? []} onChange={(v) => setChildren((p) => ({ ...p, [c.name]: v }))} /></div>)}
          </div>
        </div>
      </div>
    );
  }

  /* ------------------------------ list ------------------------------ */
  const pages = Math.max(1, Math.ceil(total / limit));
  const optimizeMax = OPTIMIZABLE[def.key];
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h1 className="text-lg font-bold">{def.label}</h1>
        <span className="a-pill">{total}</span>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <input className="a-input !w-56" placeholder="Search…" aria-label="Search" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} />
          {(def.filters ?? []).map((f) => (
            <select key={f.name} aria-label={f.label} className="a-input !w-40" value={filters[f.name] ?? ""} onChange={(e) => { setFilters((p) => ({ ...p, [f.name]: e.target.value })); setPage(1); }}>
              <option value="">All {f.label.toLowerCase()}</option>
              {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}
          {/* Gallery / Who We Are: shrink the pictures that are already uploaded */}
          {optimizeMax && <button className="a-btn" onClick={() => setOptimize(true)}>⚡ Optimize images</button>}
          {/* Gallery: add many images / videos at once */}
          {def.key === "gallery" && def.canCreate !== false && <button className="a-btn" onClick={() => setBulk(true)}>⬆ Upload multiple</button>}
          {def.canCreate !== false && <button className="a-btn a-btn-primary" onClick={() => open(null)}>+ New {def.singular}</button>}
        </div>
      </div>
      {msg && <p role={msg.kind === "err" ? "alert" : "status"} className={`mb-4 rounded border px-3 py-2 text-[13px] font-semibold ${msg.kind === "err" ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{msg.text}</p>}
      <div className="a-card admin-scroll overflow-x-auto">
        <table className="a-table">
          <thead><tr>{def.columns.map((c) => <th key={c.name}>{c.label}</th>)}<th /></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="cursor-pointer" onClick={() => open(r.id)}>
                {def.columns.map((c) => <td key={c.name}><Cell c={c} row={r} def={def} /></td>)}
                <td className="text-right"><button className="a-btn" onClick={(e) => { e.stopPropagation(); open(r.id); }} aria-label={`Edit ${String(r[def.titleField] ?? "")}`}>Edit</button></td>
              </tr>
            ))}
            {!loading && rows.length === 0 && <tr><td colSpan={def.columns.length + 1} className="py-10 text-center text-slate-500">Nothing here yet.</td></tr>}
            {loading && rows.length === 0 && <tr><td colSpan={def.columns.length + 1} className="py-10 text-center text-slate-500">Loading…</td></tr>}
          </tbody>
        </table>
      </div>
      {pages > 1 && (
        <div className="mt-4 flex items-center justify-between text-[13px]">
          <span className="text-slate-500">Page {page} of {pages}</span>
          <div className="flex gap-2"><button className="a-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><button className="a-btn" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</button></div>
        </div>
      )}

      {bulk && (
        <GalleryBulkUpload
          startOrder={total}
          onClose={() => setBulk(false)}
          onFinished={() => {
            load();
          }}
        />
      )}

      {optimize && optimizeMax && (
        <ImageOptimizer
          resourceKey={def.key}
          maxSide={optimizeMax}
          onClose={() => setOptimize(false)}
          onFinished={() => {
            load();
          }}
        />
      )}
    </div>
  );
}
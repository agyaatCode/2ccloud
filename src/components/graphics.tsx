// "use client";
// import { useEffect, useRef, type ReactNode } from "react";
// import { PauseOffscreen } from "@/components/motion";

// export type GlyphKind =
//   | "user" | "globe" | "shield" | "lb" | "server" | "db" | "backup" | "cloud" | "mail" | "key" | "code"
//   | "monitor" | "box" | "lock" | "scan" | "hybrid" | "migrate" | "pipeline" | "endpoint" | "identity";

// const P: Record<GlyphKind, ReactNode> = {
//   user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-4 3-6 7-6s7 2 7 6" /></>,
//   globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17" /></>,
//   shield: <><path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>,
//   lb: <><circle cx="12" cy="5" r="1.8" /><path d="M12 7v3M12 10l-6 5M12 10l6 5M6 15v4M18 15v4M12 10v9" /></>,
//   server: <><rect x="4" y="4" width="16" height="6" rx="1" /><rect x="4" y="14" width="16" height="6" rx="1" /><path d="M7.5 7h.01M7.5 17h.01" /></>,
//   db: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" /></>,
//   backup: <><path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v4h-4" /><path d="M12 8v4l3 2" /></>,
//   cloud: <path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5a4.2 4.2 0 0 1-.5 8.5z" />,
//   mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="M4 7l8 6 8-6" /></>,
//   key: <><circle cx="8" cy="12" r="3.5" /><path d="M11.5 12H21M17 12v3M20 12v2.5" /></>,
//   code: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />,
//   monitor: <><rect x="3" y="4.5" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16.5V20M6 12l3-3 3 2 4-4" /></>,
//   box: <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5L12 12l8-4.5M12 12v9" /></>,
//   lock: <><rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
//   scan: <><circle cx="11" cy="11" r="6" /><path d="M16 16l5 5" /></>,
//   hybrid: <><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="12" cy="18" r="2.5" /><path d="M8 7l3 9M16 7l-3 9M8.5 6h7" /></>,
//   migrate: <path d="M4 8h14l-3-3M20 16H6l3 3" />,
//   pipeline: <><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /><path d="M7 12h3M14 12h3" /></>,
//   endpoint: <><rect x="5" y="5" width="14" height="10" rx="1" /><path d="M3 19h18" /></>,
//   identity: <><rect x="3.5" y="5" width="17" height="14" rx="1.5" /><circle cx="9" cy="11" r="2" /><path d="M6 16c0-2 1.5-3 3-3s3 1 3 3M14 10h4M14 13h4" /></>,
// };

// export function Glyph({ kind, x = 0, y = 0, size = 24, color = "currentColor", sw = 1.5 }: { kind: GlyphKind; x?: number; y?: number; size?: number; color?: string; sw?: number }) {
//   return (
//     <g transform={`translate(${x} ${y}) scale(${size / 24})`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
//       {P[kind]}
//     </g>
//   );
// }

// const asKind = (k: string): GlyphKind => (k in P ? (k as GlyphKind) : "cloud");

// /** Animated service icon — animates on card hover (`group`) or always with `.always`. */
// export function ServiceIcon({ kind, className = "" }: { kind: string; className?: string }) {
//   const k = asKind(kind);
//   return (
//     <svg viewBox="0 0 48 48" className={`svc-icon ${className.includes("text-") ? "" : "text-brand-600"} ${className}`} aria-hidden="true">
//       <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.5" />
//       <g className={k === "shield" || k === "server" || k === "migrate" ? "" : "icon-float"}>
//         <Glyph kind={k} x={10} y={10} size={28} />
//       </g>
//       {k === "server" && (<><circle cx="31.5" cy="17.7" r="1.4" className="led-pulse fill-ok" /><circle cx="31.5" cy="30.3" r="1.4" className="led-pulse d2 fill-ok" /></>)}
//       {k === "shield" && <line x1="17" x2="31" y1="17" y2="17" className="icon-scan stroke-ok" strokeWidth="1.6" strokeLinecap="round" />}
//       {k === "migrate" && (<><rect x="9" y="38" width="4" height="3" className="icon-move fill-ok" /><rect x="9" y="38" width="4" height="3" className="icon-move d1 fill-ok" /></>)}
//       {(k === "cloud" || k === "hybrid") && (<><circle cx="15" cy="41" r="1.2" className="led-pulse fill-ok" /><circle cx="24" cy="41" r="1.2" className="led-pulse d1 fill-ok" /><circle cx="33" cy="41" r="1.2" className="led-pulse d2 fill-ok" /></>)}
//       {(k === "pipeline" || k === "code" || k === "box") && <circle cx="40" cy="8" r="2" className="led-pulse fill-ok" />}
//       {(k === "mail" || k === "backup" || k === "monitor" || k === "identity" || k === "lock" || k === "scan" || k === "endpoint") && <circle cx="40" cy="8" r="2" className="led-pulse fill-ok" />}
//     </svg>
//   );
// }

// /* ------------------------------ flow diagrams ------------------------------ */
// type GN = { id: string; x: number; y: number; w?: number; label: string; sub?: string; g: GlyphKind; bad?: boolean };
// type GE = { a: string; b: string; bad?: boolean };
// type Diagram = { w: number; h: number; nodes: GN[]; edges: GE[] };
// const NW = 128;
// const NH = 62;

// function linear(items: [string, string, GlyphKind][]): Diagram {
//   const n = items.length;
//   const nw = n > 5 ? 112 : 126;
//   const gap = (880 - 20 - n * nw) / (n - 1);
//   const nodes = items.map(([label, sub, g], i) => ({ id: `n${i}`, x: 10 + i * (nw + gap), y: 66, w: nw, label, sub, g }));
//   return { w: 880, h: 194, nodes, edges: nodes.slice(1).map((n2, i) => ({ a: `n${i}`, b: n2.id })) };
// }

// function tiered(labels: { edge: [string, string, GlyphKind]; lb: [string, string, GlyphKind]; app: [string, string, GlyphKind]; data: [string, string, GlyphKind]; bak: [string, string, GlyphKind]; user?: [string, string, GlyphKind] }): Diagram {
//   const u = labels.user ?? ["Users", "Browsers & apps", "globe"];
//   const mk = (id: string, x: number, y: number, t: [string, string, GlyphKind]): GN => ({ id, x, y, label: t[0], sub: t[1], g: t[2] });
//   return {
//     w: 880, h: 340,
//     nodes: [mk("u", 8, 139, u), mk("e", 178, 139, labels.edge), mk("l", 348, 139, labels.lb), mk("a1", 518, 52, labels.app), mk("a2", 518, 226, { ...labels.app } as [string, string, GlyphKind]), mk("d", 744, 52, labels.data), mk("b", 744, 226, labels.bak)].map((n) => (n.w ? n : { ...n, w: n.id === "d" || n.id === "b" ? 128 : NW })),
//     edges: [{ a: "u", b: "e" }, { a: "e", b: "l" }, { a: "l", b: "a1" }, { a: "l", b: "a2" }, { a: "a1", b: "d" }, { a: "a2", b: "d" }, { a: "d", b: "b" }],
//   };
// }

// const DIAGRAMS: Record<string, Diagram> = {
//   cloud: tiered({ edge: ["CDN + WAF", "Edge protection", "shield"], lb: ["Load balancer", "Multi-zone", "lb"], app: ["App nodes", "Auto-scaling", "server"], data: ["Database", "Replicated", "db"], bak: ["Backup", "Cross-region", "backup"] }),
//   private: tiered({ edge: ["Firewall", "Segmented zones", "shield"], lb: ["Core switching", "Redundant fabric", "lb"], app: ["Hypervisors", "HA cluster", "server"], data: ["Storage", "SAN / SDS", "db"], bak: ["Backup", "Offsite copy", "backup"], user: ["Users", "Office & VPN", "globe"] }),
//   hybrid: {
//     w: 880, h: 340,
//     nodes: [
//       { id: "o", x: 8, y: 139, label: "Private cloud", sub: "Data centre", g: "server" },
//       { id: "i", x: 376, y: 24, label: "Shared identity", sub: "SSO + MFA", g: "key" },
//       { id: "l", x: 376, y: 139, label: "Secure link", sub: "VPN / dedicated", g: "lock" },
//       { id: "m", x: 376, y: 254, label: "Unified monitoring", sub: "Health & cost", g: "monitor" },
//       { id: "c", x: 744, y: 139, label: "Public cloud", sub: "AWS · Azure · GCP", g: "cloud" },
//     ],
//     edges: [{ a: "o", b: "l" }, { a: "l", b: "c" }, { a: "i", b: "l" }, { a: "l", b: "m" }],
//   },
//   ddos: {
//     w: 880, h: 340,
//     nodes: [
//       { id: "x", x: 8, y: 36, label: "Attack traffic", sub: "Floods & bots", g: "scan", bad: true },
//       { id: "u", x: 8, y: 226, label: "Legitimate users", sub: "Customers", g: "user" },
//       { id: "s", x: 226, y: 139, label: "Scrubbing", sub: "Filter at the edge", g: "shield" },
//       { id: "w", x: 440, y: 139, label: "WAF + rate limit", sub: "Layer 7 rules", g: "shield" },
//       { id: "l", x: 640, y: 139, label: "Load balancer", sub: "Clean traffic", g: "lb" },
//       { id: "a", x: 760, y: 252, w: 112, label: "Services", sub: "Online", g: "server" },
//     ],
//     edges: [{ a: "x", b: "s", bad: true }, { a: "u", b: "s" }, { a: "s", b: "w" }, { a: "w", b: "l" }, { a: "l", b: "a" }],
//   },
//   migration: linear([["Source servers", "On-premises", "server"], ["Discovery", "Dependency map", "scan"], ["Replication", "Continuous sync", "migrate"], ["Validation", "Integrity checks", "shield"], ["Target cloud", "Cutover + rollback", "cloud"]]),
//   devops: linear([["Commit", "Git push", "code"], ["Build", "Container image", "box"], ["Test", "Unit + integration", "scan"], ["Scan", "Security checks", "shield"], ["Deploy", "Canary rollout", "cloud"], ["Monitor", "Alerts & SLOs", "monitor"]]),
//   monitoring: linear([["Servers", "Network · storage", "server"], ["Agents", "Metrics & logs", "monitor"], ["Alert engine", "Thresholds", "scan"], ["NOC", "24×7 triage", "monitor"], ["Engineer", "Resolve & report", "user"]]),
//   continuity: linear([["Production", "Primary systems", "server"], ["Backup", "Scheduled jobs", "backup"], ["Offsite copy", "Immutable", "cloud"], ["DR site", "Failover ready", "server"], ["Restore test", "Verified drills", "shield"]]),
//   datasec: linear([["Users", "Authenticated", "user"], ["Access control", "Least privilege", "key"], ["Applications", "Policy enforced", "server"], ["Encryption", "At rest + transit", "lock"], ["Data stores", "Audited", "db"], ["Backup", "Encrypted", "backup"]]),
//   vapt: linear([["Scope", "Rules of engagement", "box"], ["Recon", "Attack surface", "globe"], ["Scan", "Vulnerabilities", "scan"], ["Exploit", "Manual testing", "code"], ["Report", "Prioritised", "monitor"], ["Retest", "Fix verification", "shield"]]),
//   endpoint: linear([["Endpoints", "Laptops · servers", "endpoint"], ["Agent", "Behaviour checks", "shield"], ["Console", "Central policy", "monitor"], ["Threat intel", "Updated signatures", "globe"], ["Response", "Isolate & clean", "lock"]]),
//   identity: linear([["User", "Sign-in request", "user"], ["MFA", "Second factor", "key"], ["Domain controller", "Authenticate", "identity"], ["Group policy", "Access rules", "server"], ["Applications", "Single sign-on", "cloud"]]),
//   email: linear([["Sender", "Internet", "globe"], ["Spam filter", "Anti-malware", "shield"], ["Mail platform", "Delivery", "mail"], ["Mailbox", "Encrypted store", "db"], ["Archive", "Backup & retention", "backup"]]),
// };

// function edgePath(a: GN, b: GN): string {
//   const aw = a.w ?? NW;
//   const bw = b.w ?? NW;
//   if (b.x > a.x + aw / 2) {
//     const x1 = a.x + aw, y1 = a.y + NH / 2, x2 = b.x, y2 = b.y + NH / 2;
//     const xm = (x1 + x2) / 2;
//     return `M${x1} ${y1} C${xm} ${y1} ${xm} ${y2} ${x2} ${y2}`;
//   }
//   const x1 = a.x + aw / 2, y1 = a.y + NH, x2 = b.x + bw / 2, y2 = b.y;
//   return y2 > y1 ? `M${x1} ${y1} L${x2} ${y2}` : `M${a.x + aw / 2} ${a.y} L${b.x + bw / 2} ${b.y + NH}`;
// }

// export function FlowDiagram({ variant = "cloud", caption }: { variant?: string; caption?: string }) {
//   const d = DIAGRAMS[variant] ?? DIAGRAMS.cloud;
//   const byId = Object.fromEntries(d.nodes.map((n) => [n.id, n]));
//   const ordered = [...d.nodes].sort((a, b) => a.x - b.x || a.y - b.y);
//   const svgRef = useRef<SVGSVGElement>(null);
//   useEffect(() => {
//     if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) svgRef.current?.pauseAnimations?.();
//   }, []);
//   return (
//     <PauseOffscreen>
//       {/* desktop / tablet: SVG topology */}
//       <svg ref={svgRef} viewBox={`0 0 ${d.w} ${d.h}`} className="hidden h-auto w-full md:block" role="img" aria-label={caption || `${variant} architecture diagram`}>
//         {d.edges.map((e, i) => {
//           const a = byId[e.a], b = byId[e.b];
//           const p = edgePath(a, b);
//           const col = e.bad ? "#d4343a" : "#3e8fe0";
//           return (
//             <g key={i}>
//               <path d={p} fill="none" stroke={col} strokeOpacity={0.18} strokeWidth="2" />
//               <path d={p} fill="none" stroke={col} strokeOpacity={e.bad ? 0.6 : 0.85} strokeWidth="1.5" className="flow-line" />
//               {[0, 1].map((k) => (
//                 <circle key={k} r="3.2" fill={e.bad ? "#d4343a" : "#3ddc97"} opacity="0">
//                   <animateMotion dur={`${2.8 + (i % 3) * 0.3}s`} begin={`${k * 1.4 + i * 0.35}s`} repeatCount="indefinite" path={p} calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.45 0 0.25 1" />
//                   <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.88;1" dur={`${2.8 + (i % 3) * 0.3}s`} begin={`${k * 1.4 + i * 0.35}s`} repeatCount="indefinite" />
//                 </circle>
//               ))}
//             </g>
//           );
//         })}
//         {d.nodes.map((n) => {
//           const w = n.w ?? NW;
//           const stroke = n.bad ? "#d4343a" : "#2f66a8";
//           return (
//             <g key={n.id}>
//               <rect x={n.x} y={n.y} width={w} height={NH} rx="5" fill="#0d2a55" stroke={stroke} strokeOpacity={n.bad ? 0.8 : 1} />
//               <rect x={n.x} y={n.y} width="3" height={NH} fill={n.bad ? "#d4343a" : "#3e8fe0"} />
//               <Glyph kind={n.g} x={n.x + 14} y={n.y + 19} size={24} color={n.bad ? "#f08a8d" : "#8fc2f5"} />
//               <text x={n.x + 46} y={n.y + 28} fill="#fff" fontSize="12.5" fontWeight="600" fontFamily="var(--font-sans)">{n.label}</text>
//               {n.sub && <text x={n.x + 46} y={n.y + 44} fill="#8fa9c9" fontSize="10.5" fontFamily="var(--font-sans)">{n.sub}</text>}
//             </g>
//           );
//         })}
//       </svg>
//       {/* mobile: simplified vertical sequence */}
//       <ol className="md:hidden" aria-label={caption || "Architecture flow"}>
//         {ordered.map((n, i) => (
//           <li key={n.id}>
//             <div className="flex items-center gap-4">
//               <span className={`flex h-10 w-10 shrink-0 items-center justify-center border ${n.bad ? "border-crit/70 text-red-300" : "border-brand-500/60 text-brand-300"} bg-navy-800`}>
//                 <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><Glyph kind={n.g} /></svg>
//               </span>
//               <span>
//                 <span className="block text-[14px] font-semibold text-white">{n.label}</span>
//                 <span className="block text-[12px] text-white/60">{n.sub}</span>
//               </span>
//             </div>
//             {i < ordered.length - 1 && <span className="vflow ml-[19.5px] block h-6 w-px" aria-hidden="true" />}
//           </li>
//         ))}
//       </ol>
//     </PauseOffscreen>
//   );
// }

// /* ------------------------------ DevOps terminal ------------------------------ */
// const LOG: [string, string, string][] = [
//   ["$", "git push origin main", ""],
//   ["ok", "checkout + restore cache", "0.8s"],
//   ["ok", "build container image", "41s"],
//   ["ok", "unit + integration tests", "1m 12s"],
//   ["ok", "dependency & image scan", "0 critical"],
//   ["ok", "terraform plan", "3 to change"],
//   ["→", "deploy canary 10%", "healthy"],
//   ["ok", "promote to 100%", "rollout complete"],
// ];

// export function PipelineTerminal() {
//   const ref = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     const el = ref.current;
//     if (!el) return;
//     const io = new IntersectionObserver(([e]) => {
//       if (e.isIntersecting) {
//         el.dataset.play = "true";
//         io.disconnect();
//       }
//     }, { threshold: 0.35 });
//     io.observe(el);
//     return () => io.disconnect();
//   }, []);
//   return (
//     <div ref={ref} data-play="false" className="term overflow-hidden border border-white/10 bg-navy-950/80 font-mono text-[12.5px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]" role="img" aria-label="Illustrative CI/CD pipeline run">
//       <div className="flex items-center justify-between border-b border-white/10 bg-navy-900 px-4 py-2.5 text-[11px] text-white/50">
//         <span className="flex gap-1.5" aria-hidden="true"><i className="h-2 w-2 rounded-full bg-white/20" /><i className="h-2 w-2 rounded-full bg-white/20" /><i className="h-2 w-2 rounded-full bg-white/20" /></span>
//         <span>pipeline · main</span>
//         <span>illustrative</span>
//       </div>
//       <ul className="space-y-1.5 p-5">
//         {LOG.map(([m, t, r], i) => (
//           <li key={i} className="tline flex items-center gap-3" style={{ "--i": i } as React.CSSProperties}>
//             <span className={`w-4 shrink-0 ${m === "ok" ? "text-ok" : m === "→" ? "text-brand-300" : "text-white/50"}`}>{m === "ok" ? "✓" : m}</span>
//             <span className={m === "$" ? "text-white" : "text-white/80"}>{t}</span>
//             {r && <span className="ml-auto text-white/40">{r}</span>}
//           </li>
//         ))}
//         <li className="tline flex items-center gap-3 pt-1 text-white/60" style={{ "--i": LOG.length } as React.CSSProperties}>
//           <span className="w-4">$</span><span className="caret inline-block h-3.5 w-2 bg-white/70" />
//         </li>
//       </ul>
//     </div>
//   );
// }

// /* ------------------------------ monitoring panel ------------------------------ */
// export function MonitorPanel() {
//   const rows: [string, number, string][] = [["Compute clusters", 94, "Operational"], ["Network edge", 88, "Operational"], ["Storage arrays", 79, "Operational"], ["Backup jobs", 96, "Operational"], ["Security events", 41, "Monitoring"]];
//   return (
//     <div className="border border-white/15 bg-navy-950/75 p-5 backdrop-blur-sm" role="img" aria-label="Illustrative monitoring dashboard">
//       <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 text-[11px] uppercase tracking-[0.12em] text-white/55">
//         <span className="font-mono">Service health</span><span className="font-mono">Illustrative</span>
//       </div>
//       <ul className="space-y-4">
//         {rows.map(([l, v, s], i) => (
//           <li key={l}>
//             <div className="mb-1.5 flex items-center justify-between text-[13px]">
//               <span className="text-white/90">{l}</span>
//               <span className={`flex items-center gap-1.5 text-[11.5px] ${s === "Operational" ? "text-ok" : "text-warn"}`}>
//                 <i className={`led-pulse h-1.5 w-1.5 rounded-full ${s === "Operational" ? "bg-ok" : "bg-warn"}`} style={{ animationDelay: `${i * 0.4}s` }} />{s}
//               </span>
//             </div>
//             <div className="h-1 bg-white/10"><div className="bar-grow h-full bg-brand-400" style={{ width: `${v}%`, animationDelay: `${i * 0.15}s` }} /></div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }








// new new code 









"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { PauseOffscreen } from "@/components/motion";

export type GlyphKind =
  | "user" | "globe" | "shield" | "lb" | "server" | "db" | "backup" | "cloud" | "mail" | "key" | "code"
  | "monitor" | "box" | "lock" | "scan" | "hybrid" | "migrate" | "pipeline" | "endpoint" | "identity";

const P: Record<GlyphKind, ReactNode> = {
  user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-4 3-6 7-6s7 2 7 6" /></>,
  globe: <><circle cx="12" cy="12" r="8.5" /><path d="M3.5 12h17M12 3.5c3 3 3 14 0 17M12 3.5c-3 3-3 14 0 17" /></>,
  shield: <><path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z" /><path d="M9 12l2 2 4-4" /></>,
  lb: <><circle cx="12" cy="5" r="1.8" /><path d="M12 7v3M12 10l-6 5M12 10l6 5M6 15v4M18 15v4M12 10v9" /></>,
  server: <><rect x="4" y="4" width="16" height="6" rx="1" /><rect x="4" y="14" width="16" height="6" rx="1" /><path d="M7.5 7h.01M7.5 17h.01" /></>,
  db: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3" /></>,
  backup: <><path d="M20 12a8 8 0 1 1-2.5-5.8M20 4v4h-4" /><path d="M12 8v4l3 2" /></>,
  cloud: <path d="M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9.5a4.2 4.2 0 0 1-.5 8.5z" />,
  mail: <><rect x="3.5" y="5.5" width="17" height="13" rx="1.5" /><path d="M4 7l8 6 8-6" /></>,
  key: <><circle cx="8" cy="12" r="3.5" /><path d="M11.5 12H21M17 12v3M20 12v2.5" /></>,
  code: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12" />,
  monitor: <><rect x="3" y="4.5" width="18" height="12" rx="1.5" /><path d="M8 20h8M12 16.5V20M6 12l3-3 3 2 4-4" /></>,
  box: <><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5L12 12l8-4.5M12 12v9" /></>,
  lock: <><rect x="5" y="11" width="14" height="9" rx="1.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  scan: <><circle cx="11" cy="11" r="6" /><path d="M16 16l5 5" /></>,
  hybrid: <><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="12" cy="18" r="2.5" /><path d="M8 7l3 9M16 7l-3 9M8.5 6h7" /></>,
  migrate: <path d="M4 8h14l-3-3M20 16H6l3 3" />,
  pipeline: <><circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" /><path d="M7 12h3M14 12h3" /></>,
  endpoint: <><rect x="5" y="5" width="14" height="10" rx="1" /><path d="M3 19h18" /></>,
  identity: <><rect x="3.5" y="5" width="17" height="14" rx="1.5" /><circle cx="9" cy="11" r="2" /><path d="M6 16c0-2 1.5-3 3-3s3 1 3 3M14 10h4M14 13h4" /></>,
};

export function Glyph({ kind, x = 0, y = 0, size = 24, color = "currentColor", sw = 1.5 }: { kind: GlyphKind; x?: number; y?: number; size?: number; color?: string; sw?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size / 24})`} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
      {P[kind]}
    </g>
  );
}

const asKind = (k: string): GlyphKind => (k in P ? (k as GlyphKind) : "cloud");

/** Animated service icon — animates on card hover (`group`) or always with `.always`. */
export function ServiceIcon({ kind, className = "" }: { kind: string; className?: string }) {
  const k = asKind(kind);
  return (
    <svg viewBox="0 0 48 48" className={`svc-icon ${className.includes("text-") ? "" : "text-brand-600"} ${className}`} aria-hidden="true">
      <rect x="0.75" y="0.75" width="46.5" height="46.5" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.5" />
      <g className={k === "shield" || k === "server" || k === "migrate" ? "" : "icon-float"}>
        <Glyph kind={k} x={10} y={10} size={28} />
      </g>
      {k === "server" && (<><circle cx="31.5" cy="17.7" r="1.4" className="led-pulse fill-ok" /><circle cx="31.5" cy="30.3" r="1.4" className="led-pulse d2 fill-ok" /></>)}
      {k === "shield" && <line x1="17" x2="31" y1="17" y2="17" className="icon-scan stroke-ok" strokeWidth="1.6" strokeLinecap="round" />}
      {k === "migrate" && (<><rect x="9" y="38" width="4" height="3" className="icon-move fill-ok" /><rect x="9" y="38" width="4" height="3" className="icon-move d1 fill-ok" /></>)}
      {(k === "cloud" || k === "hybrid") && (<><circle cx="15" cy="41" r="1.2" className="led-pulse fill-ok" /><circle cx="24" cy="41" r="1.2" className="led-pulse d1 fill-ok" /><circle cx="33" cy="41" r="1.2" className="led-pulse d2 fill-ok" /></>)}
      {(k === "pipeline" || k === "code" || k === "box") && <circle cx="40" cy="8" r="2" className="led-pulse fill-ok" />}
      {(k === "mail" || k === "backup" || k === "monitor" || k === "identity" || k === "lock" || k === "scan" || k === "endpoint") && <circle cx="40" cy="8" r="2" className="led-pulse fill-ok" />}
    </svg>
  );
}

/* ------------------------------ flow diagrams ------------------------------ */

// A diagram node. `cy` is the vertical CENTER of the node (not the top edge).
type GN = { id: string; x: number; cy: number; w?: number; label: string; sub?: string; g: GlyphKind; bad?: boolean };
type GE = { a: string; b: string; bad?: boolean };
type Diagram = { w: number; h: number; nodes: GN[]; edges: GE[] };

const NW = 136; // default node width
const NH = 104; // node height (enough room for a 2-line label + 2-line sub text)
const WIDE_MIN = 720; // min container width (px) to show the SVG topology, otherwise show the vertical list

// Row centers used by the multi-row diagrams
const R1 = 56;
const R2 = 180;
const R3 = 304;

// Single-row diagram: nodes evenly spaced from left to right
function linear(items: [string, string, GlyphKind][]): Diagram {
  const n = items.length;
  const nw = n > 5 ? 118 : 144;
  const gap = (880 - 20 - n * nw) / (n - 1);
  const nodes: GN[] = items.map(([label, sub, g], i) => ({ id: `n${i}`, x: 10 + i * (nw + gap), cy: 100, w: nw, label, sub, g }));
  return { w: 880, h: 200, nodes, edges: nodes.slice(1).map((n2, i) => ({ a: `n${i}`, b: n2.id })) };
}

// Classic tiered architecture: users -> edge -> LB -> 2 app nodes -> DB -> backup
function tiered(labels: { edge: [string, string, GlyphKind]; lb: [string, string, GlyphKind]; app: [string, string, GlyphKind]; data: [string, string, GlyphKind]; bak: [string, string, GlyphKind]; user?: [string, string, GlyphKind] }): Diagram {
  const u = labels.user ?? ["Users", "Browsers & apps", "globe"];
  const mk = (id: string, x: number, cy: number, t: [string, string, GlyphKind]): GN => ({ id, x, cy, label: t[0], sub: t[1], g: t[2] });
  return {
    w: 880, h: 360,
    nodes: [
      mk("u", 8, R2, u),
      mk("e", 180, R2, labels.edge),
      mk("l", 352, R2, labels.lb),
      mk("a1", 524, R1, labels.app),
      mk("a2", 524, R3, labels.app),
      mk("d", 736, R1, labels.data),
      mk("b", 736, R3, labels.bak),
    ],
    edges: [{ a: "u", b: "e" }, { a: "e", b: "l" }, { a: "l", b: "a1" }, { a: "l", b: "a2" }, { a: "a1", b: "d" }, { a: "a2", b: "d" }, { a: "d", b: "b" }],
  };
}

const DIAGRAMS: Record<string, Diagram> = {
  cloud: tiered({ edge: ["CDN + WAF", "Edge protection", "shield"], lb: ["Load balancer", "Multi-zone", "lb"], app: ["App nodes", "Auto-scaling", "server"], data: ["Database", "Replicated", "db"], bak: ["Backup", "Cross-region", "backup"] }),
  private: tiered({ edge: ["Firewall", "Segmented zones", "shield"], lb: ["Core switching", "Redundant fabric", "lb"], app: ["Hypervisors", "HA cluster", "server"], data: ["Storage", "SAN / SDS", "db"], bak: ["Backup", "Offsite copy", "backup"], user: ["Users", "Office & VPN", "globe"] }),
  hybrid: {
    w: 880, h: 360,
    nodes: [
      { id: "o", x: 8, cy: R2, label: "Private cloud", sub: "Data centre", g: "server" },
      { id: "i", x: 372, cy: R1, label: "Shared identity", sub: "SSO + MFA", g: "key" },
      { id: "l", x: 372, cy: R2, label: "Secure link", sub: "VPN / dedicated", g: "lock" },
      { id: "m", x: 372, cy: R3, label: "Unified monitoring", sub: "Health & cost", g: "monitor" },
      { id: "c", x: 736, cy: R2, label: "Public cloud", sub: "AWS · Azure · GCP", g: "cloud" },
    ],
    edges: [{ a: "o", b: "l" }, { a: "l", b: "c" }, { a: "i", b: "l" }, { a: "l", b: "m" }],
  },
  ddos: {
    w: 880, h: 360,
    nodes: [
      { id: "x", x: 8, cy: R1, label: "Attack traffic", sub: "Floods & bots", g: "scan", bad: true },
      { id: "u", x: 8, cy: R3, label: "Legitimate users", sub: "Customers", g: "user" },
      { id: "s", x: 232, cy: R2, label: "Scrubbing", sub: "Filter at the edge", g: "shield" },
      { id: "w", x: 456, cy: R2, label: "WAF + rate limit", sub: "Layer 7 rules", g: "shield" },
      { id: "l", x: 680, cy: R2, label: "Load balancer", sub: "Clean traffic", g: "lb" },
      { id: "a", x: 680, cy: R3, label: "Services", sub: "Online", g: "server" },
    ],
    edges: [{ a: "x", b: "s", bad: true }, { a: "u", b: "s" }, { a: "s", b: "w" }, { a: "w", b: "l" }, { a: "l", b: "a" }],
  },
  migration: linear([["Source servers", "On-premises", "server"], ["Discovery", "Dependency map", "scan"], ["Replication", "Continuous sync", "migrate"], ["Validation", "Integrity checks", "shield"], ["Target cloud", "Cutover + rollback", "cloud"]]),
  devops: linear([["Commit", "Git push", "code"], ["Build", "Container image", "box"], ["Test", "Unit + integration", "scan"], ["Scan", "Security checks", "shield"], ["Deploy", "Canary rollout", "cloud"], ["Monitor", "Alerts & SLOs", "monitor"]]),
  monitoring: linear([["Servers", "Network · storage", "server"], ["Agents", "Metrics & logs", "monitor"], ["Alert engine", "Thresholds", "scan"], ["NOC", "24×7 triage", "monitor"], ["Engineer", "Resolve & report", "user"]]),
  continuity: linear([["Production", "Primary systems", "server"], ["Backup", "Scheduled jobs", "backup"], ["Offsite copy", "Immutable", "cloud"], ["DR site", "Failover ready", "server"], ["Restore test", "Verified drills", "shield"]]),
  datasec: linear([["Users", "Authenticated", "user"], ["Access control", "Least privilege", "key"], ["Applications", "Policy enforced", "server"], ["Encryption", "At rest + transit", "lock"], ["Data stores", "Audited", "db"], ["Backup", "Encrypted", "backup"]]),
  vapt: linear([["Scope", "Rules of engagement", "box"], ["Recon", "Attack surface", "globe"], ["Scan", "Vulnerabilities", "scan"], ["Exploit", "Manual testing", "code"], ["Report", "Prioritised", "monitor"], ["Retest", "Fix verification", "shield"]]),
  endpoint: linear([["Endpoints", "Laptops · servers", "endpoint"], ["Agent", "Behaviour checks", "shield"], ["Console", "Central policy", "monitor"], ["Threat intel", "Updated signatures", "globe"], ["Response", "Isolate & clean", "lock"]]),
  identity: linear([["User", "Sign-in request", "user"], ["MFA", "Second factor", "key"], ["Domain controller", "Authenticate", "identity"], ["Group policy", "Access rules", "server"], ["Applications", "Single sign-on", "cloud"]]),
  email: linear([["Sender", "Internet", "globe"], ["Spam filter", "Anti-malware", "shield"], ["Mail platform", "Delivery", "mail"], ["Mailbox", "Encrypted store", "db"], ["Archive", "Backup & retention", "backup"]]),
};

// Builds the SVG path between two nodes:
// - curved horizontal link when the target sits to the right
// - straight vertical link when the target is stacked above / below
function edgePath(a: GN, b: GN): string {
  const aw = a.w ?? NW;
  const bw = b.w ?? NW;
  if (b.x > a.x + aw / 2) {
    const x1 = a.x + aw, y1 = a.cy, x2 = b.x, y2 = b.cy;
    const xm = (x1 + x2) / 2;
    return `M${x1} ${y1} C${xm} ${y1} ${xm} ${y2} ${x2} ${y2}`;
  }
  const ax = a.x + aw / 2;
  const bx = b.x + bw / 2;
  return b.cy > a.cy
    ? `M${ax} ${a.cy + NH / 2} L${bx} ${b.cy - NH / 2}`
    : `M${ax} ${a.cy - NH / 2} L${bx} ${b.cy + NH / 2}`;
}

export function FlowDiagram({ variant = "cloud", caption }: { variant?: string; caption?: string }) {
  const d = DIAGRAMS[variant] ?? DIAGRAMS.cloud;
  const byId = Object.fromEntries(d.nodes.map((n) => [n.id, n]));
  const ordered = [...d.nodes].sort((a, b) => a.x - b.x || a.cy - b.cy);

  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [wide, setWide] = useState(false);

  // Measure the CONTAINER width (not the window) so the diagram adapts to any layout
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWide(el.clientWidth >= WIDE_MIN);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Respect reduced-motion for SVG (SMIL) animations
  useEffect(() => {
    if (!wide) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) svgRef.current?.pauseAnimations?.();
  }, [wide]);

  return (
    <PauseOffscreen>
      <div ref={wrapRef} className="w-full">
        {wide ? (
          /* desktop / large container: SVG topology */
          <svg ref={svgRef} viewBox={`0 0 ${d.w} ${d.h}`} className="h-auto w-full" role="img" aria-label={caption || `${variant} architecture diagram`}>
            {d.edges.map((e, i) => {
              const a = byId[e.a], b = byId[e.b];
              const p = edgePath(a, b);
              const col = e.bad ? "#d4343a" : "#3e8fe0";
              return (
                <g key={i}>
                  <path d={p} fill="none" stroke={col} strokeOpacity={0.18} strokeWidth="2" />
                  <path d={p} fill="none" stroke={col} strokeOpacity={e.bad ? 0.6 : 0.85} strokeWidth="1.5" className="flow-line" />
                  {[0, 1].map((k) => (
                    <circle key={k} r="3.2" fill={e.bad ? "#d4343a" : "#3ddc97"} opacity="0">
                      <animateMotion dur={`${2.8 + (i % 3) * 0.3}s`} begin={`${k * 1.4 + i * 0.35}s`} repeatCount="indefinite" path={p} calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.45 0 0.25 1" />
                      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.12;0.88;1" dur={`${2.8 + (i % 3) * 0.3}s`} begin={`${k * 1.4 + i * 0.35}s`} repeatCount="indefinite" />
                    </circle>
                  ))}
                </g>
              );
            })}
            {d.nodes.map((n) => {
              const w = n.w ?? NW;
              const top = n.cy - NH / 2;
              const stroke = n.bad ? "#d4343a" : "#2f66a8";
              return (
                <g key={n.id}>
                  <rect x={n.x} y={top} width={w} height={NH} rx="5" fill="#0d2a55" stroke={stroke} strokeOpacity={n.bad ? 0.8 : 1} />
                  <rect x={n.x} y={top} width="3" height={NH} fill={n.bad ? "#d4343a" : "#3e8fe0"} />
                  <Glyph kind={n.g} x={n.x + 14} y={top + 12} size={24} color={n.bad ? "#f08a8d" : "#8fc2f5"} />
                  {/* Text lives in a foreignObject so the browser wraps it inside the box (no overflow) */}
                  <foreignObject x={n.x + 14} y={top + 42} width={w - 24} height={NH - 48}>
                    <div style={{ fontFamily: "var(--font-sans)", overflowWrap: "break-word", wordBreak: "normal" }}>
                      <div style={{ color: "#fff", fontSize: 12.5, fontWeight: 600, lineHeight: "16px" }}>{n.label}</div>
                      {n.sub && <div style={{ color: "#8fa9c9", fontSize: 10.5, lineHeight: "13px", marginTop: 2 }}>{n.sub}</div>}
                    </div>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        ) : (
          /* mobile / tablet / narrow container: simplified vertical sequence */
          <ol aria-label={caption || "Architecture flow"}>
            {ordered.map((n, i) => (
              <li key={n.id}>
                <div className="flex items-center gap-4">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center border ${n.bad ? "border-crit/70 text-red-300" : "border-brand-500/60 text-brand-300"} bg-navy-800`}>
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><Glyph kind={n.g} /></svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block break-words text-[14px] font-semibold text-white">{n.label}</span>
                    <span className="block break-words text-[12px] text-white/60">{n.sub}</span>
                  </span>
                </div>
                {i < ordered.length - 1 && <span className="vflow ml-[19.5px] block h-6 w-px" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        )}
      </div>
    </PauseOffscreen>
  );
}

/* ------------------------------ DevOps terminal ------------------------------ */
const LOG: [string, string, string][] = [
  ["$", "git push origin main", ""],
  ["ok", "checkout + restore cache", "0.8s"],
  ["ok", "build container image", "41s"],
  ["ok", "unit + integration tests", "1m 12s"],
  ["ok", "dependency & image scan", "0 critical"],
  ["ok", "terraform plan", "3 to change"],
  ["→", "deploy canary 10%", "healthy"],
  ["ok", "promote to 100%", "rollout complete"],
];

export function PipelineTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.dataset.play = "true";
        io.disconnect();
      }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} data-play="false" className="term overflow-hidden border border-white/10 bg-navy-950/80 font-mono text-[12.5px] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]" role="img" aria-label="Illustrative CI/CD pipeline run">
      <div className="flex items-center justify-between border-b border-white/10 bg-navy-900 px-4 py-2.5 text-[11px] text-white/50">
        <span className="flex gap-1.5" aria-hidden="true"><i className="h-2 w-2 rounded-full bg-white/20" /><i className="h-2 w-2 rounded-full bg-white/20" /><i className="h-2 w-2 rounded-full bg-white/20" /></span>
        <span>pipeline · main</span>
        <span>illustrative</span>
      </div>
      <ul className="space-y-1.5 p-5">
        {LOG.map(([m, t, r], i) => (
          <li key={i} className="tline flex items-center gap-3" style={{ "--i": i } as React.CSSProperties}>
            <span className={`w-4 shrink-0 ${m === "ok" ? "text-ok" : m === "→" ? "text-brand-300" : "text-white/50"}`}>{m === "ok" ? "✓" : m}</span>
            <span className={m === "$" ? "text-white" : "text-white/80"}>{t}</span>
            {r && <span className="ml-auto text-white/40">{r}</span>}
          </li>
        ))}
        <li className="tline flex items-center gap-3 pt-1 text-white/60" style={{ "--i": LOG.length } as React.CSSProperties}>
          <span className="w-4">$</span><span className="caret inline-block h-3.5 w-2 bg-white/70" />
        </li>
      </ul>
    </div>
  );
}

/* ------------------------------ monitoring panel ------------------------------ */
export function MonitorPanel() {
  const rows: [string, number, string][] = [["Compute clusters", 94, "Operational"], ["Network edge", 88, "Operational"], ["Storage arrays", 79, "Operational"], ["Backup jobs", 96, "Operational"], ["Security events", 41, "Monitoring"]];
  return (
    <div className="border border-white/15 bg-navy-950/75 p-5 backdrop-blur-sm" role="img" aria-label="Illustrative monitoring dashboard">
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 text-[11px] uppercase tracking-[0.12em] text-white/55">
        <span className="font-mono">Service health</span><span className="font-mono">Illustrative</span>
      </div>
      <ul className="space-y-4">
        {rows.map(([l, v, s], i) => (
          <li key={l}>
            <div className="mb-1.5 flex items-center justify-between text-[13px]">
              <span className="text-white/90">{l}</span>
              <span className={`flex items-center gap-1.5 text-[11.5px] ${s === "Operational" ? "text-ok" : "text-warn"}`}>
                <i className={`led-pulse h-1.5 w-1.5 rounded-full ${s === "Operational" ? "bg-ok" : "bg-warn"}`} style={{ animationDelay: `${i * 0.4}s` }} />{s}
              </span>
            </div>
            <div className="h-1 bg-white/10"><div className="bar-grow h-full bg-brand-400" style={{ width: `${v}%`, animationDelay: `${i * 0.15}s` }} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}
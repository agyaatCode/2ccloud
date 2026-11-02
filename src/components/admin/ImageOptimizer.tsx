/**
 * FILE: src/components/admin/ImageOptimizer.tsx
 * TYPE: Client Component (admin modal)
 * INCLUDES: One-click "Optimize images" for records that already exist.
 *  - reads every record of a resource (gallery / who_we_are)
 *  - downloads each uploaded picture, and if it is too big shrinks and re-encodes it in the browser
 *  - uploads the smaller file and updates the record's imageUrl
 *  - skips pictures that are already small, external URLs and SVG files
 * NOTE: The old big files stay on the server disk (nothing is deleted).
 */
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/client";
import { fmtSize } from "@/components/admin/fields";
import { BIG_IMAGE, imageSize, resizeImage } from "@/lib/image-tools";

type Row = { id: number; title?: string; imageUrl?: string };
type Line = { key: string; name: string; text: string; tone: "ok" | "skip" | "err" };
type Phase = "idle" | "running" | "done";

const TONE: Record<Line["tone"], string> = { ok: "#15803d", skip: "#64748b", err: "#b91c1c" };

export function ImageOptimizer({
  resourceKey,
  maxSide,
  onClose,
  onFinished,
}: {
  /** "gallery" or "who_we_are" */
  resourceKey: string;
  /** Longest side (px) the pictures are shrunk to. */
  maxSide: number;
  onClose: () => void;
  onFinished: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [total, setTotal] = useState(0);
  const [seen, setSeen] = useState(0);
  const [optimized, setOptimized] = useState(0);
  const [saved, setSaved] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const [error, setError] = useState("");

  /* Esc closes (not while running) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && phase !== "running" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onClose]);

  const log = (l: Line) => setLines((prev) => [l, ...prev].slice(0, 40));

  async function run() {
    setPhase("running");
    setError("");
    setLines([]);
    setSeen(0);
    setOptimized(0);
    setSaved(0);

    // 1) load every record (100 per page)
    const all: Row[] = [];
    let page = 1;
    let count = 0;
    do {
      const r = await api<{ rows: Row[]; total: number }>(`/api/admin/r/${resourceKey}?page=${page}&limit=100&q=`);
      if (!r.ok) {
        setError(r.error || "Could not load the list.");
        setPhase("done");
        return;
      }
      all.push(...(r.rows as Row[]));
      count = r.total as number;
      page++;
    } while (all.length < count && page < 50);
    setTotal(all.length);

    // 2) go through them one by one
    let savedBytes = 0;
    let optimizedCount = 0;

    for (let i = 0; i < all.length; i++) {
      const row = all[i];
      const src = String(row.imageUrl || "");
      const name = row.title || src.split("?")[0].split("/").pop() || `#${row.id}`;
      const key = `${row.id}-${i}`;

      try {
        if (!src || !src.startsWith("/") || src.startsWith("//") || /\.svg(\?|$)/i.test(src)) {
          log({ key, name, text: "skipped (no uploaded image)", tone: "skip" });
          continue;
        }

        const res = await fetch(src);
        if (!res.ok) throw new Error("could not download the file");
        const blob = await res.blob();
        if (!blob.type.startsWith("image/")) {
          log({ key, name, text: "skipped (not an image)", tone: "skip" });
          continue;
        }

        const dims = await imageSize(blob);
        const needs = !dims || Math.max(dims.w, dims.h) > maxSide * 1.05 || blob.size > BIG_IMAGE;
        if (!needs) {
          log({ key, name, text: `already small (${fmtSize(blob.size)})`, tone: "skip" });
          continue;
        }

        const fileName = src.split("?")[0].split("/").pop() || "image.jpg";
        const small = await resizeImage(blob, fileName, maxSide);
        if (small.size >= blob.size) {
          log({ key, name, text: "no gain, kept as is", tone: "skip" });
          continue;
        }

        const fd = new FormData();
        fd.set("file", small);
        fd.set("only", "image");
        const up = await api<{ url: string }>("/api/admin/upload", { form: fd });
        if (!up.ok) throw new Error(up.error || "upload failed");

        const put = await api(`/api/admin/r/${resourceKey}/${row.id}`, { method: "PUT", json: { imageUrl: up.url as string } });
        if (!put.ok) throw new Error(put.error || "could not save the record");

        savedBytes += blob.size - small.size;
        optimizedCount++;
        setSaved(savedBytes);
        setOptimized(optimizedCount);
        log({ key, name, text: `${fmtSize(blob.size)} → ${fmtSize(small.size)}`, tone: "ok" });
      } catch (e) {
        log({ key, name, text: `failed: ${e instanceof Error ? e.message : "error"}`, tone: "err" });
      } finally {
        setSeen(i + 1);
      }
    }

    setPhase("done");
    onFinished();
  }

  const pct = total ? Math.round((seen / total) * 100) : 0;

  return (
    <div role="dialog" aria-modal="true" aria-label="Optimize images" style={{ position: "fixed", inset: 0, zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <button
        type="button"
        aria-label="Close"
        disabled={phase === "running"}
        onClick={onClose}
        style={{ position: "absolute", inset: 0, border: 0, padding: 0, background: "rgba(8,16,32,.65)", cursor: "default" }}
      />

      <div style={{ position: "relative", width: "100%", maxWidth: 620, maxHeight: "90vh", overflowY: "auto", borderRadius: 18, background: "#fff", boxShadow: "0 40px 90px -30px rgba(0,0,0,.6)", padding: 20 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700 }}>Optimize images</h3>
            <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#64748b" }}>
              Shrinks big pictures to {maxSide}px so the website loads and scrolls smoothly. Nothing looks different, files just get much lighter.
            </p>
          </div>
          <button type="button" className="a-btn" onClick={onClose} disabled={phase === "running"} aria-label="Close">
            ✕
          </button>
        </div>

        {phase === "idle" && (
          <p style={{ margin: "0 0 14px", fontSize: 13.5, lineHeight: 1.6, color: "#334155" }}>
            Every existing picture in this section is checked. Only the heavy ones are replaced with a lighter copy. Keep this window open until it says Done.
          </p>
        )}

        {phase !== "idle" && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, fontWeight: 600, color: "#475569", marginBottom: 6 }}>
              <span>
                {seen} of {total} checked · {optimized} optimized
              </span>
              <span>{pct}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 6, background: "#e2e8f0", overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "linear-gradient(90deg,#1f73c8,#ff9900)", transition: "width .3s" }} />
            </div>
            {saved > 0 && <p style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 700, color: "#15803d" }}>Saved {fmtSize(saved)} so far</p>}
          </div>
        )}

        {error && (
          <p role="alert" style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#b91c1c" }}>
            {error}
          </p>
        )}

        {lines.length > 0 && (
          <ul style={{ listStyle: "none", margin: "0 0 14px", padding: 0, maxHeight: 240, overflowY: "auto", border: "1px solid #e2e8f0", borderRadius: 12 }}>
            {lines.map((l) => (
              <li key={l.key} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 12px", borderBottom: "1px solid #f1f5f9", fontSize: 12.5 }}>
                <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600 }}>{l.name}</span>
                <span style={{ flex: "0 0 auto", color: TONE[l.tone], fontWeight: 600 }}>{l.text}</span>
              </li>
            ))}
          </ul>
        )}

        {phase === "done" && !error && (
          <p style={{ margin: "0 0 12px", fontSize: 13.5, fontWeight: 700, color: "#15803d" }}>
            Done. {optimized} picture{optimized === 1 ? "" : "s"} optimized{saved > 0 ? `, ${fmtSize(saved)} saved` : ""}.
          </p>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" className="a-btn" onClick={onClose} disabled={phase === "running"}>
            {phase === "done" ? "Close" : "Cancel"}
          </button>
          {phase !== "done" && (
            <button type="button" className="a-btn a-btn-primary" onClick={run} disabled={phase === "running"}>
              {phase === "running" ? "Optimizing…" : "Start"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
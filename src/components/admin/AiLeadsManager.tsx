/**
 * FILE: src/components/admin/AiLeadsManager.tsx
 * TYPE: Client Component (clean, compact max-w-4xl Admin UI with 3 tabs)
 * USED IN: src/app/admin/ai-leads/page.tsx
 * TABS:
 *   1) Unanswered     - Escalated questions the bot could not verify from DB, WITH:
 *                       • 1-click structured Reply Format Templates (Standard, Pricing, Technical, Callback)
 *                       • ✨ AI Format / Suggest Reply (polishes rough admin notes OR drafts structured reply)
 *                       • Live Chat Preview + Clean KB Question/Answer save option
 *   2) Knowledge base - Curated general (Cloud, Physical Server, Hybrid, VPS, Security) + company Q&As,
 *                       with 1-click Starter Cloud & Server Q&A seeding and AI formatting
 *   3) Leads          - All chatbot leads with search & status management (new / contacted / closed)
 */
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addKnowledgeAction,
  answerTicketAction,
  deleteKnowledgeAction,
  dismissTicketAction,
  polishKnowledgeAction,
  seedStarterKnowledgeAction,
  setLeadStatusAction,
  suggestTicketReplyAction,
  toggleKnowledgeAction,
  updateKnowledgeAction,
} from "@/app/admin/ai-leads/actions";
import { REPLY_TEMPLATES, STARTER_CLOUD_SERVER_KB } from "@/lib/chat-templates";

export type LeadRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
};

export type TicketRow = {
  id: number;
  code: string;
  question: string;
  standalone: string;
  language: string;
  answer: string;
  status: string;
  createdAt: string;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  chatAlive: boolean;
};

export type KnowledgeRow = {
  id: number;
  question: string;
  answer: string;
  source: string;
  isActive: boolean;
  createdAt: string;
};

type TicketDraft = {
  question: string;
  answer: string;
  kbAnswer: string;
  save: boolean;
  preview: boolean;
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const tone = (s: string) =>
  s === "answered" || s === "closed" ? "ok" : s === "open" || s === "new" ? "warn" : "info";

/** Strips leading personal greeting like "Hi Rahul," when auto-deriving a general KB answer. */
function cleanForKb(text: string): string {
  return text.replace(/^(hi|hello|dear|namaste)\s+[^\n,]+,\s*\n*/i, "").trim();
}

export function AiLeadsManager({
  leads,
  tickets,
  knowledge,
}: {
  leads: LeadRow[];
  tickets: TicketRow[];
  knowledge: KnowledgeRow[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [aiBusyId, setAiBusyId] = useState<number | "kb" | null>(null);
  const [tab, setTab] = useState<"unanswered" | "kb" | "leads">("unanswered");
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const [drafts, setDrafts] = useState<Record<number, TicketDraft>>({});
  const [newKb, setNewKb] = useState({ question: "", answer: "" });
  const [kbQuery, setKbQuery] = useState("");
  const [leadQuery, setLeadQuery] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [edit, setEdit] = useState({ question: "", answer: "" });
  const [sourceFilter, setSourceFilter] = useState<"all" | "auto" | "admin" | "seed">("all");

  const open = tickets.filter((t) => t.status === "open");
  const closed = tickets.filter((t) => t.status !== "open");

  const filteredKb = knowledge.filter((k) => {
    if (sourceFilter === "auto" && k.source !== "auto") return false;
    if (sourceFilter === "seed" && k.source !== "seed") return false;
    if (sourceFilter === "admin" && k.source !== "admin" && k.source !== "manual") return false;
    const q = kbQuery.trim().toLowerCase();
    return !q || k.question.toLowerCase().includes(q) || k.answer.toLowerCase().includes(q);
  });

  const filteredLeads = leads.filter((l) => {
    const q = leadQuery.trim().toLowerCase();
    return (
      !q ||
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q)
    );
  });

  /** Runs a server mutation, shows feedback banner, and refreshes RSC data. */
  function run(fn: () => Promise<{ ok: boolean; error?: string }>, okText: string, after?: () => void) {
    setMsg(null);
    start(async () => {
      const r = await fn();
      setMsg(r.ok ? { kind: "ok", text: okText } : { kind: "err", text: r.error || "Action failed." });
      if (r.ok) {
        after?.();
        router.refresh();
      }
    });
  }

  const draftOf = (t: TicketRow): TicketDraft =>
    drafts[t.id] ?? {
      question: t.standalone || t.question,
      answer: "",
      kbAnswer: "",
      save: true,
      preview: false,
    };

  const setDraft = (t: TicketRow, patch: Partial<TicketDraft>) =>
    setDrafts((prev) => ({ ...prev, [t.id]: { ...draftOf(t), ...patch } }));

  /** Calls OpenAI server action to format rough admin notes OR generate a clean structured reply draft. */
  async function handleAiSuggest(t: TicketRow) {
    const current = draftOf(t);
    setMsg(null);
    setAiBusyId(t.id);
    try {
      const res = await suggestTicketReplyAction({
        question: t.question,
        standalone: t.standalone,
        leadName: t.leadName,
        draftAnswer: current.answer,
      });
      if (!res.ok) {
        setMsg({ kind: "err", text: res.error || "Could not generate format suggestion." });
        return;
      }
      setDraft(t, {
        answer: res.visitorReply || current.answer,
        question: res.kbQuestion || current.question,
        kbAnswer: res.kbAnswer || cleanForKb(res.visitorReply || ""),
      });
      setMsg({
        kind: "ok",
        text: current.answer.trim()
          ? "Formatted your notes into a structured visitor reply & clean KB answer."
          : "Generated structured reply format — fill in any [bracketed] details and click Send.",
      });
    } finally {
      setAiBusyId(null);
    }
  }

  /** Calls OpenAI server action to write or polish a Knowledge Base Q&A entry. */
  async function handlePolishNewKb() {
    setMsg(null);
    setAiBusyId("kb");
    try {
      const res = await polishKnowledgeAction(newKb);
      if (!res.ok) {
        setMsg({ kind: "err", text: res.error || "Could not format knowledge entry." });
        return;
      }
      setNewKb({
        question: res.question || newKb.question,
        answer: res.answer || newKb.answer,
      });
      setMsg({ kind: "ok", text: "Formatted clean English Q&A — review and click Add to knowledge base." });
    } finally {
      setAiBusyId(null);
    }
  }

  const tabBtn = (id: typeof tab, label: string, count: number) => (
    <button
      key={id}
      type="button"
      onClick={() => setTab(id)}
      aria-pressed={tab === id}
      className={`a-btn !px-3 !py-1.5 text-[12.5px] ${tab === id ? "a-btn-primary" : ""}`}
    >
      {label} <span className="ml-1 opacity-80">({count})</span>
    </button>
  );

  return (
    <div className="mx-auto max-w-4xl">
      {/* Compact Top Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold text-slate-900">AI Leads &amp; Knowledge</h1>
          <p className="text-[12px] text-slate-500">
            General Cloud/Server questions are answered automatically by AI; company-specific unknowns arrive here.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {tabBtn("unanswered", "Unanswered", open.length)}
          {tabBtn("kb", "Knowledge base", knowledge.length)}
          {tabBtn("leads", "Leads", leads.length)}
        </div>
      </div>

      {msg && (
        <p
          role={msg.kind === "err" ? "alert" : "status"}
          className={`mb-4 rounded-md border px-3 py-2 text-[12.5px] font-medium ${
            msg.kind === "err"
              ? "border-red-200 bg-red-50 text-red-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800"
          }`}
        >
          {msg.text}
        </p>
      )}

      {/* ------------------------------ TAB 1: UNANSWERED QUESTIONS ------------------------------ */}
      {tab === "unanswered" && (
        <div className="space-y-4">
          {open.length === 0 && (
            <div className="a-card p-7 text-center text-slate-500">
              <p className="text-sm font-medium text-slate-700">All caught up! 🎉</p>
              <p className="mt-1 text-[12.5px]">
                No pending unanswered visitor questions right now. You can also pre-add company or Cloud/Server FAQs in{" "}
                <button type="button" onClick={() => setTab("kb")} className="font-semibold text-blue-600 underline">
                  Knowledge base
                </button>
                .
              </p>
            </div>
          )}

          {open.map((t) => {
            const d = draftOf(t);
            const hasBracketPlaceholder = /\[[^\]\n]{2,50}\]/.test(d.answer);
            const isAiLoading = aiBusyId === t.id;

            return (
              <div key={t.id} className="a-card p-4 sm:p-5">
                {/* Metadata row */}
                <div className="mb-2 flex flex-wrap items-center gap-2 text-[11.5px] text-slate-500">
                  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-700">#{t.code}</code>
                  <span className="font-medium text-slate-700">{t.leadName}</span>
                  <span>· {t.leadEmail}</span>
                  <span>· {t.leadPhone}</span>
                  <span>· {fmt(t.createdAt)}</span>
                  {t.language && <span className="a-pill info">{t.language}</span>}
                  <span className={`a-pill ${t.chatAlive ? "ok" : ""}`}>
                    {t.chatAlive ? "Live chat active" : "Session expired (KB only)"}
                  </span>
                </div>

                {/* Visitor question */}
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5">
                  <p className="text-[13.5px] font-semibold text-slate-900">{t.question}</p>
                  {t.standalone && t.standalone !== t.question && (
                    <p className="mt-1 text-[12px] text-slate-600">
                      <span className="font-semibold">English summary:</span> {t.standalone}
                    </p>
                  )}
                </div>

                {/* Format Suggestion Toolbar */}
                <div className="mt-3 rounded-md border border-blue-100 bg-blue-50/60 p-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11.5px] font-semibold text-slate-700">
                      Reply Format Suggestions (click a template or let AI format your rough notes):
                    </span>
                    <button
                      type="button"
                      disabled={isAiLoading || pending}
                      onClick={() => void handleAiSuggest(t)}
                      className="rounded bg-blue-600 px-2.5 py-1 text-[11.5px] font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                    >
                      {isAiLoading
                        ? "Formatting…"
                        : d.answer.trim()
                          ? "✨ Format & Polish My Notes"
                          : "✨ AI Suggest Reply Format"}
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {REPLY_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        title={tpl.hint}
                        onClick={() => {
                          const built = tpl.build(t.leadName, t.standalone || t.question);
                          setDraft(t, {
                            answer: built.visitorReply,
                            kbAnswer: built.kbAnswer,
                            save: tpl.id === "callback" ? false : d.save,
                          });
                        }}
                        className="rounded border border-slate-300 bg-white px-2.5 py-1 text-[11.5px] font-medium text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                      >
                        + {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Reply Textarea + Preview Toggle */}
                <div className="mt-3 flex items-center justify-between">
                  <label className="a-label !mb-0" htmlFor={`a-${t.id}`}>
                    Reply to visitor (write rough notes in English/Hinglish or edit template — auto-translated for visitor)
                  </label>
                  <button
                    type="button"
                    onClick={() => setDraft(t, { preview: !d.preview })}
                    className="text-[11.5px] font-medium text-blue-600 hover:underline"
                  >
                    {d.preview ? "Hide preview" : "Preview bubble"}
                  </button>
                </div>

                <textarea
                  id={`a-${t.id}`}
                  className="a-input mt-1 text-[13px]"
                  rows={5}
                  placeholder="Tip: Type rough points (e.g. 'Managed cloud starts ₹4,999/mo, 99.95% uptime, free migration') and click '✨ Format & Polish My Notes'..."
                  value={d.answer}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDraft(t, { answer: val, kbAnswer: cleanForKb(val) });
                  }}
                />

                {hasBracketPlaceholder && (
                  <p className="mt-1 text-[11.5px] font-medium text-amber-700">
                    ⚠️ Replace highlighted <code>[bracket placeholders]</code> with your exact details before sending.
                  </p>
                )}

                {d.preview && d.answer.trim() && (
                  <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                    <p className="mb-1 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                      Visitor Chat Bubble Preview (288px width)
                    </p>
                    <div className="max-w-[260px] whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-white px-3 py-2 text-[12.5px] leading-relaxed text-slate-900 shadow-sm">
                      <span className="mb-0.5 block font-mono text-[9.5px] font-semibold uppercase tracking-wider text-blue-600">
                        Team
                      </span>
                      {d.answer}
                    </div>
                  </div>
                )}

                {/* Save to Knowledge Base controls */}
                <label className="mt-3 flex items-center gap-2 text-[12.5px] font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={d.save}
                    onChange={(e) => setDraft(t, { save: e.target.checked })}
                  />
                  Save to Knowledge Base so AI answers similar questions automatically next time
                </label>

                {d.save && (
                  <div className="mt-2 grid gap-2 rounded-md border border-slate-200 bg-slate-50/70 p-3 sm:grid-cols-2">
                    <div>
                      <label className="a-label" htmlFor={`q-${t.id}`}>
                        Generalized KB Question
                      </label>
                      <input
                        id={`q-${t.id}`}
                        className="a-input text-[12.5px]"
                        value={d.question}
                        onChange={(e) => setDraft(t, { question: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="a-label" htmlFor={`kba-${t.id}`}>
                        Reusable KB Answer (no personal name)
                      </label>
                      <textarea
                        id={`kba-${t.id}`}
                        className="a-input text-[12.5px]"
                        rows={2}
                        value={d.kbAnswer || cleanForKb(d.answer)}
                        onChange={(e) => setDraft(t, { kbAnswer: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="a-btn a-btn-primary"
                    disabled={pending || isAiLoading || !d.answer.trim()}
                    onClick={() => {
                      if (hasBracketPlaceholder && !confirm("Your reply still contains [bracket placeholders]. Send anyway?")) {
                        return;
                      }
                      run(
                        () =>
                          answerTicketAction({
                            id: t.id,
                            question: d.question,
                            answer: d.answer,
                            kbAnswer: d.kbAnswer || cleanForKb(d.answer),
                            saveToKb: d.save,
                          }),
                        d.save ? "Formatted reply sent & saved to Knowledge Base." : "Formatted reply sent.",
                      );
                    }}
                  >
                    Send formatted reply
                  </button>
                  <button
                    type="button"
                    className="a-btn a-btn-danger"
                    disabled={pending || isAiLoading}
                    onClick={() => run(() => dismissTicketAction(t.id), "Question dismissed.")}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}

          {closed.length > 0 && (
            <div className="a-card admin-scroll overflow-x-auto">
              <div className="border-b border-slate-200 px-4 py-2.5 text-[12.5px] font-bold text-slate-700">
                Resolved / Dismissed History ({closed.length})
              </div>
              <table className="a-table text-[12.5px]">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Question</th>
                    <th>Admin Reply</th>
                    <th>Status</th>
                    <th>Asked</th>
                  </tr>
                </thead>
                <tbody>
                  {closed.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <code>{t.code}</code>
                      </td>
                      <td className="max-w-[220px]">{t.question}</td>
                      <td className="max-w-[280px] whitespace-pre-wrap">{t.answer || "—"}</td>
                      <td>
                        <span className={`a-pill ${tone(t.status)}`}>{t.status}</span>
                      </td>
                      <td className="whitespace-nowrap">{fmt(t.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------ TAB 2: KNOWLEDGE BASE ------------------------------ */}
      {tab === "kb" && (
        <div className="space-y-4">
          <div className="a-card p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Add Knowledge Base Q&amp;A</h2>
                <p className="a-help">
                  Add company FAQs or general Cloud / Server / Security Q&amp;As in English — the bot translates automatically for every visitor.
                </p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  run(
                    () => seedStarterKnowledgeAction(),
                    `Loaded ${STARTER_CLOUD_SERVER_KB.length} Cloud & Server starter Q&As into Knowledge Base.`,
                  )
                }
                className="rounded border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-[11.5px] font-semibold text-blue-700 hover:bg-blue-100 disabled:opacity-60"
              >
                ⚡ Load {STARTER_CLOUD_SERVER_KB.length} Cloud &amp; Server Starter Q&amp;As
              </button>
            </div>

            {/* Quick-fill topic pills */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-500">Quick fill:</span>
              {STARTER_CLOUD_SERVER_KB.map((preset) => (
                <button
                  key={preset.topic}
                  type="button"
                  onClick={() => setNewKb({ question: preset.question, answer: preset.answer })}
                  className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                >
                  {preset.topic}
                </button>
              ))}
            </div>

            <label className="a-label mt-3" htmlFor="kq">
              Question
            </label>
            <input
              id="kq"
              className="a-input mb-2 text-[13px]"
              placeholder='e.g. "Why should a business use cloud instead of a physical server?" or "Do you offer 24x7 managed support?"'
              value={newKb.question}
              onChange={(e) => setNewKb({ ...newKb, question: e.target.value })}
            />

            <div className="flex items-center justify-between">
              <label className="a-label !mb-0" htmlFor="ka">
                Answer
              </label>
              <button
                type="button"
                disabled={aiBusyId === "kb" || pending || !newKb.question.trim()}
                onClick={() => void handlePolishNewKb()}
                className="text-[11.5px] font-semibold text-blue-600 hover:underline disabled:opacity-50"
              >
                {aiBusyId === "kb" ? "Generating…" : "✨ AI Write / Format Answer"}
              </button>
            </div>
            <textarea
              id="ka"
              className="a-input mt-1 text-[13px]"
              rows={4}
              placeholder="Write full answer or rough bullet points — or click '✨ AI Write / Format Answer' above..."
              value={newKb.answer}
              onChange={(e) => setNewKb({ ...newKb, answer: e.target.value })}
            />

            <button
              type="button"
              className="a-btn a-btn-primary mt-3"
              disabled={pending || !newKb.question.trim() || !newKb.answer.trim()}
              onClick={() =>
                run(() => addKnowledgeAction(newKb), "Added to Knowledge Base.", () =>
                  setNewKb({ question: "", answer: "" }),
                )
              }
            >
              Add to knowledge base
            </button>
          </div>

          <div className="a-card admin-scroll overflow-x-auto">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[12.5px] font-bold text-slate-700">
                  Saved Knowledge Entries ({filteredKb.length})
                </span>
                <select
                  aria-label="Filter by source"
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as "all" | "auto" | "admin" | "seed")}
                  className="a-input !w-auto !py-1 text-[11.5px]"
                >
                  <option value="all">All Sources</option>
                  <option value="auto">🤖 AI Auto-Learned</option>
                  <option value="admin">👤 Admin Taught</option>
                  <option value="seed">🌱 Starter KB</option>
                </select>
              </div>
              <input
                type="search"
                placeholder="Search Q&A…"
                value={kbQuery}
                onChange={(e) => setKbQuery(e.target.value)}
                className="a-input !w-52 !py-1 text-[12px]"
              />
            </div>

            <table className="a-table text-[12.5px]">
              <thead>
                <tr>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Source</th>
                  <th>Active</th>
                  <th>Added</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredKb.map((k) =>
                  editId === k.id ? (
                    <tr key={k.id}>
                      <td>
                        <input
                          className="a-input text-[12.5px]"
                          aria-label="Question"
                          value={edit.question}
                          onChange={(e) => setEdit({ ...edit, question: e.target.value })}
                        />
                      </td>
                      <td>
                        <textarea
                          className="a-input text-[12.5px]"
                          aria-label="Answer"
                          rows={4}
                          value={edit.answer}
                          onChange={(e) => setEdit({ ...edit, answer: e.target.value })}
                        />
                      </td>
                      <td colSpan={3}></td>
                      <td className="whitespace-nowrap">
                        <button
                          type="button"
                          className="a-btn a-btn-primary"
                          disabled={pending}
                          onClick={() =>
                            run(() => updateKnowledgeAction({ id: k.id, ...edit }), "Updated.", () =>
                              setEditId(null),
                            )
                          }
                        >
                          Save
                        </button>{" "}
                        <button type="button" className="a-btn" onClick={() => setEditId(null)}>
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={k.id} className={k.isActive ? "" : "opacity-50"}>
                      <td className="max-w-[210px] font-medium">{k.question}</td>
                      <td className="max-w-[300px] whitespace-pre-wrap">{k.answer}</td>
                      <td className="whitespace-nowrap">
                        <span
                          className={`a-pill ${
                            k.source === "auto" ? "warn" : k.source === "seed" ? "info" : "ok"
                          }`}
                        >
                          {k.source === "auto"
                            ? "🤖 AI Learned"
                            : k.source === "seed"
                              ? "🌱 Starter"
                              : `👤 ${k.source}`}
                        </span>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          aria-label="Active"
                          checked={k.isActive}
                          disabled={pending}
                          onChange={(e) => run(() => toggleKnowledgeAction(k.id, e.target.checked), "Updated.")}
                        />
                      </td>
                      <td className="whitespace-nowrap">{fmt(k.createdAt)}</td>
                      <td className="whitespace-nowrap">
                        <button
                          type="button"
                          className="a-btn"
                          onClick={() => {
                            setEditId(k.id);
                            setEdit({ question: k.question, answer: k.answer });
                          }}
                        >
                          Edit
                        </button>{" "}
                        <button
                          type="button"
                          className="a-btn a-btn-danger"
                          disabled={pending}
                          onClick={() =>
                            confirm("Delete this entry?") &&
                            run(() => deleteKnowledgeAction(k.id), "Deleted.")
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ),
                )}
                {filteredKb.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-slate-500">
                      No knowledge entries yet — click &ldquo;Load Cloud &amp; Server Starter Q&amp;As&rdquo; above to get started instantly.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------ TAB 3: LEADS ------------------------------ */}
      {tab === "leads" && (
        <div className="a-card admin-scroll overflow-x-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5">
            <span className="text-[12.5px] font-bold text-slate-700">Chatbot Leads ({filteredLeads.length})</span>
            <input
              type="search"
              placeholder="Search name, email, phone…"
              value={leadQuery}
              onChange={(e) => setLeadQuery(e.target.value)}
              className="a-input !w-56 !py-1 text-[12px]"
            />
          </div>
          <table className="a-table text-[12.5px]">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((l) => (
                <tr key={l.id}>
                  <td className="font-semibold">{l.name}</td>
                  <td>
                    <a href={`mailto:${l.email}`}>{l.email}</a>
                  </td>
                  <td>
                    <a href={`tel:${l.phone}`}>{l.phone}</a>
                  </td>
                  <td>
                    <select
                      aria-label={`Status for ${l.name}`}
                      className="a-input !w-28 !py-1 text-[12px]"
                      value={l.status}
                      disabled={pending}
                      onChange={(e) => run(() => setLeadStatusAction(l.id, e.target.value), "Status updated.")}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                  <td className="whitespace-nowrap">{fmt(l.createdAt)}</td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500">
                    No leads yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

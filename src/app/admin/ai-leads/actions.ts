/**
 * FILE: src/app/admin/ai-leads/actions.ts
 * TYPE: Next.js Server Actions (called from AiLeadsManager.tsx)
 * SECURITY: Every action calls requireAdminPage() first so only authenticated admins can invoke it.
 * PURPOSE:
 *   - Answer unanswered visitor questions & save generalized answers + aliases to Knowledge Base
 *   - AI-powered reply format suggestion & rough-notes polisher for admins
 *   - One-click starter Cloud, Physical Server & Server-Troubleshooting Q&A seeding
 *   - Full CRUD & toggle controls with instant 0ms RAM Semantic Index refresh
 */
"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { chatKnowledge, chatLeads, chatMessages, chatSessions, chatTickets } from "@/db/chat-schema";
import { requireAdminPage } from "@/lib/auth";
import {
  embed,
  futureExpiry,
  invalidateKnowledgeCache,
  learn,
  polishKnowledgeDraft,
  suggestAdminReply,
  translateTo,
} from "@/lib/chat";
import { STARTER_CLOUD_SERVER_KB } from "@/lib/chat-templates";

type Result = { ok: boolean; error?: string };
const PATH = "/admin/ai-leads";
const clean = (s: string, max: number) => String(s || "").trim().slice(0, max);

/** Sends an admin's formatted answer to the visitor's chat and optionally saves a clean version to KB. */
export async function answerTicketAction(input: {
  id: number;
  question: string;
  answer: string;
  kbAnswer?: string;
  saveToKb: boolean;
}): Promise<Result> {
  await requireAdminPage();
  const answer = clean(input.answer, 2000);
  const kbQuestion = clean(input.question, 500);
  const kbAnswer = clean(input.kbAnswer || input.answer, 2000);

  if (!answer) return { ok: false, error: "Please write an answer before sending." };

  const [ticket] = await db.select().from(chatTickets).where(eq(chatTickets.id, Number(input.id))).limit(1);
  if (!ticket) return { ok: false, error: "Question not found." };

  await db
    .update(chatTickets)
    .set({ answer, status: "answered", answeredAt: new Date() })
    .where(eq(chatTickets.id, ticket.id));

  if (ticket.sessionId) {
    const translated = await translateTo(answer, ticket.language);
    await db.insert(chatMessages).values({
      sessionId: ticket.sessionId,
      role: "admin",
      content: translated,
    });
    await db
      .update(chatSessions)
      .set({ expiresAt: futureExpiry() })
      .where(eq(chatSessions.id, ticket.sessionId));
  }

  // Save clean reusable Q&A + visitor's original phrasing alias so future visitors hit DB at 0 API cost
  if (input.saveToKb) {
    await learn(kbQuestion || ticket.standalone || ticket.question, kbAnswer || answer, "admin", [
      ticket.question,
      ticket.standalone,
    ]);
  }

  revalidatePath(PATH);
  return { ok: true };
}

/** Uses AI to suggest a structured reply OR format rough admin notes into clean visitor + KB replies. */
export async function suggestTicketReplyAction(input: {
  question: string;
  standalone: string;
  leadName: string;
  draftAnswer: string;
}): Promise<{
  ok: boolean;
  error?: string;
  visitorReply?: string;
  kbQuestion?: string;
  kbAnswer?: string;
}> {
  await requireAdminPage();
  try {
    const res = await suggestAdminReply({
      question: clean(input.question, 1000),
      standalone: clean(input.standalone, 500),
      leadName: clean(input.leadName, 120),
      draftAnswer: clean(input.draftAnswer, 2000),
    });
    return {
      ok: true,
      visitorReply: res.visitorReply,
      kbQuestion: res.kbQuestion,
      kbAnswer: res.kbAnswer,
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not generate reply suggestion.",
    };
  }
}

/** Uses AI to write or format a clean English Q&A for the Knowledge Base form. */
export async function polishKnowledgeAction(input: {
  question: string;
  answer: string;
}): Promise<{ ok: boolean; error?: string; question?: string; answer?: string }> {
  await requireAdminPage();
  const question = clean(input.question, 500);
  if (question.length < 3) {
    return { ok: false, error: "Enter a question or topic first (e.g. 'Why use cloud vs physical server?')." };
  }
  try {
    const res = await polishKnowledgeDraft({
      question,
      answer: clean(input.answer, 2000),
    });
    return { ok: true, question: res.question, answer: res.answer };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not format knowledge entry." };
  }
}

/** Seeds curated Cloud, Physical Server & Server-Troubleshooting Q&As into Knowledge Base. */
export async function seedStarterKnowledgeAction(): Promise<Result & { added?: number }> {
  await requireAdminPage();
  for (const item of STARTER_CLOUD_SERVER_KB) {
    await learn(item.question, item.answer, "seed", item.aliases);
  }
  revalidatePath(PATH);
  return { ok: true, added: STARTER_CLOUD_SERVER_KB.length };
}

/** Marks an unanswered question as dismissed (spam / irrelevant). */
export async function dismissTicketAction(id: number): Promise<Result> {
  await requireAdminPage();
  await db
    .update(chatTickets)
    .set({ status: "dismissed", answeredAt: new Date() })
    .where(eq(chatTickets.id, Number(id)));
  revalidatePath(PATH);
  return { ok: true };
}

/** Adds a manual Q&A entry to the Knowledge Base. */
export async function addKnowledgeAction(input: { question: string; answer: string }): Promise<Result> {
  await requireAdminPage();
  const question = clean(input.question, 500);
  const answer = clean(input.answer, 2000);
  if (question.length < 3 || answer.length < 2) {
    return { ok: false, error: "Question and answer are required." };
  }
  await learn(question, answer, "manual");
  revalidatePath(PATH);
  return { ok: true };
}

/** Updates an existing Knowledge Base entry and refreshes the RAM Semantic Index immediately. */
export async function updateKnowledgeAction(input: {
  id: number;
  question: string;
  answer: string;
}): Promise<Result> {
  await requireAdminPage();
  const question = clean(input.question, 500);
  const answer = clean(input.answer, 2000);
  if (question.length < 3 || answer.length < 2) {
    return { ok: false, error: "Question and answer are required." };
  }
  const [current] = await db
    .select()
    .from(chatKnowledge)
    .where(eq(chatKnowledge.id, Number(input.id)))
    .limit(1);
  const prevAliases =
    current?.embedding && typeof current.embedding === "object" && !Array.isArray(current.embedding)
      ? ((current.embedding as { aliases?: string[] }).aliases ?? [])
      : [];
  const embedding = await embed(question, prevAliases);
  await db
    .update(chatKnowledge)
    .set({ question, answer, embedding })
    .where(eq(chatKnowledge.id, Number(input.id)));
  invalidateKnowledgeCache();
  revalidatePath(PATH);
  return { ok: true };
}

/** Enables or disables a Knowledge Base entry without deleting it. */
export async function toggleKnowledgeAction(id: number, isActive: boolean): Promise<Result> {
  await requireAdminPage();
  await db.update(chatKnowledge).set({ isActive }).where(eq(chatKnowledge.id, Number(id)));
  invalidateKnowledgeCache();
  revalidatePath(PATH);
  return { ok: true };
}

/** Permanently deletes a Knowledge Base entry. */
export async function deleteKnowledgeAction(id: number): Promise<Result> {
  await requireAdminPage();
  await db.delete(chatKnowledge).where(eq(chatKnowledge.id, Number(id)));
  invalidateKnowledgeCache();
  revalidatePath(PATH);
  return { ok: true };
}

/** Updates a lead's follow-up status (new | contacted | closed). */
export async function setLeadStatusAction(id: number, status: string): Promise<Result> {
  await requireAdminPage();
  if (!["new", "contacted", "closed"].includes(status)) {
    return { ok: false, error: "Invalid status." };
  }
  await db
    .update(chatLeads)
    .set({ status, updatedAt: new Date() })
    .where(eq(chatLeads.id, Number(id)));
  revalidatePath(PATH);
  return { ok: true };
}
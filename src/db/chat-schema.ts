/**
 * FILE: src/db/chat-schema.ts
 * PURPOSE: Exact Drizzle ORM schema matching your live PostgreSQL database tables:
 *   1) chat_leads     - Visitor contact details (id, name, email, phone, status[12], ip[64], created_at, updated_at)
 *   2) chat_sessions  - Browser chat sessions (id, token[64], lead_id, expires_at, created_at)
 *   3) chat_messages  - Conversation log (id, session_id, role[10], content, created_at)
 *   4) chat_tickets   - Escalated questions (id, code[8], session_id, lead_id, question, answer, status[10], created_at, answered_at, standalone, language[60])
 *   5) chat_knowledge - Learned & manual Q&A entries (id, question, answer, embedding[jsonb], source[10], is_active, created_at)
 */
import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const chatLeads = pgTable(
  "chat_leads",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 140 }).notNull(),
    email: varchar("email", { length: 190 }).notNull(),
    phone: varchar("phone", { length: 30 }).notNull(),
    status: varchar("status", { length: 12 }).notNull().default("new"), // new | contacted | closed
    ip: varchar("ip", { length: 64 }).notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("chat_leads_email_idx").on(t.email), index("chat_leads_status_idx").on(t.status)],
);

export const chatSessions = pgTable(
  "chat_sessions",
  {
    id: serial("id").primaryKey(),
    token: varchar("token", { length: 64 }).notNull(),
    leadId: integer("lead_id")
      .notNull()
      .references(() => chatLeads.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("chat_sessions_token_uq").on(t.token), index("chat_sessions_lead_idx").on(t.leadId)],
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: serial("id").primaryKey(),
    sessionId: integer("session_id")
      .notNull()
      .references(() => chatSessions.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 10 }).notNull(), // user | bot | admin
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("chat_messages_session_idx").on(t.sessionId, t.id)],
);

export const chatTickets = pgTable(
  "chat_tickets",
  {
    id: serial("id").primaryKey(),
    code: varchar("code", { length: 8 }).notNull(), // max 8 chars (e.g. "Q482910")
    sessionId: integer("session_id").references(() => chatSessions.id, { onDelete: "set null" }),
    leadId: integer("lead_id")
      .notNull()
      .references(() => chatLeads.id, { onDelete: "cascade" }),
    question: text("question").notNull(),
    answer: text("answer").notNull().default(""),
    status: varchar("status", { length: 10 }).notNull().default("open"), // open | answered | dismissed
    createdAt: timestamp("created_at").notNull().defaultNow(),
    answeredAt: timestamp("answered_at"),
    standalone: text("standalone").notNull().default(""),
    language: varchar("language", { length: 60 }).notNull().default(""),
  },
  (t) => [uniqueIndex("chat_tickets_code_uq").on(t.code), index("chat_tickets_status_idx").on(t.status, t.createdAt)],
);

export const chatKnowledge = pgTable(
  "chat_knowledge",
  {
    id: serial("id").primaryKey(),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    embedding: jsonb("embedding").$type<number[] | null>().default([]),
    source: varchar("source", { length: 10 }).notNull().default("admin"), // manual | admin | seed
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("chat_knowledge_active_idx").on(t.isActive)],
);

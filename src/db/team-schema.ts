/**
 * FILE: src/db/team-schema.ts
 * TYPE: Drizzle schema (Postgres)
 * INCLUDES: team_groups (Management Team, Support Team...) and team_members tables
 */
import { pgTable, serial, text, varchar, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

// Local timestamp helper (kept here to avoid a circular import with schema.ts)
const ts = () => ({
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** Groups such as "Management Team", "Support Team". Created by Admin / HR. */
export const teamGroups = pgTable("team_groups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull().unique(),
  slug: varchar("slug", { length: 140 }).notNull().unique(),
  description: text("description").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  ...ts(),
});

/** Individual team members. Every member belongs to exactly one group. */
export const teamMembers = pgTable(
  "team_members",
  {
    id: serial("id").primaryKey(),
    // "restrict" so a group that still has members cannot be deleted by mistake
    groupId: integer("group_id").notNull().references(() => teamGroups.id, { onDelete: "restrict" }),
    name: varchar("name", { length: 140 }).notNull(),
    designation: varchar("designation", { length: 160 }).notNull().default(""),
    photoUrl: text("photo_url").notNull().default(""),
    overview: text("overview").notNull().default(""), // long profile overview (shown in popup)
    experience: varchar("experience", { length: 160 }).notNull().default(""), // e.g. "12+ years in cloud"
    linkedinUrl: text("linkedin_url").notNull().default(""),
    email: varchar("email", { length: 190 }).notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    ...ts(),
  },
  (t) => [index("team_members_group_idx").on(t.groupId, t.sortOrder)],
);
// /**
//  * FILE: src/db/home-schema.ts
//  * TYPE: Drizzle schema (Postgres)
//  * INCLUDES: who_we_are (home page text + image block) and gallery_items (images/videos slider)
//  *           with shape (aspect), focus-position and image group title columns.
//  */
// import { pgTable, serial, text, varchar, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

// const ts = () => ({
//   createdAt: timestamp("created_at").notNull().defaultNow(),
//   updatedAt: timestamp("updated_at").notNull().defaultNow(),
// });

// /** "Who We Are" section. The website shows the first active row (lowest sort order). */
// export const whoWeAre = pgTable("who_we_are", {
//   id: serial("id").primaryKey(),
//   eyebrow: varchar("eyebrow", { length: 80 }).notNull().default("Who We Are"),
//   title: text("title").notNull().default(""),
//   body: text("body").notNull().default(""), // paragraphs separated by a blank line
//   highlights: text("highlights").notNull().default(""), // one bullet per line
//   stats: text("stats").notNull().default(""), // one per line: value|label
//   imageUrl: text("image_url").notNull().default(""),
//   imageSide: varchar("image_side", { length: 10 }).notNull().default("right"), // left | right
//   imageAspect: varchar("image_aspect", { length: 12 }).notNull().default("portrait"), // portrait | landscape | square
//   imageFocus: varchar("image_focus", { length: 30 }).notNull().default("center center"), // CSS object-position
//   badgeText: varchar("badge_text", { length: 80 }).notNull().default(""),
//   buttonText: varchar("button_text", { length: 80 }).notNull().default(""),
//   buttonUrl: text("button_url").notNull().default(""),
//   sortOrder: integer("sort_order").notNull().default(0),
//   isActive: boolean("is_active").notNull().default(true),
//   ...ts(),
// });

// /** Gallery items: photos or videos shown in the home page slider. */
// export const galleryItems = pgTable(
//   "gallery_items",
//   {
//     id: serial("id").primaryKey(),
//     kind: varchar("kind", { length: 10 }).notNull().default("image"), // image | video
//     groupTitle: varchar("group_title", { length: 160 }).notNull().default(""), // items with the same group title share one row
//     title: varchar("title", { length: 160 }).notNull().default(""),
//     caption: text("caption").notNull().default(""),
//     imageUrl: text("image_url").notNull().default(""), // photo, or poster for a video
//     videoUrl: text("video_url").notNull().default(""), // MP4/WebM, or a YouTube / Vimeo link
//     aspect: varchar("aspect", { length: 12 }).notNull().default("portrait"), // portrait | landscape | square | tall
//     focus: varchar("focus", { length: 30 }).notNull().default("center center"), // CSS object-position
//     sortOrder: integer("sort_order").notNull().default(0),
//     isActive: boolean("is_active").notNull().default(true),
//     ...ts(),
//   },
//   (t) => [index("gallery_items_sort_idx").on(t.sortOrder)],
// );







// new code 




/**
 * FILE: src/db/home-schema.ts
 * TYPE: Drizzle schema (Postgres)
 * INCLUDES: who_we_are, gallery_items (with shape, focus and group title),
 *           sophos_section + sophos_products (home page Sophos tab switcher)
 */
import { pgTable, serial, text, varchar, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";

const ts = () => ({
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

/** "Who We Are" section. The website shows the first active row (lowest sort order). */
export const whoWeAre = pgTable("who_we_are", {
  id: serial("id").primaryKey(),
  eyebrow: varchar("eyebrow", { length: 80 }).notNull().default("Who We Are"),
  title: text("title").notNull().default(""),
  body: text("body").notNull().default(""), // paragraphs separated by a blank line
  highlights: text("highlights").notNull().default(""), // one bullet per line
  stats: text("stats").notNull().default(""), // one per line: value|label
  imageUrl: text("image_url").notNull().default(""),
  imageSide: varchar("image_side", { length: 10 }).notNull().default("right"), // left | right
  imageAspect: varchar("image_aspect", { length: 12 }).notNull().default("portrait"), // portrait | landscape | square
  imageFocus: varchar("image_focus", { length: 30 }).notNull().default("center center"), // CSS object-position
  badgeText: varchar("badge_text", { length: 80 }).notNull().default(""),
  buttonText: varchar("button_text", { length: 80 }).notNull().default(""),
  buttonUrl: text("button_url").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  ...ts(),
});

/** Gallery items: photos or videos shown in the home page slider and on /gallery. */
export const galleryItems = pgTable(
  "gallery_items",
  {
    id: serial("id").primaryKey(),
    kind: varchar("kind", { length: 10 }).notNull().default("image"), // image | video
    groupTitle: varchar("group_title", { length: 160 }).notNull().default(""), // items with the same group title share one row
    title: varchar("title", { length: 160 }).notNull().default(""),
    caption: text("caption").notNull().default(""),
    imageUrl: text("image_url").notNull().default(""), // photo, or poster for a video
    videoUrl: text("video_url").notNull().default(""), // MP4/WebM, or a YouTube / Vimeo link
    aspect: varchar("aspect", { length: 12 }).notNull().default("portrait"), // portrait | landscape | square | tall
    focus: varchar("focus", { length: 30 }).notNull().default("center center"), // CSS object-position
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    ...ts(),
  },
  (t) => [index("gallery_items_sort_idx").on(t.sortOrder)],
);

/** Heading block of the home page "Sophos" section. The website shows the first active row. */
export const sophosSection = pgTable("sophos_section", {
  id: serial("id").primaryKey(),
  eyebrow: varchar("eyebrow", { length: 80 }).notNull().default("Sophos security"),
  title: text("title").notNull().default(""),
  body: text("body").notNull().default(""),
  note: text("note").notNull().default(""), // small note under the tabs (e.g. trademark note)
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true), // turn off to hide the whole section
  ...ts(),
});

/** One tab of the Sophos section. */
export const sophosProducts = pgTable(
  "sophos_products",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    kicker: varchar("kicker", { length: 80 }).notNull().default(""), // small label, e.g. "Network security"
    description: text("description").notNull().default(""),
    points: text("points").notNull().default(""), // one bullet per line
    imageUrl: text("image_url").notNull().default(""),
    linkText: varchar("link_text", { length: 80 }).notNull().default(""),
    linkUrl: text("link_url").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    ...ts(),
  },
  (t) => [index("sophos_products_sort_idx").on(t.sortOrder)],
);
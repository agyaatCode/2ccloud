// /**
//  * FILE: src/lib/admin/team-defs.ts
//  * TYPE: Pure data (admin resource definitions for Team Groups + Team Members)
//  */
// import type { FieldDef, ResourceDef } from "@/lib/admin/defs";

// const PROFILE_FIELDS: FieldDef[] = [
//   { name: "name", label: "Full name", type: "text", required: true, group: "Profile", max: 140 },
//   { name: "designation", label: "Designation", type: "text", required: true, group: "Profile", max: 160, help: "e.g. Chief Executive Officer, Support Engineer" },
//   {
//     name: "groupId",
//     label: "Team group",
//     type: "select",
//     optionsFrom: "team_groups",
//     numeric: true,
//     required: true,
//     group: "Profile",
//     help: "Create groups first in Team groups (e.g. Management Team, Support Team).",
//   },
//   { name: "sortOrder", label: "Sort order", type: "number", group: "Profile", help: "Lower numbers show first inside the group." },
//   {
//     name: "photoUrl",
//     label: "Profile photo",
//     type: "media",
//     mediaKind: "image",
//     wide: true,
//     group: "Profile",
//     help: "Use a portrait photo (4:5, around 800 x 1000). All photos are cropped to the same size on the website.",
//   },
//   { name: "isActive", label: "Show on website", type: "boolean", group: "Profile" },
// ];

// const OVERVIEW_FIELDS: FieldDef[] = [
//   { name: "experience", label: "Experience (short line)", type: "text", group: "Overview", max: 160, wide: true, help: "e.g. 15+ years in IT infrastructure" },
//   {
//     name: "overview",
//     label: "Profile overview",
//     type: "textarea",
//     group: "Overview",
//     wide: true,
//     rows: 10,
//     help: "About the person, their experience at the company, achievements. Separate paragraphs with a blank line.",
//   },
//   { name: "linkedinUrl", label: "LinkedIn URL", type: "text", group: "Overview", wide: true, max: 500, help: "Full URL, e.g. https://www.linkedin.com/in/username" },
//   { name: "email", label: "Public email (optional)", type: "email", group: "Overview" },
// ];

// export const TEAM_RESOURCES: Record<string, ResourceDef> = {
//   team_groups: {
//     key: "team_groups",
//     label: "Team groups",
//     singular: "team group",
//     perm: "team.manage",
//     titleField: "name",
//     slugFrom: "name",
//     searchFields: ["name"],
//     sort: { name: "sortOrder", dir: "asc" },
//     columns: [
//       { name: "name", label: "Group" },
//       { name: "slug", label: "Slug", type: "mono" },
//       { name: "sortOrder", label: "Order" },
//       { name: "isActive", label: "Live", type: "bool" },
//     ],
//     fields: [
//       { name: "name", label: "Group name", type: "text", required: true, max: 120, help: "e.g. Management Team, Support Team, Technical Team" },
//       { name: "slug", label: "Slug", type: "text", help: "Auto-generated from the name when empty." },
//       { name: "description", label: "Short description (optional)", type: "textarea", wide: true, rows: 2 },
//       { name: "sortOrder", label: "Sort order", type: "number", help: "Lower numbers show first on the website." },
//       { name: "isActive", label: "Show on website", type: "boolean" },
//     ],
//   },
//   team_members: {
//     key: "team_members",
//     label: "Team members",
//     singular: "team member",
//     perm: "team.manage",
//     titleField: "name",
//     searchFields: ["name", "designation"],
//     sort: { name: "sortOrder", dir: "asc" },
//     groups: ["Profile", "Overview"],
//     columns: [
//       { name: "photoUrl", label: "", type: "media" },
//       { name: "name", label: "Name" },
//       { name: "designation", label: "Designation" },
//       { name: "sortOrder", label: "Order" },
//       { name: "isActive", label: "Live", type: "bool" },
//     ],
//     fields: [...PROFILE_FIELDS, ...OVERVIEW_FIELDS],
//   },
// };




// new code 




/**
 * FILE: src/lib/admin/team-defs.ts
 * TYPE: Pure data (admin resource definitions for Team Groups + Team Members)
 * NOTE: Also re-exports the home page resources (Who We Are, Gallery) so that
 *       defs.ts only needs the single existing "...TEAM_RESOURCES" spread.
 */
import type { FieldDef, ResourceDef } from "@/lib/admin/defs";
import { HOME_RESOURCES } from "@/lib/admin/home-defs";

const PROFILE_FIELDS: FieldDef[] = [
  { name: "name", label: "Full name", type: "text", required: true, group: "Profile", max: 140 },
  { name: "designation", label: "Designation", type: "text", required: true, group: "Profile", max: 160, help: "e.g. Chief Executive Officer, Support Engineer" },
  {
    name: "groupId",
    label: "Team group",
    type: "select",
    optionsFrom: "team_groups",
    numeric: true,
    required: true,
    group: "Profile",
    help: "Create groups first in Team groups (e.g. Management Team, Support Team).",
  },
  { name: "sortOrder", label: "Sort order", type: "number", group: "Profile", help: "Lower numbers show first inside the group." },
  {
    name: "photoUrl",
    label: "Profile photo",
    type: "media",
    mediaKind: "image",
    wide: true,
    group: "Profile",
    help: "Use a portrait photo (4:5, around 800 x 1000). All photos are cropped to the same size on the website.",
  },
  { name: "isActive", label: "Show on website", type: "boolean", group: "Profile" },
];

const OVERVIEW_FIELDS: FieldDef[] = [
  { name: "experience", label: "Experience (short line)", type: "text", group: "Overview", max: 160, wide: true, help: "e.g. 15+ years in IT infrastructure" },
  {
    name: "overview",
    label: "Profile overview",
    type: "textarea",
    group: "Overview",
    wide: true,
    rows: 10,
    help: "About the person, their experience at the company, achievements. Separate paragraphs with a blank line.",
  },
  { name: "linkedinUrl", label: "LinkedIn URL", type: "text", group: "Overview", wide: true, max: 500, help: "Full URL, e.g. https://www.linkedin.com/in/username" },
  { name: "email", label: "Public email (optional)", type: "email", group: "Overview" },
];

export const TEAM_RESOURCES: Record<string, ResourceDef> = {
  team_groups: {
    key: "team_groups",
    label: "Team groups",
    singular: "team group",
    perm: "team.manage",
    titleField: "name",
    slugFrom: "name",
    searchFields: ["name"],
    sort: { name: "sortOrder", dir: "asc" },
    columns: [
      { name: "name", label: "Group" },
      { name: "slug", label: "Slug", type: "mono" },
      { name: "sortOrder", label: "Order" },
      { name: "isActive", label: "Live", type: "bool" },
    ],
    fields: [
      { name: "name", label: "Group name", type: "text", required: true, max: 120, help: "e.g. Management Team, Support Team, Technical Team" },
      { name: "slug", label: "Slug", type: "text", help: "Auto-generated from the name when empty." },
      { name: "description", label: "Short description (optional)", type: "textarea", wide: true, rows: 2 },
      { name: "sortOrder", label: "Sort order", type: "number", help: "Lower numbers show first on the website." },
      { name: "isActive", label: "Show on website", type: "boolean" },
    ],
  },
  team_members: {
    key: "team_members",
    label: "Team members",
    singular: "team member",
    perm: "team.manage",
    titleField: "name",
    searchFields: ["name", "designation"],
    sort: { name: "sortOrder", dir: "asc" },
    groups: ["Profile", "Overview"],
    columns: [
      { name: "photoUrl", label: "", type: "media" },
      { name: "name", label: "Name" },
      { name: "designation", label: "Designation" },
      { name: "sortOrder", label: "Order" },
      { name: "isActive", label: "Live", type: "bool" },
    ],
    fields: [...PROFILE_FIELDS, ...OVERVIEW_FIELDS],
  },
  // Home page: "Who We Are" + "Gallery"
  ...HOME_RESOURCES,
};
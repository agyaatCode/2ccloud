// // /**
// //  * FILE: src/lib/admin/home-defs.ts
// //  * TYPE: Pure data (admin resource definitions for "Who We Are" and "Gallery")
// //  * INCLUDES: Shape (portrait / landscape / square / tall) and focus-position selectors
// //  */
// // import type { Opt, ResourceDef } from "@/lib/admin/defs";
// // import { ASPECT_OPTIONS, FOCUS_OPTIONS } from "@/lib/home-media";

// // const ol = (v: [string, string][]): Opt[] => v.map(([value, label]) => ({ value, label }));

// // // The "Who We Are" image sits in a half-width column, so the very tall shape is not offered there
// // const WHO_ASPECTS = ASPECT_OPTIONS.filter(([k]) => k !== "tall");

// // export const HOME_RESOURCES: Record<string, ResourceDef> = {
// //   who_we_are: {
// //     key: "who_we_are",
// //     label: "Who We Are",
// //     singular: "section",
// //     perm: "pages.manage",
// //     titleField: "title",
// //     searchFields: ["title"],
// //     sort: { name: "sortOrder", dir: "asc" },
// //     groups: ["Content", "Image", "Stats & button", "Publishing"],
// //     columns: [
// //       { name: "imageUrl", label: "", type: "media" },
// //       { name: "title", label: "Title" },
// //       { name: "imageSide", label: "Image side", type: "badge" },
// //       { name: "imageAspect", label: "Shape", type: "badge" },
// //       { name: "sortOrder", label: "Order" },
// //       { name: "isActive", label: "Live", type: "bool" },
// //     ],
// //     fields: [
// //       { name: "eyebrow", label: "Small label (eyebrow)", type: "text", group: "Content", max: 80, help: "e.g. Who We Are" },
// //       { name: "title", label: "Heading", type: "text", required: true, wide: true, group: "Content", max: 220 },
// //       { name: "body", label: "Text", type: "textarea", wide: true, rows: 8, group: "Content", help: "Separate paragraphs with a blank line." },
// //       { name: "highlights", label: "Bullet points", type: "textarea", wide: true, rows: 5, group: "Content", help: "One point per line (up to 6). Shown with tick icons." },

// //       { name: "imageUrl", label: "Image", type: "media", mediaKind: "image", wide: true, group: "Image", help: "Upload an image. You can crop it while uploading." },
// //       {
// //         name: "imageSide",
// //         label: "Image position (left / right)",
// //         type: "select",
// //         required: true,
// //         group: "Image",
// //         options: ol([["right", "Image on right"], ["left", "Image on left"]]),
// //       },
// //       {
// //         name: "imageAspect",
// //         label: "Image shape / size",
// //         type: "select",
// //         required: true,
// //         group: "Image",
// //         options: ol(WHO_ASPECTS),
// //         help: "Portrait = tall frame, Landscape = wide frame, Square = equal sides.",
// //       },
// //       {
// //         name: "imageFocus",
// //         label: "Image focus (which part stays visible)",
// //         type: "select",
// //         required: true,
// //         group: "Image",
// //         options: ol(FOCUS_OPTIONS),
// //         help: "Used when the picture is cropped to fit the chosen shape. Example: choose Top to keep faces visible.",
// //       },
// //       { name: "badgeText", label: "Floating badge text (optional)", type: "text", group: "Image", max: 80, help: "Small card on the image, e.g. 15+ Years of Excellence" },

// //       { name: "stats", label: "Stats (optional)", type: "textarea", wide: true, rows: 4, group: "Stats & button", help: "One per line as value|label (up to 4). Example: 15+|Years of experience" },
// //       { name: "buttonText", label: "Button text (optional)", type: "text", group: "Stats & button", max: 80 },
// //       { name: "buttonUrl", label: "Button URL", type: "text", group: "Stats & button", max: 500, help: "Internal path like /about or a full https:// link." },

// //       { name: "sortOrder", label: "Sort order", type: "number", group: "Publishing", help: "Only the first active record (lowest number) is shown on the home page." },
// //       { name: "isActive", label: "Show on website", type: "boolean", group: "Publishing" },
// //     ],
// //   },

// //   gallery: {
// //     key: "gallery",
// //     label: "Gallery",
// //     singular: "gallery item",
// //     perm: "pages.manage",
// //     titleField: "title",
// //     searchFields: ["title", "caption"],
// //     sort: { name: "sortOrder", dir: "asc" },
// //     filters: [{ name: "kind", label: "Type", options: ol([["image", "Image"], ["video", "Video"]]) }],
// //     columns: [
// //       { name: "imageUrl", label: "", type: "media" },
// //       { name: "title", label: "Title" },
// //       { name: "kind", label: "Type", type: "badge" },
// //       { name: "aspect", label: "Shape", type: "badge" },
// //       { name: "sortOrder", label: "Order" },
// //       { name: "isActive", label: "Live", type: "bool" },
// //     ],
// //     fields: [
// //       { name: "kind", label: "Type", type: "select", required: true, options: ol([["image", "Image"], ["video", "Video"]]), help: "Choose Video to use the video field below." },
// //       { name: "title", label: "Title (optional)", type: "text", max: 160 },
// //       { name: "caption", label: "Caption (optional)", type: "textarea", wide: true, rows: 2 },
// //       { name: "imageUrl", label: "Image / video thumbnail", type: "media", mediaKind: "image", wide: true, help: "For images: the photo (you can crop it while uploading). For videos: the cover image (optional for YouTube links)." },
// //       { name: "videoUrl", label: "Video (MP4/WebM upload or link)", type: "media", mediaKind: "video", wide: true, help: "Only for Type = Video. You can also paste a YouTube or Vimeo link." },
// //       {
// //         name: "aspect",
// //         label: "Shape / size on website",
// //         type: "select",
// //         required: true,
// //         options: ol(ASPECT_OPTIONS),
// //         help: "Portrait = tall card, Landscape = wide card, Square, or Tall (story style). Works for both images and videos.",
// //       },
// //       {
// //         name: "focus",
// //         label: "Focus (which part stays visible)",
// //         type: "select",
// //         required: true,
// //         options: ol(FOCUS_OPTIONS),
// //         help: "The card crops the image/video to the chosen shape. Pick which part should stay in view.",
// //       },
// //       { name: "sortOrder", label: "Sort order", type: "number", help: "Lower numbers show first." },
// //       { name: "isActive", label: "Show on website", type: "boolean" },
// //     ],
// //   },
// // };





// // new code 




// /**
//  * FILE: src/lib/admin/home-defs.ts
//  * TYPE: Pure data (admin resource definitions for "Who We Are" and "Gallery")
//  * INCLUDES: Shape (portrait / landscape / square / tall), focus-position selectors
//  *           and the "Image group title" field for the Gallery
//  */
// import type { Opt, ResourceDef } from "@/lib/admin/defs";
// import { ASPECT_OPTIONS, FOCUS_OPTIONS } from "@/lib/home-media";

// const ol = (v: [string, string][]): Opt[] => v.map(([value, label]) => ({ value, label }));

// // The "Who We Are" image sits in a half-width column, so the very tall shape is not offered there
// const WHO_ASPECTS = ASPECT_OPTIONS.filter(([k]) => k !== "tall");

// export const HOME_RESOURCES: Record<string, ResourceDef> = {
//   who_we_are: {
//     key: "who_we_are",
//     label: "Who We Are",
//     singular: "section",
//     perm: "pages.manage",
//     titleField: "title",
//     searchFields: ["title"],
//     sort: { name: "sortOrder", dir: "asc" },
//     groups: ["Content", "Image", "Stats & button", "Publishing"],
//     columns: [
//       { name: "imageUrl", label: "", type: "media" },
//       { name: "title", label: "Title" },
//       { name: "imageSide", label: "Image side", type: "badge" },
//       { name: "imageAspect", label: "Shape", type: "badge" },
//       { name: "sortOrder", label: "Order" },
//       { name: "isActive", label: "Live", type: "bool" },
//     ],
//     fields: [
//       { name: "eyebrow", label: "Small label (eyebrow)", type: "text", group: "Content", max: 80, help: "e.g. Who We Are" },
//       { name: "title", label: "Heading", type: "text", required: true, wide: true, group: "Content", max: 220 },
//       { name: "body", label: "Text", type: "textarea", wide: true, rows: 8, group: "Content", help: "Separate paragraphs with a blank line." },
//       { name: "highlights", label: "Bullet points", type: "textarea", wide: true, rows: 5, group: "Content", help: "One point per line (up to 6). Shown with tick icons." },

//       { name: "imageUrl", label: "Image", type: "media", mediaKind: "image", wide: true, group: "Image", help: "Upload an image. You can crop or rotate it while uploading." },
//       {
//         name: "imageSide",
//         label: "Image position (left / right)",
//         type: "select",
//         required: true,
//         group: "Image",
//         options: ol([["right", "Image on right"], ["left", "Image on left"]]),
//       },
//       {
//         name: "imageAspect",
//         label: "Image shape / size",
//         type: "select",
//         required: true,
//         group: "Image",
//         options: ol(WHO_ASPECTS),
//         help: "Portrait = tall frame, Landscape = wide frame, Square = equal sides.",
//       },
//       {
//         name: "imageFocus",
//         label: "Image focus (which part stays visible)",
//         type: "select",
//         required: true,
//         group: "Image",
//         options: ol(FOCUS_OPTIONS),
//         help: "Used when the picture is cropped to fit the chosen shape. Example: choose Top to keep faces visible.",
//       },
//       { name: "badgeText", label: "Floating badge text (optional)", type: "text", group: "Image", max: 80, help: "Small card on the image, e.g. 15+ Years of Excellence" },

//       { name: "stats", label: "Stats (optional)", type: "textarea", wide: true, rows: 4, group: "Stats & button", help: "One per line as value|label (up to 4). Example: 15+|Years of experience" },
//       { name: "buttonText", label: "Button text (optional)", type: "text", group: "Stats & button", max: 80 },
//       { name: "buttonUrl", label: "Button URL", type: "text", group: "Stats & button", max: 500, help: "Internal path like /about or a full https:// link." },

//       { name: "sortOrder", label: "Sort order", type: "number", group: "Publishing", help: "Only the first active record (lowest number) is shown on the home page." },
//       { name: "isActive", label: "Show on website", type: "boolean", group: "Publishing" },
//     ],
//   },

//   gallery: {
//     key: "gallery",
//     label: "Gallery",
//     singular: "gallery item",
//     perm: "pages.manage",
//     titleField: "title",
//     searchFields: ["title", "caption", "groupTitle"],
//     sort: { name: "sortOrder", dir: "asc" },
//     filters: [{ name: "kind", label: "Type", options: ol([["image", "Image"], ["video", "Video"]]) }],
//     columns: [
//       { name: "imageUrl", label: "", type: "media" },
//       { name: "groupTitle", label: "Group" },
//       { name: "title", label: "Title" },
//       { name: "kind", label: "Type", type: "badge" },
//       { name: "aspect", label: "Shape", type: "badge" },
//       { name: "sortOrder", label: "Order" },
//       { name: "isActive", label: "Live", type: "bool" },
//     ],
//     fields: [
//       { name: "kind", label: "Type", type: "select", required: true, options: ol([["image", "Image"], ["video", "Video"]]), help: "Choose Video to use the video field below." },
//       {
//         name: "groupTitle",
//         label: "Image group title",
//         type: "text",
//         optionsFrom: "gallery_groups",
//         max: 160,
//         wide: true,
//         help: "Type a new group name or pick an existing one. All items with the same group title appear together in one row under that title on the website.",
//       },
//       { name: "title", label: "Image title (optional)", type: "text", max: 160 },
//       { name: "caption", label: "Caption (optional)", type: "textarea", wide: true, rows: 2 },
//       { name: "imageUrl", label: "Image / video thumbnail", type: "media", mediaKind: "image", wide: true, help: "For images: the photo (you can crop or rotate it while uploading). For videos: the cover image (optional for YouTube links)." },
//       { name: "videoUrl", label: "Video (MP4/WebM upload or link)", type: "media", mediaKind: "video", wide: true, help: "Only for Type = Video. You can also paste a YouTube or Vimeo link." },
//       {
//         name: "aspect",
//         label: "Shape / size on website",
//         type: "select",
//         required: true,
//         options: ol(ASPECT_OPTIONS),
//         help: "Portrait = tall card, Landscape = wide card, Square, or Tall (story style). Works for both images and videos.",
//       },
//       {
//         name: "focus",
//         label: "Focus (which part stays visible)",
//         type: "select",
//         required: true,
//         options: ol(FOCUS_OPTIONS),
//         help: "The card crops the image/video to the chosen shape. Pick which part should stay in view.",
//       },
//       { name: "sortOrder", label: "Sort order", type: "number", help: "Lower numbers show first (also decides which group row comes first)." },
//       { name: "isActive", label: "Show on website", type: "boolean" },
//     ],
//   },
// };





// new code 




/**
 * FILE: src/lib/admin/home-defs.ts
 * TYPE: Pure data (admin resource definitions for the home page blocks)
 * INCLUDES: "Who We Are", "Gallery" (with group title), "Sophos section" and "Sophos products"
 */
import type { Opt, ResourceDef } from "@/lib/admin/defs";
import { ASPECT_OPTIONS, FOCUS_OPTIONS } from "@/lib/home-media";

const ol = (v: [string, string][]): Opt[] => v.map(([value, label]) => ({ value, label }));

// The "Who We Are" image sits in a half-width column, so the very tall shape is not offered there
const WHO_ASPECTS = ASPECT_OPTIONS.filter(([k]) => k !== "tall");

export const HOME_RESOURCES: Record<string, ResourceDef> = {
  who_we_are: {
    key: "who_we_are",
    label: "Who We Are",
    singular: "section",
    perm: "pages.manage",
    titleField: "title",
    searchFields: ["title"],
    sort: { name: "sortOrder", dir: "asc" },
    groups: ["Content", "Image", "Stats & button", "Publishing"],
    columns: [
      { name: "imageUrl", label: "", type: "media" },
      { name: "title", label: "Title" },
      { name: "imageSide", label: "Image side", type: "badge" },
      { name: "imageAspect", label: "Shape", type: "badge" },
      { name: "sortOrder", label: "Order" },
      { name: "isActive", label: "Live", type: "bool" },
    ],
    fields: [
      { name: "eyebrow", label: "Small label (eyebrow)", type: "text", group: "Content", max: 80, help: "e.g. Who We Are" },
      { name: "title", label: "Heading", type: "text", required: true, wide: true, group: "Content", max: 220 },
      { name: "body", label: "Text", type: "textarea", wide: true, rows: 8, group: "Content", help: "Separate paragraphs with a blank line." },
      { name: "highlights", label: "Bullet points", type: "textarea", wide: true, rows: 5, group: "Content", help: "One point per line (up to 6). Shown with tick icons." },

      { name: "imageUrl", label: "Image", type: "media", mediaKind: "image", wide: true, group: "Image", help: "Upload an image. You can crop or rotate it while uploading." },
      {
        name: "imageSide",
        label: "Image position (left / right)",
        type: "select",
        required: true,
        group: "Image",
        options: ol([["right", "Image on right"], ["left", "Image on left"]]),
      },
      {
        name: "imageAspect",
        label: "Image shape / size",
        type: "select",
        required: true,
        group: "Image",
        options: ol(WHO_ASPECTS),
        help: "Portrait = tall frame, Landscape = wide frame, Square = equal sides.",
      },
      {
        name: "imageFocus",
        label: "Image focus (which part stays visible)",
        type: "select",
        required: true,
        group: "Image",
        options: ol(FOCUS_OPTIONS),
        help: "Used when the picture is cropped to fit the chosen shape. Example: choose Top to keep faces visible.",
      },
      { name: "badgeText", label: "Floating badge text (optional)", type: "text", group: "Image", max: 80, help: "Small card on the image, e.g. 15+ Years of Excellence" },

      { name: "stats", label: "Stats (optional)", type: "textarea", wide: true, rows: 4, group: "Stats & button", help: "One per line as value|label (up to 4). Example: 15+|Years of experience" },
      { name: "buttonText", label: "Button text (optional)", type: "text", group: "Stats & button", max: 80 },
      { name: "buttonUrl", label: "Button URL", type: "text", group: "Stats & button", max: 500, help: "Internal path like /about or a full https:// link." },

      { name: "sortOrder", label: "Sort order", type: "number", group: "Publishing", help: "Only the first active record (lowest number) is shown on the home page." },
      { name: "isActive", label: "Show on website", type: "boolean", group: "Publishing" },
    ],
  },

  gallery: {
    key: "gallery",
    label: "Gallery",
    singular: "gallery item",
    perm: "pages.manage",
    titleField: "title",
    searchFields: ["title", "caption", "groupTitle"],
    sort: { name: "sortOrder", dir: "asc" },
    filters: [{ name: "kind", label: "Type", options: ol([["image", "Image"], ["video", "Video"]]) }],
    columns: [
      { name: "imageUrl", label: "", type: "media" },
      { name: "groupTitle", label: "Group" },
      { name: "title", label: "Title" },
      { name: "kind", label: "Type", type: "badge" },
      { name: "aspect", label: "Shape", type: "badge" },
      { name: "sortOrder", label: "Order" },
      { name: "isActive", label: "Live", type: "bool" },
    ],
    fields: [
      { name: "kind", label: "Type", type: "select", required: true, options: ol([["image", "Image"], ["video", "Video"]]), help: "Choose Video to use the video field below." },
      {
        name: "groupTitle",
        label: "Image group title",
        type: "text",
        optionsFrom: "gallery_groups",
        max: 160,
        wide: true,
        help: "Type a new group name or pick an existing one. All items with the same group title appear together in one row under that title on the website.",
      },
      { name: "title", label: "Image title (optional)", type: "text", max: 160 },
      { name: "caption", label: "Caption (optional)", type: "textarea", wide: true, rows: 2 },
      { name: "imageUrl", label: "Image / video thumbnail", type: "media", mediaKind: "image", wide: true, help: "For images: the photo (you can crop or rotate it while uploading). For videos: the cover image (optional for YouTube links)." },
      { name: "videoUrl", label: "Video (MP4/WebM upload or link)", type: "media", mediaKind: "video", wide: true, help: "Only for Type = Video. You can also paste a YouTube or Vimeo link." },
      {
        name: "aspect",
        label: "Shape / size on website",
        type: "select",
        required: true,
        options: ol(ASPECT_OPTIONS),
        help: "Portrait = tall card, Landscape = wide card, Square, or Tall (story style). Works for both images and videos.",
      },
      {
        name: "focus",
        label: "Focus (which part stays visible)",
        type: "select",
        required: true,
        options: ol(FOCUS_OPTIONS),
        help: "The card crops the image/video to the chosen shape. Pick which part should stay in view.",
      },
      { name: "sortOrder", label: "Sort order", type: "number", help: "Lower numbers show first (also decides which group row comes first)." },
      { name: "isActive", label: "Show on website", type: "boolean" },
    ],
  },

  /* Heading block above the Sophos tabs on the home page */
  sophos_section: {
    key: "sophos_section",
    label: "Sophos section",
    singular: "section",
    perm: "pages.manage",
    titleField: "title",
    searchFields: ["title", "body"],
    sort: { name: "sortOrder", dir: "asc" },
    columns: [
      { name: "title", label: "Heading" },
      { name: "eyebrow", label: "Label" },
      { name: "sortOrder", label: "Order" },
      { name: "isActive", label: "Live", type: "bool" },
    ],
    fields: [
      { name: "eyebrow", label: "Small label (eyebrow)", type: "text", max: 80, help: "e.g. Sophos security" },
      { name: "title", label: "Heading", type: "text", required: true, wide: true, max: 220 },
      { name: "body", label: "Intro text", type: "textarea", wide: true, rows: 3, help: "One or two sentences shown under the heading." },
      { name: "note", label: "Small note under the tabs (optional)", type: "textarea", wide: true, rows: 2, help: "For example a trademark / partnership note. Leave empty to hide it." },
      { name: "sortOrder", label: "Sort order", type: "number", help: "Only the first active record (lowest number) is used." },
      { name: "isActive", label: "Show Sophos section on website", type: "boolean", help: "Turn this off to hide the whole Sophos section." },
    ],
  },

  /* The tabs of the Sophos section (works like the Cloud platforms tabs) */
  sophos_products: {
    key: "sophos_products",
    label: "Sophos products",
    singular: "Sophos product",
    perm: "pages.manage",
    titleField: "name",
    searchFields: ["name", "kicker", "description"],
    sort: { name: "sortOrder", dir: "asc" },
    groups: ["Product", "Visuals", "Link", "Publishing"],
    columns: [
      { name: "imageUrl", label: "", type: "media" },
      { name: "name", label: "Product" },
      { name: "kicker", label: "Label", type: "badge" },
      { name: "sortOrder", label: "Order" },
      { name: "isActive", label: "Live", type: "bool" },
    ],
    fields: [
      { name: "name", label: "Product name (tab title)", type: "text", required: true, group: "Product", max: 160, help: "e.g. Sophos Firewall" },
      { name: "kicker", label: "Small label", type: "text", group: "Product", max: 80, help: "Shown above the title, e.g. Network security." },
      { name: "description", label: "Description", type: "textarea", wide: true, rows: 4, group: "Product" },
      { name: "points", label: "Bullet points", type: "textarea", wide: true, rows: 5, group: "Product", help: "One point per line (up to 4 are shown)." },
      { name: "imageUrl", label: "Image", type: "media", mediaKind: "image", wide: true, group: "Visuals", help: "Landscape image (around 1200 x 800) works best. You can crop or rotate it while uploading." },
      { name: "linkText", label: "Link text", type: "text", group: "Link", max: 80, help: "e.g. Talk to us" },
      { name: "linkUrl", label: "Link URL", type: "text", wide: true, group: "Link", max: 500, help: "Internal path like /contact or a full https:// link. Empty = contact form for this product." },
      { name: "sortOrder", label: "Sort order", type: "number", group: "Publishing", help: "Lower numbers show first (first tab)." },
      { name: "isActive", label: "Show on website", type: "boolean", group: "Publishing" },
    ],
  },
};
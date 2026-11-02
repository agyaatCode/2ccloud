/**
 * FILE: src/lib/home-media.ts
 * TYPE: Pure data (safe for both server and client)
 * INCLUDES: Shape (aspect ratio) and focus-position options shared by the admin
 *           definitions and the website components.
 */

/** Shape choices shown in the admin dropdown: [value, label]. */
export const ASPECT_OPTIONS: [string, string][] = [
  ["portrait", "Portrait (4:5)"],
  ["landscape", "Landscape (16:10)"],
  ["square", "Square (1:1)"],
  ["tall", "Tall / Story (9:16)"],
];

/** CSS aspect-ratio strings. */
export const ASPECT_RATIO: Record<string, string> = {
  portrait: "4 / 5",
  landscape: "16 / 10",
  square: "1 / 1",
  tall: "9 / 16",
};

/** Same ratios as plain numbers (width / height), used for responsive height maths. */
export const ASPECT_NUM: Record<string, number> = {
  portrait: 0.8,
  landscape: 1.6,
  square: 1,
  tall: 0.5625,
};

/** Which part of the picture stays visible when it is cropped to fit. [value, label] */
export const FOCUS_OPTIONS: [string, string][] = [
  ["center center", "Center"],
  ["center top", "Top"],
  ["center bottom", "Bottom"],
  ["left center", "Left"],
  ["right center", "Right"],
  ["left top", "Top left"],
  ["right top", "Top right"],
  ["left bottom", "Bottom left"],
  ["right bottom", "Bottom right"],
];

export const normAspect = (v: string | null | undefined, fallback = "portrait") =>
  v && v in ASPECT_RATIO ? v : fallback;

export const normFocus = (v: string | null | undefined) =>
  v && FOCUS_OPTIONS.some(([k]) => k === v) ? v : "center center";
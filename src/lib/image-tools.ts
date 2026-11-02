/**
 * FILE: src/lib/image-tools.ts
 * TYPE: Browser-only helpers (use inside client components, never on the server)
 * INCLUDES: loadImage, imageSize, resizeImage (shrink + rotate + flip + re-encode)
 */

/** Photos above this size are re-encoded even when their dimensions are small enough. */
export const BIG_IMAGE = 450 * 1024;

export const baseName = (name: string) => name.replace(/\.[^.]+$/, "") || "image";

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read the image."));
    img.src = src;
  });
}

export async function imageSize(file: Blob): Promise<{ w: number; h: number } | null> {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    return { w: img.naturalWidth, h: img.naturalHeight };
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

let webpOk: boolean | null = null;
/** Some older browsers cannot encode WebP from a canvas. */
export function canEncodeWebp(): boolean {
  if (webpOk === null) {
    try {
      const c = document.createElement("canvas");
      c.width = c.height = 1;
      webpOk = c.toDataURL("image/webp").startsWith("data:image/webp");
    } catch {
      webpOk = false;
    }
  }
  return webpOk;
}

export type ResizeOptions = {
  /** Clockwise quarter turns: 0, 1 (90°), 2 (180°), 3 (270°). */
  quarter?: number;
  /** Mirror left / right (applied after the rotation). */
  flipX?: boolean;
  /** Always re-encode, even if nothing else changes. */
  force?: boolean;
  /** 0 - 1, default 0.82. */
  quality?: number;
};

/**
 * Shrink an image so its longest side is at most `maxSide`, optionally rotating / flipping it.
 * JPEG stays JPEG, WebP stays WebP, PNG becomes WebP when the browser can encode it.
 * Small files that need no change are returned untouched.
 * EXIF orientation is applied by the browser while drawing, so sideways phone photos come out upright.
 */
export async function resizeImage(file: Blob, name: string, maxSide: number, o: ResizeOptions = {}): Promise<File> {
  const quarter = (((o.quarter ?? 0) % 4) + 4) % 4;
  const flip = !!o.flipX;
  const original = file instanceof File ? file : new File([file], name, { type: file.type });

  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const swap = quarter % 2 === 1;
    const ow = swap ? ih : iw;
    const oh = swap ? iw : ih;
    const s = Math.min(1, maxSide / Math.max(ow, oh));
    const unchanged = s === 1 && quarter === 0 && !flip && !o.force;

    if (unchanged && file.size <= BIG_IMAGE) return original;

    const w = Math.max(1, Math.round(ow * s));
    const h = Math.max(1, Math.round(oh * s));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return original;

    // move to the centre, mirror, rotate, then draw the picture centred
    ctx.translate(w / 2, h / 2);
    ctx.scale(flip ? -1 : 1, 1);
    ctx.rotate((quarter * Math.PI) / 2);
    ctx.drawImage(img, -(iw * s) / 2, -(ih * s) / 2, iw * s, ih * s);

    const type = file.type === "image/webp" ? "image/webp" : file.type === "image/png" ? (canEncodeWebp() ? "image/webp" : "image/png") : "image/jpeg";
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, o.quality ?? 0.82));
    if (!blob) return original;

    // re-encoding did not help and nothing else changed: keep the original
    if (unchanged && blob.size >= file.size) return original;

    const ext = blob.type === "image/webp" ? "webp" : blob.type === "image/png" ? "png" : "jpg";
    return new File([blob], `${baseName(name)}.${ext}`, { type: blob.type });
  } catch {
    return original;
  } finally {
    URL.revokeObjectURL(url);
  }
}
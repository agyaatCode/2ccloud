import Image from "next/image";
import { isExternal } from "@/lib/util";

type Props = {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  style?: React.CSSProperties;
};

/** Fill-parent image. Local images are optimised (AVIF/WebP + responsive sizes); external URLs are lazy-loaded as-is. */
export function SmartImage({ src, alt, className = "", sizes = "100vw", priority, style }: Props) {
  if (!src) return null;
  if (isExternal(src) || src.endsWith(".svg")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
        style={style}
      />
    );
  }
  return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} style={style} />;
}

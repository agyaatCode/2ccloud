// import type { Metadata, Viewport } from "next";
// import type { ReactNode } from "react";
// import "./globals.css";
// import { getBranding, getSettings, getSiteUrl } from "@/lib/data";

// export const dynamic = "force-dynamic";

// export const viewport: Viewport = { themeColor: "#0A1F44", width: "device-width", initialScale: 1 };

// export async function generateMetadata(): Promise<Metadata> {
//   const [b, s, base] = await Promise.all([getBranding(), getSettings(), getSiteUrl()]);
//   return {
//     metadataBase: new URL(base),
//     title: { default: `${s.brand_name} — ${s.tagline}`, template: `%s | ${s.brand_name}` },
//     description: s.footer_blurb,
//     applicationName: s.brand_name,
//     icons: { icon: b.faviconUrl, shortcut: b.faviconUrl, apple: b.faviconUrl },
//   };
// }

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <body suppressHydrationWarning>
//         <a href="#main" className="skip-link">Skip to content</a>
//         {children}
//       </body>
//     </html>
//   );
// }




// new new code 




/**
 * FILE: src/app/layout.tsx
 * TYPE: Root layout (wraps every page)
 * CHANGE: Added <ChatWidget /> so the chatbot appears on all pages. Everything else is unchanged.
 */
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { getBranding, getSettings, getSiteUrl } from "@/lib/data";
import { ChatWidget } from "@/components/ChatWidget";

export const dynamic = "force-dynamic";

export const viewport: Viewport = { themeColor: "#0A1F44", width: "device-width", initialScale: 1 };

export async function generateMetadata(): Promise<Metadata> {
  const [b, s, base] = await Promise.all([getBranding(), getSettings(), getSiteUrl()]);
  return {
    metadataBase: new URL(base),
    title: { default: `${s.brand_name} — ${s.tagline}`, template: `%s | ${s.brand_name}` },
    description: s.footer_blurb,
    applicationName: s.brand_name,
    icons: { icon: b.faviconUrl, shortcut: b.faviconUrl, apple: b.faviconUrl },
  };
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <a href="#main" className="skip-link">Skip to content</a>
        {children}
        {/* AI chatbot (lead capture + FAQ + WhatsApp escalation) */}
        <ChatWidget />
      </body>
    </html>
  );
}
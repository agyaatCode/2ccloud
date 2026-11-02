import Link from "next/link";
import type { ReactNode } from "react";
import { paragraphs } from "@/lib/util";

export function SectionHead({ eyebrow, title, body, className = "" }: { eyebrow?: string; title: string; body?: string; className?: string }) {
  return (
    <div className={`grid gap-5 lg:grid-cols-12 lg:items-end ${className}`}>
      <div className="lg:col-span-7">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 className="h-section text-balance">{title}</h2>
      </div>
      {body && <p className="lead lg:col-span-5">{body}</p>}
    </div>
  );
}

export function ArrowLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`group/arrow inline-flex items-center gap-2 text-[14.5px] font-semibold text-brand-600 hover:text-brand-700 ${className}`}>
      {children}
      <span className="arrow-slide transition-transform duration-300 group-hover/arrow:translate-x-1" aria-hidden="true">→</span>
    </Link>
  );
}

export function Faq({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f, i) => (
        <details key={i} className="group py-1" name="faq">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-3 text-[16px] font-semibold marker:hidden [&::-webkit-details-marker]:hidden">
            {f.question}
            <span className="relative h-4 w-4 shrink-0" aria-hidden="true">
              <span className="absolute left-0 top-1/2 h-0.5 w-4 -translate-y-1/2 bg-brand-600" />
              <span className="absolute left-1/2 top-0 h-4 w-0.5 -translate-x-1/2 bg-brand-600 transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <div className="max-w-3xl pb-5 pr-10 leading-relaxed text-slate-soft">{f.answer}</div>
        </details>
      ))}
    </div>
  );
}

export function Prose({ text, className = "" }: { text: string; className?: string }) {
  return (
    <div className={`prose-cms ${className}`}>
      {paragraphs(text).map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </div>
  );
}

export function JsonLd({ data }: { data: unknown }) {
  if (!data) return null;
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

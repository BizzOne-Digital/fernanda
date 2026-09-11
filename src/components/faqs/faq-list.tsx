import type { FaqData } from "@/lib/data/faqs";
import Link from "next/link";

type FaqListProps = {
  faqs: FaqData[];
  showCategory?: boolean;
  emptyMessage?: string;
};

export function FaqList({
  faqs,
  showCategory = false,
  emptyMessage = "No FAQs available yet.",
}: FaqListProps) {
  if (faqs.length === 0) {
    return (
      <p className="text-sm text-ink/70">
        {emptyMessage}{" "}
        <Link href="/faqs" className="text-lake-medium underline-offset-2 hover:underline">
          View all FAQs
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => (
        <details
          key={faq._id}
          className="group rounded-sm border border-sand/70 bg-cream/60 p-4 open:bg-cream"
        >
          <summary className="cursor-pointer list-none font-medium text-lake-deep marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-start justify-between gap-3">
              <span>{faq.question}</span>
              <span
                aria-hidden
                className="mt-0.5 shrink-0 text-sm text-lake-medium transition group-open:rotate-45"
              >
                +
              </span>
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-ink/75">{faq.answer}</p>
          {showCategory ? (
            <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-ink/45">{faq.category}</p>
          ) : null}
        </details>
      ))}
    </div>
  );
}

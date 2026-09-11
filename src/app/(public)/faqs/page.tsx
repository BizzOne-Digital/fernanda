import type { Metadata } from "next";
import { FaqsClient } from "./faqs-client";
import { getFaqs } from "@/lib/data/faqs";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about Vaseaux Lake Waterfront Cabins.",
};

export default async function FaqsPage() {
  const faqs = await getFaqs();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FaqsClient faqs={faqs} />
    </>
  );
}

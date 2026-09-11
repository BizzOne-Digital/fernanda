import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for Vaseaux Lake Waterfront Cabins website.",
};

export default function TermsPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="font-serif text-4xl text-lake-deep">Terms</h1>
      <p className="mt-4 text-sm text-ink/75">
        PLACEHOLDER — Owner review required before launch. Website content is provided for general
        information. Availability and rates are confirmed only through direct correspondence.
      </p>
    </section>
  );
}

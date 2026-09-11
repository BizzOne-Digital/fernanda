import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacy policy for Vaseaux Lake Waterfront Cabins.",
};

export default function PrivacyPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="font-serif text-4xl text-lake-deep">Privacy</h1>
      <p className="mt-4 text-sm text-ink/75">
        PLACEHOLDER — Owner review required before launch. This site collects inquiry and contact
        information solely to respond to guest requests. We do not sell personal information.
      </p>
    </section>
  );
}

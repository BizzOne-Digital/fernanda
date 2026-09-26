import type { Metadata } from "next";
import Link from "next/link";
import { GuestMemoryForm } from "@/components/forms/guest-memory-form";
import { PageHero } from "@/components/layout/page-hero";
import { HERO_IMAGE } from "@/lib/demo-images";

export const metadata: Metadata = {
  title: "Share a memory",
  description: "Share your Vaseaux Lake story and optional photo for the guest memories gallery.",
};

export default function ShareMemoryPage() {
  return (
    <>
      <PageHero
        title="Share a memory"
        subtitle="Tell us about a favourite lake day. We review submissions before they appear on the gallery."
        eyebrow="Guest memories"
        imageSrc={HERO_IMAGE}
        imageAlt="Vaseaux Lake at golden hour"
      />
      <section className="mx-auto max-w-2xl px-4 py-12 md:px-6 md:py-16">
        <p className="mb-8 text-sm text-ink/70">
          <Link href="/gallery" className="font-medium text-lake-medium hover:underline">
            ← Back to gallery
          </Link>
        </p>
        <GuestMemoryForm />
      </section>
    </>
  );
}

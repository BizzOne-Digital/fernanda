import Image from "next/image";
import Link from "next/link";
import type { SiteSettingsData } from "@/lib/data/settings";
import { HERO_IMAGE } from "@/lib/demo-images";
import { resolvePublicImageUrl } from "@/lib/uploads/public-url";

type HomeHeroProps = {
  settings: SiteSettingsData;
};

export function HomeHero({ settings }: HomeHeroProps) {
  const heroSrc = resolvePublicImageUrl(HERO_IMAGE, HERO_IMAGE);

  return (
    <section className="relative">
      <div className="relative min-h-[52vh] md:min-h-[58vh] lg:min-h-[62vh]">
        <Image
          src={heroSrc}
          alt="Guests on the floating swim platform on Vaseaux Lake with McIntyre Bluff in the background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-resort-navy/75 via-resort-navy/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-4xl px-4 pb-10 pt-16 text-center text-cream md:px-6 md:pb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-golden">
            Vaseaux Lake Waterfront Cabins
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight md:text-5xl">
            {settings.general.primaryHeadline || "Your getaway on Vaseaux Lake"}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-cream/90 md:text-lg">
            {settings.general.supportingHeadline ||
              "Family-friendly cabin-style stays in Oliver, BC — lake, lawn, and long summer evenings."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/inquire" className="resort-btn-primary">
              Request a reservation
            </Link>
            <Link href="/gallery" className="resort-btn-outline border-cream/40 bg-transparent text-cream hover:bg-cream/10">
              View gallery
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

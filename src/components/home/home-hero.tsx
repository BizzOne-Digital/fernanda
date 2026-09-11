import Image from "next/image";
import Link from "next/link";
import type { SiteSettingsData } from "@/lib/data/settings";
import { HERO_IMAGE } from "@/lib/demo-images";
import { resolvePublicImageUrl } from "@/lib/uploads/public-url";

type HomeHeroProps = {
  settings: SiteSettingsData;
};

export function HomeHero({ settings }: HomeHeroProps) {
  const heroSrc = resolvePublicImageUrl(settings.general.logo?.url || HERO_IMAGE, HERO_IMAGE);

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <Image
        src={heroSrc}
        alt="Adirondack chairs facing a sunset over Vaseaux Lake"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-lake-deep/15 via-transparent to-sky-bright/15" />

      <div className="absolute inset-y-0 left-0 flex w-full max-w-full overflow-hidden lg:max-w-[52%]">
        <svg
          className="absolute inset-0 h-full w-full text-lake-deep/72"
          viewBox="0 0 760 900"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="currentColor"
            d="M0,0 H560 C610,120 590,260 620,420 C650,580 600,760 640,900 H0 Z"
          />
        </svg>

        <div className="hero-grain relative z-10 flex w-full min-w-0 flex-col justify-center px-4 pb-20 pt-36 sm:px-8 sm:pb-24 sm:pt-40 md:px-14 md:pb-28 md:pt-44 lg:px-16 lg:pb-32 lg:pt-48">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-golden sm:text-xs sm:tracking-[0.32em]">
            Vaseaux Lake • Oliver, BC
          </p>

          <h1 className="mt-5 max-w-xl text-balance font-serif text-3xl leading-[1.08] tracking-[0.04em] text-cream uppercase sm:text-4xl md:text-[2.75rem] lg:text-5xl">
            {settings.general.primaryHeadline}
          </h1>

          <p className="mt-5 max-w-md font-serif text-lg leading-relaxed text-cream/90 md:text-xl">
            {settings.general.supportingHeadline}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cabins"
              className="inline-flex items-center justify-center rounded-sm bg-golden px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-ink transition hover:brightness-110 hover:shadow-[0_8px_24px_rgb(240_180_41_/_35%)]"
            >
              Explore the cabins
            </Link>
            <Link
              href="/inquire"
              className="inline-flex items-center justify-center rounded-sm border border-golden/80 bg-cream/10 px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-golden backdrop-blur-sm transition hover:bg-golden/15"
            >
              Plan your stay
            </Link>
          </div>

          <div className="mt-10 hidden max-w-md items-center gap-4 sm:flex">
            <span className="h-px flex-1 bg-golden/50" aria-hidden />
            <span className="font-serif text-[0.62rem] uppercase tracking-[0.28em] text-golden/95">
              Eight private stays • One historic roof
            </span>
            <span className="h-px flex-1 bg-golden/50" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}

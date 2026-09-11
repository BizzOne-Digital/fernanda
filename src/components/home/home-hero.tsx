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

      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-sky-bright/10" />

      <div className="absolute inset-x-0 bottom-0 top-auto flex flex-col justify-end p-4 sm:inset-y-0 sm:left-0 sm:top-0 sm:w-full sm:max-w-md sm:justify-center sm:p-0">
        <div className="sm:flex sm:h-full sm:flex-col sm:justify-center">
          <div className="rounded-sm bg-lake-deep/92 px-6 py-5 backdrop-blur-sm sm:rounded-none sm:px-10 sm:py-8 md:px-12 md:py-10">
            <p className="font-serif text-[0.65rem] font-medium uppercase tracking-[0.28em] text-cream/90 sm:text-xs">
              Vaseaux Lake • Oliver, BC
            </p>
            <h1 className="mt-3 font-serif text-2xl leading-tight text-cream sm:text-3xl md:text-4xl">
              {settings.general.shortBrandName}
            </h1>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream/88 sm:text-base">
              {settings.general.supportingHeadline}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/inquire"
                className="inline-flex items-center justify-center rounded-full bg-golden px-6 py-2.5 text-sm font-medium text-ink transition hover:brightness-105"
              >
                Check availability
              </Link>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center rounded-full border border-cream/60 bg-cream/10 px-6 py-2.5 text-sm font-medium text-cream backdrop-blur-sm transition hover:bg-cream/20"
              >
                See the lake
              </Link>
            </div>
          </div>

          <div className="mt-0 rounded-sm bg-lake-medium/95 px-6 py-3 backdrop-blur-sm sm:rounded-none sm:px-10 sm:py-3.5 md:px-12">
            <p className="text-sm font-medium text-cream sm:text-[0.95rem]">
              {settings.general.primaryHeadline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

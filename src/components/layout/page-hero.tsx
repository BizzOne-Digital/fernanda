import Image from "next/image";
import { cn } from "@/lib/utils/cn";

type PageHeroProps = {
  title: string;
  subtitle: string;
  eyebrow?: string;
  imageSrc: string;
  imageAlt: string;
  className?: string;
};

export function PageHero({
  title,
  subtitle,
  eyebrow,
  imageSrc,
  imageAlt,
  className,
}: PageHeroProps) {
  return (
    <section className={cn("relative overflow-hidden border-b border-sand/80", className)}>
      <div className="relative min-h-[32vh] md:min-h-[38vh]">
        <Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-resort-navy/55" />
        <div className="relative z-10 mx-auto flex min-h-[32vh] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center text-cream md:min-h-[38vh] md:px-6">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-golden">{eyebrow}</p>
          ) : null}
          <h1 className="mt-2 font-serif text-4xl font-semibold md:text-5xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-cream/90 md:text-lg">{subtitle}</p>
        </div>
      </div>
    </section>
  );
}

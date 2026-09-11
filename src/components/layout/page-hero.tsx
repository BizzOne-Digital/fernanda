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
    <section
      className={cn(
        "relative flex min-h-[38vh] items-center justify-center overflow-hidden md:min-h-[44vh]",
        className,
      )}
    >
      <Image src={imageSrc} alt={imageAlt} fill priority sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-lake-deep/40 via-lake-medium/20 to-sky-bright/10" />
      <div className="relative z-10 mx-auto max-w-3xl min-w-0 px-4 py-20 text-center text-cream md:px-6 md:py-24">
        {eyebrow ? (
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.32em] text-golden">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 font-serif text-4xl tracking-[0.03em] md:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl font-serif text-lg leading-relaxed text-cream/88 md:text-xl">
          {subtitle}
        </p>
      </div>
    </section>
  );
}

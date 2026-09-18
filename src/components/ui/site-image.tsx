import Image, { ImageProps } from "next/image";
import { resolvePublicImageUrl, requiresUnoptimizedImage } from "@/lib/uploads/public-url";
import { cn } from "@/lib/utils/cn";

type SiteImageProps = ImageProps & {
  frame?: "postcard" | "film" | "none";
  label?: string;
};

export function SiteImage({
  className,
  frame = "none",
  label,
  alt,
  src,
  fill,
  ...props
}: SiteImageProps) {
  const resolvedSrc = typeof src === "string" ? resolvePublicImageUrl(src) : src;

  return (
    <figure
      className={cn(
        "relative overflow-hidden",
        fill && "absolute inset-0 h-full w-full",
        frame === "postcard" && "postcard-border rounded-sm bg-cream p-2",
        frame === "film" && "rounded-sm border-y-8 border-ink/80 bg-ink/80",
        className,
      )}
    >
      <Image
        alt={alt}
        src={resolvedSrc}
        fill={fill}
        className={cn("object-cover", fill ? "h-full w-full" : undefined)}
        unoptimized={typeof resolvedSrc === "string" && requiresUnoptimizedImage(resolvedSrc)}
        {...props}
      />
      {label ? (
        <figcaption className="absolute bottom-3 left-3 rounded bg-ink/70 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-cream">
          {label}
        </figcaption>
      ) : null}
    </figure>
  );
}

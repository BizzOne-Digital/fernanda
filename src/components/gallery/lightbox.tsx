"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  PLACEHOLDER_IMAGE,
  resolvePublicImageUrl,
  requiresUnoptimizedImage,
} from "@/lib/uploads/public-url";
import { cn } from "@/lib/utils/cn";

export type LightboxImage = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

type LightboxProps = {
  images: LightboxImage[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
};

export function Lightbox({ images, initialIndex = 0, open, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const prev = useCallback(() => {
    setIndex((value) => (value - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((value) => (value + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, prev, next]);

  if (!open || images.length === 0) return null;

  const current = images[index];
  const currentSrc = resolvePublicImageUrl(current.src, PLACEHOLDER_IMAGE);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full border border-cream/30 px-3 py-1 text-sm text-cream"
      >
        Close
      </button>
      <button type="button" onClick={prev} className="absolute left-4 text-cream" aria-label="Previous image">
        ‹
      </button>
      <button type="button" onClick={next} className="absolute right-12 text-cream" aria-label="Next image">
        ›
      </button>
      <figure className="max-h-[85vh] max-w-5xl">
        <div className="relative aspect-[4/3] w-[min(90vw,960px)]">
          <Image
            src={currentSrc}
            alt={current.alt}
            fill
            className="object-contain"
            sizes="90vw"
            unoptimized={requiresUnoptimizedImage(currentSrc)}
          />
        </div>
        {(current.caption || current.credit) && (
          <figcaption className="mt-3 text-center text-sm text-cream/85">
            {current.caption}
            {current.credit ? <span className="block text-xs text-cream/60">{current.credit}</span> : null}
          </figcaption>
        )}
      </figure>
      <p className="absolute bottom-4 text-xs text-cream/70">
        {index + 1} / {images.length}
      </p>
    </div>
  );
}

type LightboxGridProps = {
  images: LightboxImage[];
  className?: string;
};

export function LightboxGrid({ images, className }: LightboxGridProps) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {images.map((image, imageIndex) => {
          const src = resolvePublicImageUrl(image.src, PLACEHOLDER_IMAGE);
          return (
          <button
            key={`${image.src}-${imageIndex}`}
            type="button"
            className="group relative aspect-[4/3] overflow-hidden rounded-sm"
            onClick={() => {
              setIndex(imageIndex);
              setOpen(true);
            }}
          >
            <Image
              src={src}
              alt={image.alt}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized={requiresUnoptimizedImage(src)}
            />
          </button>
          );
        })}
      </div>
      <Lightbox images={images} initialIndex={index} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

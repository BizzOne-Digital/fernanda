"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { galleryCategoryLabel } from "@/lib/gallery/categories";
import { requiresUnoptimizedImage } from "@/lib/uploads/public-url";

export type GalleryPhotoAdminItem = {
  _id: string;
  url: string;
  alt: string;
  caption?: string;
  category: string;
  status: string;
};

type GalleryPhotoAdminCardProps = {
  photo: GalleryPhotoAdminItem;
  uploading?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onReplace: (file: File) => void;
};

export function GalleryPhotoAdminCard({
  photo,
  uploading,
  onEdit,
  onDelete,
  onReplace,
}: GalleryPhotoAdminCardProps) {
  return (
    <article className="overflow-hidden rounded-sm border border-sand/80 bg-white">
      <div className="relative aspect-[4/3] bg-sand/20">
        <Image
          src={photo.url}
          alt={photo.alt}
          fill
          className="object-cover"
          unoptimized={requiresUnoptimizedImage(photo.url)}
        />
        <div className="absolute right-2 top-2 flex gap-1">
          <Button
            type="button"
            variant="secondary"
            className="h-8 min-h-0 border border-red-200 bg-white/95 px-3 py-1 text-xs normal-case tracking-normal text-red-700 hover:bg-red-50"
            disabled={uploading}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="space-y-2 p-3">
        <p className="line-clamp-2 text-sm font-medium text-ink">{photo.alt}</p>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={photo.status} />
          <span className="text-xs text-ink/50">{galleryCategoryLabel(photo.category)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="ghost"
            className="h-8 min-h-0 px-2 py-1 text-xs normal-case tracking-normal"
            onClick={onEdit}
          >
            Edit
          </Button>
          <label className="inline-flex h-8 cursor-pointer items-center rounded-sm px-2 text-xs text-lake-medium hover:bg-sand/30">
            Replace
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onReplace(file);
                event.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
    </article>
  );
}

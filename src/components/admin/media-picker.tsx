"use client";

import { Button } from "@/components/ui/button";
import { AdminInput, FormField } from "@/components/admin/form-field";
import { adminUploadToFolder, deleteStoredUpload, useAdminFetch } from "@/hooks/use-admin-fetch";
import type { UploadFolder } from "@/lib/uploads/public-url";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

import type { AdminImageRef } from "@/lib/validation/admin-ui";

export type ImageRefValue = AdminImageRef;

type MediaAsset = {
  _id: string;
  publicUrl: string;
  alt?: string;
  caption?: string;
  credit?: string;
  originalFilename?: string;
};

type MediaPickerProps = {
  value?: ImageRefValue | null;
  onChange: (value: ImageRefValue | null) => void;
  label?: string;
  folder?: UploadFolder;
};

export function MediaPicker({
  value,
  onChange,
  label = "Image",
  folder = "pages",
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { data, loading, reload } = useAdminFetch<{ assets?: MediaAsset[]; items?: MediaAsset[] }>(
    open ? "/api/admin/gallery?limit=48" : null,
  );

  const assets = (data?.assets ?? data?.items ?? []).filter((asset) =>
    asset.publicUrl?.startsWith("/api/uploads/") ||
    asset.publicUrl?.startsWith("/images/") ||
    asset.publicUrl?.startsWith("/media/"),
  );

  const handleUpload = useCallback(
    async (file: File) => {
      setUploading(true);
      try {
        if (value?.url) {
          await deleteStoredUpload(value.url);
        }
        const result = await adminUploadToFolder(file, folder);
        onChange({
          url: result.url,
          alt: value?.alt ?? "",
          caption: value?.caption,
          credit: value?.credit,
        });
        toast.success("Image uploaded");
        setOpen(false);
        reload();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange, reload, value],
  );

  const handleRemove = async () => {
    if (value?.url) {
      await deleteStoredUpload(value.url);
    }
    onChange(null);
  };

  const handleQuickUpload = async (file: File) => {
    setUploading(true);
    try {
      if (value?.url) {
        await deleteStoredUpload(value.url);
      }
      const result = await adminUploadToFolder(file, folder);
      onChange({
        url: result.url,
        alt: value?.alt ?? "",
      });
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      {label ? <p className="text-sm font-medium text-ink/80">{label}</p> : null}
      <div className="flex flex-wrap items-start gap-3">
        {value?.url ? (
          <div className="relative h-24 w-32 overflow-hidden rounded-lg border border-sand/50 bg-sand/10">
            <Image src={value.url} alt={value.alt ?? ""} fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed border-sand/60 bg-white/50 text-xs text-ink/40">
            No image
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleQuickUpload(file);
            }}
          />
          <Button
            type="button"
            variant="secondary"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? "Uploading…" : value?.url ? "Replace" : "Upload"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => setOpen(true)}>
            Choose from library
          </Button>
          {value ? (
            <Button type="button" variant="ghost" onClick={handleRemove}>
              Remove
            </Button>
          ) : null}
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-lake-deep/30 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-sand/60 bg-cream shadow-xl">
            <div className="flex items-center justify-between border-b border-sand/40 px-5 py-4">
              <h3 className="font-serif text-xl text-lake-deep">Media library</h3>
              <div className="flex gap-2">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  id={`media-upload-${label}`}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleUpload(file);
                  }}
                />
                <Button
                  type="button"
                  variant="golden"
                  disabled={uploading}
                  onClick={() => document.getElementById(`media-upload-${label}`)?.click()}
                >
                  {uploading ? "Uploading…" : "Upload new"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
            <div className="overflow-y-auto p-4">
              {loading ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="aspect-[4/3] animate-pulse rounded-lg bg-sand/40" />
                  ))}
                </div>
              ) : assets.length ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {assets.map((asset) => (
                    <button
                      key={asset._id}
                      type="button"
                      onClick={() => {
                        onChange({
                          mediaId: asset._id,
                          url: asset.publicUrl,
                          alt: asset.alt ?? "",
                          caption: asset.caption,
                          credit: asset.credit,
                        });
                        setOpen(false);
                      }}
                      className={cn(
                        "group relative aspect-[4/3] overflow-hidden rounded-lg border border-sand/40 bg-white transition hover:border-lake-medium",
                        value?.url === asset.publicUrl && "ring-2 ring-lake-medium",
                      )}
                    >
                      <Image
                        src={asset.publicUrl}
                        alt={asset.alt ?? asset.originalFilename ?? "Media"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="py-12 text-center text-sm text-ink/50">
                  No media yet. Upload an image to get started.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function MediaPickerField({
  value,
  onChange,
  altValue,
  onAltChange,
  label,
  folder = "pages",
}: {
  value?: ImageRefValue | null;
  onChange: (value: ImageRefValue | null) => void;
  altValue?: string;
  onAltChange?: (alt: string) => void;
  label?: string;
  folder?: UploadFolder;
}) {
  return (
    <div className="space-y-4">
      <MediaPicker value={value} onChange={onChange} label={label} folder={folder} />
      {onAltChange ? (
        <FormField label="Alt text" hint="Describe the image for accessibility">
          <AdminInput
            value={altValue ?? value?.alt ?? ""}
            onChange={(event) => onAltChange(event.target.value)}
            placeholder="Lake view from cabin patio"
          />
        </FormField>
      ) : null}
    </div>
  );
}

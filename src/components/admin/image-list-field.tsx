"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/admin/form-field";
import { MediaPicker, type ImageRefValue } from "@/components/admin/media-picker";
import { adminUploadToFolder } from "@/hooks/use-admin-fetch";
import type { UploadFolder } from "@/lib/uploads/public-url";

type ImageListFieldProps = {
  label: string;
  hint?: string;
  value?: ImageRefValue[] | null;
  onChange: (value: ImageRefValue[]) => void;
  folder?: UploadFolder;
  max?: number;
};

export function ImageListField({
  label,
  hint,
  value,
  onChange,
  folder = "products",
  max = 24,
}: ImageListFieldProps) {
  const images = value ?? [];
  const addInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleAddFile = async (file: File) => {
    setUploading(true);
    try {
      const uploaded = await adminUploadToFolder(file, folder);
      onChange([
        ...images,
        {
          url: uploaded.url,
          alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        },
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (addInputRef.current) addInputRef.current.value = "";
    }
  };

  return (
    <FormField label={label} hint={hint}>
      <div className="space-y-4">
        {images.map((image, index) => (
          <div
            key={`${image.url}-${index}`}
            className="rounded-lg border border-sand/60 bg-white/50 p-4"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">
                Photo {index + 1}
              </p>
              <Button
                type="button"
                variant="ghost"
                className="h-8 px-2 text-xs normal-case tracking-normal text-red-700 hover:bg-red-50"
                onClick={() => onChange(images.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </div>
            <MediaPicker
              value={image}
              onChange={(next) => {
                if (!next) {
                  onChange(images.filter((_, i) => i !== index));
                  return;
                }
                const updated = [...images];
                updated[index] = next;
                onChange(updated);
              }}
              folder={folder}
            />
          </div>
        ))}

        {images.length < max ? (
          <>
            <input
              ref={addInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleAddFile(file);
              }}
            />
            <Button
              type="button"
              variant="secondary"
              disabled={uploading}
              className="normal-case tracking-normal"
              onClick={() => addInputRef.current?.click()}
            >
              {uploading ? "Uploading…" : `+ Add photo (${images.length}/${max})`}
            </Button>
          </>
        ) : (
          <p className="text-xs text-ink/50">Maximum {max} photos.</p>
        )}
      </div>
    </FormField>
  );
}

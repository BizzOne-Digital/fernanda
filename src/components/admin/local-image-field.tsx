"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { adminUploadToFolder, deleteStoredUpload } from "@/hooks/use-admin-fetch";
import type { UploadFolder } from "@/lib/uploads/public-url";
import { cn } from "@/lib/utils/cn";

type LocalImageFieldProps = {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder: UploadFolder;
  label?: string;
  hint?: string;
  className?: string;
};

export function LocalImageField({
  value,
  onChange,
  folder,
  label = "Image",
  hint,
  className,
}: LocalImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const result = await adminUploadToFolder(file, folder);
      if (value) {
        await deleteStoredUpload(value);
      }
      onChange(result.url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (value) {
      await deleteStoredUpload(value);
    }
    onChange(null);
    toast.success("Image removed");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label ? <p className="text-sm font-medium text-ink/80">{label}</p> : null}
      {hint ? <p className="text-xs text-ink/50">{hint}</p> : null}

      <div className="flex flex-wrap items-start gap-3">
        {value ? (
          <div className="relative h-24 w-32 overflow-hidden rounded-lg border border-sand/50 bg-sand/10">
            <Image src={value} alt="" fill className="object-cover" unoptimized />
          </div>
        ) : (
          <div className="flex h-24 w-32 items-center justify-center rounded-lg border border-dashed border-sand/60 bg-white/50 text-xs text-ink/40">
            No image
          </div>
        )}

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <Button
            type="button"
            variant="secondary"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {uploading ? "Uploading…" : value ? "Replace" : "Upload image"}
          </Button>
          {value ? (
            <Button
              type="button"
              variant="ghost"
              disabled={uploading}
              className="text-red-700 hover:bg-red-50 hover:text-red-800"
              onClick={handleRemove}
            >
              Delete image
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { AdminHeader, AdminPanel } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { AdminInput, FormField } from "@/components/admin/form-field";
import { adminUploadToFolder, useAdminFetch, useAdminMutation } from "@/hooks/use-admin-fetch";
import { cn } from "@/lib/utils/cn";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

type MediaAsset = {
  _id: string;
  publicUrl: string;
  alt?: string;
  caption?: string;
  sortOrder?: number;
  featured?: boolean;
};

type CategoryDetail = {
  _id: string;
  name: string;
  slug: string;
};

export default function AdminGalleryCategoryPage() {
  const params = useParams<{ categoryId: string }>();
  const categoryId = params.categoryId;
  const { openMenu } = useAdminLayout();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<MediaAsset | null>(null);

  const { data, loading, error, reload } = useAdminFetch<{
    category?: CategoryDetail;
    assets?: MediaAsset[];
    items?: MediaAsset[];
  }>(`/api/admin/gallery/${categoryId}`);

  const { mutate, saving } = useAdminMutation();

  const category = data?.category;
  const assets = data?.assets ?? data?.items ?? [];

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const uploaded = await adminUploadToFolder(file, "gallery");
      await mutate(
        "/api/admin/gallery-photos",
        {
          method: "POST",
          body: JSON.stringify({
            url: uploaded.url,
            alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
            category: "property",
            caption: category?.name ? `Gallery: ${category.name}` : undefined,
            sortOrder: assets.length,
            status: "published",
          }),
        },
        { silent: true },
      );
      toast.success("Photo uploaded to site gallery");
      reload();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const saveAssetMeta = async () => {
    if (!editing) return;
    await mutate(
      `/api/media/${editing._id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          alt: editing.alt,
          caption: editing.caption,
          sortOrder: editing.sortOrder,
          featured: editing.featured,
        }),
      },
      { successMessage: "Photo updated" },
    );
    setEditing(null);
    reload();
  };

  return (
    <>
      <AdminHeader
        title={category?.name ?? "Gallery category"}
        description={category ? `/${category.slug}` : "Manage photos in this category."}
        onMenuClick={openMenu}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/gallery" className="rounded-full px-4 py-2 text-sm text-ink/60 hover:bg-sand/30">
              Back
            </Link>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            <Button
              type="button"
              variant="golden"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? "Uploading…" : "Upload photo"}
            </Button>
          </div>
        }
      />

      <div className="space-y-6 p-4 lg:p-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-[4/3] animate-pulse rounded-xl bg-sand/40" />
            ))}
          </div>
        ) : assets.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {assets.map((asset) => (
              <button
                key={asset._id}
                type="button"
                onClick={() => setEditing(asset)}
                className={cn(
                  "group relative aspect-[4/3] overflow-hidden rounded-xl border border-sand/50 bg-white text-left shadow-sm transition hover:border-lake-medium",
                  asset.featured && "ring-2 ring-golden/50",
                )}
              >
                <Image src={asset.publicUrl} alt={asset.alt ?? ""} fill className="object-cover" unoptimized />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-lake-deep/70 to-transparent p-2">
                  <p className="truncate text-xs text-cream">{asset.alt || asset.caption || "Untitled"}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <AdminPanel className="py-16 text-center">
            <p className="font-serif text-xl text-lake-deep">No photos yet</p>
            <p className="mt-2 text-sm text-ink/50">Upload images to populate this gallery category.</p>
            <Button
              className="mt-6"
              variant="golden"
              type="button"
              onClick={() => fileRef.current?.click()}
            >
              Upload first photo
            </Button>
          </AdminPanel>
        )}

        {editing ? (
          <AdminPanel>
            <h2 className="mb-4 font-serif text-xl text-lake-deep">Edit photo</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-sand/50 sm:col-span-2 sm:max-w-sm">
                <Image src={editing.publicUrl} alt="" fill className="object-cover" unoptimized />
              </div>
              <FormField label="Alt text">
                <AdminInput
                  value={editing.alt ?? ""}
                  onChange={(event) => setEditing({ ...editing, alt: event.target.value })}
                />
              </FormField>
              <FormField label="Sort order">
                <AdminInput
                  type="number"
                  value={editing.sortOrder ?? 0}
                  onChange={(event) =>
                    setEditing({ ...editing, sortOrder: Number(event.target.value) })
                  }
                />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Caption">
                  <AdminInput
                    value={editing.caption ?? ""}
                    onChange={(event) => setEditing({ ...editing, caption: event.target.value })}
                  />
                </FormField>
              </div>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={Boolean(editing.featured)}
                  onChange={(event) => setEditing({ ...editing, featured: event.target.checked })}
                />
                Featured photo
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button type="button" variant="golden" disabled={saving} onClick={saveAssetMeta}>
                Save
              </Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button type="button" variant="ghost" onClick={() => setDeleteId(editing._id)}>
                Delete
              </Button>
            </div>
          </AdminPanel>
        ) : null}
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete this photo?"
        description="This removes the media asset if it is not referenced elsewhere."
        confirmLabel="Delete"
        variant="danger"
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await mutate(`/api/media/${deleteId}`, { method: "DELETE" }, { successMessage: "Photo deleted" });
          setDeleteId(null);
          setEditing(null);
          reload();
        }}
      />
    </>
  );
}

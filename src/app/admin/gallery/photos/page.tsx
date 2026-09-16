"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminHeader, AdminPanel } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { AdminInput, AdminSelect, AdminTextarea, FormField } from "@/components/admin/form-field";
import { StatusBadge } from "@/components/admin/status-badge";
import { GALLERY_PHOTO_CATEGORIES } from "@/models/GalleryPhoto";
import { galleryCategoryLabel } from "@/lib/gallery/categories";
import { adminUploadToFolder, deleteStoredUpload, useAdminFetch, useAdminMutation } from "@/hooks/use-admin-fetch";
import Link from "next/link";

type GalleryPhotoRow = {
  _id: string;
  url: string;
  alt: string;
  caption?: string;
  category: string;
  sortOrder?: number;
  featured?: boolean;
  status: string;
};

export default function AdminGalleryPhotosPage() {
  const { openMenu } = useAdminLayout();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<GalleryPhotoRow | null>(null);

  const { data, loading, error, reload } = useAdminFetch<{ photos?: GalleryPhotoRow[]; items?: GalleryPhotoRow[] }>(
    "/api/admin/gallery-photos",
  );
  const { mutate, saving } = useAdminMutation();

  const photos = data?.photos ?? data?.items ?? [];

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
            sortOrder: photos.length,
            status: "published",
          }),
        },
        { successMessage: "Photo added to gallery" },
      );
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    await mutate(
      `/api/admin/gallery-photos/${editing._id}`,
      {
        method: "PATCH",
        body: JSON.stringify({
          alt: editing.alt,
          caption: editing.caption,
          category: editing.category,
          sortOrder: editing.sortOrder,
          featured: editing.featured,
          status: editing.status,
        }),
      },
      { successMessage: "Photo updated" },
    );
    setEditing(null);
    reload();
  };

  const replaceImage = async (file: File, photo: GalleryPhotoRow) => {
    setUploading(true);
    try {
      const uploaded = await adminUploadToFolder(file, "gallery");
      await deleteStoredUpload(photo.url);
      await mutate(
        `/api/admin/gallery-photos/${photo._id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ url: uploaded.url }),
        },
        { silent: true },
      );
      toast.success("Image replaced");
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Replace failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <AdminHeader
        title="Site gallery photos"
        description="All public /gallery images. Uploads are stored in MongoDB for Vercel."
        onMenuClick={openMenu}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/gallery" className="rounded-sm px-3 py-2 text-sm text-ink/70 hover:bg-sand/30">
              Categories
            </Link>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            <Button type="button" variant="golden" disabled={uploading} onClick={() => fileRef.current?.click()}>
              {uploading ? "Uploading…" : "Upload photo"}
            </Button>
          </div>
        }
      />

      <div className="space-y-6 p-4 lg:p-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        {editing ? (
          <AdminPanel>
            <h2 className="mb-4 font-serif text-xl text-lake-deep">Edit photo</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Alt text" required>
                <AdminInput
                  value={editing.alt}
                  onChange={(event) => setEditing({ ...editing, alt: event.target.value })}
                />
              </FormField>
              <FormField label="Category">
                <AdminSelect
                  value={editing.category}
                  onChange={(event) => setEditing({ ...editing, category: event.target.value })}
                >
                  {GALLERY_PHOTO_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{galleryCategoryLabel(cat)}</option>
                  ))}
                </AdminSelect>
              </FormField>
              <FormField label="Sort order">
                <AdminInput
                  type="number"
                  value={editing.sortOrder ?? 0}
                  onChange={(event) => setEditing({ ...editing, sortOrder: Number(event.target.value) })}
                />
              </FormField>
              <FormField label="Status">
                <AdminSelect
                  value={editing.status}
                  onChange={(event) => setEditing({ ...editing, status: event.target.value })}
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </AdminSelect>
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Caption">
                  <AdminTextarea
                    rows={2}
                    value={editing.caption ?? ""}
                    onChange={(event) => setEditing({ ...editing, caption: event.target.value })}
                  />
                </FormField>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button type="button" variant="golden" disabled={saving} onClick={saveEdit}>Save</Button>
              <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            </div>
          </AdminPanel>
        ) : null}

        {loading ? <p className="text-sm text-ink/60">Loading gallery…</p> : null}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {photos.map((photo) => (
            <article key={photo._id} className="overflow-hidden rounded-sm border border-sand/80 bg-white">
              <div className="relative aspect-[4/3] bg-sand/20">
                <Image src={photo.url} alt={photo.alt} fill className="object-cover" unoptimized={photo.url.startsWith("/api/uploads/")} />
              </div>
              <div className="space-y-2 p-3">
                <p className="line-clamp-2 text-sm font-medium text-ink">{photo.alt}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={photo.status} />
                  <span className="text-xs text-ink/50">{galleryCategoryLabel(photo.category)}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="text-xs text-lake-medium" onClick={() => setEditing(photo)}>
                    Edit
                  </button>
                  <label className="cursor-pointer text-xs text-lake-medium">
                    Replace
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (file) replaceImage(file, photo);
                      }}
                    />
                  </label>
                  <button type="button" className="text-xs text-red-600" onClick={() => setDeleteId(photo._id)}>
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Remove photo from gallery?"
        description="The image file will be deleted from MongoDB if it was uploaded through the admin."
        confirmLabel="Remove"
        variant="danger"
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await mutate(`/api/admin/gallery-photos/${deleteId}`, { method: "DELETE" }, { successMessage: "Photo removed" });
          setDeleteId(null);
          reload();
        }}
      />
    </>
  );
}

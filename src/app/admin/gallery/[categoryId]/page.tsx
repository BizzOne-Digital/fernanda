"use client";

import { Button } from "@/components/ui/button";
import { AdminHeader, AdminPanel } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { GalleryPhotoAdminCard, type GalleryPhotoAdminItem } from "@/components/admin/gallery-photo-card";
import {
  adminUploadToFolder,
  deleteStoredUpload,
  useAdminFetch,
  useAdminMutation,
} from "@/hooks/use-admin-fetch";
import { photoCategoryForGallerySlug } from "@/lib/gallery/photo-constants";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

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

  const { data, loading, error, reload } = useAdminFetch<{
    category?: CategoryDetail;
    photos?: GalleryPhotoAdminItem[];
    items?: GalleryPhotoAdminItem[];
  }>(`/api/admin/gallery/${categoryId}`);

  const { mutate, saving } = useAdminMutation();

  const category = data?.category;
  const photos = data?.photos ?? data?.items ?? [];

  const handleUpload = async (file: File) => {
    if (!category) return;
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
            category: photoCategoryForGallerySlug(category.slug),
            galleryCategoryId: category._id,
            caption: category.name,
            sortOrder: photos.length,
            status: "published",
          }),
        },
        { silent: true },
      );
      toast.success("Photo uploaded");
      reload();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const replaceImage = async (file: File, photo: GalleryPhotoAdminItem) => {
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
        title={category?.name ?? "Gallery category"}
        description={
          category
            ? `/${category.slug} · ${photos.length} photo${photos.length === 1 ? "" : "s"}`
            : "Manage photos in this category."
        }
        onMenuClick={openMenu}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/admin/gallery" className="rounded-full px-4 py-2 text-sm text-ink/60 hover:bg-sand/30">
              Back
            </Link>
            <Link href="/admin/gallery/photos" className="rounded-full px-4 py-2 text-sm text-ink/60 hover:bg-sand/30">
              All site photos
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
            <Button
              type="button"
              variant="golden"
              disabled={uploading || !category}
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

        <p className="text-sm text-ink/60">
          All photos for this category are listed below. Click <strong>Delete</strong> on any image to remove it from the
          site gallery.
        </p>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-[4/3] animate-pulse rounded-xl bg-sand/40" />
            ))}
          </div>
        ) : photos.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <GalleryPhotoAdminCard
                key={photo._id}
                photo={photo}
                uploading={uploading}
                onEdit={() => {
                  window.location.assign("/admin/gallery/photos");
                }}
                onDelete={() => setDeleteId(photo._id)}
                onReplace={(file) => replaceImage(file, photo)}
              />
            ))}
          </div>
        ) : (
          <AdminPanel className="py-16 text-center">
            <p className="font-serif text-xl text-lake-deep">No photos yet</p>
            <p className="mt-2 text-sm text-ink/50">
              Upload a photo for this category. Existing site photos may appear here after the next deploy if they match
              this category (for example, lake photos under Lake &amp; Waterfront).
            </p>
            <Button
              className="mt-6"
              variant="golden"
              type="button"
              disabled={!category}
              onClick={() => fileRef.current?.click()}
            >
              Upload first photo
            </Button>
          </AdminPanel>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Delete this photo?"
        description="This removes the image from the public gallery and deletes the uploaded file from storage."
        confirmLabel="Delete"
        variant="danger"
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await mutate(`/api/admin/gallery-photos/${deleteId}`, { method: "DELETE" }, { successMessage: "Photo deleted" });
          setDeleteId(null);
          reload();
        }}
      />
    </>
  );
}

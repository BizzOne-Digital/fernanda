"use client";

import { Button } from "@/components/ui/button";
import { AdminHeader, AdminPanel, AdminTabs } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import {
  AdminInput,
  AdminSelect,
  AdminTextarea,
  FormField,
  adminInputClass,
} from "@/components/admin/form-field";
import { MediaPicker, type ImageRefValue } from "@/components/admin/media-picker";
import { SeoEditor } from "@/components/admin/section-editor";
import { useAdminFetch, useAdminMutation } from "@/hooks/use-admin-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { adminImageRefSchema, adminSeoSchema } from "@/lib/validation/admin-ui";

const blogSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  coverImage: adminImageRefSchema,
  authorName: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  content: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  publishedAt: z.string().optional(),
  seo: adminSeoSchema,
});

type BlogForm = z.infer<typeof blogSchema>;

export default function AdminBlogEditorPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const isNew = id === "new";
  const router = useRouter();
  const { openMenu } = useAdminLayout();
  const [tab, setTab] = useState<"content" | "seo">("content");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data, loading, error, reload } = useAdminFetch<{ post?: BlogForm; blog?: BlogForm }>(
    isNew ? null : `/api/admin/blogs/${id}`,
  );
  const { mutate, saving } = useAdminMutation();

  const form = useForm<BlogForm>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      status: "draft",
      tags: [],
      seo: {},
    },
  });

  useEffect(() => {
    const post = data?.post ?? data?.blog;
    if (post) {
      form.reset({
        ...post,
        publishedAt: post.publishedAt
          ? new Date(post.publishedAt as string).toISOString().slice(0, 16)
          : "",
      });
    }
  }, [data, form]);

  const tags = form.watch("tags") ?? [];

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      ...values,
      publishedAt: values.publishedAt ? new Date(values.publishedAt).toISOString() : undefined,
    };

    if (isNew) {
      const result = await mutate<{ post?: { _id: string }; blog?: { _id: string } }>(
        "/api/admin/blogs",
        { method: "POST", body: JSON.stringify(payload) },
        { successMessage: "Post created" },
      );
      const newId = result.post?._id ?? result.blog?._id;
      if (newId) router.replace(`/admin/blogs/${newId}`);
      return;
    }

    await mutate(
      `/api/admin/blogs/${id}`,
      { method: "PATCH", body: JSON.stringify(payload) },
      { successMessage: "Post saved" },
    );
    reload();
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <AdminHeader
          title={isNew ? "New blog post" : form.watch("title") || "Edit post"}
          onMenuClick={openMenu}
          actions={
            <div className="flex gap-2">
              <Link href="/admin/blogs" className="rounded-full px-4 py-2 text-sm text-ink/60 hover:bg-sand/30">
                Back
              </Link>
              {!isNew ? (
                <Button type="button" variant="ghost" onClick={() => setConfirmDelete(true)}>
                  Archive
                </Button>
              ) : null}
              <Button type="submit" variant="golden" disabled={saving}>
                {saving ? "Saving…" : "Save"}
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

          {loading && !isNew && !data?.post && !data?.blog ? (
            <div className="h-64 animate-pulse rounded-xl bg-sand/30" />
          ) : (
            <>
              <AdminTabs
                tabs={[
                  { id: "content", label: "Content" },
                  { id: "seo", label: "SEO" },
                ]}
                active={tab}
                onChange={(value) => setTab(value as "content" | "seo")}
              />

              {tab === "content" ? (
                <AdminPanel className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Title" required>
                      <AdminInput {...form.register("title")} />
                    </FormField>
                    <FormField label="Slug" required>
                      <AdminInput {...form.register("slug")} />
                    </FormField>
                    <FormField label="Author">
                      <AdminInput {...form.register("authorName")} />
                    </FormField>
                    <FormField label="Category">
                      <AdminInput {...form.register("category")} />
                    </FormField>
                    <FormField label="Status">
                      <AdminSelect {...form.register("status")}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </AdminSelect>
                    </FormField>
                    <FormField label="Publish date">
                      <AdminInput type="datetime-local" {...form.register("publishedAt")} />
                    </FormField>
                  </div>
                  <FormField label="Excerpt">
                    <AdminTextarea rows={3} {...form.register("excerpt")} />
                  </FormField>
                  <MediaPicker
                    label="Cover image"
                    value={(form.watch("coverImage") as ImageRefValue) ?? null}
                    onChange={(image) => form.setValue("coverImage", image, { shouldDirty: true })}
                    folder="pages"
                  />
                  <FormField label="Tags">
                    {tags.map((_, index) => (
                      <input
                        key={index}
                        {...form.register(`tags.${index}`)}
                        className={`${adminInputClass} mb-2`}
                      />
                    ))}
                    <button
                      type="button"
                      className="text-sm text-lake-medium"
                      onClick={() => form.setValue("tags", [...tags, ""], { shouldDirty: true })}
                    >
                      + Add tag
                    </button>
                  </FormField>
                  <FormField label="Content">
                    <AdminTextarea rows={12} {...form.register("content")} />
                  </FormField>
                </AdminPanel>
              ) : null}

              {tab === "seo" ? <SeoEditor /> : null}
            </>
          )}
        </div>

        <ConfirmDialog
          open={confirmDelete}
          title="Archive this post?"
          confirmLabel="Archive"
          variant="danger"
          loading={saving}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            await mutate(`/api/admin/blogs/${id}`, { method: "DELETE" }, { successMessage: "Post archived" });
            router.push("/admin/blogs");
          }}
        />
      </form>
    </FormProvider>
  );
}

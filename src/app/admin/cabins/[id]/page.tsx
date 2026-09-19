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
import { SeoEditor } from "@/components/admin/seo-editor";
import { useAdminFetch, useAdminMutation } from "@/hooks/use-admin-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { adminImageRefSchema, adminSeoSchema } from "@/lib/validation/admin-ui";

const cabinSchema = z.object({
  cabinNumber: z.coerce.number().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().optional(),
  capacity: z.coerce.number().min(1),
  sleepingSummary: z.string().optional(),
  hasSeparateBedroom: z.boolean().optional(),
  featureHighlights: z.array(z.string()).optional(),
  cardImage: adminImageRefSchema,
  heroHeading: z.string().optional(),
  heroSubheading: z.string().optional(),
  heroImage: adminImageRefSchema,
  fullDescription: z.string().optional(),
  bestSuitedFor: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  packingNotes: z.string().optional(),
  importantNotes: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  sortOrder: z.coerce.number().optional(),
  seo: adminSeoSchema,
});

type CabinForm = z.infer<typeof cabinSchema>;

export default function AdminCabinEditorPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const isNew = id === "new";
  const router = useRouter();
  const { openMenu } = useAdminLayout();
  const [tab, setTab] = useState<"listing" | "detail" | "seo">("listing");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data, loading, error, reload } = useAdminFetch<{ cabin?: CabinForm }>(
    isNew ? null : `/api/admin/cabins/${id}`,
  );
  const { mutate, saving } = useAdminMutation();

  const form = useForm<CabinForm>({
    resolver: zodResolver(cabinSchema),
    defaultValues: {
      cabinNumber: 1,
      name: "",
      slug: "",
      capacity: 4,
      status: "draft",
      sortOrder: 0,
      featureHighlights: [],
      amenities: [],
      seo: {},
    },
  });

  useEffect(() => {
    if (data?.cabin) form.reset(data.cabin);
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (isNew) {
      const result = await mutate<{ cabin?: { _id: string } }>(
        "/api/admin/cabins",
        { method: "POST", body: JSON.stringify(values) },
        { successMessage: "Cabin created" },
      );
      if (result.cabin?._id) router.replace(`/admin/cabins/${result.cabin._id}`);
      return;
    }
    await mutate(
      `/api/admin/cabins/${id}`,
      { method: "PATCH", body: JSON.stringify(values) },
      { successMessage: "Cabin saved" },
    );
    reload();
  });

  const handleDelete = async () => {
    await mutate(`/api/admin/cabins/${id}`, { method: "DELETE" }, { successMessage: "Cabin archived" });
    router.push("/admin/cabins");
  };

  const highlights = form.watch("featureHighlights") ?? [];
  const amenities = form.watch("amenities") ?? [];

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <AdminHeader
          title={isNew ? "New cabin" : form.watch("name") || "Edit cabin"}
          description={isNew ? "Create a new cabin listing." : `Cabin ${form.watch("cabinNumber")}`}
          onMenuClick={openMenu}
          actions={
            <div className="flex gap-2">
              <Link href="/admin/cabins" className="rounded-full px-4 py-2 text-sm text-ink/60 hover:bg-sand/30">
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

          {loading && !isNew && !data?.cabin ? (
            <div className="h-64 animate-pulse rounded-xl bg-sand/30" />
          ) : (
            <>
              <AdminTabs
                tabs={[
                  { id: "listing", label: "Listing" },
                  { id: "detail", label: "Detail" },
                  { id: "seo", label: "SEO" },
                ]}
                active={tab}
                onChange={(value) => setTab(value as typeof tab)}
              />

              {tab === "listing" ? (
                <AdminPanel className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Cabin number" required>
                    <AdminInput type="number" {...form.register("cabinNumber")} />
                  </FormField>
                  <FormField label="Sort order">
                    <AdminInput type="number" {...form.register("sortOrder")} />
                  </FormField>
                  <FormField label="Name" required>
                    <AdminInput {...form.register("name")} />
                  </FormField>
                  <FormField label="Slug" required>
                    <AdminInput {...form.register("slug")} />
                  </FormField>
                  <FormField label="Capacity" required>
                    <AdminInput type="number" {...form.register("capacity")} />
                  </FormField>
                  <FormField label="Status">
                    <AdminSelect {...form.register("status")}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </AdminSelect>
                  </FormField>
                  <div className="sm:col-span-2">
                    <FormField label="Short description">
                      <AdminTextarea rows={3} {...form.register("shortDescription")} />
                    </FormField>
                  </div>
                  <div className="sm:col-span-2">
                    <MediaPicker
                      label="Card image"
                      value={(form.watch("cardImage") as ImageRefValue) ?? null}
                      onChange={(image) => form.setValue("cardImage", image, { shouldDirty: true })}
                      folder="products"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <FormField label="Feature highlights">
                      {highlights.map((_, index) => (
                        <input
                          key={index}
                          {...form.register(`featureHighlights.${index}`)}
                          className={`${adminInputClass} mb-2`}
                        />
                      ))}
                      <button
                        type="button"
                        className="text-sm text-lake-medium"
                        onClick={() =>
                          form.setValue("featureHighlights", [...highlights, ""], { shouldDirty: true })
                        }
                      >
                        + Add highlight
                      </button>
                    </FormField>
                  </div>
                </AdminPanel>
              ) : null}

              {tab === "detail" ? (
                <AdminPanel className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField label="Hero heading">
                      <AdminInput {...form.register("heroHeading")} />
                    </FormField>
                    <FormField label="Hero subheading">
                      <AdminInput {...form.register("heroSubheading")} />
                    </FormField>
                  </div>
                  <MediaPicker
                    label="Hero image"
                    value={(form.watch("heroImage") as ImageRefValue) ?? null}
                    onChange={(image) => form.setValue("heroImage", image, { shouldDirty: true })}
                    folder="products"
                  />
                  <FormField label="Full description">
                    <AdminTextarea rows={6} {...form.register("fullDescription")} />
                  </FormField>
                  <FormField label="Best suited for">
                    <AdminTextarea rows={2} {...form.register("bestSuitedFor")} />
                  </FormField>
                  <FormField label="Sleeping summary">
                    <AdminInput {...form.register("sleepingSummary")} />
                  </FormField>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" {...form.register("hasSeparateBedroom")} />
                    Separate bedroom
                  </label>
                  <FormField label="Amenities">
                    {amenities.map((_, index) => (
                      <input
                        key={index}
                        {...form.register(`amenities.${index}`)}
                        className={`${adminInputClass} mb-2`}
                      />
                    ))}
                    <button
                      type="button"
                      className="text-sm text-lake-medium"
                      onClick={() => form.setValue("amenities", [...amenities, ""], { shouldDirty: true })}
                    >
                      + Add amenity
                    </button>
                  </FormField>
                  <FormField label="Packing notes">
                    <AdminTextarea rows={3} {...form.register("packingNotes")} />
                  </FormField>
                  <FormField label="Important notes">
                    <AdminTextarea rows={3} {...form.register("importantNotes")} />
                  </FormField>
                </AdminPanel>
              ) : null}

              {tab === "seo" ? <SeoEditor /> : null}
            </>
          )}
        </div>

        <ConfirmDialog
          open={confirmDelete}
          title="Archive this cabin?"
          description="The cabin will be hidden from the public site but can be restored later."
          confirmLabel="Archive"
          variant="danger"
          loading={saving}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            await handleDelete();
            setConfirmDelete(false);
          }}
        />
      </form>
    </FormProvider>
  );
}

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

const serviceSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  shortDescription: z.string().optional(),
  cardImage: adminImageRefSchema,
  iconAccent: z.string().optional(),
  ctaText: z.string().optional(),
  heroHeading: z.string().optional(),
  heroSubheading: z.string().optional(),
  heroImage: adminImageRefSchema,
  overview: z.string().optional(),
  intendedGuestType: z.string().optional(),
  benefits: z.array(z.string()).optional(),
  experienceDetails: z.string().optional(),
  inquirySteps: z.array(z.string()).optional(),
  seasonalNotes: z.string().optional(),
  safetyPolicies: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  sortOrder: z.coerce.number().optional(),
  seo: adminSeoSchema,
});

type ServiceForm = z.infer<typeof serviceSchema>;

export default function AdminServiceEditorPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const isNew = id === "new";
  const router = useRouter();
  const { openMenu } = useAdminLayout();
  const [tab, setTab] = useState<"listing" | "detail" | "seo">("listing");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { data, loading, error, reload } = useAdminFetch<{ service?: ServiceForm }>(
    isNew ? null : `/api/admin/services/${id}`,
  );
  const { mutate, saving } = useAdminMutation();

  const form = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      slug: "",
      status: "draft",
      sortOrder: 0,
      benefits: [],
      inquirySteps: [],
      seo: {},
    },
  });

  useEffect(() => {
    if (data?.service) form.reset(data.service);
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    if (isNew) {
      const result = await mutate<{ service?: { _id: string } }>(
        "/api/admin/services",
        { method: "POST", body: JSON.stringify(values) },
        { successMessage: "Service created" },
      );
      if (result.service?._id) router.replace(`/admin/services/${result.service._id}`);
      return;
    }
    await mutate(
      `/api/admin/services/${id}`,
      { method: "PATCH", body: JSON.stringify(values) },
      { successMessage: "Service saved" },
    );
    reload();
  });

  const benefits = form.watch("benefits") ?? [];
  const inquirySteps = form.watch("inquirySteps") ?? [];

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <AdminHeader
          title={isNew ? "New service" : form.watch("title") || "Edit service"}
          onMenuClick={openMenu}
          actions={
            <div className="flex gap-2">
              <Link href="/admin/services" className="rounded-full px-4 py-2 text-sm text-ink/60 hover:bg-sand/30">
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

          {loading && !isNew && !data?.service ? (
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
                  <FormField label="Title" required>
                    <AdminInput {...form.register("title")} />
                  </FormField>
                  <FormField label="Slug" required>
                    <AdminInput {...form.register("slug")} />
                  </FormField>
                  <FormField label="CTA text">
                    <AdminInput {...form.register("ctaText")} />
                  </FormField>
                  <FormField label="Sort order">
                    <AdminInput type="number" {...form.register("sortOrder")} />
                  </FormField>
                  <FormField label="Status">
                    <AdminSelect {...form.register("status")}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </AdminSelect>
                  </FormField>
                  <FormField label="Icon accent">
                    <AdminInput {...form.register("iconAccent")} placeholder="golden" />
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
                      folder="pages"
                    />
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
                    folder="pages"
                  />
                  <FormField label="Overview">
                    <AdminTextarea rows={5} {...form.register("overview")} />
                  </FormField>
                  <FormField label="Intended guest type">
                    <AdminInput {...form.register("intendedGuestType")} />
                  </FormField>
                  <FormField label="Benefits">
                    {benefits.map((_, index) => (
                      <input
                        key={index}
                        {...form.register(`benefits.${index}`)}
                        className={`${adminInputClass} mb-2`}
                      />
                    ))}
                    <button
                      type="button"
                      className="text-sm text-lake-medium"
                      onClick={() => form.setValue("benefits", [...benefits, ""], { shouldDirty: true })}
                    >
                      + Add benefit
                    </button>
                  </FormField>
                  <FormField label="Experience details">
                    <AdminTextarea rows={4} {...form.register("experienceDetails")} />
                  </FormField>
                  <FormField label="Inquiry steps">
                    {inquirySteps.map((_, index) => (
                      <input
                        key={index}
                        {...form.register(`inquirySteps.${index}`)}
                        className={`${adminInputClass} mb-2`}
                      />
                    ))}
                    <button
                      type="button"
                      className="text-sm text-lake-medium"
                      onClick={() =>
                        form.setValue("inquirySteps", [...inquirySteps, ""], { shouldDirty: true })
                      }
                    >
                      + Add step
                    </button>
                  </FormField>
                  <FormField label="Seasonal notes">
                    <AdminTextarea rows={3} {...form.register("seasonalNotes")} />
                  </FormField>
                  <FormField label="Safety policies">
                    <AdminTextarea rows={3} {...form.register("safetyPolicies")} />
                  </FormField>
                </AdminPanel>
              ) : null}

              {tab === "seo" ? <SeoEditor /> : null}
            </>
          )}
        </div>

        <ConfirmDialog
          open={confirmDelete}
          title="Archive this service?"
          description="The service will be hidden from the public site."
          confirmLabel="Archive"
          variant="danger"
          loading={saving}
          onCancel={() => setConfirmDelete(false)}
          onConfirm={async () => {
            await mutate(`/api/admin/services/${id}`, { method: "DELETE" }, { successMessage: "Service archived" });
            router.push("/admin/services");
          }}
        />
      </form>
    </FormProvider>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { AdminHeader, AdminPanel, AdminTabs } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { AdminInput, AdminSelect, FormField } from "@/components/admin/form-field";
import { SeoEditor, SectionEditor, type AdminPageSection } from "@/components/admin/section-editor";
import { useAdminFetch, useAdminMutation } from "@/hooks/use-admin-fetch";
import { PAGE_SECTION_TYPES } from "@/models/Page";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { adminImageRefSchema } from "@/lib/validation/admin-ui";

const pageFormSchema = z.object({
  title: z.string().min(1),
  status: z.enum(["draft", "published"]),
  sections: z.array(z.custom<AdminPageSection>()),
  seo: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
      canonical: z.string().optional(),
      noIndex: z.boolean().optional(),
      ogImage: adminImageRefSchema,
    })
    .optional(),
});

type PageFormValues = z.infer<typeof pageFormSchema> & {
  sections: AdminPageSection[];
};

function newSection(type: string, order: number): AdminPageSection {
  const key = `section-${Date.now()}`;
  return {
    sectionKey: key,
    type: type as AdminPageSection["type"],
    enabled: true,
    order,
    heading: "",
    subheading: "",
    body: "",
    listItems: [],
    images: [],
  };
}

export default function AdminPageEditorPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const { openMenu } = useAdminLayout();
  const [tab, setTab] = useState<"content" | "seo">("content");
  const [newSectionType, setNewSectionType] = useState<string>("rich-text");
  const { data, loading, error, reload } = useAdminFetch<{ page?: PageFormValues & { slug: string } }>(
    slug ? `/api/admin/pages/${slug}` : null,
  );
  const { mutate, saving } = useAdminMutation();

  const form = useForm<PageFormValues>({
    resolver: zodResolver(pageFormSchema),
    defaultValues: { title: "", status: "published", sections: [], seo: {} },
  });

  useEffect(() => {
    if (data?.page) {
      const sections = [...(data.page.sections ?? [])].sort((a, b) => a.order - b.order);
      form.reset({
        title: data.page.title,
        status: data.page.status as "draft" | "published",
        sections,
        seo: data.page.seo ?? {},
      });
    }
  }, [data, form]);

  const sections = form.watch("sections") ?? [];

  const moveSection = (index: number, direction: -1 | 1) => {
    const next = [...sections];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    const reordered = next.map((section, order) => ({ ...section, order }));
    form.setValue("sections", reordered, { shouldDirty: true });
  };

  const removeSection = (index: number) => {
    const next = sections.filter((_, i) => i !== index).map((section, order) => ({ ...section, order }));
    form.setValue("sections", next, { shouldDirty: true });
  };

  const addSection = () => {
    const next = [...sections, newSection(newSectionType, sections.length)];
    form.setValue("sections", next, { shouldDirty: true });
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      ...values,
      sections: values.sections.map((section, index) => ({ ...section, order: index })),
    };
    await mutate(
      `/api/admin/pages/${slug}`,
      { method: "PATCH", body: JSON.stringify(payload) },
      { successMessage: "Page saved" },
    );
    reload();
  });

  if (loading && !data?.page) {
    return (
      <>
        <AdminHeader title="Loading page…" onMenuClick={openMenu} />
        <div className="space-y-4 p-4 lg:p-8">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-xl bg-sand/30" />
          ))}
        </div>
      </>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <AdminHeader
          title={form.watch("title") || slug}
          description={`Editing /${slug === "home" ? "" : slug}`}
          onMenuClick={openMenu}
          actions={
            <div className="flex gap-2">
              <Link href="/admin/pages" className="rounded-full px-4 py-2 text-sm text-ink/60 hover:bg-sand/30">
                Back
              </Link>
              <Button type="submit" variant="golden" disabled={saving}>
                {saving ? "Saving…" : "Save page"}
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

          <AdminPanel className="grid gap-4 sm:grid-cols-2">
            <FormField label="Page title" required error={form.formState.errors.title?.message}>
              <AdminInput {...form.register("title")} />
            </FormField>
            <FormField label="Status">
              <AdminSelect {...form.register("status")}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </AdminSelect>
            </FormField>
          </AdminPanel>

          <AdminTabs
            tabs={[
              { id: "content", label: `Sections (${sections.length})` },
              { id: "seo", label: "SEO" },
            ]}
            active={tab}
            onChange={(id) => setTab(id as "content" | "seo")}
          />

          {tab === "content" ? (
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={`${section.sectionKey}-${index}`} className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 px-1">
                    <span className="text-xs font-medium text-ink/50">Section {index + 1}</span>
                    <button
                      type="button"
                      className="text-xs text-lake-medium hover:underline disabled:opacity-40"
                      disabled={index === 0}
                      onClick={() => moveSection(index, -1)}
                    >
                      Move up
                    </button>
                    <button
                      type="button"
                      className="text-xs text-lake-medium hover:underline disabled:opacity-40"
                      disabled={index === sections.length - 1}
                      onClick={() => moveSection(index, 1)}
                    >
                      Move down
                    </button>
                  </div>
                  <SectionEditor
                    index={index}
                    section={section}
                    onRemove={() => removeSection(index)}
                  />
                </div>
              ))}

              <AdminPanel className="flex flex-wrap items-end gap-3">
                <FormField label="Add section" className="min-w-[200px] flex-1">
                  <AdminSelect value={newSectionType} onChange={(e) => setNewSectionType(e.target.value)}>
                    {PAGE_SECTION_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </AdminSelect>
                </FormField>
                <Button type="button" variant="secondary" onClick={addSection}>
                  + Add section
                </Button>
              </AdminPanel>

              {!sections.length ? (
                <AdminPanel>
                  <p className="text-sm text-ink/50">
                    This page has no sections yet. Add a section above to start building the page.
                  </p>
                </AdminPanel>
              ) : null}
            </div>
          ) : null}

          {tab === "seo" ? <SeoEditor /> : null}
        </div>
      </form>
    </FormProvider>
  );
}

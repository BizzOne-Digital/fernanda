"use client";

import { AdminPanel } from "@/components/admin/admin-header";
import { AdminInput, AdminTextarea, FormField } from "@/components/admin/form-field";
import { MediaPicker, type ImageRefValue } from "@/components/admin/media-picker";
import { useFormContext } from "react-hook-form";

type SeoFormValues = {
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    noIndex?: boolean;
    ogImage?: ImageRefValue | null;
  };
};

export function SeoEditor() {
  const { register, watch, setValue } = useFormContext<SeoFormValues>();
  const ogImage = watch("seo.ogImage");

  return (
    <AdminPanel className="space-y-4">
      <h3 className="font-serif text-xl text-lake-deep">SEO</h3>
      <FormField label="Meta title">
        <AdminInput {...register("seo.title")} />
      </FormField>
      <FormField label="Meta description">
        <AdminTextarea rows={3} {...register("seo.description")} />
      </FormField>
      <FormField label="Canonical URL">
        <AdminInput {...register("seo.canonical")} placeholder="https://..." />
      </FormField>
      <label className="flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" {...register("seo.noIndex")} />
        No index
      </label>
      <MediaPicker
        label="Open Graph image"
        folder="pages"
        value={ogImage ?? null}
        onChange={(image) => setValue("seo.ogImage", image ?? undefined, { shouldDirty: true })}
      />
    </AdminPanel>
  );
}

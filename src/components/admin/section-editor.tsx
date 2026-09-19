"use client";

import { AdminTabs, AdminPanel } from "@/components/admin/admin-header";
import {
  AdminInput,
  AdminSelect,
  AdminTextarea,
  FormField,
  adminInputClass,
} from "@/components/admin/form-field";
import { MediaPicker, type ImageRefValue } from "@/components/admin/media-picker";
import { PAGE_SECTION_TYPES } from "@/lib/pages/page-section-types";
import type { IPageSection } from "@/models/Page";
import type { AdminImageRef } from "@/lib/validation/admin-ui";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export type AdminPageSection = Omit<
  IPageSection,
  "images" | "backgroundImage" | "foregroundImage"
> & {
  images?: AdminImageRef[];
  backgroundImage?: AdminImageRef;
  foregroundImage?: AdminImageRef;
};

type SectionEditorProps = {
  index: number;
  section: AdminPageSection;
  onRemove?: () => void;
};

type SectionFormValues = {
  sections: AdminPageSection[];
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    noIndex?: boolean;
    ogImage?: ImageRefValue | null;
  };
};

function ListItemsEditor({ index }: { index: number }) {
  const { register, watch, setValue } = useFormContext<SectionFormValues>();
  const items = watch(`sections.${index}.listItems`) ?? [];

  return (
    <div className="space-y-3">
      {items.map((_, itemIndex) => (
        <div key={itemIndex} className="flex gap-2">
          <input
            {...register(`sections.${index}.listItems.${itemIndex}`)}
            className={adminInputClass}
            placeholder={`Item ${itemIndex + 1}`}
          />
          <button
            type="button"
            className="shrink-0 rounded-lg px-2 text-sm text-ink/50 hover:bg-red-50 hover:text-red-600"
            onClick={() => {
              const next = items.filter((__, i) => i !== itemIndex);
              setValue(`sections.${index}.listItems`, next, { shouldDirty: true });
            }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-sm text-lake-medium hover:text-lake-deep"
        onClick={() => setValue(`sections.${index}.listItems`, [...items, ""], { shouldDirty: true })}
      >
        + Add list item
      </button>
    </div>
  );
}

function StatsEditor({ index }: { index: number }) {
  const { register, watch, setValue } = useFormContext<SectionFormValues>();
  const stats = watch(`sections.${index}.stats`) ?? [];

  return (
    <div className="space-y-3">
      {stats.map((_, statIndex) => (
        <div key={statIndex} className="grid gap-2 sm:grid-cols-2">
          <input
            {...register(`sections.${index}.stats.${statIndex}.label`)}
            className={adminInputClass}
            placeholder="Label"
          />
          <div className="flex gap-2">
            <input
              {...register(`sections.${index}.stats.${statIndex}.value`)}
              className={adminInputClass}
              placeholder="Value"
            />
            <button
              type="button"
              className="shrink-0 rounded-lg px-2 text-sm text-ink/50 hover:text-red-600"
              onClick={() => {
                const next = stats.filter((__, i) => i !== statIndex);
                setValue(`sections.${index}.stats`, next, { shouldDirty: true });
              }}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="text-sm text-lake-medium hover:text-lake-deep"
        onClick={() =>
          setValue(`sections.${index}.stats`, [...stats, { label: "", value: "" }], {
            shouldDirty: true,
          })
        }
      >
        + Add stat
      </button>
    </div>
  );
}

export function SectionEditor({ index, section, onRemove }: SectionEditorProps) {
  const [tab, setTab] = useState("content");
  const { register, watch, setValue } = useFormContext<SectionFormValues>();

  const enabled = watch(`sections.${index}.enabled`);
  const backgroundImage = watch(`sections.${index}.backgroundImage`);
  const foregroundImage = watch(`sections.${index}.foregroundImage`);
  const images = watch(`sections.${index}.images`) ?? [];

  return (
    <AdminPanel className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-lake-medium">
            {section.type}
          </p>
          <h3 className="font-serif text-xl text-lake-deep">
            {section.heading || section.sectionKey}
          </h3>
          <p className="text-xs text-ink/50">Key: {section.sectionKey}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input type="checkbox" {...register(`sections.${index}.enabled`)} />
            Enabled
          </label>
          {onRemove ? (
            <button
              type="button"
              onClick={onRemove}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          ) : null}
        </div>
      </div>

      <AdminTabs
        tabs={[
          { id: "content", label: "Content" },
          { id: "media", label: "Media" },
          { id: "meta", label: "Meta" },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === "content" ? (
        <div className={cn("grid gap-4", !enabled && "opacity-60")}>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Eyebrow">
              <AdminInput {...register(`sections.${index}.eyebrow`)} />
            </FormField>
            <FormField label="Order">
              <AdminInput type="number" {...register(`sections.${index}.order`, { valueAsNumber: true })} />
            </FormField>
          </div>
          <FormField label="Heading">
            <AdminInput {...register(`sections.${index}.heading`)} />
          </FormField>
          <FormField label="Subheading">
            <AdminInput {...register(`sections.${index}.subheading`)} />
          </FormField>
          <FormField label="Body">
            <AdminTextarea rows={5} {...register(`sections.${index}.body`)} />
          </FormField>
          <FormField label="Quote">
            <AdminTextarea rows={3} {...register(`sections.${index}.quote`)} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="CTA text">
              <AdminInput {...register(`sections.${index}.ctaText`)} />
            </FormField>
            <FormField label="CTA URL">
              <AdminInput {...register(`sections.${index}.ctaUrl`)} />
            </FormField>
          </div>
          {["rich-text", "image-text", "timeline", "custom", "hero", "cta"].includes(section.type) ||
          (section.listItems?.length ?? 0) > 0 ? (
            <FormField label="List items">
              <ListItemsEditor index={index} />
            </FormField>
          ) : null}
          {section.type === "stats" || (section.stats?.length ?? 0) > 0 ? (
            <FormField label="Stats">
              <StatsEditor index={index} />
            </FormField>
          ) : null}
        </div>
      ) : null}

      {tab === "media" ? (
        <div className="grid gap-6">
          <MediaPicker
            label="Background image"
            folder="pages"
            value={backgroundImage ?? null}
            onChange={(image) =>
              setValue(`sections.${index}.backgroundImage`, image ?? undefined, { shouldDirty: true })
            }
          />
          <MediaPicker
            label="Foreground image"
            folder="pages"
            value={foregroundImage ?? null}
            onChange={(image) =>
              setValue(`sections.${index}.foregroundImage`, image ?? undefined, { shouldDirty: true })
            }
          />
          <div className="space-y-3">
            <p className="text-sm font-medium text-ink/80">Gallery images</p>
            {images.map((image, imageIndex) => (
              <MediaPicker
                key={imageIndex}
                label={`Image ${imageIndex + 1}`}
                folder="pages"
                value={image}
                onChange={(next) => {
                  if (!next) {
                    setValue(
                      `sections.${index}.images`,
                      images.filter((__, i) => i !== imageIndex),
                      { shouldDirty: true },
                    );
                  } else {
                    const copy = [...images];
                    copy[imageIndex] = next;
                    setValue(`sections.${index}.images`, copy, { shouldDirty: true });
                  }
                }}
              />
            ))}
            <button
              type="button"
              className="text-sm text-lake-medium hover:text-lake-deep"
              onClick={() =>
                setValue(`sections.${index}.images`, [...images, { url: "", alt: "" }], {
                  shouldDirty: true,
                })
              }
            >
              + Add gallery image
            </button>
          </div>
        </div>
      ) : null}

      {tab === "meta" ? (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Section key">
              <AdminInput {...register(`sections.${index}.sectionKey`)} />
            </FormField>
            <FormField label="Section type">
              <AdminSelect {...register(`sections.${index}.type`)}>
                {PAGE_SECTION_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </AdminSelect>
            </FormField>
          </div>
          <FormField label="Label" hint="Optional internal label">
            <AdminInput {...register(`sections.${index}.label`)} />
          </FormField>
          {section.type === "custom" ? (
            <FormField
              label="Metadata (JSON)"
              hint='e.g. {"layout":"activity-constellation"}'
            >
              <AdminTextarea
                rows={4}
                value={JSON.stringify(watch(`sections.${index}.metadata`) ?? {}, null, 2)}
                onChange={(event) => {
                  try {
                    const parsed = JSON.parse(event.target.value || "{}");
                    setValue(`sections.${index}.metadata`, parsed, { shouldDirty: true });
                  } catch {
                    // Allow invalid JSON while typing
                  }
                }}
              />
            </FormField>
          ) : null}
        </div>
      ) : null}
    </AdminPanel>
  );
}

export { SeoEditor } from "@/components/admin/seo-editor";

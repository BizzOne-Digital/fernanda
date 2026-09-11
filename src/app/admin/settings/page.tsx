"use client";

import { Button } from "@/components/ui/button";
import { AdminHeader, AdminPanel } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import {
  AdminInput,
  AdminSelect,
  AdminTextarea,
  FormField,
} from "@/components/admin/form-field";
import { MediaPicker, type ImageRefValue } from "@/components/admin/media-picker";
import { useAdminFetch, useAdminMutation } from "@/hooks/use-admin-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { adminImageRefSchema } from "@/lib/validation/admin-ui";

const settingsSchema = z.object({
  general: z.object({
    brandName: z.string().optional(),
    shortBrandName: z.string().optional(),
    projectName: z.string().optional(),
    primaryHeadline: z.string().optional(),
    supportingHeadline: z.string().optional(),
    announcement: z.string().optional(),
    defaultSeoTitle: z.string().optional(),
    defaultSeoDescription: z.string().optional(),
    logo: adminImageRefSchema,
  }),
  contact: z.object({
    email: z.string().optional(),
    phoneDisplay: z.string().optional(),
    phoneLink: z.string().optional(),
    facebook: z.string().optional(),
    address: z.string().optional(),
    businessHours: z.string().optional(),
  }),
  property: z.object({
    sharedAmenities: z.array(z.string()).optional(),
    packingNotes: z.string().optional(),
    landscapeDescriptors: z.array(z.string()).optional(),
    safetyNotes: z.string().optional(),
  }),
  booking: z.object({
    inquiryConfirmationCopy: z.string().optional(),
    responseTimeWording: z.string().optional(),
    defaultCapacityRules: z.string().optional(),
    availabilityDisclaimer: z.string().optional(),
  }),
  footer: z.object({
    description: z.string().optional(),
    ctaText: z.string().optional(),
    ctaUrl: z.string().optional(),
    copyright: z.string().optional(),
  }),
  motion: z.object({
    introEnabled: z.boolean().optional(),
    introOncePerSession: z.boolean().optional(),
    animationIntensity: z.enum(["low", "medium", "high"]).optional(),
  }),
});

type SettingsForm = z.infer<typeof settingsSchema>;

const DEFAULT_SETTINGS: SettingsForm = {
  general: {},
  contact: {},
  property: { sharedAmenities: [], landscapeDescriptors: [] },
  booking: {},
  footer: {},
  motion: { introEnabled: true, introOncePerSession: true, animationIntensity: "medium" },
};

export default function AdminSettingsPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error, reload } = useAdminFetch<{ settings?: SettingsForm }>(
    "/api/admin/settings",
  );
  const { mutate, saving } = useAdminMutation();

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: DEFAULT_SETTINGS,
  });

  useEffect(() => {
    if (data?.settings) {
      form.reset({
        ...DEFAULT_SETTINGS,
        ...data.settings,
        property: {
          ...DEFAULT_SETTINGS.property,
          ...data.settings.property,
          sharedAmenities: data.settings.property?.sharedAmenities ?? [],
          landscapeDescriptors: data.settings.property?.landscapeDescriptors ?? [],
        },
      });
    }
  }, [data, form]);

  const amenities = form.watch("property.sharedAmenities") ?? [];
  const descriptors = form.watch("property.landscapeDescriptors") ?? [];

  const onSubmit = form.handleSubmit(async (values) => {
    await mutate(
      "/api/admin/settings",
      { method: "PATCH", body: JSON.stringify(values) },
      { successMessage: "Settings saved" },
    );
    reload();
  });

  return (
    <>
      <AdminHeader
        title="Site settings"
        description="Global branding, contact info, booking copy, and motion preferences."
        onMenuClick={openMenu}
        actions={
          <Button type="submit" form="settings-form" variant="golden" disabled={saving || loading}>
            {saving ? "Saving…" : "Save settings"}
          </Button>
        }
      />
      <div className="space-y-6 p-4 lg:p-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading && !data?.settings ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-40 animate-pulse rounded-xl bg-sand/30" />
            ))}
          </div>
        ) : (
          <form id="settings-form" onSubmit={onSubmit} className="space-y-6">
            <AdminPanel className="space-y-4">
              <h2 className="font-serif text-xl text-lake-deep">General</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Brand name">
                  <AdminInput {...form.register("general.brandName")} />
                </FormField>
                <FormField label="Short brand name">
                  <AdminInput {...form.register("general.shortBrandName")} />
                </FormField>
                <FormField label="Project name">
                  <AdminInput {...form.register("general.projectName")} />
                </FormField>
                <FormField label="Announcement">
                  <AdminInput {...form.register("general.announcement")} />
                </FormField>
              </div>
              <FormField label="Primary headline">
                <AdminTextarea rows={2} {...form.register("general.primaryHeadline")} />
              </FormField>
              <FormField label="Supporting headline">
                <AdminTextarea rows={2} {...form.register("general.supportingHeadline")} />
              </FormField>
              <MediaPicker
                label="Logo / hero image"
                folder="misc"
                value={(form.watch("general.logo") as ImageRefValue) ?? null}
                onChange={(image) => form.setValue("general.logo", image, { shouldDirty: true })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Default SEO title">
                  <AdminInput {...form.register("general.defaultSeoTitle")} />
                </FormField>
                <FormField label="Default SEO description">
                  <AdminTextarea rows={2} {...form.register("general.defaultSeoDescription")} />
                </FormField>
              </div>
            </AdminPanel>

            <AdminPanel className="space-y-4">
              <h2 className="font-serif text-xl text-lake-deep">Contact</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Email">
                  <AdminInput {...form.register("contact.email")} />
                </FormField>
                <FormField label="Phone display">
                  <AdminInput {...form.register("contact.phoneDisplay")} />
                </FormField>
                <FormField label="Phone link">
                  <AdminInput {...form.register("contact.phoneLink")} />
                </FormField>
                <FormField label="Facebook URL">
                  <AdminInput {...form.register("contact.facebook")} />
                </FormField>
              </div>
              <FormField label="Address">
                <AdminTextarea rows={2} {...form.register("contact.address")} />
              </FormField>
              <FormField label="Business hours">
                <AdminInput {...form.register("contact.businessHours")} />
              </FormField>
            </AdminPanel>

            <AdminPanel className="space-y-4">
              <h2 className="font-serif text-xl text-lake-deep">Property</h2>
              <FormField label="Shared amenities">
                {amenities.map((_, index) => (
                  <AdminInput key={index} className="mb-2" {...form.register(`property.sharedAmenities.${index}`)} />
                ))}
                <button
                  type="button"
                  className="text-sm text-lake-medium"
                  onClick={() =>
                    form.setValue("property.sharedAmenities", [...amenities, ""], { shouldDirty: true })
                  }
                >
                  + Add amenity
                </button>
              </FormField>
              <FormField label="Landscape descriptors">
                {descriptors.map((_, index) => (
                  <AdminInput
                    key={index}
                    className="mb-2"
                    {...form.register(`property.landscapeDescriptors.${index}`)}
                  />
                ))}
                <button
                  type="button"
                  className="text-sm text-lake-medium"
                  onClick={() =>
                    form.setValue("property.landscapeDescriptors", [...descriptors, ""], {
                      shouldDirty: true,
                    })
                  }
                >
                  + Add descriptor
                </button>
              </FormField>
              <FormField label="Packing notes">
                <AdminTextarea rows={3} {...form.register("property.packingNotes")} />
              </FormField>
              <FormField label="Safety notes">
                <AdminTextarea rows={3} {...form.register("property.safetyNotes")} />
              </FormField>
            </AdminPanel>

            <AdminPanel className="space-y-4">
              <h2 className="font-serif text-xl text-lake-deep">Booking</h2>
              <FormField label="Inquiry confirmation copy">
                <AdminTextarea rows={3} {...form.register("booking.inquiryConfirmationCopy")} />
              </FormField>
              <FormField label="Response time wording">
                <AdminInput {...form.register("booking.responseTimeWording")} />
              </FormField>
              <FormField label="Default capacity rules">
                <AdminTextarea rows={2} {...form.register("booking.defaultCapacityRules")} />
              </FormField>
              <FormField label="Availability disclaimer">
                <AdminTextarea rows={2} {...form.register("booking.availabilityDisclaimer")} />
              </FormField>
            </AdminPanel>

            <AdminPanel className="space-y-4">
              <h2 className="font-serif text-xl text-lake-deep">Footer</h2>
              <FormField label="Description">
                <AdminTextarea rows={3} {...form.register("footer.description")} />
              </FormField>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="CTA text">
                  <AdminInput {...form.register("footer.ctaText")} />
                </FormField>
                <FormField label="CTA URL">
                  <AdminInput {...form.register("footer.ctaUrl")} />
                </FormField>
              </div>
              <FormField label="Copyright">
                <AdminInput {...form.register("footer.copyright")} />
              </FormField>
            </AdminPanel>

            <AdminPanel className="space-y-4">
              <h2 className="font-serif text-xl text-lake-deep">Motion</h2>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("motion.introEnabled")} />
                Intro animation enabled
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("motion.introOncePerSession")} />
                Intro once per session
              </label>
              <FormField label="Animation intensity">
                <AdminSelect {...form.register("motion.animationIntensity")}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </AdminSelect>
              </FormField>
            </AdminPanel>
          </form>
        )}
      </div>
    </>
  );
}

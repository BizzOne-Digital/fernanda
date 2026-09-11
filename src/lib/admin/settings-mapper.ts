import type { ISiteSettings } from "@/models/SiteSettings";
import type { IImageRef } from "@/models/shared/schemas";
import type { SettingsPatchInput } from "@/lib/validation/settings";

/** Admin form shape used by the settings page */
export type AdminSettingsForm = {
  general: {
    brandName?: string;
    shortBrandName?: string;
    projectName?: string;
    primaryHeadline?: string;
    supportingHeadline?: string;
    announcement?: string;
    defaultSeoTitle?: string;
    defaultSeoDescription?: string;
    logo?: { url?: string; alt?: string; mediaId?: string } | null;
  };
  contact: {
    email?: string;
    phoneDisplay?: string;
    phoneLink?: string;
    facebook?: string;
    address?: string;
    businessHours?: string;
  };
  property: {
    sharedAmenities?: string[];
    packingNotes?: string;
    landscapeDescriptors?: string[];
    safetyNotes?: string;
  };
  booking: {
    inquiryConfirmationCopy?: string;
    responseTimeWording?: string;
    defaultCapacityRules?: string;
    availabilityDisclaimer?: string;
  };
  footer: {
    description?: string;
    ctaText?: string;
    ctaUrl?: string;
    copyright?: string;
  };
  motion: {
    introEnabled?: boolean;
    introOncePerSession?: boolean;
    animationIntensity?: "low" | "medium" | "high";
  };
};

export function settingsToAdminForm(settings: ISiteSettings | Record<string, unknown>): AdminSettingsForm {
  const s = settings as ISiteSettings;
  return {
    general: {
      brandName: s.general?.brandName,
      shortBrandName: s.general?.shortBrandName,
      projectName: s.general?.descriptor,
      primaryHeadline: s.general?.primaryHeadline,
      supportingHeadline: s.general?.supportingHeadline,
      announcement: s.general?.announcementText,
      defaultSeoTitle: s.general?.defaultSeo?.title,
      defaultSeoDescription: s.general?.defaultSeo?.description,
      logo: s.general?.logo
        ? {
            ...s.general.logo,
            mediaId: s.general.logo.mediaId ? String(s.general.logo.mediaId) : undefined,
          }
        : null,
    },
    contact: {
      email: s.contact?.email,
      phoneDisplay: s.contact?.phoneDisplay,
      phoneLink: s.contact?.phoneLink,
      facebook: s.contact?.facebookUrl,
      address: s.contact?.address,
      businessHours: s.contact?.businessHours,
    },
    property: {
      sharedAmenities: s.property?.sharedAmenities ?? [],
      packingNotes: s.property?.packingNotes,
      landscapeDescriptors: s.property?.landscapeDescriptors ?? [],
      safetyNotes: s.property?.generalSafetyNotes,
    },
    booking: {
      inquiryConfirmationCopy: s.booking?.inquiryConfirmationCopy,
      responseTimeWording: s.booking?.responseTimeWording,
      defaultCapacityRules: s.booking?.defaultCapacityRules,
      availabilityDisclaimer: s.booking?.availabilityDisclaimer,
    },
    footer: {
      description: s.footer?.shortDescription,
      ctaText: s.footer?.ctaText,
      ctaUrl: s.footer?.ctaUrl,
      copyright: s.footer?.copyrightText,
    },
    motion: {
      introEnabled: s.motion?.introEnabled,
      introOncePerSession: s.motion?.introOncePerSession,
      animationIntensity: s.motion?.animationIntensity,
    },
  };
}

export function adminFormToSettingsPatch(values: AdminSettingsForm): SettingsPatchInput {
  return {
    general: {
      brandName: values.general?.brandName,
      shortBrandName: values.general?.shortBrandName,
      projectName: values.general?.projectName,
      primaryHeadline: values.general?.primaryHeadline,
      supportingHeadline: values.general?.supportingHeadline,
      announcement: values.general?.announcement,
      defaultSeoTitle: values.general?.defaultSeoTitle,
      defaultSeoDescription: values.general?.defaultSeoDescription,
      logo:
        values.general?.logo?.url
          ? { ...values.general.logo, url: values.general.logo.url }
          : null,
    },
    contact: {
      email: values.contact?.email,
      phoneDisplay: values.contact?.phoneDisplay,
      phoneLink: values.contact?.phoneLink,
      facebook: values.contact?.facebook,
      address: values.contact?.address,
      businessHours: values.contact?.businessHours,
    },
    property: {
      sharedAmenities: values.property?.sharedAmenities,
      packingNotes: values.property?.packingNotes,
      landscapeDescriptors: values.property?.landscapeDescriptors,
      safetyNotes: values.property?.safetyNotes,
    },
    booking: values.booking,
    footer: {
      description: values.footer?.description,
      ctaText: values.footer?.ctaText,
      ctaUrl: values.footer?.ctaUrl,
      copyright: values.footer?.copyright,
    },
    motion: values.motion,
  };
}

export function applySettingsPatch(
  settings: ISiteSettings,
  patch: SettingsPatchInput,
): void {
  if (patch.general) {
    const g = patch.general;
    if (g.brandName !== undefined) settings.general.brandName = g.brandName;
    if (g.shortBrandName !== undefined) settings.general.shortBrandName = g.shortBrandName;
    if (g.projectName !== undefined) settings.general.descriptor = g.projectName;
    if (g.primaryHeadline !== undefined) settings.general.primaryHeadline = g.primaryHeadline;
    if (g.supportingHeadline !== undefined) settings.general.supportingHeadline = g.supportingHeadline;
    if (g.announcement !== undefined) {
      settings.general.announcementText = g.announcement ?? undefined;
      settings.general.announcementEnabled = Boolean(g.announcement);
    }
    if (g.defaultSeoTitle !== undefined) settings.general.defaultSeo.title = g.defaultSeoTitle;
    if (g.defaultSeoDescription !== undefined) {
      settings.general.defaultSeo.description = g.defaultSeoDescription;
    }
    if (g.logo !== undefined) settings.general.logo = (g.logo ?? undefined) as IImageRef | undefined;
  }

  if (patch.contact) {
    const c = patch.contact;
    if (c.email !== undefined) settings.contact.email = c.email;
    if (c.phoneDisplay !== undefined) settings.contact.phoneDisplay = c.phoneDisplay;
    if (c.phoneLink !== undefined) settings.contact.phoneLink = c.phoneLink;
    if (c.facebook !== undefined) settings.contact.facebookUrl = c.facebook;
    if (c.address !== undefined) settings.contact.address = c.address ?? undefined;
    if (c.businessHours !== undefined) settings.contact.businessHours = c.businessHours ?? undefined;
  }

  if (patch.property) {
    const p = patch.property;
    if (p.sharedAmenities !== undefined) settings.property.sharedAmenities = p.sharedAmenities;
    if (p.packingNotes !== undefined) settings.property.packingNotes = p.packingNotes;
    if (p.landscapeDescriptors !== undefined) {
      settings.property.landscapeDescriptors = p.landscapeDescriptors;
    }
    if (p.safetyNotes !== undefined) settings.property.generalSafetyNotes = p.safetyNotes;
  }

  if (patch.booking) {
    Object.assign(settings.booking, patch.booking);
  }

  if (patch.footer) {
    const f = patch.footer;
    if (f.description !== undefined) settings.footer.shortDescription = f.description;
    if (f.ctaText !== undefined) settings.footer.ctaText = f.ctaText;
    if (f.ctaUrl !== undefined) settings.footer.ctaUrl = f.ctaUrl;
    if (f.copyright !== undefined) settings.footer.copyrightText = f.copyright;
  }

  if (patch.motion) {
    Object.assign(settings.motion, patch.motion);
  }
}

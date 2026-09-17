import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import SiteSettings, {
  SITE_SETTINGS_KEY,
  type ISiteSettings,
} from "@/models/SiteSettings";
import { FALLBACK_SETTINGS } from "@/lib/data/fallbacks";
import { toPlain, type PlainModel } from "@/lib/data/utils";

export type SiteSettingsData = PlainModel<ISiteSettings> & {
  _id?: string;
};

function fallbackSettings(): SiteSettingsData {
  return toPlain(FALLBACK_SETTINGS) as SiteSettingsData;
}

/** Ensures nested settings exist when older DB documents omit subdocuments. */
export function normalizeSiteSettings(
  partial: Partial<SiteSettingsData> | null | undefined,
): SiteSettingsData {
  const base = fallbackSettings();
  if (!partial) return base;

  return {
    ...base,
    ...partial,
    general: { ...base.general, ...partial.general },
    contact: { ...base.contact, ...partial.contact },
    property: { ...base.property, ...partial.property },
    booking: { ...base.booking, ...partial.booking },
    footer: { ...base.footer, ...partial.footer },
    motion: { ...base.motion, ...partial.motion },
  };
}

async function fetchSiteSettings(): Promise<SiteSettingsData> {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne({ singletonKey: SITE_SETTINGS_KEY }).lean();
    if (!settings) {
      const created = await SiteSettings.create({ singletonKey: SITE_SETTINGS_KEY });
      return normalizeSiteSettings(toPlain(created.toObject()) as SiteSettingsData);
    }
    return normalizeSiteSettings(toPlain(settings) as SiteSettingsData);
  } catch {
    return fallbackSettings();
  }
}

export const getSiteSettings = unstable_cache(
  fetchSiteSettings,
  ["site-settings-v2"],
  { tags: ["settings"], revalidate: 300 },
);

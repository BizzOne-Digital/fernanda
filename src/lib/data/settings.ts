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

async function fetchSiteSettings(): Promise<SiteSettingsData> {
  try {
    await connectDB();
    const settings = await SiteSettings.findOne({ singletonKey: SITE_SETTINGS_KEY }).lean();
    if (!settings) {
      const created = await SiteSettings.create({ singletonKey: SITE_SETTINGS_KEY });
      return toPlain(created.toObject()) as SiteSettingsData;
    }
    return toPlain(settings) as SiteSettingsData;
  } catch {
    return toPlain(FALLBACK_SETTINGS) as SiteSettingsData;
  }
}

export const getSiteSettings = unstable_cache(
  fetchSiteSettings,
  ["site-settings"],
  { tags: ["settings"], revalidate: 300 },
);

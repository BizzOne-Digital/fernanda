import Link from "next/link";
import type { SiteSettingsData } from "@/lib/data/settings";

type AnnouncementBarProps = {
  settings: SiteSettingsData;
};

export function AnnouncementBar({ settings }: AnnouncementBarProps) {
  const { announcementEnabled, announcementText, announcementLink } = settings.general;
  if (!announcementEnabled || !announcementText) return null;

  const content = (
    <span className="text-xs uppercase tracking-[0.2em]">{announcementText}</span>
  );

  return (
    <div className="bg-golden text-resort-navy">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-2 text-center">
        {announcementLink ? (
          <Link href={announcementLink} className="hover:text-golden">
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

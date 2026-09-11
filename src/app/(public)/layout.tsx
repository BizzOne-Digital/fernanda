import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CinematicIntro } from "@/components/motion/cinematic-intro";
import { getCabins } from "@/lib/data/cabins";
import { getSiteSettings } from "@/lib/data/settings";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const [settings, cabins] = await Promise.all([getSiteSettings(), getCabins()]);

  return (
    <CinematicIntro settings={settings}>
      <div className="site-shell relative">
        <AnnouncementBar settings={settings} />
        <Header settings={settings} cabins={cabins} />
        <main id="main-content" className="w-full min-w-0">
          {children}
        </main>
      </div>
      <Footer settings={settings} />
    </CinematicIntro>
  );
}

import "./load-env";
import { connectMongo, disconnectMongo } from "@/lib/mongodb";
import { attractionSeeds } from "@/lib/seed/attractions";
import { buildCabinSeeds } from "@/lib/seed/cabins";
import { faqSeeds } from "@/lib/seed/faqs";
import { galleryCategorySeeds } from "@/lib/seed/gallery";
import { galleryPhotoSeeds } from "@/lib/seed/gallery-photos";
import { seedIfMissing } from "@/lib/seed/helpers";
import { pageSeeds } from "@/lib/seed/pages";
import { seasonSeeds } from "@/lib/seed/seasons";
import { serviceSeeds } from "@/lib/seed/services";
import { SITE_SETTINGS_KEY, siteSettingsSeed } from "@/lib/seed/settings";
import { testimonialSeeds } from "@/lib/seed/testimonials";
import Attraction from "@/models/Attraction";
import Cabin from "@/models/Cabin";
import FAQ from "@/models/FAQ";
import GalleryCategory from "@/models/GalleryCategory";
import GalleryPhoto from "@/models/GalleryPhoto";
import Page from "@/models/Page";
import Season from "@/models/Season";
import Service from "@/models/Service";
import SiteSettings from "@/models/SiteSettings";
import Testimonial from "@/models/Testimonial";

type SeedStats = {
  created: number;
  skipped: number;
};

function track(result: "created" | "skipped", stats: SeedStats) {
  if (result === "created") {
    stats.created += 1;
  } else {
    stats.skipped += 1;
  }
}

async function seedSettings(stats: SeedStats) {
  console.log("\nSite settings");
  track(
    await seedIfMissing(
      SiteSettings,
      { singletonKey: SITE_SETTINGS_KEY },
      siteSettingsSeed,
      "site settings",
    ),
    stats,
  );
}

async function seedPages(stats: SeedStats) {
  console.log("\nPages");
  for (const page of pageSeeds) {
    track(
      await seedIfMissing(Page, { slug: page.slug }, page, `page:${page.slug}`),
      stats,
    );
  }
}

async function seedCabins(stats: SeedStats) {
  console.log("\nCabins");
  for (const cabin of buildCabinSeeds()) {
    track(
      await seedIfMissing(
        Cabin,
        { cabinNumber: cabin.cabinNumber },
        cabin,
        `cabin:${cabin.cabinNumber}`,
      ),
      stats,
    );
  }
}

async function seedServices(stats: SeedStats) {
  console.log("\nServices");
  for (const service of serviceSeeds) {
    track(
      await seedIfMissing(Service, { slug: service.slug }, service, `service:${service.slug}`),
      stats,
    );
  }
}

async function seedSeasons(stats: SeedStats) {
  console.log("\nSeasons");
  for (const season of seasonSeeds) {
    track(
      await seedIfMissing(
        Season,
        { name: season.name, year: season.year },
        season,
        `season:${season.name} ${season.year}`,
      ),
      stats,
    );
  }
}

async function seedGallery(stats: SeedStats) {
  console.log("\nGallery categories");
  for (const category of galleryCategorySeeds) {
    track(
      await seedIfMissing(
        GalleryCategory,
        { slug: category.slug },
        category,
        `gallery:${category.slug}`,
      ),
      stats,
    );
  }

  console.log("\nGallery photos");
  for (const photo of galleryPhotoSeeds) {
    track(
      await seedIfMissing(GalleryPhoto, { url: photo.url }, photo, `gallery-photo:${photo.url}`),
      stats,
    );
  }
}

async function seedFaqs(stats: SeedStats) {
  console.log("\nFAQs");
  for (const faq of faqSeeds) {
    track(
      await seedIfMissing(FAQ, { question: faq.question }, faq, `faq:${faq.question.slice(0, 48)}…`),
      stats,
    );
  }
}

async function seedTestimonials(stats: SeedStats) {
  console.log("\nTestimonials");
  await Testimonial.deleteMany({
    $or: [
      { isDemo: true },
      { guestName: { $regex: /Demo|Replace Before Launch/i } },
      { quote: { $regex: /^\[DEMO TESTIMONIAL\]/i } },
    ],
  });

  for (const testimonial of testimonialSeeds) {
    const existing = await Testimonial.findOne({ sortOrder: testimonial.sortOrder });
    if (existing) {
      await Testimonial.findByIdAndUpdate(existing._id, { $set: testimonial }, { runValidators: true });
      console.log(`  updated testimonial:${testimonial.guestName}`);
      stats.created += 1;
      continue;
    }

    track(
      await seedIfMissing(
        Testimonial,
        { sortOrder: testimonial.sortOrder },
        testimonial,
        `testimonial:${testimonial.guestName}`,
      ),
      stats,
    );
  }
}

async function seedAttractions(stats: SeedStats) {
  console.log("\nAttractions");
  for (const attraction of attractionSeeds) {
    track(
      await seedIfMissing(
        Attraction,
        { slug: attraction.slug },
        attraction,
        `attraction:${attraction.slug}`,
      ),
      stats,
    );
  }
}

async function main() {
  const stats: SeedStats = { created: 0, skipped: 0 };

  console.log("Vaseaux Lake Rentals — idempotent seed");
  console.log("Existing records are left unchanged.\n");

  await connectMongo();

  try {
    await seedSettings(stats);
    await seedPages(stats);
    await seedCabins(stats);
    await seedServices(stats);
    await seedSeasons(stats);
    await seedGallery(stats);
    await seedFaqs(stats);
    await seedTestimonials(stats);
    await seedAttractions(stats);

    console.log(`\nDone. Created ${stats.created}, skipped ${stats.skipped}.`);
  } finally {
    await disconnectMongo();
  }
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});

import { demoGallery, img } from "@/lib/seed/helpers";

export const blogSeeds = [
  {
    title: "[DEMO DRAFT] What to Pack for a Vaseaux Lake Stay",
    slug: "demo-what-to-pack-vaseaux-lake",
    excerpt:
      "Demo draft post — packing basics for a lakeside cabin stay. Replace before publishing.",
    coverImage: img("kitchen", "Demo blog cover — packing guide"),
    authorDisplayName: "Vaseaux Lake Team",
    category: "Packing Tips",
    tags: ["demo", "packing", "draft"],
    content: `<p><strong>[DEMO DRAFT — NOT PUBLISHED]</strong> This is placeholder editorial content for layout and admin testing.</p>
<p>Confirmed fact: guests bring their own bedding, towels, and toiletries. Kitchen basics and propane are provided.</p>
<p>Replace this article with owner-approved copy before launch.</p>`,
    inlineImages: demoGallery(2, "Demo packing blog"),
    isDemo: true,
    status: "draft" as const,
    seo: {
      title: "[Demo] What to Pack | Vaseaux Lake Blog",
      description: "Demo draft — packing tips for Vaseaux Lake stays.",
      noIndex: true,
    },
  },
  {
    title: "[DEMO DRAFT] A Short History of the Sundial Motel",
    slug: "demo-sundial-motel-history",
    excerpt:
      "Demo draft — from the Sundial Motel in the 1960s to today's waterfront cabins. Replace before publishing.",
    coverImage: img("historic", "Demo blog cover — property history"),
    authorDisplayName: "Vaseaux Lake Team",
    category: "History",
    tags: ["demo", "history", "draft"],
    content: `<p><strong>[DEMO DRAFT — NOT PUBLISHED]</strong> Originally opened as the Sundial Motel in the 1960s, the property has welcomed generations of visitors to Vaseaux Lake.</p>
<p>Today, eight private cabin-style accommodations sit within the historic building. Do not publish unverified historical details — expand with owner-supplied facts only.</p>`,
    inlineImages: demoGallery(2, "Demo history blog"),
    isDemo: true,
    status: "draft" as const,
    seo: {
      title: "[Demo] Sundial Motel History | Vaseaux Lake Blog",
      description: "Demo draft — property history on Vaseaux Lake.",
      noIndex: true,
    },
  },
  {
    title: "[DEMO DRAFT] Shoulder Season on the Lake",
    slug: "demo-shoulder-season-lake-guide",
    excerpt:
      "Demo draft — quieter lake days in May, June, and September. Replace before publishing.",
    coverImage: img("nature", "Demo blog cover — shoulder season"),
    authorDisplayName: "Vaseaux Lake Team",
    category: "Seasonal",
    tags: ["demo", "shoulder-season", "draft"],
    content: `<p><strong>[DEMO DRAFT — NOT PUBLISHED]</strong> Shoulder-season stays may be available in May, June, and September with different minimum stays than high season.</p>
<p>Rates are not fixed online — guests should inquire for availability and a quote. Do not invent pricing or local business recommendations here.</p>`,
    inlineImages: demoGallery(2, "Demo shoulder season blog"),
    isDemo: true,
    status: "draft" as const,
    seo: {
      title: "[Demo] Shoulder Season Guide | Vaseaux Lake Blog",
      description: "Demo draft — shoulder season on Vaseaux Lake.",
      noIndex: true,
    },
  },
];

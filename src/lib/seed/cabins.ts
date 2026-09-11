import { demoGallery, img } from "@/lib/seed/helpers";
import type { ICabinSleepingRow } from "@/models/shared/schemas";

const SHARED_AMENITIES = [
  "Private washroom with hot shower, sink, and toilet",
  "Fully stocked kitchen with fridge/freezer, stove/oven, and cookware",
  "Patio with picnic table",
  "Propane BBQ",
];

const PACKING_NOTE =
  "Guests bring their own bedding, towels, and toiletries. Kitchen basics and propane are provided.";

interface CabinSeed {
  cabinNumber: number;
  name: string;
  slug: string;
  capacity: number;
  hasSeparateBedroom: boolean;
  sleepingSummary: string;
  sleepingArrangement: ICabinSleepingRow[];
  shortDescription: string;
  featureHighlights: string[];
}

const cabinDefinitions: CabinSeed[] = [
  {
    cabinNumber: 5,
    name: "Cabin 5",
    slug: "cabin-5",
    capacity: 4,
    hasSeparateBedroom: false,
    sleepingSummary: "Queen bed in the front room; bunk beds at the back; no separate bedroom.",
    sleepingArrangement: [
      { bedType: "Queen", count: 1, location: "Front room" },
      { bedType: "Bunk", count: 1, location: "Back area", notes: "Bunk beds" },
    ],
    shortDescription:
      "Cozy open-layout cabin sleeping up to four — queen in front, bunks at the back.",
    featureHighlights: ["Sleeps up to 4", "Open layout", "Queen + bunk beds"],
  },
  {
    cabinNumber: 6,
    name: "Cabin 6",
    slug: "cabin-6",
    capacity: 5,
    hasSeparateBedroom: true,
    sleepingSummary: "Queen bed in the front room; three twin beds in a separate bedroom.",
    sleepingArrangement: [
      { bedType: "Queen", count: 1, location: "Front room" },
      { bedType: "Twin", count: 3, location: "Separate bedroom" },
    ],
    shortDescription:
      "Comfortable cabin with a separate bedroom — ideal for families who want a bit more privacy.",
    featureHighlights: ["Sleeps up to 5", "Separate bedroom", "Queen + three twins"],
  },
  {
    cabinNumber: 7,
    name: "Cabin 7",
    slug: "cabin-7",
    capacity: 5,
    hasSeparateBedroom: true,
    sleepingSummary: "Queen bed in the front room; three twin beds in a separate bedroom.",
    sleepingArrangement: [
      { bedType: "Queen", count: 1, location: "Front room" },
      { bedType: "Twin", count: 3, location: "Separate bedroom" },
    ],
    shortDescription:
      "Same thoughtful layout as Cabins 6 and 8 — queen up front, three twins in a private bedroom.",
    featureHighlights: ["Sleeps up to 5", "Separate bedroom", "Queen + three twins"],
  },
  {
    cabinNumber: 8,
    name: "Cabin 8",
    slug: "cabin-8",
    capacity: 5,
    hasSeparateBedroom: true,
    sleepingSummary: "Queen bed in the front room; three twin beds in a separate bedroom.",
    sleepingArrangement: [
      { bedType: "Queen", count: 1, location: "Front room" },
      { bedType: "Twin", count: 3, location: "Separate bedroom" },
    ],
    shortDescription:
      "A family-friendly five-guest cabin with queen in front and three twins in a separate bedroom.",
    featureHighlights: ["Sleeps up to 5", "Separate bedroom", "Queen + three twins"],
  },
  {
    cabinNumber: 9,
    name: "Cabin 9",
    slug: "cabin-9",
    capacity: 6,
    hasSeparateBedroom: true,
    sleepingSummary:
      "Queen bed in the front room; one double bed and bunk beds in a separate bedroom.",
    sleepingArrangement: [
      { bedType: "Queen", count: 1, location: "Front room" },
      { bedType: "Double", count: 1, location: "Separate bedroom" },
      { bedType: "Bunk", count: 1, location: "Separate bedroom", notes: "Bunk beds" },
    ],
    shortDescription:
      "Room for six with a queen in front and flexible sleeping in a separate bedroom.",
    featureHighlights: ["Sleeps up to 6", "Separate bedroom", "Queen + double + bunk"],
  },
  {
    cabinNumber: 10,
    name: "Cabin 10",
    slug: "cabin-10",
    capacity: 6,
    hasSeparateBedroom: true,
    sleepingSummary:
      "Queen bed in the front room; bunk beds and two twin beds in a separate bedroom.",
    sleepingArrangement: [
      { bedType: "Queen", count: 1, location: "Front room" },
      { bedType: "Bunk", count: 1, location: "Separate bedroom", notes: "Bunk beds" },
      { bedType: "Twin", count: 2, location: "Separate bedroom" },
    ],
    shortDescription:
      "Spacious six-guest cabin with queen up front and varied beds in a separate bedroom.",
    featureHighlights: ["Sleeps up to 6", "Separate bedroom", "Queen + bunk + two twins"],
  },
  {
    cabinNumber: 11,
    name: "Cabin 11",
    slug: "cabin-11",
    capacity: 4,
    hasSeparateBedroom: true,
    sleepingSummary: "Queen bed in a separate bedroom; futon in the front room.",
    sleepingArrangement: [
      { bedType: "Queen", count: 1, location: "Separate bedroom" },
      { bedType: "Futon", count: 1, location: "Front room" },
    ],
    shortDescription:
      "A four-guest cabin with a private queen bedroom and a futon in the front room.",
    featureHighlights: ["Sleeps up to 4", "Separate bedroom", "Queen + futon"],
  },
  {
    cabinNumber: 12,
    name: "Cabin 12",
    slug: "cabin-12",
    capacity: 6,
    hasSeparateBedroom: true,
    sleepingSummary:
      "Bunk beds and one double bed in a separate bedroom; futon in the front room.",
    sleepingArrangement: [
      { bedType: "Bunk", count: 1, location: "Separate bedroom", notes: "Bunk beds" },
      { bedType: "Double", count: 1, location: "Separate bedroom" },
      { bedType: "Futon", count: 1, location: "Front room" },
    ],
    shortDescription:
      "Flexible six-guest layout with bunk and double in a separate bedroom plus a front-room futon.",
    featureHighlights: ["Sleeps up to 6", "Separate bedroom", "Bunk + double + futon"],
  },
];

export function buildCabinSeeds() {
  return cabinDefinitions.map((cabin, index) => ({
    cabinNumber: cabin.cabinNumber,
    name: cabin.name,
    slug: cabin.slug,
    shortDescription: cabin.shortDescription,
    fullDescription: `${cabin.shortDescription} Each unit is a private cabin-style accommodation within our historic lakeside building — not a detached standalone cabin. The heart of your stay is outside on the lawn, beach, and lake.`,
    capacity: cabin.capacity,
    hasSeparateBedroom: cabin.hasSeparateBedroom,
    sleepingSummary: cabin.sleepingSummary,
    sleepingArrangement: cabin.sleepingArrangement,
    cardImage: img("cabinInterior", `${cabin.name} — demo card image`),
    heroImage: img("lakeHero", `${cabin.name} lakeside hero placeholder`),
    galleryImages: demoGallery(8, cabin.name),
    featureHighlights: cabin.featureHighlights,
    amenities: SHARED_AMENITIES,
    packingNotes: PACKING_NOTE,
    importantNotes:
      "Maximum occupancy includes all adults and children. Please inquire for availability — rates vary by dates, duration, and guest count.",
    bestSuitedFor: "",
    cabinFaqs: [
      {
        question: "Do I need to bring bedding?",
        answer:
          "Yes. Guests bring their own bedding, towels, and toiletries. Kitchen basics and propane are provided.",
        order: 0,
      },
      {
        question: "Is this a detached cabin?",
        answer:
          "No. Each unit is a private cabin-style accommodation within our historic building on Vaseaux Lake.",
        order: 1,
      },
    ],
    relatedCabinIds: [],
    status: "published" as const,
    sortOrder: index,
    seo: {
      title: `${cabin.name} | Vaseaux Lake Waterfront Cabins`,
      description: `${cabin.sleepingSummary} Inquire for availability and a quote.`,
    },
    isArchived: false,
  }));
}

export const cabinSlugs = cabinDefinitions.map((cabin) => cabin.slug);

import { demoGallery, propertyImg } from "@/lib/seed/helpers";

export const attractionSeeds = [
  {
    title: "Oliver Wine Country",
    slug: "oliver-wine-country",
    category: "Food & Wine",
    summary:
      "Oliver is known as the wine capital of Canada — tasting rooms, vineyard tours, and summer events just minutes from Vaseaux Lake.",
    body: `<p>The town of Oliver sits in the heart of the South Okanagan wine region. Dozens of wineries and tasting rooms line the valley, many within a short drive of the property.</p>
<p>Summer brings vineyard events, patio tastings, and the fresh energy of harvest season across the valley.</p>`,
    images: [
      propertyImg("/images/property/property-hydrangeas-lawn.jpg", "Gardens at the property near Oliver"),
      propertyImg("/images/property/property-pine-sky.jpg", "Pine trees against a summer sky"),
    ],
    travelTimeText: "Approx. 15 minutes to Oliver",
    season: "Year-round; peak activity May through October",
    familyNotes: "Many wineries welcome families; check individual venues for age policies.",
    isVerified: true,
    featured: true,
    sortOrder: 0,
    status: "published" as const,
    seo: {
      title: "Oliver Wine Country | Things to Do",
      description: "Wineries and tasting rooms near Vaseaux Lake in Oliver, BC.",
    },
  },
  {
    title: "McIntyre Bluff Hike",
    slug: "mcintyre-bluff-hike",
    category: "Hiking",
    summary:
      "One of the South Okanagan's signature hikes — panoramic views over the valley, Vaseaux Lake, and the surrounding bluffs.",
    body: `<p>McIntyre Bluff rises above the valley floor and offers one of the region's most rewarding day hikes. The trail rewards effort with sweeping views across wine country and the lake below.</p>
<p>Best attempted in cooler morning hours during summer. Bring water, sun protection, and sturdy footwear.</p>`,
    images: [
      propertyImg("/images/property/lake-mcintyre-bluff.jpg", "McIntyre Bluff above Vaseaux Lake"),
    ],
    travelTimeText: "Short drive from the property",
    season: "Spring through fall; conditions vary",
    familyNotes: "Moderate to challenging depending on route; best for older children and adults.",
    isVerified: true,
    featured: true,
    sortOrder: 1,
    status: "published" as const,
    seo: {
      title: "McIntyre Bluff Hike | Things to Do",
      description: "Hiking near Vaseaux Lake and Oliver, BC.",
    },
  },
  {
    title: "South Okanagan Cycling & Fruit Stands",
    slug: "okanagan-cycling-fruit-stands",
    category: "Family",
    summary:
      "Valley cycling routes, farm-fresh cherries and peaches in summer, and roadside fruit stands across the South Okanagan.",
    body: `<p>The flat valley floor between Oliver and the surrounding communities makes for pleasant cycling. In summer, farm stands appear along the roads with fresh cherries, peaches, apricots, and vegetables straight from the orchard.</p>
<p>A relaxed way to explore beyond the lake — at your own pace, with plenty of stops along the way.</p>`,
    images: [
      propertyImg("/images/property/property-lakefront-lawn.jpg", "Lakefront lawn in summer"),
      propertyImg("/images/property/family-picnic-sunset.jpg", "Outdoor dining at sunset"),
    ],
    travelTimeText: "Throughout the valley",
    season: "Peak fruit season: June through September",
    familyNotes: "Great for all ages; fruit stands are a summer highlight for families.",
    isVerified: true,
    featured: true,
    sortOrder: 2,
    status: "published" as const,
    seo: {
      title: "Cycling & Fruit Stands | Things to Do",
      description: "Summer cycling and fresh fruit near Vaseaux Lake, Oliver BC.",
    },
  },
  {
    title: "On-Property Lake Days",
    slug: "on-property-lake-days",
    category: "Nature",
    summary:
      "Fishing, swimming, paddleboards, the floating raft, lawn gatherings, and stargazing — right at the property.",
    body: `<p>Confirmed on-property experiences include patios, BBQs, lawn and beach access, complimentary paddleboards for guest use when available, a floating raft, and incredible star-filled skies.</p>
<p>Conditions, equipment availability, and wildlife sightings vary by season and are never guaranteed.</p>`,
    images: demoGallery(3, "On-property lake days"),
    season: "Summer peak; some activities vary in shoulder months",
    familyNotes: "Children must be supervised around water and equipment.",
    isVerified: true,
    featured: true,
    sortOrder: 3,
    status: "published" as const,
    seo: {
      title: "On-Property Lake Days | Things to Do",
      description: "Lake activities at Vaseaux Lake Waterfront Cabins.",
    },
  },
  {
    title: "Vaseaux Lake, Eagle's Bluff & McIntyre Bluff",
    slug: "vaseaux-lake-landscape",
    category: "Nature",
    summary:
      "The property sits between Eagle's Bluff and McIntyre Bluff with Vaseaux Lake directly in front.",
    body: `<p>Vaseaux Lake sits in the South Okanagan near Oliver, framed by Eagle's Bluff on one side and McIntyre Bluff on the other. Ponderosa pines and willow shade surround the property.</p>
<p>Bighorn sheep and various bird species may be spotted nearby — wildlife is never guaranteed.</p>`,
    images: demoGallery(3, "Vaseaux Lake landscape"),
    isVerified: true,
    featured: true,
    sortOrder: 4,
    status: "published" as const,
    seo: {
      title: "Vaseaux Lake Landscape | Things to Do",
      description: "Eagle's Bluff, McIntyre Bluff, and Vaseaux Lake views.",
    },
  },
];

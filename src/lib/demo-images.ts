const BASE = "/images/property";

export const PROPERTY_IMAGE_META = {
  lakeHero: {
    path: `${BASE}/lake-mcintyre-bluff.jpg`,
    alt: "McIntyre Bluff reflected on calm Vaseaux Lake",
  },
  cabinInterior: {
    path: `${BASE}/property-lakefront-lawn.jpg`,
    alt: "Lakefront lawn and sandy beach at the property",
  },
  patioBbq: {
    path: `${BASE}/family-picnic-sunset.jpg`,
    alt: "Guests dining at picnic tables under a willow tree at sunset",
  },
  boats: {
    path: `${BASE}/family-paddleboat.jpg`,
    alt: "Children enjoying a paddleboat on Vaseaux Lake",
  },
  kitchen: {
    path: `${BASE}/property-hydrangeas-lawn.jpg`,
    alt: "Shaded lawn and white hydrangeas at the property",
  },
  stars: {
    path: `${BASE}/sunset-chairs.jpg`,
    alt: "Adirondack chairs facing a colourful sunset over the lake",
  },
  historic: {
    path: `${BASE}/property-pine-sky.jpg`,
    alt: "Tall pine tree against a bright summer sky",
  },
  nature: {
    path: `${BASE}/wildlife-eagle.jpg`,
    alt: "Bald eagle perched in a pine tree near the lake",
  },
} as const;

export type DemoImageKey = keyof typeof PROPERTY_IMAGE_META;

export const DEMO_IMAGES = Object.fromEntries(
  Object.entries(PROPERTY_IMAGE_META).map(([key, meta]) => [key, meta.path]),
) as Record<DemoImageKey, string>;

/** All approved property photos (dock images excluded). */
export const PROPERTY_GALLERY: { path: string; alt: string; category: string }[] = [
  { path: `${BASE}/sunset-chairs.jpg`, alt: "Adirondack chairs facing a sunset over Vaseaux Lake", category: "sunset" },
  { path: `${BASE}/sunset-sailboat.jpg`, alt: "Sailboat on calm water at sunset", category: "sunset" },
  { path: `${BASE}/sunset-sailboat-calm.jpg`, alt: "Sailboat anchored on mirror-still lake at sunset", category: "sunset" },
  { path: `${BASE}/lake-mcintyre-bluff.jpg`, alt: "McIntyre Bluff reflected on glassy Vaseaux Lake", category: "lake" },
  { path: `${BASE}/sunset-orange-lake.jpg`, alt: "Dramatic orange sunset over the lake", category: "sunset" },
  { path: `${BASE}/sunset-canoe-shore.jpg`, alt: "Red canoe on the shore at sunset", category: "sunset" },
  { path: `${BASE}/sunset-twilight-lake.jpg`, alt: "Twilight over calm lake with mountain reflections", category: "sunset" },
  { path: `${BASE}/lake-mountain-forest.jpg`, alt: "Calm lake surrounded by forested mountains", category: "lake" },
  { path: `${BASE}/sunset-fiery-sky.jpg`, alt: "Fiery orange and purple sunset over the lake", category: "sunset" },
  { path: `${BASE}/sunset-pink-orange.jpg`, alt: "Vibrant pink and orange sunset sky over the lake", category: "sunset" },
  { path: `${BASE}/lake-glassy-mountains.jpg`, alt: "Glassy lake reflecting rocky mountains", category: "lake" },
  { path: `${BASE}/lake-shallow-clear.jpg`, alt: "Crystal-clear shallow water on Vaseaux Lake", category: "lake" },
  { path: `${BASE}/sunset-beach-seating.jpg`, alt: "Sunset lake view with sandy beach seating", category: "sunset" },
  { path: `${BASE}/sunset-clouds-lake.jpg`, alt: "Layered sunset clouds over calm lake", category: "sunset" },
  { path: `${BASE}/sunset-pine-framed.jpg`, alt: "Sunset framed by silhouetted pine trees", category: "sunset" },
  { path: `${BASE}/sunset-boaters.jpg`, alt: "Calm sunset lake with boaters on the water", category: "sunset" },
  { path: `${BASE}/lake-wide-mountains.jpg`, alt: "Wide lake view with rugged mountain backdrop", category: "lake" },
  { path: `${BASE}/lake-swim-platform.jpg`, alt: "Sunny lake with swim platform and bluff views", category: "lake" },
  { path: `${BASE}/lake-winter-frozen.jpg`, alt: "Partially frozen lake with snow-dusted mountains", category: "lake" },
  { path: `${BASE}/lake-winter-pines.jpg`, alt: "Frozen lake framed by pine branches", category: "lake" },
  { path: `${BASE}/wildlife-swans.jpg`, alt: "White swans swimming on Vaseaux Lake", category: "wildlife" },
  { path: `${BASE}/wildlife-swans-pair.jpg`, alt: "Pair of swans gliding across calm blue water", category: "wildlife" },
  { path: `${BASE}/wildlife-eagle.jpg`, alt: "Bald eagle perched in a pine tree", category: "wildlife" },
  { path: `${BASE}/family-paddleboat.jpg`, alt: "Children in life jackets on a paddleboat", category: "family" },
  { path: `${BASE}/family-lake-canopy.jpg`, alt: "Family enjoying lake activities under a canopy tent", category: "family" },
  { path: `${BASE}/family-group-dining.jpg`, alt: "Large group dining outdoors by the lake at dusk", category: "family" },
  { path: `${BASE}/family-picnic-sunset.jpg`, alt: "Guests at picnic tables under a willow tree at sunset", category: "family" },
  { path: `${BASE}/property-lakefront-lawn.jpg`, alt: "Lakefront lawn and sandy beach with guests relaxing", category: "property" },
  { path: `${BASE}/property-hydrangeas-lawn.jpg`, alt: "Sunny lawn and white hydrangeas under leafy canopy", category: "property" },
  { path: `${BASE}/property-pine-sky.jpg`, alt: "Tall pine tree against a bright blue summer sky", category: "property" },
  { path: `${BASE}/sunset-fire-pit.jpg`, alt: "Fire pit and lakeside chairs at sunset on Vaseaux Lake", category: "sunset" },
  { path: `${BASE}/sunset-valley-bluff.jpg`, alt: "Pink sunset sky over the valley and McIntyre Bluff", category: "sunset" },
  { path: `${BASE}/property-rental-sign.jpg`, alt: "Vaseux Lake weekly rentals sign at the property entrance", category: "property" },
  { path: `${BASE}/property-willow-lawn.jpg`, alt: "Weeping willows, lawn seating, and lake views at the property", category: "property" },
  { path: `${BASE}/property-herb-garden.jpg`, alt: "Herb and flower garden on the property", category: "property" },
  { path: `${BASE}/property-hydrangeas-table.jpg`, alt: "Hydrangeas on a picnic table overlooking the lake", category: "property" },
  { path: `${BASE}/lake-reflection-bluff.jpg`, alt: "Glassy lake reflecting mountains and sky at Vaseaux Lake", category: "lake" },
  { path: `${BASE}/wildlife-ducks.jpg`, alt: "Ducks swimming on Vaseaux Lake", category: "wildlife" },
  { path: `${BASE}/property-picnic-shore.jpg`, alt: "Picnic area and string lights along the sandy lakeshore", category: "property" },
  { path: `${BASE}/wildlife-bird-nest.jpg`, alt: "Baby birds in a nest under the property eaves", category: "wildlife" },
  { path: `${BASE}/family-swing-sunset.jpg`, alt: "Lakefront swings at sunset", category: "family" },
  { path: `${BASE}/family-kids-wading.jpg`, alt: "Children wading and playing in the shallow lake", category: "family" },
  { path: `${BASE}/family-paddleboard-pov.jpg`, alt: "Stand-up paddleboard on calm Vaseaux Lake", category: "family" },
];

export const HERO_IMAGE = "/images/hero-lake.jpg";

export function demoImage(key: DemoImageKey) {
  return PROPERTY_IMAGE_META[key].path;
}

export function demoImageAlt(key: DemoImageKey) {
  return PROPERTY_IMAGE_META[key].alt;
}

export function demoGallery(count: number, keys?: DemoImageKey[]) {
  const pool = keys
    ? keys.map((key) => ({
        src: PROPERTY_IMAGE_META[key].path,
        alt: PROPERTY_IMAGE_META[key].alt,
      }))
    : PROPERTY_GALLERY.map((item) => ({ src: item.path, alt: item.alt }));

  return Array.from({ length: count }, (_, index) => pool[index % pool.length]);
}

export function propertyGalleryByCategory(category: string, count?: number) {
  const filtered = PROPERTY_GALLERY.filter((item) => item.category === category);
  const pool = filtered.length > 0 ? filtered : PROPERTY_GALLERY;
  const slice = count ? pool.slice(0, count) : pool;
  return slice.map((item) => ({ src: item.path, alt: item.alt }));
}

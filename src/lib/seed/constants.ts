import { DEMO_IMAGES } from "@/lib/demo-images";
import type { IImageRef } from "@/models";

export function img(url: string, alt: string): IImageRef {
  return { url, alt };
}

export const demo = {
  lake: img(DEMO_IMAGES.lakeHero, "McIntyre Bluff reflected on Vaseaux Lake"),
  cabin: img(DEMO_IMAGES.cabinInterior, "Lakefront lawn and beach at the property"),
  patio: img(DEMO_IMAGES.patioBbq, "Guests dining at picnic tables by the lake"),
  boats: img(DEMO_IMAGES.boats, "Children enjoying a paddleboat on the lake"),
  kitchen: img(DEMO_IMAGES.kitchen, "Shaded lawn and gardens at the property"),
  stars: img(DEMO_IMAGES.stars, "Adirondack chairs facing a sunset over the lake"),
  historic: img(DEMO_IMAGES.historic, "Tall pine tree against a summer sky"),
  nature: img(DEMO_IMAGES.nature, "Bald eagle perched in a pine tree"),
};

export const SHARED_AMENITIES = [
  "Private washroom with hot shower, sink, and toilet",
  "Fully stocked kitchen with fridge/freezer, stove/oven, small appliances, serving dishes, pots, and pans",
  "Patio with picnic table",
  "BBQ and propane",
];

export const PACKING_NOTE =
  "Guests bring their own bedding, towels, and toiletries.";

export const BRAND_STORY = `From the Sundial Motel to Vaseaux Lake Waterfront Cabins. Originally opened as the Sundial Motel in the 1960s, our property has welcomed generations of visitors to the shores of Vaseaux Lake, near Oliver in the South Okanagan. Today, the original building continues to offer eight cabin-style accommodations, each with its own space and character — a little taste of the 1970s, when summer holidays meant lakeside days, family time, and making memories together.

The property isn't a collection of detached cabins. It's something more unusual: eight private accommodations under one nostalgic roof, surrounded by Eagle's Bluff on one side, McIntyre Bluff on the other, and directly in front, a perfect view of the heart of Vaseaux Lake — in the relaxed atmosphere of a bright Okanagan summer.

Guests stay in cozy, private cabin-style units within a historic building, but the heart of the experience is outside: patios, BBQs, the lawn, beach, shallow lake, paddleboards for guest use, a floating raft, evening gatherings, and incredible star-filled skies. The property is surrounded by nature — Ponderosa pines, majestic shade-giving willow trees, and opportunities to spot bighorn sheep and various bird species. Minutes away, Oliver's wine country, hiking trails, and summer fruit stands await.`;

import { img } from "@/lib/seed/helpers";

export const testimonialSeeds = [
  {
    guestName: "Sarah & Mark",
    location: "Kelowna, BC",
    quote:
      "Our family loved the lake mornings and quiet evenings on the patio. The kids spent hours on the raft while we grilled dinner — exactly the kind of simple summer we hoped for.",
    stayLabel: "Family summer stay",
    image: img("lakeHero", "Guest testimonial — lake morning"),
    featured: true,
    isDemo: false,
    sortOrder: 0,
    status: "published" as const,
  },
  {
    guestName: "The Chen Family",
    location: "Vancouver, BC",
    quote:
      "The shallow lake and quiet evenings made for easy family time. Paddleboards, the lawn, and starry skies — we did not want to leave.",
    stayLabel: "Family lake holiday",
    image: img("patioBbq", "Guest testimonial — patio evening"),
    featured: false,
    isDemo: false,
    sortOrder: 1,
    status: "published" as const,
  },
  {
    guestName: "James & Elena",
    location: "Calgary, AB",
    quote:
      "Starry nights over Vaseaux Lake were a highlight. Cozy cabins, warm hospitality, and mornings with coffee by the water.",
    stayLabel: "Couples getaway",
    image: img("stars", "Guest testimonial — starry lake night"),
    featured: false,
    isDemo: false,
    sortOrder: 2,
    status: "published" as const,
  },
  {
    guestName: "Returning Guest",
    location: "Okanagan, BC",
    quote:
      "We have come back three summers in a row. Same peaceful lake, same nostalgic feel — a tradition for our family now.",
    stayLabel: "Repeat summer stay",
    image: img("historic", "Guest testimonial — historic property"),
    featured: true,
    isDemo: false,
    sortOrder: 3,
    status: "published" as const,
  },
];

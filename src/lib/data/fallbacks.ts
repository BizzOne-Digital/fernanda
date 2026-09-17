import type { ISiteSettings } from "@/models/SiteSettings";
import { SITE_SETTINGS_KEY } from "@/models/SiteSettings";
import { PACKING_NOTE, SHARED_AMENITIES } from "@/lib/seed/constants";

export const FALLBACK_SETTINGS: ISiteSettings = {
  singletonKey: SITE_SETTINGS_KEY,
  general: {
    brandName: "Vaseaux Lake Waterfront Cabins",
    shortBrandName: "Vaseaux Lake Cabins",
    descriptor: "Vaseaux Lake Rentals",
    primaryHeadline: "Our guests come for the lake — and stay for the memories.",
    supportingHeadline:
      "A classic Okanagan lake vacation — simple, affordable, nostalgic and made for families.",
    announcementEnabled: false,
    defaultSeo: {
      title: "Vaseaux Lake Rentals | Waterfront Cabins",
      description:
        "Family-friendly cabin-style accommodations on Vaseaux Lake in the South Okanagan. Inquire for availability and a quote.",
    },
  },
  contact: {
    email: "vaseauxlakecabins@gmail.com",
    phoneDisplay: "+1 250-870-4365",
    phoneLink: "tel:+12508704365",
    facebookUrl: "https://www.facebook.com/vaseauxlakewaterfrontcabins/",
    socialLinks: [],
    businessHours: "Inquiries welcome by email or phone.",
  },
  property: {
    sharedAmenities: SHARED_AMENITIES,
    packingNotes: PACKING_NOTE,
    landscapeDescriptors: [
      "Vaseaux Lake",
      "Eagle's Bluff",
      "McIntyre Bluff",
      "Ponderosa pines and willow shade",
    ],
    generalSafetyNotes:
      "Lake conditions, wildlife sightings, and equipment availability vary by season and are never guaranteed.",
  },
  booking: {
    inquiryConfirmationCopy:
      "Thank you for your inquiry. We will review your requested dates and reply with availability and a quote.",
    responseTimeWording: "We aim to respond within one to two business days.",
    availabilityDisclaimer:
      "Online availability hints are advisory only. Your stay is not confirmed until we reply directly.",
  },
  footer: {
    shortDescription:
      "Eight private cabin-style accommodations under one historic roof on the shores of Vaseaux Lake.",
    ctaText: "Check availability",
    ctaUrl: "/inquire",
    copyrightText: "© Vaseaux Lake Waterfront Cabins. All rights reserved.",
    legalLinks: [
      { label: "Policies", url: "/policies" },
      { label: "Privacy", url: "/privacy" },
      { label: "Terms", url: "/terms" },
    ],
  },
  motion: {
    introEnabled: true,
    introOncePerSession: true,
    animationIntensity: "medium",
  },
  createdAt: new Date(0),
  updatedAt: new Date(0),
} as unknown as ISiteSettings;

export const FALLBACK_TESTIMONIALS = [
  {
    _id: "fallback-testimonial-1",
    guestName: "Sarah & Mark",
    location: "Kelowna, BC",
    quote:
      "Our family loved the lake mornings and quiet evenings on the patio. The kids spent hours on the raft while we grilled dinner — exactly the kind of simple summer we hoped for.",
    stayLabel: "Family summer stay",
    featured: true,
    isDemo: false,
    status: "published" as const,
    sortOrder: 0,
    isArchived: false,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    _id: "fallback-testimonial-2",
    guestName: "The Chen Family",
    location: "Vancouver, BC",
    quote:
      "The shallow lake and quiet evenings made for easy family time. Paddleboards, the lawn, and starry skies — we did not want to leave.",
    stayLabel: "Family lake holiday",
    featured: false,
    isDemo: false,
    status: "published" as const,
    sortOrder: 1,
    isArchived: false,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    _id: "fallback-testimonial-3",
    guestName: "Linda & Tom",
    location: "Edmonton, AB",
    quote:
      "Fire pit nights, calm mornings on the lake, and the kids on the swim platform — it felt like the Okanagan summers we grew up with. We are already talking about booking again.",
    stayLabel: "Multi-family reunion",
    featured: false,
    isDemo: false,
    status: "published" as const,
    sortOrder: 2,
    isArchived: false,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
];

export const FALLBACK_ATTRACTIONS = [
  {
    _id: "fallback-attraction-1",
    title: "On-property lake days",
    slug: "on-property-lake-days",
    category: "On-Property" as const,
    summary:
      "Fishing, swimming, boating, paddleboards, the floating raft, lawn gatherings, and stargazing — right at the property.",
    body: "Complimentary boats and paddleboards for guest use when available. Conditions vary by season.",
    images: [],
    travelTimeText: "Steps from your unit",
    season: "Summer peak; some activities vary in shoulder months",
    familyNotes: "Children must be supervised around water and equipment.",
    isVerified: true,
    featured: true,
    status: "published" as const,
    sortOrder: 0,
    isArchived: false,
    seo: {},
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    _id: "fallback-attraction-2",
    title: "Vaseaux Lake, Eagle's Bluff & McIntyre Bluff",
    slug: "vaseaux-lake-landscape",
    category: "Nature" as const,
    summary:
      "The property sits between Eagle's Bluff and McIntyre Bluff with Vaseaux Lake directly in front.",
    body: "Ponderosa pines and willow shade surround the shoreline. Wildlife sightings are possible but never guaranteed.",
    images: [],
    isVerified: true,
    featured: true,
    status: "published" as const,
    sortOrder: 1,
    isArchived: false,
    seo: {},
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    _id: "fallback-attraction-3",
    title: "South Okanagan day trips",
    slug: "south-okanagan-day-trips",
    category: "Day Trips" as const,
    summary: "Wineries, scenic drives, and family-friendly outings — ask us for current local suggestions.",
    body: "We are happy to share owner-reviewed ideas once your stay dates are confirmed.",
    images: [],
    travelTimeText: "Varies by destination",
    season: "Year-round — confirm details before you go",
    isVerified: false,
    featured: false,
    status: "published" as const,
    sortOrder: 2,
    isArchived: false,
    seo: {},
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    _id: "fallback-attraction-4",
    title: "Okanagan wine country",
    slug: "okanagan-wine-country",
    category: "Food & Wine" as const,
    summary: "Tasting rooms and farm-to-table stops across the South Okanagan — inquire for current favorites.",
    body: "Hours and availability change seasonally. We share verified suggestions rather than open-ended lists.",
    images: [],
    travelTimeText: "Owner to confirm drive time",
    season: "Spring through fall peak",
    isVerified: false,
    featured: false,
    status: "published" as const,
    sortOrder: 3,
    isArchived: false,
    seo: {},
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
];

export const FALLBACK_FAQS = [
  {
    _id: "fallback-faq-1",
    question: "How do I book a stay?",
    answer:
      "Submit a booking inquiry with your dates, guest count, and preferred cabin. Your stay is not confirmed until we reply and agree on details.",
    category: "Booking" as const,
    status: "published" as const,
    sortOrder: 0,
    isArchived: false,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    _id: "fallback-faq-2",
    question: "Are rates published on the website?",
    answer:
      "No. Rates vary by guest count, stay length, selected cabin, and dates. Contact us for availability and a personalized quote.",
    category: "Rates & Seasons" as const,
    status: "published" as const,
    sortOrder: 0,
    isArchived: false,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
  {
    _id: "fallback-faq-3",
    question: "What should I bring?",
    answer:
      "Guests bring their own bedding, towels, and toiletries. Kitchen basics, dishes, cookware, and propane for the BBQ are provided.",
    category: "Packing" as const,
    status: "published" as const,
    sortOrder: 0,
    isArchived: false,
    createdAt: new Date(0),
    updatedAt: new Date(0),
  },
];

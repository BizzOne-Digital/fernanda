import { img } from "@/lib/seed/helpers";
import { SITE_SETTINGS_KEY } from "@/models/SiteSettings";

export { SITE_SETTINGS_KEY };

export const siteSettingsSeed = {
  singletonKey: SITE_SETTINGS_KEY,
  general: {
    brandName: "Vaseaux Lake Waterfront Cabins",
    shortBrandName: "Vaseaux Lake Cabins",
    descriptor: "Vaseaux Lake Rentals",
    logo: img("lakeHero", "Vaseaux Lake Cabins"),
    primaryHeadline: "Bring your family vacation memories to life.",
    supportingHeadline:
      "Waterfront cabin-style stays on Vaseaux Lake — fishing, family days, and reunions in the heart of the South Okanagan.",
    announcementEnabled: false,
    defaultSeo: {
      title: "Vaseaux Lake Rentals | Waterfront Cabins",
      description:
        "Waterfront cabin-style accommodations on Vaseaux Lake near Oliver, BC. Fishing, family vacations, and reunions in wine country. Inquire for availability.",
    },
  },
  contact: {
    email: "vaseauxlakecabins@gmail.com",
    phoneDisplay: "+1 250-870-4365",
    phoneLink: "tel:+12508704365",
    facebookUrl: "https://www.facebook.com/vaseauxlakewaterfrontcabins/",
    socialLinks: [],
    address: "",
    businessHours: "Inquiries answered year-round; seasonal on-site hours vary.",
  },
  property: {
    sharedAmenities: [
      "Private washroom with hot shower, sink, and toilet in every unit",
      "Fully stocked kitchen with fridge/freezer, stove/oven, small appliances, dishes, pots, and pans",
      "Patio with picnic table",
      "Propane BBQ",
      "Complimentary boats and paddleboards for guest use",
      "Floating raft, lawn, and shallow lake access",
      "Evening gatherings and star-filled skies",
    ],
    packingNotes:
      "Guests bring their own bedding, towels, and toiletries. Kitchen basics and propane are provided.",
    landscapeDescriptors: [
      "Vaseaux Lake",
      "Eagle's Bluff",
      "McIntyre Bluff",
      "Ponderosa pines and willow shade",
      "Possible bighorn sheep and bird sightings",
    ],
    generalSafetyNotes:
      "Lake activities and wildlife sightings vary by season and conditions. Children must be supervised around water and equipment.",
  },
  booking: {
    inquiryConfirmationCopy:
      "Thank you for your inquiry. Your request has been recorded and is not a confirmed reservation until we reply.",
    responseTimeWording: "We aim to respond to inquiries as soon as possible during our active season.",
    defaultCapacityRules:
      "Each cabin has a maximum guest capacity. Please include all adults and children in your inquiry.",
    availabilityDisclaimer:
      "Availability shown on the website is advisory only. Dates are not held until confirmed by the property.",
  },
  footer: {
    shortDescription:
      "Eight private cabin-style accommodations on the shores of Vaseaux Lake, near Oliver BC — fishing, family lake days, and reunions in wine country.",
    ctaText: "Check availability",
    ctaUrl: "/inquire",
    copyrightText: `© ${new Date().getFullYear()} Vaseaux Lake Waterfront Cabins`,
    legalLinks: [
      { label: "Policies", url: "/policies" },
      { label: "Privacy", url: "/privacy" },
      { label: "Terms", url: "/terms" },
    ],
  },
  motion: {
    introEnabled: false,
    introOncePerSession: true,
    animationIntensity: "medium" as const,
  },
};

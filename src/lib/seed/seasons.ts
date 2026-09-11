const SEED_YEAR = new Date().getFullYear();

export const seasonSeeds = [
  {
    name: "High Season",
    year: SEED_YEAR,
    startDate: new Date(SEED_YEAR, 6, 1),
    endDate: new Date(SEED_YEAR, 8, 7),
    weeklyAvailabilityText:
      "Weekly rentals from Canada Day week through Labour Day week. Contact us for availability and a personalized quote.",
    minimumStayText: "Weekly stays are typical during high season. Minimum stay requirements may vary by cabin and dates.",
    variabilityNote:
      "Rates vary by guest count, stay length, selected cabin, and dates. We do not publish fixed prices online.",
    publicInquiryNote:
      "Submit an inquiry with your dates and party size. Your stay is not confirmed until we reply and agree on details.",
    adminQuoteGuidance:
      "Quote based on cabin, occupancy, week alignment, and any last-minute adjustments. Do not expose quote logic publicly.",
    lastMinuteOfferText: "Ask about last-minute openings — availability changes when cancellations occur.",
    lastMinuteActive: true,
    lastMinuteCabinIds: [],
    isActive: true,
    isPublished: true,
    sortOrder: 0,
    isArchived: false,
  },
  {
    name: "Shoulder Season — Spring",
    year: SEED_YEAR,
    startDate: new Date(SEED_YEAR, 4, 1),
    endDate: new Date(SEED_YEAR, 5, 30),
    weeklyAvailabilityText:
      "May and early June may offer shorter stays and different minimum-night rules than high season.",
    minimumStayText:
      "Minimum stays are flexible compared to peak summer — confirm requirements when you inquire.",
    variabilityNote:
      "Shoulder-season rates differ from high season and depend on dates, duration, and cabin selection.",
    publicInquiryNote: "Contact us for shoulder-season availability and a quote. No fixed prices are published.",
    adminQuoteGuidance: "Consider shorter stays and quieter-period pricing. Update dates annually.",
    lastMinuteOfferText: "",
    lastMinuteActive: false,
    lastMinuteCabinIds: [],
    isActive: true,
    isPublished: true,
    sortOrder: 1,
    isArchived: false,
  },
  {
    name: "Shoulder Season — Fall",
    year: SEED_YEAR,
    startDate: new Date(SEED_YEAR, 8, 8),
    endDate: new Date(SEED_YEAR, 8, 30),
    weeklyAvailabilityText:
      "September may offer off-season rates and shorter stays after Labour Day week.",
    minimumStayText: "Shorter stays may be available — inquire for current rules.",
    variabilityNote: "Fall pricing and availability vary by year. Guests should inquire for a quote.",
    publicInquiryNote: "September inquiries welcome — we will reply with options for your dates.",
    adminQuoteGuidance: "Labour Day week boundary shifts yearly — verify calendar before quoting.",
    lastMinuteOfferText: "",
    lastMinuteActive: false,
    lastMinuteCabinIds: [],
    isActive: true,
    isPublished: true,
    sortOrder: 2,
    isArchived: false,
  },
];

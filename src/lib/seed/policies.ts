export interface PolicyCategorySeed {
  key: string;
  title: string;
  body: string;
  isPlaceholder: boolean;
}

export const policyCategories: PolicyCategorySeed[] = [
  {
    key: "booking",
    title: "Booking",
    body: "[PLACEHOLDER — OWNER REVIEW REQUIRED] Booking terms, deposits, and confirmation process to be supplied by the property owner before launch.",
    isPlaceholder: true,
  },
  {
    key: "cancellation",
    title: "Cancellation",
    body: "[PLACEHOLDER — OWNER REVIEW REQUIRED] Cancellation and refund policy to be confirmed by the owner. Do not publish until reviewed.",
    isPlaceholder: true,
  },
  {
    key: "arrival-departure",
    title: "Arrival & Departure",
    body: "[PLACEHOLDER — OWNER REVIEW REQUIRED] Check-in and check-out times to be supplied by the owner.",
    isPlaceholder: true,
  },
  {
    key: "guests",
    title: "Guests & Occupancy",
    body: "[PLACEHOLDER — OWNER REVIEW REQUIRED] Maximum occupancy rules follow each cabin's published capacity. Additional guest policies require owner input.",
    isPlaceholder: true,
  },
  {
    key: "bedding-towels",
    title: "Bedding, Towels & Toiletries",
    body: "Confirmed: guests bring their own bedding, towels, and toiletries. Kitchen basics, dishes, cookware, and propane for the BBQ are provided in each unit.",
    isPlaceholder: false,
  },
  {
    key: "lake-equipment",
    title: "Lake & Equipment",
    body: "[PLACEHOLDER — OWNER REVIEW REQUIRED] Rules for boats, paddleboards, the floating raft, and lake use to be confirmed. Equipment availability varies by season. Children must be supervised.",
    isPlaceholder: true,
  },
  {
    key: "children-supervision",
    title: "Children & Supervision",
    body: "[PLACEHOLDER — OWNER REVIEW REQUIRED] Children must be supervised around water, boats, BBQs, and shared outdoor areas. Owner to supply full supervision policy.",
    isPlaceholder: true,
  },
  {
    key: "quiet-hours",
    title: "Quiet Hours",
    body: "[PLACEHOLDER — OWNER REVIEW REQUIRED] Quiet hours and noise expectations to be supplied by the owner.",
    isPlaceholder: true,
  },
  {
    key: "pets",
    title: "Pets",
    body: "[PLACEHOLDER — OWNER REVIEW REQUIRED] Pet policy to be supplied if applicable. Not confirmed at seed time.",
    isPlaceholder: true,
  },
  {
    key: "smoking",
    title: "Smoking",
    body: "[PLACEHOLDER — OWNER REVIEW REQUIRED] Smoking policy to be confirmed by the owner before launch.",
    isPlaceholder: true,
  },
  {
    key: "property-care",
    title: "Property Care",
    body: "[PLACEHOLDER — OWNER REVIEW REQUIRED] Guest responsibilities for the cabin, patio, BBQ, and shared spaces to be supplied by the owner.",
    isPlaceholder: true,
  },
];

export function policyListItems(): string[] {
  return policyCategories.map((policy) => {
    const marker = policy.isPlaceholder ? " [Review required]" : "";
    return `${policy.title}${marker}`;
  });
}

export function policySectionsBody(): string {
  return policyCategories
    .map((policy) => `## ${policy.title}\n\n${policy.body}`)
    .join("\n\n");
}

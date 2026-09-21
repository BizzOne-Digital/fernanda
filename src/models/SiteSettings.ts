import mongoose, { type Document, type Model, Schema } from "mongoose";

import { imageRefSchema, seoSchema, type IImageRef, type ISeoFields } from "@/models/shared/schemas";

export const SITE_SETTINGS_KEY = "site" as const;

export interface ISiteGeneralSettings {
  brandName: string;
  shortBrandName: string;
  descriptor?: string;
  logo?: IImageRef;
  wordmark?: IImageRef;
  primaryHeadline?: string;
  supportingHeadline?: string;
  announcementEnabled: boolean;
  announcementText?: string;
  announcementLink?: string;
  defaultSeo: ISeoFields;
}

export interface ISiteContactSettings {
  email: string;
  phoneDisplay: string;
  phoneLink: string;
  facebookUrl?: string;
  socialLinks: { label: string; url: string }[];
  address?: string;
  mapEmbedUrl?: string;
  businessHours?: string;
}

export interface ISitePropertySettings {
  sharedAmenities: string[];
  packingNotes?: string;
  landscapeDescriptors?: string[];
  generalSafetyNotes?: string;
}

export interface ISiteBookingSettings {
  inquiryConfirmationCopy?: string;
  responseTimeWording?: string;
  defaultCapacityRules?: string;
  availabilityDisclaimer?: string;
}

export interface ISiteFooterSettings {
  shortDescription?: string;
  ctaText?: string;
  ctaUrl?: string;
  copyrightText?: string;
  legalLinks: { label: string; url: string }[];
}

export interface ISiteMotionSettings {
  introEnabled: boolean;
  introOncePerSession: boolean;
  animationIntensity: "low" | "medium" | "high";
}

export interface ISiteSettings extends Document {
  singletonKey: typeof SITE_SETTINGS_KEY;
  general: ISiteGeneralSettings;
  contact: ISiteContactSettings;
  property: ISitePropertySettings;
  booking: ISiteBookingSettings;
  footer: ISiteFooterSettings;
  motion: ISiteMotionSettings;
  createdAt: Date;
  updatedAt: Date;
}

const socialLinkSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const legalLinkSchema = new Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const generalSettingsSchema = new Schema<ISiteGeneralSettings>(
  {
    brandName: {
      type: String,
      default: "Vaseaux Lake Waterfront Cabins",
      trim: true,
    },
    shortBrandName: {
      type: String,
      default: "Vaseaux Lake Cabins",
      trim: true,
    },
    descriptor: { type: String, trim: true },
    logo: imageRefSchema,
    wordmark: imageRefSchema,
    primaryHeadline: {
      type: String,
      default: "Our guests come for the lake — and stay for the memories.",
      trim: true,
    },
    supportingHeadline: {
      type: String,
      default:
        "A classic Okanagan lake vacation — simple, affordable, nostalgic and made for families.",
      trim: true,
    },
    announcementEnabled: { type: Boolean, default: false },
    announcementText: { type: String, trim: true },
    announcementLink: { type: String, trim: true },
    defaultSeo: { type: seoSchema, default: () => ({}) },
  },
  { _id: false },
);

const contactSettingsSchema = new Schema<ISiteContactSettings>(
  {
    email: {
      type: String,
      default: "vaseauxlakecabins@gmail.com",
      trim: true,
      lowercase: true,
    },
    phoneDisplay: { type: String, default: "+1 250-870-4365", trim: true },
    phoneLink: { type: String, default: "tel:+12508704365", trim: true },
    facebookUrl: {
      type: String,
      default: "https://www.facebook.com/share/1CDyErC1J1/?mibextid=wwXIfr",
      trim: true,
    },
    socialLinks: { type: [socialLinkSchema], default: [] },
    address: { type: String, trim: true },
    mapEmbedUrl: { type: String, trim: true },
    businessHours: { type: String, trim: true },
  },
  { _id: false },
);

const propertySettingsSchema = new Schema<ISitePropertySettings>(
  {
    sharedAmenities: [{ type: String, trim: true }],
    packingNotes: { type: String, trim: true },
    landscapeDescriptors: [{ type: String, trim: true }],
    generalSafetyNotes: { type: String, trim: true },
  },
  { _id: false },
);

const bookingSettingsSchema = new Schema<ISiteBookingSettings>(
  {
    inquiryConfirmationCopy: { type: String, trim: true },
    responseTimeWording: { type: String, trim: true },
    defaultCapacityRules: { type: String, trim: true },
    availabilityDisclaimer: { type: String, trim: true },
  },
  { _id: false },
);

const footerSettingsSchema = new Schema<ISiteFooterSettings>(
  {
    shortDescription: { type: String, trim: true },
    ctaText: { type: String, trim: true },
    ctaUrl: { type: String, trim: true },
    copyrightText: { type: String, trim: true },
    legalLinks: { type: [legalLinkSchema], default: [] },
  },
  { _id: false },
);

const motionSettingsSchema = new Schema<ISiteMotionSettings>(
  {
    introEnabled: { type: Boolean, default: true },
    introOncePerSession: { type: Boolean, default: true },
    animationIntensity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { _id: false },
);

const siteSettingsSchema = new Schema<ISiteSettings>(
  {
    singletonKey: {
      type: String,
      required: true,
      unique: true,
      default: SITE_SETTINGS_KEY,
      immutable: true,
    },
    general: { type: generalSettingsSchema, default: () => ({}) },
    contact: { type: contactSettingsSchema, default: () => ({}) },
    property: { type: propertySettingsSchema, default: () => ({}) },
    booking: { type: bookingSettingsSchema, default: () => ({}) },
    footer: { type: footerSettingsSchema, default: () => ({}) },
    motion: { type: motionSettingsSchema, default: () => ({}) },
  },
  { timestamps: true },
);

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ??
  mongoose.model<ISiteSettings>("SiteSettings", siteSettingsSchema);

export async function getSiteSettings(): Promise<ISiteSettings> {
  const existing = await SiteSettings.findOne({ singletonKey: SITE_SETTINGS_KEY });
  if (existing) {
    return existing;
  }

  return SiteSettings.create({ singletonKey: SITE_SETTINGS_KEY });
}

export default SiteSettings;

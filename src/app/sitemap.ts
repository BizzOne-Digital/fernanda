import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getCabins } from "@/lib/data/cabins";
import { getServices } from "@/lib/data/services";

const STATIC_ROUTES = [
  "",
  "/about",
  "/cabins",
  "/services",
  "/rates-and-seasons",
  "/gallery",
  "/testimonials",
  "/faqs",
  "/things-to-do",
  "/contact",
  "/inquire",
  "/policies",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.siteUrl.replace(/\/$/, "");
  const [cabins, services] = await Promise.all([getCabins(), getServices()]);

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
  }));

  const cabinEntries = cabins.map((cabin) => ({
    url: `${base}/cabins/${cabin.slug}`,
    lastModified: new Date(cabin.updatedAt),
  }));

  const serviceEntries = services.map((service) => ({
    url: `${base}/services/${service.slug}`,
    lastModified: new Date(service.updatedAt),
  }));

  return [...staticEntries, ...cabinEntries, ...serviceEntries];
}

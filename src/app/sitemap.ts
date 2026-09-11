import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getCabins } from "@/lib/data/cabins";
import { getServices } from "@/lib/data/services";
import { getBlogPosts } from "@/lib/data/blog";

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
  "/blog",
  "/policies",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.siteUrl.replace(/\/$/, "");
  const [cabins, services, posts] = await Promise.all([
    getCabins(),
    getServices(),
    getBlogPosts(),
  ]);

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

  const blogEntries = posts.map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
  }));

  return [...staticEntries, ...cabinEntries, ...serviceEntries, ...blogEntries];
}

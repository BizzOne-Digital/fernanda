import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Service, { type IService } from "@/models/Service";
import { createDataFetcher } from "@/lib/data/cache";
import { CACHE_TAGS } from "@/lib/revalidation";
import { toPlain, type PlainModel } from "@/lib/data/utils";

export type ServiceData = PlainModel<IService>;

async function fetchPublishedServices(): Promise<ServiceData[]> {
  try {
    await connectDB();
    const services = await Service.find({
      status: "published",
      isArchived: false,
    })
      .sort({ sortOrder: 1 })
      .lean();
    return toPlain(services) as ServiceData[];
  } catch {
    return [];
  }
}

async function fetchServiceBySlug(slug: string): Promise<ServiceData | null> {
  try {
    await connectDB();
    const service = await Service.findOne({
      slug,
      status: "published",
      isArchived: false,
    }).lean();
    return service ? (toPlain(service) as ServiceData) : null;
  } catch {
    return null;
  }
}

export const getServices = createDataFetcher(
  "services-v2",
  [CACHE_TAGS.services],
  fetchPublishedServices,
);

export async function getServiceBySlug(slug: string) {
  if (process.env.NODE_ENV === "development") {
    return fetchServiceBySlug(slug);
  }
  return unstable_cache(
    () => fetchServiceBySlug(slug),
    [`service-${slug}`],
    { tags: [CACHE_TAGS.services, `service-${slug}`], revalidate: 300 },
  )();
}

export async function getServiceSlugs(): Promise<string[]> {
  const services = await getServices();
  return services.map((service) => service.slug);
}

import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Service, { type IService } from "@/models/Service";
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

export const getServices = unstable_cache(fetchPublishedServices, ["services"], {
  tags: ["services"],
  revalidate: 300,
});

export async function getServiceBySlug(slug: string) {
  return unstable_cache(
    () => fetchServiceBySlug(slug),
    [`service-${slug}`],
    { tags: ["services", `service-${slug}`], revalidate: 300 },
  )();
}

export async function getServiceSlugs(): Promise<string[]> {
  const services = await getServices();
  return services.map((service) => service.slug);
}

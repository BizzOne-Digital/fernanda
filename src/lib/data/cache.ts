import { unstable_cache } from "next/cache";

export function createDataFetcher<T>(
  key: string,
  tags: string[],
  fetcher: () => Promise<T>,
): () => Promise<T> {
  const cached = unstable_cache(fetcher, [key], {
    tags,
    revalidate: 300,
  });

  return () => {
    if (process.env.NODE_ENV === "development") {
      return fetcher();
    }
    return cached();
  };
}

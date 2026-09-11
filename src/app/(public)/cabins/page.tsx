import type { Metadata } from "next";
import { CabinsPageClient } from "./cabins-client";
import { getCabins } from "@/lib/data/cabins";
import { getFaqs } from "@/lib/data/faqs";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Cabins",
  description:
    "Compare Cabins 5–12 at Vaseaux Lake Waterfront Cabins. Private units within one historic building.",
};

export default async function CabinsPage() {
  const [cabins, settings, faqs] = await Promise.all([
    getCabins(),
    getSiteSettings(),
    getFaqs(),
  ]);

  return <CabinsPageClient cabins={cabins} settings={settings} faqs={faqs} />;
}

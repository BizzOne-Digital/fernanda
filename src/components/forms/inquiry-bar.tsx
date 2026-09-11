"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CabinData } from "@/lib/data/cabins";
import { Button } from "@/components/ui/button";

type InquiryBarProps = {
  cabins?: CabinData[];
};

export function InquiryBar({ cabins = [] }: InquiryBarProps) {
  const router = useRouter();
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState("2");
  const [cabin, setCabin] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (arrival) params.set("arrival", arrival);
    if (departure) params.set("departure", departure);
    if (guests) params.set("guests", guests);
    if (cabin) params.set("cabin", cabin);
    router.push(`/inquire?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="postcard-border mx-auto grid w-full min-w-0 max-w-5xl gap-3 rounded-sm border border-golden/30 bg-white/95 p-4 shadow-[0_12px_40px_rgb(240_180_41_/_12%)] backdrop-blur-md md:grid-cols-[1fr_1fr_0.7fr_1fr_auto]"
    >
      <label className="text-xs uppercase tracking-[0.15em] text-ink/60">
        Arrival
        <input
          type="date"
          value={arrival}
          onChange={(event) => setArrival(event.target.value)}
          className="mt-1 w-full rounded border border-sand/70 bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="text-xs uppercase tracking-[0.15em] text-ink/60">
        Departure
        <input
          type="date"
          value={departure}
          onChange={(event) => setDeparture(event.target.value)}
          className="mt-1 w-full rounded border border-sand/70 bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="text-xs uppercase tracking-[0.15em] text-ink/60">
        Guests
        <input
          type="number"
          min={1}
          max={20}
          value={guests}
          onChange={(event) => setGuests(event.target.value)}
          className="mt-1 w-full rounded border border-sand/70 bg-white px-3 py-2 text-sm"
        />
      </label>
      <label className="text-xs uppercase tracking-[0.15em] text-ink/60">
        Cabin (optional)
        <select
          value={cabin}
          onChange={(event) => setCabin(event.target.value)}
          className="mt-1 w-full rounded border border-sand/70 bg-white px-3 py-2 text-sm"
        >
          <option value="">Any unit</option>
          {cabins.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-end">
        <Button type="submit" variant="golden" className="w-full">
          Check availability
        </Button>
      </div>
      <p className="col-span-full text-xs text-ink/60">
        This bar routes to our inquiry form. Availability is not confirmed until we reply.
      </p>
    </form>
  );
}

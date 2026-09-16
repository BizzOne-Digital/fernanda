"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CabinData } from "@/lib/data/cabins";

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
      className="grid w-full min-w-0 gap-3 border border-sand/90 bg-white p-4 md:grid-cols-[1fr_1fr_0.7fr_1fr_auto] md:p-5"
    >
      <p className="col-span-full text-center font-serif text-lg text-resort-navy md:text-xl">
        Check availability for your dates
      </p>
      <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/55">
        Arrival
        <input
          type="date"
          value={arrival}
          onChange={(event) => setArrival(event.target.value)}
          className="mt-1 w-full border border-sand bg-cream px-3 py-2 text-sm"
        />
      </label>
      <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/55">
        Departure
        <input
          type="date"
          value={departure}
          onChange={(event) => setDeparture(event.target.value)}
          className="mt-1 w-full border border-sand bg-cream px-3 py-2 text-sm"
        />
      </label>
      <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/55">
        Guests
        <input
          type="number"
          min={1}
          max={20}
          value={guests}
          onChange={(event) => setGuests(event.target.value)}
          className="mt-1 w-full border border-sand bg-cream px-3 py-2 text-sm"
        />
      </label>
      <label className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink/55">
        Cabin (optional)
        <select
          value={cabin}
          onChange={(event) => setCabin(event.target.value)}
          className="mt-1 w-full border border-sand bg-cream px-3 py-2 text-sm"
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
        <button type="submit" className="resort-btn-primary w-full">
          Continue
        </button>
      </div>
      <p className="col-span-full text-center text-xs text-ink/55">
        This sends you to our inquiry form. Availability is not confirmed until we reply.
      </p>
    </form>
  );
}

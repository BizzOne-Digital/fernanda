"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryFormValues } from "@/lib/validation/inquiry";
import type { CabinData } from "@/lib/data/cabins";
import type { ServiceData } from "@/lib/data/services";
import type { SiteSettingsData } from "@/lib/data/settings";
import { Button } from "@/components/ui/button";
import { toDateOnlyString } from "@/lib/validation/common";
import { toast } from "sonner";

const ACTIVITIES = [
  "Fishing",
  "Swimming",
  "Boating",
  "Kayaking / paddleboarding",
  "Wildlife watching",
  "Evening gatherings",
  "Stargazing",
];

type InquiryFormProps = {
  cabins: CabinData[];
  services: ServiceData[];
  settings: SiteSettingsData;
  initial?: Partial<{
    arrival: string;
    departure: string;
    guests: string;
    cabin: string;
    service: string;
  }>;
};

export function InquiryForm({ cabins, services, settings, initial }: InquiryFormProps) {
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [startedAt] = useState(() => Date.now());
  const defaultArrival = initial?.arrival ? new Date(`${initial.arrival}T00:00:00`) : undefined;
  const defaultDeparture = initial?.departure ? new Date(`${initial.departure}T00:00:00`) : undefined;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      arrivalDate: defaultArrival,
      departureDate: defaultDeparture,
      adults: Number(initial?.guests || 2),
      children: 0,
      preferredCabins: initial?.cabin ? [initial.cabin] : [],
      stayType: initial?.service || "",
      activities: [],
      dateFlexible: false,
      helpMeChoose: false,
      consent: undefined,
    },
  });

  const helpMeChoose = watch("helpMeChoose");

  const cabinOptions = useMemo(() => cabins, [cabins]);

  const onSubmit = async (values: InquiryFormValues) => {
    const response = await fetch("/api/inquire", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        arrivalDate: toDateOnlyString(new Date(values.arrivalDate)),
        departureDate: toDateOnlyString(new Date(values.departureDate)),
        formStartedAt: startedAt,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error("Unable to submit inquiry. Please check your details.");
      return;
    }
    setConfirmation(data.inquiryNumber);
    toast.success("Inquiry recorded.");
  };

  if (confirmation) {
    return (
      <div className="rounded-sm border border-sand/70 bg-sand/20 p-6">
        <p className="font-serif text-2xl text-lake-deep">Inquiry received</p>
        <p className="mt-2 text-sm">
          Reference <strong>{confirmation}</strong>
        </p>
        <p className="mt-3 text-sm text-ink/80">
          {settings.booking.inquiryConfirmationCopy}
        </p>
        <p className="mt-2 text-sm text-ink/70">{settings.booking.availabilityDisclaimer}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          Arrival
          <input type="date" className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("arrivalDate")} />
          {errors.arrivalDate ? <span className="text-xs text-red-700">{String(errors.arrivalDate.message)}</span> : null}
        </label>
        <label className="text-sm">
          Departure
          <input type="date" className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("departureDate")} />
          {errors.departureDate ? <span className="text-xs text-red-700">{String(errors.departureDate.message)}</span> : null}
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" {...register("dateFlexible")} />
        My dates are flexible
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          Adults
          <input type="number" min={1} className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("adults")} />
        </label>
        <label className="text-sm">
          Children
          <input type="number" min={0} className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("children")} />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Preferred cabin(s)</legend>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("helpMeChoose")} />
          Help me choose the best unit
        </label>
        {!helpMeChoose ? (
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {cabinOptions.map((cabin) => (
              <label key={cabin.slug} className="flex items-center gap-2 text-sm">
                <input type="checkbox" value={cabin.slug} {...register("preferredCabins")} />
                {cabin.name} (sleeps {cabin.capacity})
              </label>
            ))}
          </div>
        ) : null}
      </fieldset>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          First name
          <input className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("firstName")} />
        </label>
        <label className="text-sm">
          Last name
          <input className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("lastName")} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          Email
          <input type="email" className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("email")} />
        </label>
        <label className="text-sm">
          Phone
          <input className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("phone")} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm">
          Province / state
          <input className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("homeRegion")} />
        </label>
        <label className="text-sm">
          Country
          <input className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("country")} />
        </label>
      </div>

      <label className="text-sm">
        Stay type / interest
        <select className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("stayType")}>
          <option value="">Select (optional)</option>
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.title}
            </option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="text-sm font-medium">Activities of interest</legend>
        <div className="mt-2 grid gap-2 md:grid-cols-2">
          {ACTIVITIES.map((activity) => (
            <label key={activity} className="flex items-center gap-2 text-sm">
              <input type="checkbox" value={activity} {...register("activities")} />
              {activity}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="text-sm">
        Special requests
        <textarea rows={3} className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("specialRequests")} />
      </label>
      <label className="text-sm">
        Message
        <textarea rows={4} className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("message")} />
      </label>
      <label className="text-sm">
        How did you hear about us?
        <input className="mt-1 w-full rounded border border-sand/70 px-3 py-2" {...register("heardAbout")} />
      </label>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" className="mt-1" {...register("consent")} />
        <span>
          I understand this is an inquiry only and my stay is not confirmed until Vaseaux Lake replies
          with availability and a quote.
        </span>
      </label>

      <p className="text-xs text-ink/60">{settings.booking.availabilityDisclaimer}</p>

      <Button type="submit" variant="golden" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit inquiry"}
      </Button>
    </form>
  );
}

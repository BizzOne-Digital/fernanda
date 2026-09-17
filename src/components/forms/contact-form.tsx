"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormInput } from "@/lib/validation/contact";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { consent: undefined },
  });

  const onSubmit = async (values: ContactFormInput) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, formStartedAt: startedAt }),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error("Unable to send message. Please try again.");
      return;
    }
    setSubmitted(true);
    toast.success(data.message || "Message recorded.");
    reset();
  };

  if (submitted) {
    return (
      <div className="rounded-sm border border-sand/70 bg-sand/20 p-6">
        <p className="font-serif text-2xl text-lake-deep">Message received</p>
        <p className="mt-2 text-sm text-ink/80">
          Thank you — your message has been recorded. We will respond as soon as we can.
        </p>
        <Button className="mt-4" variant="secondary" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-ink/80">
          First name
          <input
            className="mt-1.5 w-full rounded-sm border border-sand/80 bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-lake-medium focus:ring-2 focus:ring-lake-medium/20"
            {...register("firstName")}
          />
          {errors.firstName ? <span className="text-xs text-red-700">{errors.firstName.message}</span> : null}
        </label>
        <label className="block text-sm font-medium text-ink/80">
          Last name
          <input
            className="mt-1.5 w-full rounded-sm border border-sand/80 bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-lake-medium focus:ring-2 focus:ring-lake-medium/20"
            {...register("lastName")}
          />
          {errors.lastName ? <span className="text-xs text-red-700">{errors.lastName.message}</span> : null}
        </label>
      </div>
      <label className="block text-sm font-medium text-ink/80">
        Email
        <input
          type="email"
          className="mt-1.5 w-full rounded-sm border border-sand/80 bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-lake-medium focus:ring-2 focus:ring-lake-medium/20"
          {...register("email")}
        />
        {errors.email ? <span className="text-xs text-red-700">{errors.email.message}</span> : null}
      </label>
      <label className="block text-sm font-medium text-ink/80">
        Phone (optional)
        <input
          className="mt-1.5 w-full rounded-sm border border-sand/80 bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-lake-medium focus:ring-2 focus:ring-lake-medium/20"
          {...register("phone")}
        />
      </label>
      <label className="block text-sm font-medium text-ink/80">
        Subject
        <input
          className="mt-1.5 w-full rounded-sm border border-sand/80 bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-lake-medium focus:ring-2 focus:ring-lake-medium/20"
          {...register("subject")}
        />
        {errors.subject ? <span className="text-xs text-red-700">{errors.subject.message}</span> : null}
      </label>
      <label className="block text-sm font-medium text-ink/80">
        Message
        <textarea
          rows={5}
          className="mt-1.5 w-full rounded-sm border border-sand/80 bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-lake-medium focus:ring-2 focus:ring-lake-medium/20"
          {...register("message")}
        />
        {errors.message ? <span className="text-xs text-red-700">{errors.message.message}</span> : null}
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" className="mt-1" {...register("consent")} />
        <span>I consent to being contacted about my inquiry.</span>
      </label>
      {errors.consent ? <span className="text-xs text-red-700">{errors.consent.message}</span> : null}
      <Button type="submit" variant="golden" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

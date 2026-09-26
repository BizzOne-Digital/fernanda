"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { guestMemoryFormSchema, type GuestMemoryFormInput } from "@/lib/validation/guest-memory";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function GuestMemoryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<GuestMemoryFormInput>({
    resolver: zodResolver(guestMemoryFormSchema),
    defaultValues: { consent: undefined, photoUrl: "", photoAlt: "" },
  });

  const onPhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const response = await fetch("/api/guest-memories/photo", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || "Could not upload photo");
        return;
      }
      setPhotoUrl(data.url);
      setValue("photoUrl", data.url, { shouldDirty: true });
      setValue(
        "photoAlt",
        file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "),
        { shouldDirty: true },
      );
      toast.success("Photo attached");
    } catch {
      toast.error("Could not upload photo");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: GuestMemoryFormInput) => {
    const response = await fetch("/api/guest-memories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, formStartedAt: startedAt }),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error || "Unable to send memory. Please try again.");
      return;
    }
    setSubmitted(true);
    toast.success(data.message || "Memory received.");
    reset();
    setPhotoUrl(null);
  };

  if (submitted) {
    return (
      <div className="rounded-sm border border-sand/70 bg-sand/20 p-6">
        <p className="font-serif text-2xl text-lake-deep">Thank you for sharing</p>
        <p className="mt-2 text-sm text-ink/80">
          We review guest memories before they appear on the gallery. We may reach out if we have questions.
        </p>
        <Button className="mt-4" variant="secondary" onClick={() => setSubmitted(false)}>
          Share another memory
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />
      <input type="hidden" {...register("photoUrl")} />
      <input type="hidden" {...register("photoAlt")} />

      <label className="block text-sm font-medium text-ink/80">
        Your name (as you would like it shown)
        <input
          className="mt-1.5 w-full rounded-sm border border-sand/80 bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-lake-medium focus:ring-2 focus:ring-lake-medium/20"
          {...register("guestName")}
        />
        {errors.guestName ? <span className="text-xs text-red-700">{errors.guestName.message}</span> : null}
      </label>

      <label className="block text-sm font-medium text-ink/80">
        Email (optional — only if we need to follow up)
        <input
          type="email"
          className="mt-1.5 w-full rounded-sm border border-sand/80 bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-lake-medium focus:ring-2 focus:ring-lake-medium/20"
          {...register("email")}
        />
        {errors.email ? <span className="text-xs text-red-700">{errors.email.message}</span> : null}
      </label>

      <label className="block text-sm font-medium text-ink/80">
        Your memory
        <textarea
          rows={6}
          className="mt-1.5 w-full rounded-sm border border-sand/80 bg-white px-3 py-2.5 text-ink shadow-sm outline-none transition focus:border-lake-medium focus:ring-2 focus:ring-lake-medium/20"
          placeholder="Tell us about a favourite lake day, a family tradition, wildlife you spotted, or a fishing story…"
          {...register("story")}
        />
        {errors.story ? <span className="text-xs text-red-700">{errors.story.message}</span> : null}
      </label>

      <div>
        <p className="text-sm font-medium text-ink/80">Photo (optional)</p>
        <p className="mt-1 text-xs text-ink/60">JPEG, PNG, WebP, or GIF — up to 8MB.</p>
        <label className="mt-2 inline-flex cursor-pointer items-center rounded-sm border border-sand/80 bg-white px-4 py-2 text-sm text-resort-navy hover:bg-sand/20">
          {uploading ? "Uploading…" : photoUrl ? "Replace photo" : "Add a photo"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            disabled={uploading || isSubmitting}
            onChange={onPhotoChange}
          />
        </label>
        {photoUrl ? <p className="mt-2 text-xs text-lake-medium">Photo attached</p> : null}
      </div>

      <label className="flex items-start gap-2 text-sm text-ink/80">
        <input type="checkbox" className="mt-1" {...register("consent")} />
        <span>
          I agree that Vaseaux Lake Waterfront Cabins may review and display this memory on the website, and
          that I have permission to share any photo I upload.
        </span>
      </label>
      {errors.consent ? <span className="text-xs text-red-700">{errors.consent.message}</span> : null}

      <Button type="submit" variant="golden" disabled={isSubmitting || uploading}>
        {isSubmitting ? "Sending…" : "Submit memory"}
      </Button>
    </form>
  );
}

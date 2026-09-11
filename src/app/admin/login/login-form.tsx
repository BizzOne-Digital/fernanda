"use client";

import { Button } from "@/components/ui/button";
import { AdminInput, FormField } from "@/components/admin/form-field";
import { cn } from "@/lib/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitting(true);
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Welcome back");
      router.push(callbackUrl);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  });

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-lake-medium">Admin portal</p>
          <h1 className="mt-2 font-serif text-3xl text-lake-deep">Vaseaux Lake Rentals</h1>
          <p className="mt-2 text-sm text-ink/60">Sign in to manage content, inquiries, and availability.</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-sand/60 bg-white/80 p-6 shadow-sm"
        >
          <div className="space-y-4">
            <FormField label="Email" required error={errors.email?.message}>
              <AdminInput
                type="email"
                autoComplete="email"
                error={Boolean(errors.email)}
                {...register("email")}
              />
            </FormField>
            <FormField label="Password" required error={errors.password?.message}>
              <AdminInput
                type="password"
                autoComplete="current-password"
                error={Boolean(errors.password)}
                {...register("password")}
              />
            </FormField>
          </div>
          <Button type="submit" className={cn("mt-6 w-full")} disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}

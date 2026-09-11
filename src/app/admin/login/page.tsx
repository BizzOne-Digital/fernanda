import { Suspense } from "react";
import { AdminLoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-pulse rounded-full bg-sand/50" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}

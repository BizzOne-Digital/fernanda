import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-lake-medium">404</p>
      <h1 className="mt-3 font-serif text-4xl text-lake-deep">This page drifted off the lake</h1>
      <p className="mt-3 text-ink/75">
        The page you requested may have moved or is not yet published.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button href="/">Return home</Button>
        <Link href="/cabins" className="rounded-full border border-sand px-5 py-2.5 text-sm">
          View cabins
        </Link>
      </div>
    </section>
  );
}

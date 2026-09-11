"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { UploadFolder } from "@/lib/uploads/public-url";

export class AdminApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

export async function adminFetch<T = unknown>(url: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  if (init?.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, { ...init, headers });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new AdminApiError(
      (payload as { error?: string }).error ?? `Request failed (${response.status})`,
      response.status,
    );
  }

  return payload as T;
}

export function useAdminFetch<T>(url: string | null, options?: { enabled?: boolean }) {
  const enabled = options?.enabled ?? true;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(Boolean(url && enabled));
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!url || !enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await adminFetch<T>(url);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [url, enabled]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { data, loading, error, reload, setData };
}

export function useAdminMutation() {
  const [saving, setSaving] = useState(false);

  const mutate = useCallback(
    async <T>(
      url: string,
      init?: RequestInit,
      options?: { successMessage?: string; silent?: boolean },
    ) => {
      setSaving(true);
      try {
        const result = await adminFetch<T>(url, init);
        if (options?.successMessage && !options.silent) {
          toast.success(options.successMessage);
        }
        return result;
      } catch (err) {
        if (!options?.silent) {
          toast.error(err instanceof Error ? err.message : "Request failed");
        }
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [],
  );

  return { mutate, saving };
}

export type UploadResult = {
  success: boolean;
  url: string;
  filename: string;
  size: number;
  folder: UploadFolder;
};

export async function adminUploadToFolder(
  file: File,
  folder: UploadFolder,
): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  form.append("folder", folder);
  return adminFetch<UploadResult>("/api/upload", { method: "POST", body: form });
}

export async function deleteStoredUpload(url?: string | null) {
  if (!url || !url.startsWith("/api/uploads/")) return;
  try {
    await adminFetch("/api/upload", {
      method: "DELETE",
      body: JSON.stringify({ url }),
    });
  } catch {
    // Non-blocking cleanup
  }
}

/** @deprecated Use adminUploadToFolder for serverless-safe MongoDB storage */
export async function adminUpload(
  file: File,
  meta?: Record<string, string>,
): Promise<{ asset: Record<string, unknown> }> {
  const folder: UploadFolder =
    meta?.category === "gallery" || meta?.galleryCategoryId ? "gallery" : "misc";
  const result = await adminUploadToFolder(file, folder);
  return {
    asset: {
      _id: result.filename,
      publicUrl: result.url,
      alt: "",
      originalFilename: file.name,
    },
  };
}

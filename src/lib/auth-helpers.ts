import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { session };
}

export async function getAdminEmail() {
  const session = await auth();
  return session?.user?.email ?? "system";
}

"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { updatePassThreshold } from "@/lib/settings";

export async function updateSettings(formData: FormData) {
  await requireAdmin();

  const raw = formData.get("passThreshold");
  const value = typeof raw === "string" ? Number(raw) : NaN;
  await updatePassThreshold(value);

  revalidatePath("/admin/settings");
}

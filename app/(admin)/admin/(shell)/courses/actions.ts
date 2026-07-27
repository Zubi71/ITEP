"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

function parseCourseForm(formData: FormData) {
  const title = formData.get("title");
  const description = formData.get("description");
  const thumbnailUrl = formData.get("thumbnailUrl");
  const priceDollars = formData.get("priceDollars");
  const category = formData.get("category");
  const badge = formData.get("badge");
  const durationHours = formData.get("durationHours");
  const rating = formData.get("rating");
  const studentsCount = formData.get("studentsCount");

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    !description.trim() ||
    typeof thumbnailUrl !== "string" ||
    !thumbnailUrl.trim() ||
    typeof priceDollars !== "string" ||
    typeof durationHours !== "string"
  ) {
    throw new Error("Missing required fields.");
  }

  const priceCents = Math.round(Number(priceDollars) * 100);
  if (!Number.isFinite(priceCents) || priceCents < 0) {
    throw new Error("Price must be a valid non-negative number.");
  }

  return {
    title,
    description,
    thumbnailUrl,
    priceCents,
    category: typeof category === "string" && category.trim() ? category : null,
    badge: typeof badge === "string" && badge.trim() ? badge : null,
    durationHours: Math.max(0, Number(durationHours) || 0),
    rating: typeof rating === "string" && rating ? Math.max(0, Math.min(5, Number(rating))) : 0,
    studentsCount: typeof studentsCount === "string" && studentsCount ? Math.max(0, Number(studentsCount)) : 0,
  };
}

export async function createCourse(formData: FormData) {
  await requireAdmin();
  const data = parseCourseForm(formData);

  const maxOrder = await prisma.course.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  await prisma.course.create({ data: { ...data, order } });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

export async function updateCourse(courseId: string, formData: FormData) {
  await requireAdmin();
  const data = parseCourseForm(formData);

  await prisma.course.update({ where: { id: courseId }, data });

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  redirect("/admin/courses");
}

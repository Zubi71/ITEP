"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import type { Role, UserStatus } from "@/app/generated/prisma/client";

export async function updateUserRole(targetUserId: string, role: Role) {
  const session = await requireAdmin();
  if (targetUserId === session.user.id) {
    throw new Error("You cannot change your own role.");
  }
  await prisma.user.update({ where: { id: targetUserId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function updateUserStatus(targetUserId: string, status: UserStatus) {
  const session = await requireAdmin();
  if (targetUserId === session.user.id) {
    throw new Error("You cannot change your own status.");
  }
  await prisma.user.update({ where: { id: targetUserId }, data: { status } });
  revalidatePath("/admin/users");
}

export async function createUser(formData: FormData) {
  await requireAdmin();

  const name = formData.get("name");
  const email = formData.get("email");
  const role = formData.get("role");

  if (typeof name !== "string" || typeof email !== "string" || typeof role !== "string" || !name || !email) {
    throw new Error("Missing required fields.");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("A user with that email already exists.");
  }

  // Admin-created accounts get a random temporary password (never shared via
  // this UI) and start PENDING — an admin must flip status to ACTIVE before
  // this account can log in at all; a real invite/reset-password flow is out
  // of scope this milestone.
  const tempPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  const passwordHash = await bcrypt.hash(tempPassword, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      role: role as Role,
      status: "PENDING",
    },
  });

  revalidatePath("/admin/users");
}

export async function deleteUser(targetUserId: string) {
  const session = await requireAdmin();
  if (targetUserId === session.user.id) {
    throw new Error("You cannot delete your own account.");
  }
  // Cascades per schema: their exam attempts, answers, certificates, and
  // purchases go with them. Questions they edited / answers they graded are
  // kept, just detached (lastEditedBy/gradedBy become null).
  await prisma.user.delete({ where: { id: targetUserId } });
  revalidatePath("/admin/users");
}

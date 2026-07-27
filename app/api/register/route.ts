import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(200),
  role: z.enum(["STUDENT", "TEACHER"]).default("STUDENT"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const { name, email, password, role } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const studentId = role === "STUDENT" ? String(Math.floor(10000 + Math.random() * 90000)) : null;

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
      studentId,
      role,
      // Teacher self-signups need admin approval before they can log in;
      // students get instant access, matching the existing product flow.
      status: role === "TEACHER" ? "PENDING" : "ACTIVE",
    },
  });

  return NextResponse.json({ ok: true, pendingApproval: role === "TEACHER" });
}

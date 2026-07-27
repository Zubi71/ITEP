"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/staff-auth";
import type { QuestionType } from "@/app/generated/prisma/client";

const CHOICE_LABELS = ["A", "B", "C", "D"];

// Shared by both the Admin and Teacher consoles — both roles can author
// questions, so every list page that renders needs revalidating.
function revalidateQuestionBankLists() {
  revalidatePath("/admin/question-bank");
  revalidatePath("/teacher/question-bank");
}

export async function createQuestion(formData: FormData) {
  const session = await requireStaff();

  const sectionId = formData.get("sectionId");
  const prompt = formData.get("prompt");
  const hint = formData.get("hint");
  const type = formData.get("type");

  if (
    typeof sectionId !== "string" ||
    !sectionId ||
    typeof prompt !== "string" ||
    !prompt.trim() ||
    typeof type !== "string"
  ) {
    throw new Error("Missing required fields.");
  }

  const maxOrder = await prisma.question.aggregate({
    where: { sectionId },
    _max: { order: true },
  });
  const order = (maxOrder._max.order ?? -1) + 1;

  const choiceTexts = CHOICE_LABELS.map((_, i) => formData.get(`choiceText${i}`)).filter(
    (t): t is string => typeof t === "string" && t.trim().length > 0
  );
  const correctIndex = formData.get("correctIndex");

  if (type === "MULTIPLE_CHOICE" && choiceTexts.length < 2) {
    throw new Error("Multiple-choice questions need at least 2 answer choices.");
  }

  await prisma.question.create({
    data: {
      sectionId,
      prompt,
      hint: typeof hint === "string" && hint.trim() ? hint : null,
      order,
      type: type as QuestionType,
      lastEditedById: session.user.id,
      choices:
        type === "MULTIPLE_CHOICE"
          ? {
              create: choiceTexts.map((text, i) => ({
                label: CHOICE_LABELS[i],
                text,
                isCorrect: String(correctIndex) === String(i),
              })),
            }
          : undefined,
    },
  });

  revalidateQuestionBankLists();
}

export async function updateQuestion(questionId: string, redirectTo: string, formData: FormData) {
  const session = await requireStaff();

  const prompt = formData.get("prompt");
  const hint = formData.get("hint");
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("Prompt is required.");
  }

  const question = await prisma.question.findUniqueOrThrow({
    where: { id: questionId },
    include: { choices: { orderBy: { label: "asc" } } },
  });

  await prisma.question.update({
    where: { id: questionId },
    data: {
      prompt,
      hint: typeof hint === "string" && hint.trim() ? hint : null,
      lastEditedById: session.user.id,
    },
  });

  if (question.type === "MULTIPLE_CHOICE") {
    const correctIndex = formData.get("correctIndex");
    for (let i = 0; i < question.choices.length; i++) {
      const text = formData.get(`choiceText${i}`);
      if (typeof text === "string" && text.trim()) {
        await prisma.choice.update({
          where: { id: question.choices[i].id },
          data: { text, isCorrect: String(correctIndex) === String(i) },
        });
      }
    }
  }

  revalidateQuestionBankLists();
  redirect(redirectTo);
}

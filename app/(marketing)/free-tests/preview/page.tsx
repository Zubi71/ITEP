import { prisma } from "@/lib/prisma";
import { PreviewTestClient } from "./PreviewTestClient";

async function pickQuestions(skill: "GRAMMAR" | "LISTENING" | "READING", n: number) {
  return prisma.question.findMany({
    where: { type: "MULTIPLE_CHOICE", section: { skill } },
    include: { choices: { orderBy: { label: "asc" } }, section: true },
    orderBy: { order: "asc" },
    take: n,
  });
}

export default async function PreviewTestPage() {
  const [grammar, listening, reading] = await Promise.all([
    pickQuestions("GRAMMAR", 2),
    pickQuestions("LISTENING", 2),
    pickQuestions("READING", 2),
  ]);

  const questions = [...grammar, ...listening, ...reading].map((q) => ({
    prompt: q.prompt,
    passage: q.section.passage ?? undefined,
    choices: q.choices.map((c) => c.text),
    correct: q.choices.findIndex((c) => c.isCorrect),
  }));

  return <PreviewTestClient questions={questions} />;
}

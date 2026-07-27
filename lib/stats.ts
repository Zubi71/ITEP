import { prisma } from "@/lib/prisma";

const PASS_THRESHOLD = 70;

export async function getDashboardStats(userId: string) {
  const submitted = await prisma.attempt.findMany({
    where: { userId, status: "SUBMITTED" },
    include: { exam: true },
    orderBy: { submittedAt: "asc" },
  });

  const scores = submitted.map((a) => a.scorePct ?? 0);
  const avgScore = scores.length > 0 ? scores.reduce((sum, s) => sum + s, 0) / scores.length : 0;

  const totalMinutesStudied = submitted.reduce((sum, a) => sum + a.exam.durationMin, 0);

  const recent = [...submitted]
    .sort((a, b) => (b.submittedAt?.getTime() ?? 0) - (a.submittedAt?.getTime() ?? 0))
    .slice(0, 5)
    .map((a) => ({
      id: a.id,
      examTitle: a.exam.title,
      date: a.submittedAt,
      scorePct: a.scorePct ?? 0,
      passed: (a.scorePct ?? 0) >= PASS_THRESHOLD,
    }));

  const trend = submitted.map((a) => ({
    date: a.submittedAt,
    scorePct: a.scorePct ?? 0,
  }));

  return {
    examsCompleted: submitted.length,
    avgScore,
    hoursStudied: totalMinutesStudied / 60,
    recent,
    trend,
  };
}

export async function getSkillBreakdown(attemptId: string) {
  const answers = await prisma.answer.findMany({
    where: { attemptId },
    include: {
      question: {
        include: { section: true },
      },
    },
  });

  // Per-question contribution generalizes to any question type: MCQ
  // contributes 100/0 for correct/incorrect (identical to the old
  // correct-count-based math), subjective questions contribute their graded
  // percentage directly (0 if somehow still ungraded when this runs).
  const bySkill = new Map<string, { sum: number; total: number }>();
  for (const answer of answers) {
    const skill = answer.question.section.skill;
    const entry = bySkill.get(skill) ?? { sum: 0, total: 0 };
    const contribution =
      answer.question.type === "MULTIPLE_CHOICE" ? (answer.isCorrect ? 100 : 0) : (answer.subjectiveScorePct ?? 0);
    entry.sum += contribution;
    entry.total += 1;
    bySkill.set(skill, entry);
  }

  return Array.from(bySkill.entries()).map(([skill, { sum, total }]) => ({
    skill,
    scorePct: total > 0 ? sum / total : 0,
  }));
}

export { PASS_THRESHOLD };

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AddQuestionForm } from "@/components/admin/AddQuestionForm";

const TYPE_BADGE: Record<string, string> = {
  MULTIPLE_CHOICE: "bg-primary/10 text-primary",
  WRITING: "bg-secondary/10 text-secondary",
  SPEAKING: "bg-secondary/10 text-secondary",
};

const TYPE_LABEL: Record<string, string> = {
  MULTIPLE_CHOICE: "Multiple Choice",
  WRITING: "Writing",
  SPEAKING: "Speaking",
};

export default async function TeacherQuestionBankPage({
  searchParams,
}: {
  searchParams: Promise<{ examId?: string }>;
}) {
  const { examId } = await searchParams;

  const [exams, sections, questions, totalQuestions, subjectiveCount] = await Promise.all([
    prisma.exam.findMany({ orderBy: { title: "asc" } }),
    prisma.section.findMany({
      include: { exam: true },
      orderBy: [{ exam: { title: "asc" } }, { order: "asc" }],
    }),
    prisma.question.findMany({
      where: examId ? { section: { examId } } : undefined,
      include: { section: { include: { exam: true } }, lastEditedBy: true },
      orderBy: [{ section: { exam: { title: "asc" } } }, { section: { order: "asc" } }, { order: "asc" }],
    }),
    prisma.question.count(),
    prisma.question.count({ where: { type: { not: "MULTIPLE_CHOICE" } } }),
  ]);

  const sectionOptions = sections.map((s) => ({ id: s.id, label: `${s.exam.title} — ${s.title}` }));

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Question Bank</h1>
          <p className="text-body-md text-on-surface-variant">
            Author and edit exam questions. Deleting a question is disabled — it would corrupt historical
            results and certificates that reference it.
          </p>
        </div>
      </div>

      <AddQuestionForm sections={sectionOptions} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Total Questions</p>
          <p className="text-3xl font-bold text-primary mt-xs">{totalQuestions}</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Multiple Choice</p>
          <p className="text-3xl font-bold text-primary mt-xs">{totalQuestions - subjectiveCount}</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Writing / Speaking</p>
          <p className="text-3xl font-bold text-primary mt-xs">{subjectiveCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <form method="GET" className="p-md border-b border-outline-variant/30 flex flex-wrap items-center gap-sm">
          <select
            name="examId"
            defaultValue={examId ?? ""}
            className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
          >
            <option value="">All Exams</option>
            {exams.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
          <button type="submit" className="px-4 py-2 bg-surface-container-high rounded-lg font-label-md text-label-md font-bold">
            Filter
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Exam / Section</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Type</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Prompt</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Last Modified</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {questions.map((q) => (
                <tr key={q.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary">{q.section.exam.title}</div>
                    <div className="text-body-sm text-on-surface-variant">{q.section.title}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${TYPE_BADGE[q.type]}`}>
                      {TYPE_LABEL[q.type]}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-body-sm max-w-[24rem] truncate">{q.prompt}</td>
                  <td className="px-4 py-4 font-body-sm text-on-surface-variant">
                    {q.updatedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    {q.lastEditedBy && (
                      <div className="text-[11px] text-outline">by {q.lastEditedBy.name ?? q.lastEditedBy.email}</div>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/teacher/question-bank/${q.id}`}
                      className="px-3 py-1.5 rounded-lg border border-primary text-primary font-label-sm text-label-sm font-bold hover:bg-surface-container transition-colors"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {questions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    No questions match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

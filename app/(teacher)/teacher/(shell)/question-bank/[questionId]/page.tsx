import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateQuestion } from "@/app/(admin)/admin/(shell)/question-bank/actions";

const TYPE_LABEL: Record<string, string> = {
  MULTIPLE_CHOICE: "Multiple Choice",
  WRITING: "Writing",
  SPEAKING: "Speaking",
};

export default async function TeacherEditQuestionPage({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) {
  const { questionId } = await params;

  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: { section: { include: { exam: true } }, choices: { orderBy: { label: "asc" } } },
  });

  if (!question) {
    notFound();
  }

  const boundUpdate = updateQuestion.bind(null, question.id, "/teacher/question-bank");
  const correctIndex = question.choices.findIndex((c) => c.isCorrect);

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-3xl mx-auto w-full">
      <div>
        <Link href="/teacher/question-bank" className="font-label-sm text-label-sm text-primary hover:underline">
          ← Back to Question Bank
        </Link>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold mt-xs">Edit Question</h1>
        <p className="text-body-md text-on-surface-variant">
          {question.section.exam.title} — {question.section.title} •{" "}
          <span className="font-bold">{TYPE_LABEL[question.type]}</span>
        </p>
      </div>

      <form action={boundUpdate} className="bg-white rounded-xl border border-outline-variant/30 shadow-sm p-lg flex flex-col gap-md">
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Prompt</label>
          <textarea
            name="prompt"
            defaultValue={question.prompt}
            required
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
          />
        </div>

        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
            Hint (optional)
          </label>
          <input
            name="hint"
            defaultValue={question.hint ?? ""}
            className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
          />
        </div>

        {question.type === "MULTIPLE_CHOICE" && (
          <div className="space-y-xs">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              Answer choices — mark the correct one
            </p>
            {question.choices.map((choice, i) => (
              <div key={choice.id} className="flex items-center gap-sm">
                <input
                  type="radio"
                  name="correctIndex"
                  value={i}
                  defaultChecked={i === correctIndex}
                  required
                  className="w-4 h-4"
                />
                <span className="font-label-sm text-label-sm font-bold w-4">{choice.label}</span>
                <input
                  name={`choiceText${i}`}
                  defaultValue={choice.text}
                  required
                  className="flex-1 px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
                />
              </div>
            ))}
          </div>
        )}

        {question.type !== "MULTIPLE_CHOICE" && (
          <p className="font-body-sm text-body-sm text-on-surface-variant italic">
            {question.type === "SPEAKING"
              ? "Speaking questions are answered as typed text (no audio recording in this exam)."
              : "Students answer with free-text; a teacher or admin grades the response in the Evaluation Queue."}
          </p>
        )}

        <div className="flex items-center gap-sm pt-sm">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all"
          >
            Save Changes
          </button>
          <Link
            href="/teacher/question-bank"
            className="px-6 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-label-md text-label-md"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

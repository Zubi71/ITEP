"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { gradeAnswer } from "@/app/(admin)/admin/evaluations/[attemptId]/actions";

export function GradeAnswerForm({
  attemptId,
  answerId,
  initialScore,
}: {
  attemptId: string;
  answerId: string;
  initialScore: number | null;
}) {
  const [score, setScore] = useState<string>(initialScore != null ? String(initialScore) : "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
          try {
            await gradeAnswer(attemptId, answerId, Number(score));
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong.");
          }
        });
      }}
      className="flex items-center gap-sm flex-wrap"
    >
      <input
        type="number"
        min={0}
        max={100}
        step={1}
        value={score}
        onChange={(e) => setScore(e.target.value)}
        required
        className="w-24 px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
      />
      <span className="font-label-md text-label-md text-on-surface-variant">%</span>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all disabled:opacity-60"
      >
        {isPending ? "Saving…" : initialScore != null ? "Update Score" : "Submit Score"}
      </button>
      {error && <p className="text-error font-body-sm w-full">{error}</p>}
    </form>
  );
}

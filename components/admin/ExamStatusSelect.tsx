"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateExamStatus } from "@/app/(admin)/admin/(shell)/exams/actions";

const STATUSES = ["DRAFT", "LIVE", "ARCHIVED"] as const;

export function ExamStatusSelect({ examId, status }: { examId: string; status: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <select
      defaultValue={status}
      disabled={isPending}
      onChange={(e) => {
        const value = e.target.value as (typeof STATUSES)[number];
        startTransition(async () => {
          await updateExamStatus(examId, value).catch(() => {});
          router.refresh();
        });
      }}
      className="px-2 py-1 rounded-md border border-outline-variant/40 bg-surface-container-low text-label-sm disabled:opacity-50"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.charAt(0) + s.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}

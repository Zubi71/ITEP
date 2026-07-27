"use client";

import { useState } from "react";
import { startExam } from "@/app/(app)/exams/actions";

type ExamCard = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  durationMin: number;
  difficulty: string;
  inProgressAttemptId: string | null;
};

const CATEGORY_ICON: Record<string, string> = {
  GRAMMAR: "translate",
  LISTENING: "headphones",
  READING: "menu_book",
  WRITING: "edit_note",
  SPEAKING: "record_voice_over",
};

const CATEGORIES = ["GRAMMAR", "LISTENING", "READING", "WRITING", "SPEAKING"] as const;

export function ExamGrid({ exams }: { exams: ExamCard[] }) {
  const [filter, setFilter] = useState<string | null>(null);

  const visible = filter ? exams.filter((e) => e.category === filter) : exams;

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-wrap gap-sm">
        <button
          onClick={() => setFilter(null)}
          className={`flex items-center gap-xs px-md py-2 rounded-full font-label-md text-label-md transition-colors ${
            filter === null
              ? "bg-primary text-on-primary"
              : "bg-surface-container-high text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed"
          }`}
        >
          All Categories
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`flex items-center gap-xs px-md py-2 rounded-full font-label-md text-label-md transition-colors ${
              filter === cat
                ? "bg-primary text-on-primary"
                : "bg-surface-container-high text-on-surface-variant hover:bg-primary-fixed hover:text-on-primary-fixed"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{CATEGORY_ICON[cat]}</span>
            {cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {visible.map((exam) => (
          <div
            key={exam.id}
            className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant flex flex-col hover:shadow-md transition-shadow relative"
          >
            {exam.inProgressAttemptId && (
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-warning/20 text-warning whitespace-nowrap px-3 py-1 rounded-full font-label-sm text-label-sm font-bold uppercase tracking-wider">
                  In Progress
                </span>
              </div>
            )}
            <div className="mb-lg">
              <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center text-white mb-md">
                <span className="material-symbols-outlined text-2xl">
                  {exam.category ? CATEGORY_ICON[exam.category] : "school"}
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-1">{exam.title}</h3>
              {exam.description && (
                <p className="font-body-sm text-body-sm text-on-surface-variant">{exam.description}</p>
              )}
            </div>
            <div className="mt-auto">
              <div className="flex items-center gap-lg mb-md">
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">timer</span>
                  <span className="font-label-md text-label-md text-on-surface">{exam.durationMin} mins</span>
                </div>
                <div className="flex items-center gap-xs">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">bar_chart</span>
                  <span className="font-label-md text-label-md text-on-surface">{exam.difficulty}</span>
                </div>
              </div>
              <form action={startExam}>
                <input type="hidden" name="examId" value={exam.id} />
                <button
                  type="submit"
                  className={`w-full rounded-lg py-3 font-label-md text-label-md font-bold transition-colors flex items-center justify-center gap-sm ${
                    exam.inProgressAttemptId
                      ? "bg-secondary text-on-primary hover:bg-primary"
                      : "bg-primary text-on-primary hover:opacity-90"
                  }`}
                >
                  {exam.inProgressAttemptId ? "Continue Exam" : "Start Exam"}
                  {exam.inProgressAttemptId && (
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="text-on-surface-variant font-body-md py-md col-span-full">
            No exams in this category yet.
          </p>
        )}
      </div>
    </div>
  );
}

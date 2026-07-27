"use client";

import { useCallback, useState } from "react";
import { ExamTimer } from "@/components/exam/ExamTimer";
import { QuestionGrid } from "@/components/exam/QuestionGrid";
import { saveAnswer, saveTextAnswer, setCurrentIndex, submitAttempt, toggleFlag } from "@/app/exam/[attemptId]/actions";

export type QuestionVM = {
  id: string;
  prompt: string;
  hint: string | null;
  passage: string | null;
  sectionTitle: string;
  type: "MULTIPLE_CHOICE" | "WRITING" | "SPEAKING";
  choices: { id: string; label: string; text: string }[];
  selectedChoiceId: string | null;
  responseText: string | null;
  flagged: boolean;
};

export function ExamRunner({
  attemptId,
  examTitle,
  questions,
  initialIndex,
  initialRemainingSec,
}: {
  attemptId: string;
  examTitle: string;
  questions: QuestionVM[];
  initialIndex: number;
  initialRemainingSec: number;
}) {
  const [currentIndex, setIndex] = useState(() =>
    Math.min(Math.max(initialIndex, 0), Math.max(questions.length - 1, 0))
  );
  const [answers, setAnswers] = useState<Record<string, string | null>>(() =>
    Object.fromEntries(questions.map((q) => [q.id, q.selectedChoiceId]))
  );
  const [textAnswers, setTextAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(questions.map((q) => [q.id, q.responseText ?? ""]))
  );
  const [flags, setFlags] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(questions.map((q) => [q.id, q.flagged]))
  );
  const [submitting, setSubmitting] = useState(false);

  const current = questions[currentIndex];

  const flushTextAnswer = useCallback(() => {
    if (current.type !== "MULTIPLE_CHOICE") {
      saveTextAnswer(attemptId, current.id, textAnswers[current.id] ?? "").catch(() => {});
    }
  }, [attemptId, current, textAnswers]);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= questions.length) return;
      flushTextAnswer();
      setIndex(index);
      // Fired immediately (not deferred via startTransition) to keep the
      // save-vs-reload race window as tight as possible.
      setCurrentIndex(attemptId, index).catch(() => {});
    },
    [attemptId, questions.length, flushTextAnswer]
  );

  function handleSelectChoice(choiceId: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: choiceId }));
    saveAnswer(attemptId, current.id, choiceId).catch(() => {});
  }

  function handleTextChange(value: string) {
    setTextAnswers((prev) => ({ ...prev, [current.id]: value }));
  }

  function handleToggleFlag() {
    setFlags((prev) => ({ ...prev, [current.id]: !prev[current.id] }));
    toggleFlag(attemptId, current.id).catch(() => {});
  }

  const handleSubmit = useCallback(() => {
    if (submitting) return;
    flushTextAnswer();
    setSubmitting(true);
    submitAttempt(attemptId).catch(() => setSubmitting(false));
  }, [attemptId, submitting, flushTextAnswer]);

  const gridItems = questions.map((q) => ({
    answered:
      q.type === "MULTIPLE_CHOICE" ? answers[q.id] != null : (textAnswers[q.id] ?? "").trim().length > 0,
    flagged: flags[q.id] ?? false,
  }));

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-surface text-on-surface font-body-md">
      <header className="flex-none flex justify-between items-center px-md h-16 bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-md">
          <h1 className="font-headline-md text-headline-md font-bold text-secondary">{examTitle}</h1>
          <div className="h-6 w-[1px] bg-outline-variant mx-sm" />
          <p className="font-label-md text-label-md text-on-surface-variant font-medium">
            {current.sectionTitle}
          </p>
        </div>
        <div className="flex items-center gap-lg">
          <ExamTimer initialRemainingSec={initialRemainingSec} onExpire={handleSubmit} />
          <div className="flex items-center gap-md">
            <button
              onClick={handleToggleFlag}
              className={`material-symbols-outlined transition-opacity hover:opacity-80 ${
                flags[current.id] ? "text-secondary" : "text-on-surface-variant"
              }`}
            >
              flag
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-lg hover:opacity-90 active:scale-98 transition-all disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Finish Exam"}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <QuestionGrid items={gridItems} currentIndex={currentIndex} onJump={goTo} />

        <main className="flex-1 flex flex-col bg-background overflow-hidden">
          <div className="flex-1 flex overflow-hidden p-md gap-gutter">
            {current.passage && (
              <section className="flex-1 flex flex-col bg-surface shadow-sm rounded-xl border border-outline-variant overflow-hidden">
                <div className="p-md bg-surface-container-low border-b border-outline-variant">
                  <span className="font-label-md text-label-md font-bold text-primary uppercase tracking-wider">
                    Reading Passage
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-lg">
                  <article className="max-w-2xl mx-auto space-y-md text-on-surface leading-relaxed whitespace-pre-line">
                    {current.passage}
                  </article>
                </div>
              </section>
            )}

            <section className="flex-1 flex flex-col bg-surface shadow-sm rounded-xl border border-outline-variant overflow-hidden">
              <div className="p-md bg-surface-container-low border-b border-outline-variant">
                <span className="font-label-md text-label-md font-bold text-primary uppercase tracking-wider">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar p-lg">
                <div className="max-w-2xl mx-auto">
                  <p className="font-body-lg text-body-lg font-semibold text-primary mb-lg">{current.prompt}</p>
                  {current.type === "MULTIPLE_CHOICE" ? (
                    <div className="space-y-sm">
                      {current.choices.map((choice) => {
                        const selected = answers[current.id] === choice.id;
                        return (
                          <label
                            key={choice.id}
                            className={`group flex items-start gap-md p-md rounded-lg border cursor-pointer transition-all ${
                              selected
                                ? "border-primary bg-primary-fixed/30"
                                : "border-outline-variant hover:border-primary-fixed hover:bg-surface-container"
                            }`}
                          >
                            <input
                              type="radio"
                              name={current.id}
                              className="mt-1 w-5 h-5 text-primary border-outline-variant focus:ring-primary"
                              checked={selected}
                              onChange={() => handleSelectChoice(choice.id)}
                            />
                            <div>
                              <span className="font-label-md text-label-md font-bold text-primary block mb-xs">
                                {choice.label}
                              </span>
                              <span className="font-body-md text-body-md text-on-surface-variant">{choice.text}</span>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div>
                      {current.type === "SPEAKING" && (
                        <p className="font-body-sm text-body-sm text-outline italic mb-sm">
                          Speaking response — type what you would say (no audio recording in this exam).
                        </p>
                      )}
                      <textarea
                        key={current.id}
                        defaultValue={textAnswers[current.id] ?? ""}
                        onChange={(e) => handleTextChange(e.target.value)}
                        onBlur={flushTextAnswer}
                        rows={10}
                        placeholder="Type your response here…"
                        className="w-full rounded-lg border border-outline-variant p-md font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                      />
                    </div>
                  )}
                  {current.hint && (
                    <div className="mt-xl pt-lg border-t border-outline-variant">
                      <div className="flex items-center gap-sm text-outline mb-md">
                        <span className="material-symbols-outlined">lightbulb</span>
                        <p className="font-body-sm text-body-sm italic">{current.hint}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          <footer className="flex-none h-20 bg-surface border-t border-outline-variant flex items-center justify-between px-xl">
            <button
              onClick={() => goTo(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex items-center gap-sm px-6 py-2.5 rounded-lg border border-primary text-primary font-label-md text-label-md hover:bg-surface-container transition-colors active:scale-95 disabled:opacity-40"
            >
              <span className="material-symbols-outlined">chevron_left</span>
              Previous
            </button>
            <div className="flex items-center gap-lg">
              <button
                onClick={handleToggleFlag}
                className="flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined">bookmark</span>
                <span className="font-label-md text-label-md">
                  {flags[current.id] ? "Unflag" : "Flag for Review"}
                </span>
              </button>
              <div className="w-[1px] h-6 bg-outline-variant" />
              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-sm bg-primary text-on-primary px-10 py-2.5 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-95 shadow-lg disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Finish Exam"}
                </button>
              ) : (
                <button
                  onClick={() => goTo(currentIndex + 1)}
                  className="flex items-center gap-sm bg-primary text-on-primary px-10 py-2.5 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all active:scale-95 shadow-lg"
                >
                  Next
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              )}
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

export type QuizQuestion = {
  prompt: string;
  choices: string[];
  correct: number;
  passage?: string;
};

export function QuizFlow({
  questions,
  eyebrow,
  progressTone = "var(--ink-3)",
  renderResult,
}: {
  questions: QuizQuestion[];
  eyebrow: string;
  progressTone?: string;
  renderResult: (correctCount: number, total: number, restart: () => void) => React.ReactNode;
}) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  function restart() {
    setI(0);
    setAnswers({});
    setDone(false);
  }

  if (done) {
    const correct = questions.filter((q, k) => answers[k] === q.correct).length;
    return <>{renderResult(correct, questions.length, restart)}</>;
  }

  const q = questions[i];

  function choose(ci: number) {
    setAnswers((prev) => ({ ...prev, [i]: ci }));
    setTimeout(() => (i === questions.length - 1 ? setDone(true) : setI((v) => v + 1)), 180);
  }

  return (
    <div className="card card-pad">
      <div className="flex items-center justify-between mb-4">
        <div className="eyebrow">
          {eyebrow} · {i + 1} of {questions.length}
        </div>
      </div>
      <div className="bar mb-6">
        <i style={{ width: `${(i / questions.length) * 100}%`, background: progressTone }} />
      </div>

      {q.passage && (
        <div className="mb-4 p-4" style={{ background: "#f7f9fc", borderLeft: "3px solid var(--ink-3)", borderRadius: "0 5px 5px 0" }}>
          <div className="eyebrow mb-2">Reading passage</div>
          <p style={{ fontSize: 13.5, lineHeight: 1.75, color: "var(--text-2)" }}>{q.passage}</p>
        </div>
      )}

      <h2 style={{ fontSize: 18.5, lineHeight: 1.5 }}>{q.prompt}</h2>
      <div className="grid gap-2 mt-5">
        {q.choices.map((c, ci) => (
          <button key={ci} className="opt" data-on={answers[i] === ci ? 1 : 0} onClick={() => choose(ci)}>
            <span className="opt-key">{"ABCD"[ci]}</span>
            <span style={{ fontSize: 14.5, paddingTop: 1 }}>{c}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

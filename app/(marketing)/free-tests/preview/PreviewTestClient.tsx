"use client";

import Link from "next/link";
import { QuizFlow, type QuizQuestion } from "@/components/marketing/QuizFlow";
import { CefrLadder } from "@/components/shared/CefrLadder";
import { cefrBand } from "@/lib/cefr";

export function PreviewTestClient({ questions }: { questions: QuizQuestion[] }) {
  if (questions.length === 0) {
    return (
      <main className="p-6 lg:p-9 flex-1" style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
        <Link href="/free-tests" className="btn btn-quiet btn-sm mb-4">
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
            chevron_left
          </span>
          Back to free tests
        </Link>
        <div className="card card-pad">
          <p className="muted" style={{ fontSize: 14 }}>
            No sample questions are available right now — please check back shortly.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 lg:p-9 flex-1" style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
      <Link href="/free-tests" className="btn btn-quiet btn-sm mb-4">
        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
          chevron_left
        </span>
        Back to free tests
      </Link>

      <QuizFlow
        questions={questions}
        eyebrow="Preview test"
        progressTone="var(--ink-3)"
        renderResult={(right, total, restart) => {
          const pct = Math.round((right / total) * 100);
          const band = cefrBand(pct);
          return (
            <div className="card card-pad rise" style={{ borderTop: "3px solid var(--ink-3)" }}>
              <div className="flex items-center justify-between">
                <div className="eyebrow eyebrow-seal">Preview test</div>
                <span className="pill pill-draft">Unofficial · not certificated</span>
              </div>
              <h1 className="mt-3" style={{ fontSize: 25 }}>
                An unofficial read: {band.code}
              </h1>
              <p className="muted mt-2.5" style={{ fontSize: 14, lineHeight: 1.7 }}>
                {right} of {total} correct across grammar, listening and reading — real questions drawn
                from our exam bank. This is a single-version sample of the real structure; sit a full mock
                examination for a certificated score and a proper section breakdown.
              </p>
              <div className="mt-6">
                <CefrLadder scorePct={pct} />
              </div>
              <div className="flex flex-wrap gap-2 mt-7">
                <button className="btn btn-primary" onClick={restart}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                    refresh
                  </span>
                  Try again
                </button>
                <Link href="/free-tests" className="btn btn-line">
                  Back to free tests
                </Link>
              </div>
            </div>
          );
        }}
      />
    </main>
  );
}

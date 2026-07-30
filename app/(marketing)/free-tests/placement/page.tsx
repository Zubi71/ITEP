"use client";

import Link from "next/link";
import { QuizFlow, type QuizQuestion } from "@/components/marketing/QuizFlow";
import { CefrLadder } from "@/components/shared/CefrLadder";
import { cefrBand } from "@/lib/cefr";

const QUESTIONS: QuizQuestion[] = [
  { prompt: "She ___ to the office by bus every morning.", choices: ["go", "goes", "going", "gone"], correct: 1 },
  { prompt: "There isn't ___ milk left in the fridge.", choices: ["many", "a few", "much", "several"], correct: 2 },
  { prompt: "I've lived here ___ 2019.", choices: ["for", "since", "from", "during"], correct: 1 },
  { prompt: "If it rains tomorrow, we ___ the trip.", choices: ["cancel", "will cancel", "would cancel", "cancelled"], correct: 1 },
  { prompt: "The report, ___ was published last week, caused a stir.", choices: ["that", "what", "which", "who"], correct: 2 },
  { prompt: "She's used to ___ in front of large audiences.", choices: ["speak", "speaking", "spoke", "speaks"], correct: 1 },
  { prompt: "Not only ___ the deadline, he also improved the design.", choices: ["he met", "did he meet", "he did meet", "met he"], correct: 1 },
  { prompt: "The proposal was rejected on the ___ that it was too costly.", choices: ["grounds", "reasons", "bases", "causes"], correct: 0 },
  { prompt: "Had the funding been approved, the project ___ on time.", choices: ["will finish", "would finish", "would have finished", "finished"], correct: 2 },
  { prompt: "His argument, ___ elegant, rests on a false premise.", choices: ["however", "albeit", "whereas", "nonetheless"], correct: 1 },
];

export default function PlacementCheckPage() {
  return (
    <main className="p-6 lg:p-9 flex-1" style={{ maxWidth: 620, margin: "0 auto", width: "100%" }}>
      <Link href="/free-tests" className="btn btn-quiet btn-sm mb-4">
        <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
          chevron_left
        </span>
        Back to free tests
      </Link>

      <QuizFlow
        questions={QUESTIONS}
        eyebrow="Placement check"
        progressTone="var(--seal)"
        renderResult={(right, total, restart) => {
          const pct = Math.round((right / total) * 100);
          const band = cefrBand(pct);
          return (
            <div className="card card-pad rise" style={{ borderTop: "3px solid var(--seal)" }}>
              <div className="eyebrow eyebrow-seal">Placement check</div>
              <h1 className="mt-2" style={{ fontSize: 26 }}>
                You are working at {band.code}
              </h1>
              <p className="muted mt-2.5" style={{ fontSize: 14, lineHeight: 1.7 }}>
                {right} of {total} correct. This is a five-minute indication, not an examination result —
                sit a full mock examination for a certificated score.
              </p>
              <div className="mt-6">
                <CefrLadder scorePct={pct} />
              </div>
              <div className="flex flex-wrap gap-2 mt-7">
                <Link href="/study" className="btn btn-primary">
                  See {band.code} study materials
                </Link>
                <Link href="/login" className="btn btn-line">
                  Sit a full examination
                </Link>
                <button className="btn btn-quiet" onClick={restart}>
                  <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
                    refresh
                  </span>
                  Retake
                </button>
              </div>
            </div>
          );
        }}
      />
    </main>
  );
}

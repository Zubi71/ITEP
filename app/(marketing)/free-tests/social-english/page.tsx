"use client";

import Link from "next/link";
import { QuizFlow, type QuizQuestion } from "@/components/marketing/QuizFlow";

const QUESTIONS: QuizQuestion[] = [
  {
    prompt: "A friend texts: 'running 10 late, sry!!' What are they telling you?",
    choices: ["They are cancelling", "They will arrive ten minutes late", "They are ten minutes away by car", "They want to reschedule"],
    correct: 1,
  },
  {
    prompt: "You bump into a neighbour on the stairs. The most natural opener is:",
    choices: ["Greetings. How do you do.", "Oh, hey — how's it going?", "I request an update on your wellbeing.", "Salutations, neighbour."],
    correct: 1,
  },
  {
    prompt: "A cashier says 'Do you want that for here or to go?' They are asking about:",
    choices: ["Payment method", "Whether you're eating in or taking away", "Delivery address", "Portion size"],
    correct: 1,
  },
  {
    prompt: "Someone says 'I'm swamped this week.' They mean:",
    choices: ["They are travelling", "They are very busy", "They are unwell", "They are relaxed"],
    correct: 1,
  },
  {
    prompt: "Best reply to 'How's it going?' from a stranger making small talk:",
    choices: ["It is going by car.", "Can't complain, you?", "I decline to answer.", "Define 'going'."],
    correct: 1,
  },
  {
    prompt: "A friend cancels plans by saying 'Can I take a raincheck?' They want to:",
    choices: ["Borrow an umbrella", "Do it another time instead", "Check the weather first", "End the friendship"],
    correct: 1,
  },
];

export default function SocialEnglishPage() {
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
        eyebrow="Social English"
        progressTone="var(--ink-3)"
        renderResult={(right, total, restart) => {
          const pct = Math.round((right / total) * 100);
          const verdict =
            pct >= 84
              ? { t: "Comfortable in casual conversation", d: "Tone, idiom and informal shorthand landed without much trouble." }
              : pct >= 50
                ? { t: "Solid, with a few informal gaps", d: "The everyday basics are there; fast, casual phrasing is where marks slipped." }
                : { t: "Stronger on formal English than casual", d: "Worth spending time on informal register — texting shorthand, small talk, idiom." };
          return (
            <div className="card card-pad rise" style={{ borderTop: "3px solid var(--ink-3)" }}>
              <div className="flex items-center justify-between">
                <div className="eyebrow eyebrow-seal">Social English check</div>
                <span className="pill pill-draft">Unofficial</span>
              </div>
              <h1 className="mt-3" style={{ fontSize: 25 }}>
                {verdict.t}
              </h1>
              <p className="muted mt-2.5" style={{ fontSize: 14, lineHeight: 1.7 }}>
                {right} of {total} correct. {verdict.d}
              </p>
              <div className="mt-6 flex items-center gap-4">
                <div className="mono" style={{ fontSize: 40, fontWeight: 600 }}>
                  {pct}%
                </div>
                <div className="flex-1 bar">
                  <i style={{ width: `${pct}%`, background: "var(--ink-3)" }} />
                </div>
              </div>
              <p className="tiny muted mt-3" style={{ lineHeight: 1.65 }}>
                Private and yours to keep — this result is not saved to any account and sits apart from the
                CEFR band reported on a certificated examination.
              </p>
              <div className="flex flex-wrap gap-2 mt-6">
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

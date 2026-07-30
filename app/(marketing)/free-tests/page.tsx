import Link from "next/link";
import { NewsTicker } from "@/components/marketing/News";

const CHECKS = [
  "Tests are quick",
  "Instant unofficial results",
  "Results are private and yours to keep",
  "No writing or speaking reaches an examiner",
];

export default function FreeTestsPage() {
  return (
    <main className="p-6 lg:p-9 flex-1" style={{ maxWidth: 1180, margin: "0 auto", width: "100%" }}>
      <div className="mb-6">
        <div className="eyebrow eyebrow-seal">Practise your skills</div>
        <h1 className="mt-2" style={{ fontSize: 28 }}>
          Free tests
        </h1>
        <p className="muted mt-2" style={{ fontSize: 14, maxWidth: 620, lineHeight: 1.6 }}>
          Two quick, unofficial checks with instant results — nothing here is sent to an examiner or filed
          on a record. When you want a certificated score, sit a full official mock examination.
        </p>
      </div>

      <div className="mb-5">
        <NewsTicker />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
        {CHECKS.map((t) => (
          <div key={t} className="flex items-center gap-2 tiny muted">
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: "var(--pass)" }}>
              check
            </span>
            {t}
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-3.5">
        <Link href="/free-tests/social-english" className="ftile ftile-social rise">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            mic
          </span>
          <div className="mono mt-4" style={{ fontSize: 10, letterSpacing: ".14em", opacity: 0.7 }}>
            FREE &amp; UNOFFICIAL
          </div>
          <h3 className="mt-1.5" style={{ fontSize: 18, color: "#fff" }}>
            Social English check
          </h3>
          <p className="tiny mt-2" style={{ color: "rgba(255,255,255,.78)", lineHeight: 1.6 }}>
            Six quick scenarios that check how you handle everyday, conversational English — texts, small
            talk, ordering food.
          </p>
          <span className="flex items-center gap-1.5 mt-4 tiny" style={{ fontWeight: 700, color: "#fff" }}>
            Start · 2 min
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
              arrow_forward
            </span>
          </span>
        </Link>

        <Link href="/free-tests/preview" className="ftile ftile-preview rise">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            description
          </span>
          <div className="mono mt-4" style={{ fontSize: 10, letterSpacing: ".14em", opacity: 0.7 }}>
            FREE &amp; UNOFFICIAL
          </div>
          <h3 className="mt-1.5" style={{ fontSize: 18, color: "#fff" }}>
            Preview test
          </h3>
          <p className="tiny mt-2" style={{ color: "rgba(255,255,255,.78)", lineHeight: 1.6 }}>
            A single-version sample across grammar, listening and reading, so you know exactly what the
            real structure looks like.
          </p>
          <span className="flex items-center gap-1.5 mt-4 tiny" style={{ fontWeight: 700, color: "#fff" }}>
            Start · 6 min
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
              arrow_forward
            </span>
          </span>
        </Link>

        <Link href="/login" className="ftile ftile-official rise">
          <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
            workspace_premium
          </span>
          <div className="mono mt-4" style={{ fontSize: 10, letterSpacing: ".14em", opacity: 0.78 }}>
            CERTIFICATED
          </div>
          <h3 className="mt-1.5" style={{ fontSize: 18, color: "#fff" }}>
            Sit an official test
          </h3>
          <p className="tiny mt-2" style={{ color: "rgba(255,255,255,.88)", lineHeight: 1.6 }}>
            A full, timed mock examination with a CEFR band, human-graded writing and speaking, and a
            verifiable certificate.
          </p>
          <span className="flex items-center gap-1.5 mt-4 tiny" style={{ fontWeight: 700, color: "#fff" }}>
            Get started
            <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
              arrow_forward
            </span>
          </span>
        </Link>
      </div>

      <div className="mt-6">
        <Link href="/free-tests/placement" className="flex items-center gap-2" style={{ color: "var(--seal-2)", fontSize: 13, fontWeight: 650 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            straighten
          </span>
          Not sure of your level? Take the 5-minute placement check
          <span className="material-symbols-outlined" style={{ fontSize: 15 }}>
            arrow_forward
          </span>
        </Link>
      </div>
    </main>
  );
}

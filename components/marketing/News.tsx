"use client";

import { useEffect, useState } from "react";

export type NewsItem = {
  id: string;
  tag: string;
  date: string;
  title: string;
  body: string;
};

export const CENTRE_NEWS: NewsItem[] = [
  {
    id: "n1",
    tag: "New",
    date: "2026-07-28",
    title: "Free Tests hub is now live",
    body: "A Social English check and a Preview test are now open to anyone from the sign-in screen — no account needed, instant unofficial results.",
  },
  {
    id: "n2",
    tag: "New",
    date: "2026-07-28",
    title: "Results now report a CEFR band",
    body: "Alongside your percentage score, results, certificates and your dashboard now show where you land on the standard A1–C2 scale.",
  },
  {
    id: "n3",
    tag: "Update",
    date: "2026-07-27",
    title: "iTEP Writing & Grammar Combo added",
    body: "A blended checkpoint pairing grammar multiple-choice with a human-graded writing prompt is now available in the exam centre.",
  },
  {
    id: "n4",
    tag: "Notice",
    date: "2026-07-25",
    title: "Writing and Speaking are graded by a human examiner",
    body: "These responses are read and scored individually, so your final result appears once grading is complete rather than instantly.",
  },
];

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function NewsTicker({ items = CENTRE_NEWS }: { items?: NewsItem[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 5000);
    return () => clearInterval(t);
  }, [items.length]);

  const n = items[i];
  if (!n) return null;

  return (
    <div className="news-strip">
      <span className="news-badge">
        <span className="material-symbols-outlined" style={{ fontSize: 13 }}>
          auto_awesome
        </span>
        {n.tag}
      </span>
      <span className="news-text">{n.title}</span>
      <span className="mono tiny" style={{ marginLeft: "auto", flex: "none", color: "var(--seal-2)", opacity: 0.8 }}>
        {fmtDate(n.date)}
      </span>
    </div>
  );
}

export function NewsPanel({ items = CENTRE_NEWS }: { items?: NewsItem[] }) {
  return (
    <div className="card card-pad">
      <div className="flex items-center justify-between">
        <div>
          <div className="eyebrow eyebrow-seal">Centre announcements</div>
          <h3 className="mt-1.5" style={{ fontSize: 16 }}>
            What changed recently
          </h3>
        </div>
        <span className="mono tiny muted">{items.length} UPDATES</span>
      </div>
      <div className="mt-3.5">
        {items.map((n) => (
          <div key={n.id} className="news-row">
            <span className="news-dot" />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="pill pill-seal">{n.tag}</span>
                <span className="mono tiny muted">{fmtDate(n.date)}</span>
              </div>
              <div style={{ fontWeight: 650, fontSize: 13.5, marginTop: 4 }}>{n.title}</div>
              <p className="tiny muted mt-1" style={{ lineHeight: 1.6 }}>
                {n.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

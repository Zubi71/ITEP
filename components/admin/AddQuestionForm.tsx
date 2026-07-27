"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createQuestion } from "@/app/(admin)/admin/(shell)/question-bank/actions";

type SectionOption = { id: string; label: string };

export function AddQuestionForm({ sections }: { sections: SectionOption[] }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"MULTIPLE_CHOICE" | "WRITING" | "SPEAKING">("MULTIPLE_CHOICE");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold shadow-sm hover:opacity-90 transition-all"
      >
        <span className="material-symbols-outlined">add</span>
        New Question
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        setError(null);
        try {
          await createQuestion(formData);
          setOpen(false);
          setType("MULTIPLE_CHOICE");
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      }}
      className="flex flex-col gap-sm bg-surface-container-low p-md rounded-lg border border-outline-variant/30"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
        <select
          name="sectionId"
          required
          className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
        >
          <option value="">Select exam section…</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
          className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
        >
          <option value="MULTIPLE_CHOICE">Multiple Choice</option>
          <option value="WRITING">Writing</option>
          <option value="SPEAKING">Speaking</option>
        </select>
      </div>

      <textarea
        name="prompt"
        placeholder="Question prompt"
        required
        rows={2}
        className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
      />
      <input
        name="hint"
        placeholder="Hint (optional)"
        className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
      />

      {type === "MULTIPLE_CHOICE" && (
        <div className="space-y-xs">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">
            Answer choices — mark the correct one
          </p>
          {["A", "B", "C", "D"].map((label, i) => (
            <div key={label} className="flex items-center gap-sm">
              <input type="radio" name="correctIndex" value={i} required className="w-4 h-4" />
              <span className="font-label-sm text-label-sm font-bold w-4">{label}</span>
              <input
                name={`choiceText${i}`}
                placeholder={`Choice ${label}${i < 2 ? " (required)" : " (optional)"}`}
                required={i < 2}
                className="flex-1 px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
              />
            </div>
          ))}
        </div>
      )}

      {type !== "MULTIPLE_CHOICE" && (
        <p className="font-body-sm text-body-sm text-on-surface-variant italic">
          {type === "SPEAKING"
            ? "Speaking questions are answered as typed text (no audio recording in this exam)."
            : "Students answer with free-text; an admin grades the response afterward."}
        </p>
      )}

      <div className="flex items-center gap-sm">
        <button
          type="submit"
          className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all"
        >
          Create
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-label-md text-label-md"
        >
          Cancel
        </button>
      </div>
      {error && <p className="text-error font-body-sm">{error}</p>}
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCourse } from "@/app/(admin)/admin/(shell)/courses/actions";

export function AddCourseForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold shadow-sm hover:opacity-90 transition-all"
      >
        <span className="material-symbols-outlined">add</span>
        New Course
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        setError(null);
        try {
          await createCourse(formData);
          setOpen(false);
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      }}
      className="flex flex-col gap-sm bg-surface-container-low p-md rounded-lg border border-outline-variant/30"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
        <input name="title" placeholder="Course title" required className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
        <input name="category" placeholder="Category (e.g. Writing)" className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
      </div>
      <textarea name="description" placeholder="Description" required rows={2} className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
      <input name="thumbnailUrl" placeholder="Thumbnail image URL" required className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-sm">
        <input name="priceDollars" type="number" min={0} step={0.01} placeholder="Price ($)" required className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
        <input name="durationHours" type="number" min={0} placeholder="Hours" required className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
        <input name="rating" type="number" min={0} max={5} step={0.1} placeholder="Rating (0-5)" className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
        <input name="studentsCount" type="number" min={0} placeholder="Students shown" className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />
      </div>
      <input name="badge" placeholder="Badge (optional, e.g. Most Popular)" className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md" />

      <div className="flex items-center gap-sm">
        <button type="submit" className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all">
          Create
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant font-label-md text-label-md">
          Cancel
        </button>
      </div>
      {error && <p className="text-error font-body-sm">{error}</p>}
    </form>
  );
}

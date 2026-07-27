"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUser } from "@/app/(admin)/admin/(shell)/users/actions";

export function AddUserForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold shadow-sm hover:opacity-90 transition-all"
      >
        <span className="material-symbols-outlined">person_add</span>
        Add User
      </button>
    );
  }

  return (
    <form
      action={async (formData) => {
        setError(null);
        try {
          await createUser(formData);
          setOpen(false);
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      }}
      className="flex flex-wrap items-center gap-sm bg-surface-container-low p-sm rounded-lg border border-outline-variant/30"
    >
      <input
        name="name"
        placeholder="Full name"
        required
        className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
      />
      <select name="role" defaultValue="STUDENT" className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md">
        <option value="STUDENT">Student</option>
        <option value="TEACHER">Teacher</option>
        <option value="ADMIN">Admin</option>
      </select>
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
      {error && <p className="text-error font-body-sm w-full">{error}</p>}
    </form>
  );
}

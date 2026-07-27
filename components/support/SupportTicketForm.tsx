"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitTicket } from "@/app/(app)/support/actions";

export function SupportTicketForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  return (
    <form
      action={async (formData) => {
        setError(null);
        setSuccess(false);
        try {
          await submitTicket(formData);
          setSuccess(true);
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
        }
      }}
      className="bg-white rounded-xl border border-outline-variant/30 shadow-sm p-lg flex flex-col gap-md"
    >
      <div>
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Subject</label>
        <input
          name="subject"
          required
          className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
        />
      </div>
      <div>
        <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Message</label>
        <textarea
          name="message"
          required
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
        />
      </div>
      <div className="flex items-center gap-sm">
        <button
          type="submit"
          className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all"
        >
          Send Message
        </button>
        {success && <p className="font-body-sm text-body-sm text-success">Sent — an admin will respond soon.</p>}
      </div>
      {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}
    </form>
  );
}

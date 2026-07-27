"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { resolveTicket } from "@/app/(admin)/admin/(shell)/support/actions";

export function ResolveTicketButton({ ticketId }: { ticketId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await resolveTicket(ticketId).catch(() => {});
          router.refresh();
        });
      }}
      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
    >
      {isPending ? "Resolving…" : "Mark Resolved"}
    </button>
  );
}

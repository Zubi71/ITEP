"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { refundPurchase } from "@/app/(admin)/admin/(shell)/payments/actions";

export function RefundButton({ purchaseId }: { purchaseId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (!window.confirm("Refund this purchase? This marks it as REFUNDED — no real payment processor is wired up yet, so no money actually moves.")) {
          return;
        }
        startTransition(async () => {
          await refundPurchase(purchaseId).catch(() => {});
          router.refresh();
        });
      }}
      className="px-3 py-1.5 rounded-lg border border-error/40 text-error font-label-sm text-label-sm font-bold hover:bg-error/10 transition-colors disabled:opacity-50"
    >
      {isPending ? "Refunding…" : "Refund"}
    </button>
  );
}

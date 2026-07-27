"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole, updateUserStatus, deleteUser } from "@/app/(admin)/admin/(shell)/users/actions";

const ROLES = ["STUDENT", "TEACHER", "ADMIN"] as const;
const STATUSES = ["ACTIVE", "INACTIVE", "PENDING"] as const;

export function UserRoleStatusControls({
  userId,
  userLabel,
  role,
  status,
  isSelf,
}: {
  userId: string;
  userLabel: string;
  role: string;
  status: string;
  isSelf: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function handleDelete() {
    if (!window.confirm(`Permanently delete ${userLabel}? This also deletes their exam attempts, certificates, and purchase history. This cannot be undone.`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        await deleteUser(userId);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not delete this user.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-xs">
    <div className="flex items-center gap-sm">
      <select
        defaultValue={role}
        disabled={isSelf || isPending}
        title={isSelf ? "You cannot change your own role" : undefined}
        onChange={(e) => {
          const value = e.target.value as (typeof ROLES)[number];
          startTransition(async () => {
            await updateUserRole(userId, value).catch(() => {});
            router.refresh();
          });
        }}
        className="px-2 py-1 rounded-md border border-outline-variant/40 bg-surface-container-low text-label-md text-label-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r.charAt(0) + r.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      <select
        defaultValue={status}
        disabled={isSelf || isPending}
        title={isSelf ? "You cannot change your own status" : undefined}
        onChange={(e) => {
          const value = e.target.value as (typeof STATUSES)[number];
          startTransition(async () => {
            await updateUserStatus(userId, value).catch(() => {});
            router.refresh();
          });
        }}
        className="px-2 py-1 rounded-md border border-outline-variant/40 bg-surface-container-low text-label-md text-label-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isSelf || isPending}
        title={isSelf ? "You cannot delete your own account" : "Delete user"}
        className="px-2 py-1 rounded-md border border-error/40 text-error font-label-sm text-label-sm hover:bg-error/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete
      </button>
    </div>
    {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}
    </div>
  );
}

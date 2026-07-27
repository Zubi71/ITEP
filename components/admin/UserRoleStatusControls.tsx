"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserRole, updateUserStatus } from "@/app/(admin)/admin/(shell)/users/actions";

const ROLES = ["STUDENT", "TEACHER", "ADMIN"] as const;
const STATUSES = ["ACTIVE", "INACTIVE", "PENDING"] as const;

export function UserRoleStatusControls({
  userId,
  role,
  status,
  isSelf,
}: {
  userId: string;
  role: string;
  status: string;
  isSelf: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
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
    </div>
  );
}

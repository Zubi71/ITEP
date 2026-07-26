"use client";

import { useEffect, useRef, useState } from "react";

export function ExamTimer({
  initialRemainingSec,
  onExpire,
}: {
  initialRemainingSec: number;
  onExpire: () => void;
}) {
  const [remaining, setRemaining] = useState(Math.max(0, Math.floor(initialRemainingSec)));
  const expiredRef = useRef(false);

  useEffect(() => {
    if (remaining <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpire();
      }
      return;
    }

    const timeout = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(timeout);
  }, [remaining, onExpire]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const low = remaining < 300;

  return (
    <div
      className={`flex items-center gap-sm px-4 py-2 rounded-full border border-outline-variant transition-colors ${
        low ? "bg-error-container animate-pulse" : "bg-surface-container-high"
      }`}
    >
      <span className={`material-symbols-outlined ${low ? "text-error" : "text-primary"}`}>timer</span>
      <span className={`font-label-md text-label-md font-bold ${low ? "text-error" : "text-primary"}`}>
        {minutes}:{seconds < 10 ? "0" : ""}
        {seconds}
      </span>
    </div>
  );
}

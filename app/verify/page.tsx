"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    router.push(`/verify/${encodeURIComponent(trimmed)}`);
  }

  return (
    <main className="min-h-screen flex flex-col bg-background text-on-surface font-body-md">
      <header className="h-20 px-margin-desktop flex items-center bg-surface-glass backdrop-blur-md shadow-sm">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">iTEP Center</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop">
        <div className="w-full max-w-[32rem] flex flex-col items-center text-center gap-md">
          <span className="material-symbols-outlined text-primary text-5xl">verified</span>
          <h2 className="font-headline-lg text-headline-lg text-primary">Verify a Certificate</h2>
          <p className="font-body-md text-on-surface-variant">
            Enter the verification code printed on an iTEP certificate to confirm it&apos;s genuine.
          </p>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-sm mt-md">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="ITEP-XXXX-XXXX"
              className="w-full text-center uppercase tracking-widest px-md py-sm bg-white border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
            />
            <button
              type="submit"
              className="w-full py-sm px-lg bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:shadow-md hover:opacity-90 transition-all"
            >
              Verify Certificate
            </button>
          </form>
        </div>
      </div>

      <footer className="py-xl px-margin-desktop bg-primary text-on-primary text-center">
        <p className="font-body-sm text-on-primary/60">© 2026 iTEP International. Academic Excellence Defined.</p>
      </footer>
    </main>
  );
}

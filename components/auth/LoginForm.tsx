"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { CEFR_BANDS } from "@/lib/cefr";

type Mode = "in" | "up";
type SignupRole = "STUDENT" | "TEACHER";

const DEMO_ACCOUNTS = [
  { label: "Student", who: "Alex Johnson", email: "alex@itep.test" },
  { label: "Teacher", who: "Sam Whitfield", email: "teacher@itep.test" },
  { label: "Administrator", who: "Admin Sarah", email: "admin@itep.test" },
];
const DEMO_PASSWORD = "Password123!";

export function LoginForm({ oauthEnabled }: { oauthEnabled: { google: boolean; facebook: boolean; linkedin: boolean } }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<SignupRole>("STUDENT");
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setErr("");
    setNote("");
  }

  async function doSignIn(emailValue: string, passwordValue: string) {
    setBusy(true);
    try {
      const result = await signIn("credentials", { email: emailValue, password: passwordValue, redirect: false });
      if (result?.error) {
        setErr("Invalid email or password. If you registered as a teacher, an administrator must approve the account first.");
        setBusy(false);
        return;
      }
      const session = await getSession();
      const destination =
        session?.user?.role === "ADMIN" ? "/admin/dashboard" : session?.user?.role === "TEACHER" ? "/teacher/dashboard" : "/dashboard";
      router.push(destination);
      router.refresh();
    } catch {
      setErr("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr("");
    setNote("");

    if (mode === "in") {
      if (!email.trim() || !password) return setErr("Enter both an email address and a password.");
      await doSignIn(email.trim(), password);
      return;
    }

    if (name.trim().length < 2) return setErr("Enter the name that should appear on your certificate.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email address.");
    if (password.length < 8) return setErr("Passwords must be at least eight characters.");

    setBusy(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, role }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(body.error ?? "Could not create your account.");
        setBusy(false);
        return;
      }
      if (body.pendingApproval) {
        setBusy(false);
        setPassword("");
        switchMode("in");
        setNote("Account created. A teacher account stays inactive until an administrator approves it.");
        return;
      }
      await doSignIn(email.trim(), password);
    } catch {
      setErr("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  function openDemo(demoEmail: string) {
    setEmail(demoEmail);
    setPassword(DEMO_PASSWORD);
    setErr("");
    setNote("");
    doSignIn(demoEmail, DEMO_PASSWORD);
  }

  const oauthButtons = [
    { id: "google", label: "Google", enabled: oauthEnabled.google },
    { id: "linkedin", label: "LinkedIn", enabled: oauthEnabled.linkedin },
    { id: "facebook", label: "Facebook", enabled: oauthEnabled.facebook },
  ] as const;
  const anyOauth = oauthButtons.some((p) => p.enabled);

  return (
    <div className="itep min-h-screen grid lg:grid-cols-2" style={{ background: "var(--chalk)" }}>
      {/* Left — thesis panel */}
      <div className="relative flex-col justify-between p-8 lg:p-12 overflow-hidden hidden lg:flex" style={{ background: "var(--ink)", color: "#fff", minHeight: "100vh" }}>
        <div className="ink-glow" style={{ width: 340, height: 340, background: "var(--seal)", opacity: 0.16, top: -120, right: -100 }} />
        <div className="absolute inset-0 omr-field" style={{ opacity: 0.5 }} />

        <div className="flex items-center gap-2.5 relative">
          <div className="flex items-center justify-center" style={{ width: 28, height: 28, background: "var(--seal)", borderRadius: 5 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "#fff" }}>
              school
            </span>
          </div>
          <span style={{ fontWeight: 800, letterSpacing: "-.02em", fontSize: 16 }}>iTEP Center</span>
        </div>

        <div className="py-10 relative">
          <div className="eyebrow" style={{ color: "var(--seal)" }}>
            English proficiency examination
          </div>
          <h1 className="mt-4" style={{ fontSize: "clamp(34px,5vw,52px)", lineHeight: 1.02, color: "#fff" }}>
            Six bands.
            <br />
            One honest number.
          </h1>
          <p className="mt-5" style={{ color: "#a9bad4", fontSize: 15, lineHeight: 1.68, maxWidth: 420 }}>
            Sit a full mock examination across grammar, listening, reading, writing and speaking. Objective
            sections are scored the moment you finish; writing and speaking are read by a human examiner.
            Pass, and your certificate is issued with a code anyone can verify.
          </p>
          <div className="mt-8" style={{ maxWidth: 420 }}>
            <div className="ladder">
              {CEFR_BANDS.map((b, i) => (
                <div key={b.code} className="rung" style={{ background: i <= 3 ? "var(--ink-3)" : "#1b2c4f", color: i === 3 ? "#fff" : "#8fa3c2", height: 30 }}>
                  {b.code}
                </div>
              ))}
            </div>
            <div className="mono mt-2.5" style={{ fontSize: 10.5, color: "#7c90b2", letterSpacing: ".06em" }}>
              CEFR-ALIGNED REPORTING · 5 SECTIONS · HUMAN-GRADED WRITING &amp; SPEAKING
            </div>
          </div>
        </div>

        <div className="grid gap-2.5 relative">
          <Link href="/free-tests" className="flex items-center gap-2" style={{ color: "#a9bad4", fontSize: 13 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--seal)" }}>
              auto_awesome
            </span>
            Try a free test — no account needed
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              arrow_forward
            </span>
          </Link>
          <Link href="/verify" className="flex items-center gap-2" style={{ color: "#a9bad4", fontSize: 13 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: "var(--seal)" }}>
              verified_user
            </span>
            Verify a certificate — no account needed
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              arrow_forward
            </span>
          </Link>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full" style={{ maxWidth: 396 }}>
          <div className="flex gap-1 mb-7" style={{ borderBottom: "1px solid var(--line)" }}>
            {(["in", "up"] as Mode[]).map((k) => (
              <button
                key={k}
                onClick={() => switchMode(k)}
                style={{
                  padding: "0 2px 11px",
                  marginRight: 22,
                  marginBottom: -1,
                  fontSize: 14,
                  fontWeight: mode === k ? 700 : 550,
                  color: mode === k ? "var(--ink)" : "var(--ghost)",
                  borderBottom: mode === k ? "2px solid var(--seal)" : "2px solid transparent",
                }}
              >
                {k === "in" ? "Sign in" : "Create account"}
              </button>
            ))}
          </div>

          <h2 style={{ fontSize: 26 }}>{mode === "in" ? "Welcome back" : "Join iTEP Center"}</h2>
          <p className="tiny muted mt-2">
            {mode === "in"
              ? "Sign in and you will land on the console for your role."
              : "Choose how you will use the platform. This can be changed later by an administrator."}
          </p>

          {anyOauth && (
            <>
              <div className={`grid gap-2 mt-6`} style={{ gridTemplateColumns: `repeat(${oauthButtons.filter((p) => p.enabled).length}, 1fr)` }}>
                {oauthButtons
                  .filter((p) => p.enabled)
                  .map((p) => (
                    <button key={p.id} type="button" className="btn btn-line" onClick={() => signIn(p.id, { callbackUrl: "/dashboard" })}>
                      {p.label}
                    </button>
                  ))}
              </div>
              <div className="relative my-6">
                <div className="hair" />
                <span
                  className="mono tiny"
                  style={{
                    position: "absolute",
                    top: -7,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--chalk)",
                    padding: "0 10px",
                    color: "var(--ghost)",
                    letterSpacing: ".1em",
                  }}
                >
                  OR EMAIL
                </span>
              </div>
            </>
          )}

          <form className="grid gap-4 mt-6" onSubmit={submit}>
            {mode === "up" && (
              <div>
                <label className="label">Full name — as it will appear on your certificate</label>
                <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Johnson" />
              </div>
            )}

            <div>
              <label className="label">Email</label>
              <input className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@university.edu" />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                className="field"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least eight characters"
              />
            </div>

            {mode === "up" && (
              <div>
                <label className="label">I am signing up as</label>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    ["STUDENT", "Student", "Active straight away"],
                    ["TEACHER", "Teacher", "Needs admin approval"],
                  ] as const).map(([v, l, h]) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setRole(v)}
                      className="text-left p-3"
                      style={{
                        border: `1.5px solid ${role === v ? "var(--ink)" : "var(--line)"}`,
                        borderRadius: 6,
                        background: role === v ? "#f4f7fb" : "var(--paper)",
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: 13.5 }}>{l}</div>
                      <div className="tiny muted mt-0.5" style={{ fontSize: 11.5 }}>
                        {h}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {note && (
              <div className="flex gap-2.5 p-3" style={{ background: "var(--seal-soft)", borderRadius: 5, borderLeft: "3px solid var(--seal)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: "var(--seal-2)", flex: "none", marginTop: 1 }}>
                  lock
                </span>
                <div className="tiny" style={{ color: "var(--seal-2)", lineHeight: 1.55 }}>
                  {note}
                </div>
              </div>
            )}
            {err && (
              <div className="flex gap-2.5 p-3" style={{ background: "var(--fail-soft)", borderRadius: 5, borderLeft: "3px solid var(--fail)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: "var(--fail)", flex: "none", marginTop: 1 }}>
                  warning
                </span>
                <div className="tiny" style={{ color: "var(--fail)", lineHeight: 1.55 }}>
                  {err}
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "in" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-8 card card-pad">
            <div className="eyebrow">Open the demo as</div>
            <div className="grid gap-1.5 mt-3">
              {DEMO_ACCOUNTS.map((d) => (
                <button
                  key={d.email}
                  disabled={busy}
                  className="flex items-center justify-between px-3"
                  style={{ height: 38, border: "1px solid var(--line)", borderRadius: 5, background: "var(--paper)" }}
                  onClick={() => openDemo(d.email)}
                >
                  <span style={{ fontSize: 13, fontWeight: 650 }}>{d.label}</span>
                  <span className="tiny muted flex items-center gap-1.5">
                    {d.who}
                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                      arrow_forward
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center tiny muted" style={{ lineHeight: 1.6 }}>
            By continuing, you agree to iTEP Center&apos;s{" "}
            <a style={{ color: "var(--ink)", fontWeight: 650, textDecoration: "underline" }} href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a style={{ color: "var(--ink)", fontWeight: 650, textDecoration: "underline" }} href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

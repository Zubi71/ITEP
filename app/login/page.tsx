"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error ?? "Could not create your account.");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full flex flex-col lg:flex-row bg-background text-on-surface font-body-md">
      {/* Illustration Side */}
      <section className="hidden lg:flex relative overflow-hidden bg-primary-container lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container/90 via-primary-container/60 to-primary-container/30" />
        <div className="relative z-10 h-full w-full flex flex-col justify-between p-xl text-white">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 bg-on-primary-fixed rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary-fixed">school</span>
            </div>
            <span className="font-headline-md text-headline-md font-bold tracking-tight">iTEP Center</span>
          </div>
          <div className="max-w-[28rem]">
            <h1 className="font-display-lg text-display-lg mb-md leading-tight">
              Master your academic journey.
            </h1>
            <p className="font-body-lg text-body-lg text-white/80 mb-lg">
              Access the industry standard in English proficiency testing. Join
              thousands of students achieving global recognition.
            </p>
            <div className="flex items-center gap-md p-md glass-effect rounded-xl border border-white/10">
              <div className="w-12 h-12 rounded-full bg-secondary-container/20 flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-secondary-fixed"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
              </div>
              <div>
                <p className="font-label-md text-label-md text-white">Certified Results</p>
                <p className="font-body-sm text-body-sm text-white/70">
                  Recognized by 700+ institutions worldwide.
                </p>
              </div>
            </div>
          </div>
          <div className="font-body-sm text-body-sm text-white/60">
            © 2026 iTEP International. Academic Excellence Defined.
          </div>
        </div>
      </section>

      {/* Form Side */}
      <section className="flex-1 flex items-center justify-center p-margin-mobile md:p-xl">
        <div className="w-full max-w-[440px] flex flex-col">
          <div className="lg:hidden mb-lg">
            <div className="flex items-center gap-sm">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">school</span>
              </div>
              <span className="font-headline-md text-headline-md font-bold text-primary">
                iTEP Center
              </span>
            </div>
          </div>

          <div className="mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">
              {isSignup ? "Join iTEP Center" : "Welcome back"}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {isSignup
                ? "Start your path to global academic recognition."
                : "Please enter your details to sign in."}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-md mb-lg border-b border-outline-variant">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`pb-sm font-label-md text-label-md transition-all ${
                !isSignup
                  ? "text-primary border-b-2 border-secondary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`pb-sm font-label-md text-label-md transition-all ${
                isSignup
                  ? "text-primary border-b-2 border-secondary"
                  : "text-on-surface-variant hover:text-primary"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Social logins (visual only, not wired up yet) */}
          <div className="grid grid-cols-2 gap-md mb-lg">
            <button
              type="button"
              disabled
              title="Coming soon"
              className="flex items-center justify-center gap-sm px-md py-sm bg-white border border-outline-variant rounded-lg opacity-50 cursor-not-allowed"
            >
              <span className="font-label-md text-label-md text-on-surface-variant">Google</span>
            </button>
            <button
              type="button"
              disabled
              title="Coming soon"
              className="flex items-center justify-center gap-sm px-md py-sm bg-white border border-outline-variant rounded-lg opacity-50 cursor-not-allowed"
            >
              <span className="font-label-md text-label-md text-on-surface-variant">LinkedIn</span>
            </button>
          </div>

          <div className="relative mb-lg">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-md font-label-sm text-label-sm text-outline uppercase tracking-widest">
                or email
              </span>
            </div>
          </div>

          <form className="flex flex-col gap-md" onSubmit={handleSubmit}>
            {isSignup && (
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg font-body-md text-body-md transition-all placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>
            )}

            <div className="flex flex-col gap-xs">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg font-body-md text-body-md transition-all placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
            </div>

            <div className="flex flex-col gap-xs">
              <div className="flex justify-between items-center">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="password">
                  Password
                </label>
                {!isSignup && (
                  <a className="font-label-sm text-label-sm text-secondary hover:underline" href="#">
                    Forgot password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-md py-sm bg-white border border-outline-variant rounded-lg font-body-md text-body-md transition-all placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-md top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-base">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {!isSignup && (
              <div className="flex items-center gap-sm">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary-container"
                />
                <label
                  htmlFor="remember-me"
                  className="font-body-sm text-body-sm text-on-surface-variant select-none"
                >
                  Remember me for 30 days
                </label>
              </div>
            )}

            {error && (
              <p className="font-body-sm text-body-sm text-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-sm py-sm px-lg bg-primary-container text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:shadow-md hover:bg-primary transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? "Please wait…" : isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="mt-xl text-center font-body-sm text-body-sm text-on-surface-variant">
            By continuing, you agree to iTEP Center&apos;s{" "}
            <a className="text-primary font-medium underline" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="text-primary font-medium underline" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

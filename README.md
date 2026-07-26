# iTEP Center Enterprise Platform

A Next.js (App Router) student platform for iTEP Center, built from Stitch design exports in `stitch-export/`.

## Milestone 1: Student Dashboard + Mock Exam Engine

Implemented and working end-to-end:

- Email/password authentication (NextAuth v5 / Auth.js, Credentials provider + Prisma adapter)
- Student dashboard with real, computed stats (average score, exams completed, hours studied, performance trend)
- Mock exam selection with skill filters and score history
- Exam-taking interface: real countdown timer, per-question answer persistence, flag-for-review, and refresh-resilience (reloading mid-exam restores your answers and position)
- Automatic scoring on submit, with a results page showing a real score gauge, per-skill breakdown, and answer review
- Study materials library

## Milestone 2: Course Marketplace

- `/courses` — real course catalog (seeded), ratings/students/duration display, category badges
- **Enrollment is currently mocked** — clicking "Enroll Now" instantly grants ownership (creates a `COMPLETED` `Purchase` row), no payment step. Real Stripe Checkout was deferred until the client supplies test-mode credentials (`STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`). The `Purchase` model already carries (nullable) Stripe fields, so wiring in real payments later is a localized change to `app/(app)/courses/actions.ts` — see the comment in that file and the "Later: swapping in real Stripe" note in the milestone-2 plan.

## Milestone 3: Certificate Verification

- Certificates are **auto-issued** when a student passes an exam (`scorePct >= PASS_THRESHOLD`) — hooked into `submitAttempt` (`app/exam/[attemptId]/actions.ts`) via `issueCertificateIfPassed` (`lib/certificates.ts`), one certificate per passing attempt with a unique human-shareable code (`ITEP-XXXX-XXXX`).
- `/verify` — a fully **public** (unauthenticated) lookup page: enter a code, see the real certificate if it exists, or a neutral "not found" message if it doesn't. `/verify/[code]` is the direct shareable link.
- Passing the exam surfaces a "Certificate Earned" callout on the results page linking to the public certificate.

## Milestone 4: Production Database (Postgres)

- Migrated off SQLite to a real **Postgres database hosted on Supabase**, via the `@prisma/adapter-pg` driver adapter (`pg` package).
- **Connection note**: Supabase's *direct* connection (port 5432, `db.<ref>.supabase.co`) is IPv6-only unless you pay for the IPv4 add-on. If your network is IPv4-only (common), `DATABASE_URL` must use the **Session Pooler** connection string instead (`postgres.<ref>@aws-...pooler.supabase.com:5432`) — that's what's configured in `.env` now. If you ever regenerate the database password or need a fresh connection string, get it from Supabase's dashboard → **Connect** button → **Direct Connection** tab → **Session pooler** option (not Transaction pooler, and not the default Direct connection unless you have IPv6 or the IPv4 add-on).
- Migration history was reset (`prisma/migrations/`) since SQLite and Postgres migration SQL aren't interchangeable — there's a single fresh `init` migration now.
- No app code changes were needed beyond the datasource/adapter swap (`lib/prisma.ts`, `prisma/seed.ts`) — Prisma's query API abstracted the rest.
- Deployment itself (Vercel or otherwise) is still not set up — this project also isn't a git repo yet. That remains a separate step whenever you're ready to go live.

## Stack

- Next.js 16 (App Router, TypeScript), Tailwind CSS v4 (legacy JS config loaded via `@config` in `app/globals.css` — see the note in `tailwind.config.ts` about avoiding `max-w-{xs,sm,md,lg,xl}`, which collide with our custom spacing scale)
- Prisma 7 + **Postgres (hosted on Supabase)**, via the `@prisma/adapter-pg` driver adapter — see the connection note above about the IPv4/IPv6 pooler gotcha
- NextAuth v5 (Auth.js), split into an edge-safe `lib/auth.config.ts` (used by `proxy.ts` for route gating) and the full `lib/auth.ts` (Prisma adapter + Credentials provider, Node-only)

## Getting started

```bash
npm install
# set DATABASE_URL in .env to your Postgres connection string (see Milestone 4 note above)
npx prisma migrate dev   # applies the schema
npm run db:seed          # seeds a demo user, exams, study materials, courses, and one completed attempt
npm run dev
```

Demo login: `alex@itep.test` / `Password123!`

## Deferred to Phase 2

Not built yet — reference designs still live in `stitch-export/`:

- Public marketing landing page (`stitch-export/05-itep-center-landing-page`)
- Real Stripe payments for the course marketplace (currently mocked, see Milestone 2 above)
- Actual deployment (Vercel or otherwise) — the app now runs on production-grade Postgres and is on GitHub, but isn't hosted anywhere public yet

import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Footer } from "@/components/shell/Footer";

const CATEGORIES = [
  {
    icon: "school",
    title: "iTEP Preparation",
    description: "Official partner materials for Academic, Business, and Slate variations.",
    bullets: ["12 Realistic Full Tests", "Real Speaking Prompts"],
    cta: "Explore iTEP",
  },
  {
    icon: "menu_book",
    title: "IELTS Intensive",
    description: "Master the Academic and General modules with expert strategy guides.",
    bullets: ["Band 8+ Writing Bank", "Audio Simulation Lab"],
    cta: "Explore IELTS",
  },
  {
    icon: "language",
    title: "TOEFL Mastery",
    description: "Complete coverage for iBT tests with timed environment simulation.",
    bullets: ["Instant AI Grading", "45-Section Practice"],
    cta: "Explore TOEFL",
  },
];

const TESTIMONIALS = [
  {
    name: "Lina Martinez",
    role: "Graduate Student, MIT",
    quote:
      "The AI performance insights were a game changer. I improved my TOEFL score from 92 to 110 in just four weeks of focused practice.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7nsqKdusvSr0Hl-oIAc96QVmJPvKBFP-9xmf8DcAyeqKg-fqIW7ZSoe_JNQFH1Y4uJrJoeHl9bs8HbK8HokeiINPuxqx2NtvJtpR8iF76ymTj8rrx1r838QBzNGPa-2Vry3df1YS3ypX-0S9q9sE3rGk-1OqRDGxzmLQ9H0qnkCjrOHKbCcJj9yOod16SNe55Ayv_WO_XVdFqTo180fblqg0KPh417wRhPAbAgor2z3w4f6f4QM9oVHovaer97c6cUvCftWVu1Ls",
  },
  {
    name: "Kenji Sato",
    role: "Senior Consultant, Deloitte",
    quote:
      "Practical, realistic, and efficient. The iTEP Center platform allowed me to prepare for my business English certification during my commute.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDYFHqhx_uTHWbyLEhTbHyA2UCX26p_F646rnM3-G3FkYCBzIg0ufiefoA_kJi-zyxSbn424l2-Tkdx-rLyXVVI3tB5IwFpuzyGxeoyMoPnFSL-FuyEgUYPIWNp_6Z-a0whm3JPDxvP8RJex0cPgrf_Q0MYWaE7chk5T-ow7Dn1AkStiIVz1ioO-GDpQIt41bdAZtFvg0ynPfZlmlTHph0kPbZHFvJLmzrjFZnZplSi9b5Dwhpxvr-yJbwRuGzyV79rojNsHbBCPwk",
  },
  {
    name: "Sarah Williams",
    role: "Undergraduate Student, Oxford",
    quote:
      "I finally felt ready after taking the mock exams. The interface is identical to the real test, so there were no surprises on exam day.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgB9P4cbMmQnhmBBe0lUgPySHa0pzaZ3LXshtRkCHoTK7QhE5gXhWhWx29yQkiYECrBZC3fzOmgRi5oz5h5S8SEmb_7tNKj5XlrPLKIesoCPrfjtgfJBHG_UdTO-4Z80bR0HVDoPY7l-_bwaeqGH9eWsrKLNmRdJ9MQx-8cXdFeZql1VxH2ri71NdjL2IdxlHx3bMoMbsOt6MY6X2KUjR17pa3JMWXSkdhRgHn3i290rchv8OErQtTVNBJW4m-YrkvHq7o4-cNqcY",
  },
];

const FAQS = [
  {
    q: "How accurate are the predicted exam scores?",
    a: "Our scoring algorithm is calibrated using data from over 500,000 official test results, maintaining a 96.4% correlation with actual iTEP and TOEFL results.",
  },
  {
    q: "Can I cancel my subscription at any time?",
    a: "Yes, you can cancel your monthly subscription at any time through your dashboard with no hidden fees or long-term commitments.",
  },
  {
    q: "Does the platform work on mobile devices?",
    a: "Absolutely. While mock exams are best experienced on desktop to simulate test conditions, all lessons and AI analysis are fully responsive for mobile study.",
  },
];

function StarRow() {
  return (
    <div className="mt-md flex text-brand-accent gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          star
        </span>
      ))}
    </div>
  );
}

export default async function LandingPage() {
  const session = await auth();
  const isSignedIn = Boolean(session?.user);
  const dashboardHref =
    session?.user.role === "ADMIN"
      ? "/admin/dashboard"
      : session?.user.role === "TEACHER"
        ? "/teacher/dashboard"
        : "/dashboard";

  return (
    <main className="bg-background text-on-background antialiased overflow-x-hidden flex-1 flex flex-col">
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-margin-desktop h-20 bg-surface-glass backdrop-blur-md">
        <div className="flex items-center gap-xl">
          <span className="font-headline-md text-headline-md font-bold text-primary">iTEP Center</span>
          <div className="hidden md:flex gap-lg items-center">
            <a
              className="font-label-md text-label-md text-primary font-bold border-b-2 border-brand-accent h-full flex items-center"
              href="#features"
            >
              Solutions
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant font-medium hover:text-primary transition-colors"
              href="#pricing"
            >
              Pricing
            </a>
            <a
              className="font-label-md text-label-md text-on-surface-variant font-medium hover:text-primary transition-colors"
              href="#faq"
            >
              FAQ
            </a>
            <Link
              href="/free-tests"
              className="font-label-md text-label-md text-on-surface-variant font-medium hover:text-primary transition-colors"
            >
              Free Tests
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-md">
          {isSignedIn ? (
            <Link
              href={dashboardHref}
              className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md text-label-md font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="font-label-md text-label-md font-semibold text-primary hover:opacity-80 transition-opacity"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-label-md text-label-md font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="pt-20">
        {/* Hero */}
        <section className="relative flex items-center px-margin-desktop py-xl overflow-hidden">
          <div className="mx-auto max-w-[1200px] w-full grid lg:grid-cols-2 gap-xl items-center relative z-10">
            <div className="space-y-lg max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-[18px]">verified</span>
                AI-Powered Academic Excellence
              </div>
              <h1 className="font-display-lg text-display-lg text-primary leading-tight">
                Master Your English Exams with <span className="text-brand-accent">Confidence</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[32rem]">
                Accelerate your learning with realistic mock exams, personalized learning paths, and
                advanced AI-driven analytics designed for serious achievers.
              </p>
              <div className="flex flex-wrap gap-md">
                <Link
                  href="/login"
                  className="bg-brand-accent text-on-primary px-8 py-4 rounded-xl font-label-md text-label-md font-bold hover:shadow-lg transition-all active:scale-95"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/free-tests"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl border border-outline font-label-md text-label-md font-bold hover:bg-surface-container transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined">quiz</span>
                  Try a Free Test
                </Link>
              </div>
            </div>
            <div className="hidden lg:block relative h-[500px]">
              <div className="absolute inset-0 bg-primary-container/5 rounded-3xl overflow-hidden border border-white/40 shadow-2xl backdrop-blur-sm p-base">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMsml9eW_4iMcy7808ldaj9-27QklR7FNXqPOavuanfrFlH-USHPMMQLgO6DxqxaGEEVk8bF3d2oFVfYJpn_carU4zaQFzpMIECRB2kBzYX4b467TMLnFznCcGZJ1NiC3NjrliG_ybAnz7Sh_Gzp69AwR1WKZUvAb2Bcmz7tOLKBfuWTVv2YVC1arpN75gQFbezKBcsaIO_mYQneR_a5c0qRFy3E3fYnC7Tkr5gbe0I0IJnNq3Pb8yBva-n7d1liJmIvxlraWSJNo"
                    alt=""
                    fill
                    unoptimized
                    className="object-cover shadow-inner"
                  />
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-xl border border-outline-variant/30 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center text-success">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <p className="text-label-sm font-bold text-on-surface-variant">Avg. Improvement</p>
                  <p className="text-headline-md font-extrabold text-primary">+24%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary-container text-on-primary py-xl">
          <div className="mx-auto max-w-[1200px] px-margin-desktop grid md:grid-cols-3 gap-xl text-center">
            <div className="space-y-xs">
              <p className="text-display-lg-mobile md:text-display-lg font-extrabold text-brand-accent">
                50,000+
              </p>
              <p className="font-label-md text-label-md text-on-primary-container uppercase tracking-widest">
                Global Students
              </p>
            </div>
            <div className="space-y-xs">
              <p className="text-display-lg-mobile md:text-display-lg font-extrabold text-brand-accent">98%</p>
              <p className="font-label-md text-label-md text-on-primary-container uppercase tracking-widest">
                Success Rate
              </p>
            </div>
            <div className="space-y-xs">
              <p className="text-display-lg-mobile md:text-display-lg font-extrabold text-brand-accent">100+</p>
              <p className="font-label-md text-label-md text-on-primary-container uppercase tracking-widest">
                Mock Exams
              </p>
            </div>
          </div>
        </section>

        {/* Exam Categories */}
        <section className="py-xl px-margin-desktop bg-surface-container-low">
          <div className="mx-auto max-w-[1200px]">
            <div className="flex flex-col items-center text-center mb-xl space-y-md">
              <h2 className="font-headline-lg text-headline-lg text-primary">Specialized Preparation</h2>
              <p className="text-body-md text-on-surface-variant max-w-[36rem]">
                Comprehensive resources tailored for the world&apos;s most recognized English proficiency
                standards.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-gutter">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.title}
                  className="group bg-white p-lg rounded-xl shadow-sm border border-outline-variant/30 hover:border-brand-accent transition-all"
                >
                  <div className="w-14 h-14 bg-primary-fixed rounded-lg flex items-center justify-center text-primary mb-md group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[32px]">{cat.icon}</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-sm">{cat.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
                    {cat.description}
                  </p>
                  <ul className="space-y-sm mb-xl">
                    {cat.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2 text-body-sm">
                        <span className="material-symbols-outlined text-success text-[18px]">
                          check_circle
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/exams"
                    className="text-primary font-bold inline-flex items-center gap-2 group-hover:gap-4 transition-all"
                  >
                    {cat.cta} <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Bento */}
        <section id="features" className="py-xl px-margin-desktop">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="font-headline-lg text-headline-lg text-primary text-center mb-xl">
              Built for Excellence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
              <div className="md:col-span-8 bg-primary-container text-on-primary rounded-xl overflow-hidden p-lg relative min-h-[280px] flex items-center">
                <div className="relative z-10 md:w-1/2">
                  <span className="inline-block px-3 py-1 rounded bg-brand-accent text-white font-label-sm mb-md">
                    PREMIUM AI
                  </span>
                  <h3 className="text-headline-md font-bold mb-md">Deep AI Performance Insights</h3>
                  <p className="text-body-md text-on-primary-container">
                    Identify weak spots in your syntax, vocabulary, and pronunciation with millisecond
                    precision grading.
                  </p>
                </div>
              </div>
              <div className="md:col-span-4 bg-white border border-outline-variant/30 rounded-xl p-lg flex flex-col justify-between min-h-[280px]">
                <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">assignment_turned_in</span>
                </div>
                <div>
                  <h3 className="text-body-lg font-bold mb-xs">Realistic Mock Exams</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    The exact interface and timing constraints of official examinations.
                  </p>
                </div>
              </div>
              <div className="md:col-span-4 bg-white border border-outline-variant/30 rounded-xl p-lg flex flex-col justify-between min-h-[280px]">
                <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">dashboard</span>
                </div>
                <div>
                  <h3 className="text-body-lg font-bold mb-xs">Personalized Dashboards</h3>
                  <p className="text-body-sm text-on-surface-variant">
                    Track your growth trajectory and predicted exam scores in real-time.
                  </p>
                </div>
              </div>
              <div className="md:col-span-8 bg-surface-bright border border-outline-variant/30 rounded-xl p-lg flex flex-col md:flex-row gap-lg items-center min-h-[280px]">
                <div className="md:w-1/2">
                  <h3 className="text-headline-md font-bold mb-md">Official Readiness Certificates</h3>
                  <p className="text-body-md text-on-surface-variant mb-md">
                    Earn a verifiable iTEP certificate the moment you pass a mock exam — shareable with a
                    public verification link.
                  </p>
                  <Link href="/verify" className="text-primary font-bold flex items-center gap-2">
                    Verify a certificate <span className="material-symbols-outlined">chevron_right</span>
                  </Link>
                </div>
                <div className="md:w-1/2 relative h-48 w-full rounded-lg overflow-hidden shadow-lg">
                  <Image
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3OEJFnMj5yR2LheVCmDKS0EC2UDWUHq2JRhNLUeiaOeWZVjsY-fTHoEScIerpXXmZLvnV8nInJ5RiO06klMSkNnni84xVQHeYl7JD7NlNpN_RgXxK_Re6MEXuSQVIlNj9vv-DA3GLtVcxffdEyfHpikSsxPd_K-CFy7VDwNAWofKSN0C7AvRFpYWLc_qyJ3_ycksi8ScLH7VgkMNMBtSbhjt_Wbh7sejkg-OLbaM_iAlYfkXAAAghGionVyKp5AbMawdlJxUTDqk"
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-xl px-margin-desktop bg-primary text-on-primary">
          <div className="mx-auto max-w-[1200px]">
            <h2 className="text-center font-headline-lg text-headline-lg mb-xl">
              Trusted by Future Leaders
            </h2>
            <div className="grid md:grid-cols-3 gap-lg">
              {TESTIMONIALS.map((t) => (
                <div
                  key={t.name}
                  className="bg-primary-container p-lg rounded-xl border border-white/10 hover:border-white/30 transition-all"
                >
                  <div className="flex items-center gap-md mb-md">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden flex-none">
                      <Image src={t.image} alt="" fill unoptimized className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold">{t.name}</h4>
                      <p className="text-label-sm text-on-primary-container">{t.role}</p>
                    </div>
                  </div>
                  <p className="font-body-md italic text-on-primary-container leading-relaxed">
                    &quot;{t.quote}&quot;
                  </p>
                  <StarRow />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-xl px-margin-desktop bg-surface-container-low">
          <div className="mx-auto max-w-[1200px]">
            <div className="text-center mb-xl">
              <h2 className="font-headline-lg text-headline-lg text-primary">Transparent Investment</h2>
              <p className="text-body-md text-on-surface-variant">
                Choose the plan that fits your academic goals.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-gutter items-start">
              <div className="bg-white p-lg rounded-xl border border-outline-variant/30 flex flex-col h-full">
                <div className="mb-lg">
                  <p className="font-bold text-primary uppercase tracking-widest text-label-sm mb-xs">
                    Basic
                  </p>
                  <h3 className="text-display-lg-mobile font-extrabold text-primary">
                    $0 <span className="text-label-md font-medium text-on-surface-variant">/mo</span>
                  </h3>
                </div>
                <ul className="space-y-md mb-xl flex-grow">
                  <li className="flex gap-3 text-body-sm">
                    <span className="material-symbols-outlined text-primary">check</span> 2 Sample Mock
                    Exams
                  </li>
                  <li className="flex gap-3 text-body-sm">
                    <span className="material-symbols-outlined text-primary">check</span> Vocabulary Daily
                    Packs
                  </li>
                  <li className="flex gap-3 text-body-sm text-on-surface-variant/40">
                    <span className="material-symbols-outlined">close</span> AI Speaking Grading
                  </li>
                </ul>
                <Link
                  href="/login"
                  className="w-full py-3 rounded-lg border border-primary font-bold hover:bg-primary-container hover:text-white transition-all text-center"
                >
                  Get Started
                </Link>
              </div>
              <div className="bg-white p-lg rounded-xl border-2 border-brand-accent flex flex-col h-full relative shadow-xl md:scale-105 z-10">
                <div className="absolute top-0 right-4 md:right-margin-desktop -translate-y-1/2 bg-brand-accent text-white px-4 py-1 rounded-full text-label-sm font-bold whitespace-nowrap">
                  MOST POPULAR
                </div>
                <div className="mb-lg">
                  <p className="font-bold text-brand-accent uppercase tracking-widest text-label-sm mb-xs">
                    Professional
                  </p>
                  <h3 className="text-display-lg-mobile font-extrabold text-primary">
                    $49 <span className="text-label-md font-medium text-on-surface-variant">/mo</span>
                  </h3>
                </div>
                <ul className="space-y-md mb-xl flex-grow">
                  <li className="flex gap-3 text-body-sm">
                    <span className="material-symbols-outlined text-brand-accent">check</span> Unlimited
                    Mock Exams
                  </li>
                  <li className="flex gap-3 text-body-sm">
                    <span className="material-symbols-outlined text-brand-accent">check</span> Full AI
                    Performance Suite
                  </li>
                  <li className="flex gap-3 text-body-sm">
                    <span className="material-symbols-outlined text-brand-accent">check</span> 1-on-1
                    Strategy Session
                  </li>
                  <li className="flex gap-3 text-body-sm">
                    <span className="material-symbols-outlined text-brand-accent">check</span> Personalized
                    Study Path
                  </li>
                </ul>
                <button
                  type="button"
                  disabled
                  title="Coming soon"
                  className="w-full py-4 rounded-lg bg-brand-accent text-white font-bold shadow-md transition-all opacity-60 cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
              <div className="bg-white p-lg rounded-xl border border-outline-variant/30 flex flex-col h-full">
                <div className="mb-lg">
                  <p className="font-bold text-primary uppercase tracking-widest text-label-sm mb-xs">
                    Institutional
                  </p>
                  <h3 className="text-display-lg-mobile font-extrabold text-primary">Custom</h3>
                </div>
                <ul className="space-y-md mb-xl flex-grow">
                  <li className="flex gap-3 text-body-sm">
                    <span className="material-symbols-outlined text-primary">check</span> Bulk Licenses
                    (50+)
                  </li>
                  <li className="flex gap-3 text-body-sm">
                    <span className="material-symbols-outlined text-primary">check</span> LMS Integration
                    (LTI)
                  </li>
                  <li className="flex gap-3 text-body-sm">
                    <span className="material-symbols-outlined text-primary">check</span> Admin Reporting
                    Dashboard
                  </li>
                </ul>
                <a
                  href="mailto:sales@itepcenter.example"
                  className="w-full py-3 rounded-lg border border-primary font-bold hover:bg-primary-container hover:text-white transition-all text-center"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-xl px-margin-desktop max-w-3xl mx-auto">
          <h2 className="text-center font-headline-lg text-headline-lg mb-xl">
            Frequently Asked Questions
          </h2>
          <div className="space-y-md">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white p-6 rounded-xl border border-outline-variant/30"
              >
                <summary className="flex items-center justify-between cursor-pointer focus:outline-none list-none [&::-webkit-details-marker]:hidden">
                  <h4 className="font-bold text-body-lg">{faq.q}</h4>
                  <span className="material-symbols-outlined group-open:-rotate-180 transition-transform">
                    expand_more
                  </span>
                </summary>
                <p className="mt-4 text-on-surface-variant font-body-md">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSkillBreakdown } from "@/lib/stats";
import { CertificateDisplay } from "@/components/certificate/CertificateDisplay";

export default async function VerifyCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const normalizedCode = decodeURIComponent(code).trim().toUpperCase();

  const certificate = await prisma.certificate.findUnique({
    where: { code: normalizedCode },
  });

  return (
    <main className="min-h-screen flex flex-col bg-background text-on-surface font-body-md">
      <header className="h-20 px-margin-desktop flex items-center justify-between bg-surface-glass backdrop-blur-md shadow-sm no-print">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">iTEP Center</h1>
        <Link href="/verify" className="font-label-md text-label-md text-primary hover:underline">
          Verify another certificate
        </Link>
      </header>

      <div className="flex-1 p-margin-mobile md:p-margin-desktop">
        {certificate ? (
          <CertificateDisplay
            certificate={certificate}
            skillBreakdown={await getSkillBreakdown(certificate.attemptId)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-md text-center py-xl max-w-[32rem] mx-auto">
            <span className="material-symbols-outlined text-error text-5xl">error</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Certificate Not Found</h2>
            <p className="font-body-md text-on-surface-variant">
              We couldn&apos;t find a certificate with that code. Double check the code and try again.
            </p>
            <Link
              href="/verify"
              className="mt-md px-8 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all"
            >
              Try Again
            </Link>
          </div>
        )}
      </div>

      <footer className="py-xl px-margin-desktop bg-primary text-on-primary text-center no-print">
        <p className="font-body-sm text-on-primary/60">© 2026 iTEP International. Academic Excellence Defined.</p>
      </footer>
    </main>
  );
}

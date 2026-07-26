import { PrintButton } from "@/components/certificate/PrintButton";

const SKILL_ICON: Record<string, string> = {
  GRAMMAR: "edit_note",
  LISTENING: "hearing",
  READING: "menu_book",
  WRITING: "draw",
  SPEAKING: "mic",
};

export type CertificateVM = {
  code: string;
  recipientName: string;
  examTitle: string;
  scorePct: number;
  levelLabel: string;
  issuedAt: Date;
};

export function CertificateDisplay({
  certificate,
  skillBreakdown,
}: {
  certificate: CertificateVM;
  skillBreakdown: { skill: string; scorePct: number }[];
}) {
  return (
    <div className="max-w-[1000px] mx-auto w-full flex flex-col gap-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md no-print">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary">Certificate of Achievement</h1>
          <p className="font-body-md text-on-surface-variant">
            Verified on{" "}
            {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <PrintButton />
      </div>

      {/* Certificate canvas */}
      <div
        className="relative bg-white overflow-hidden mx-auto w-full"
        style={{
          boxShadow: "0 10px 40px rgba(0, 15, 39, 0.12)",
        }}
      >
        <div
          className="w-full bg-white relative flex flex-col items-center gap-lg py-xl px-lg"
          style={{
            border: "16px solid transparent",
            borderImage: "linear-gradient(to bottom right, #000f27, #fd9830, #000f27) 1",
          }}
        >
          <div
            className="absolute top-1/2 left-1/2 font-bold text-primary select-none pointer-events-none whitespace-nowrap"
            style={{
              transform: "translate(-50%, -50%) rotate(-30deg)",
              fontSize: "6rem",
              opacity: 0.03,
            }}
          >
            iTEP INTERNATIONAL
          </div>

          <div className="text-center z-10">
            <span className="material-symbols-outlined text-primary text-6xl block mb-sm">
              account_balance
            </span>
            <h2 className="font-serif text-5xl text-primary tracking-wide uppercase mb-xs">Certificate</h2>
            <p className="font-label-md tracking-[0.3em] text-on-surface-variant uppercase">
              Of Achievement and Proficiency
            </p>
          </div>

          <div className="text-center z-10 w-full max-w-[42rem]">
            <p className="font-body-lg italic text-on-surface-variant mb-md">This is to certify that</p>
            <h3 className="font-serif text-5xl text-primary mb-md border-b-2 border-primary-fixed inline-block px-xl pb-2">
              {certificate.recipientName}
            </h3>
            <p className="font-body-lg text-on-surface-variant mb-xl leading-relaxed">
              has successfully completed the international standard requirements for the
              <br />
              <span className="font-bold text-primary">{certificate.examTitle}</span>
            </p>
          </div>

          <div className="grid grid-cols-3 w-full max-w-[48rem] gap-xl z-10 border-t border-b border-outline-variant/30 py-lg">
            <div className="text-center">
              <p className="text-label-sm uppercase text-on-surface-variant mb-xs">Overall Score</p>
              <p className="font-serif text-4xl text-secondary">{certificate.scorePct.toFixed(0)}%</p>
              <p className="text-body-sm font-bold text-primary mt-1">{certificate.levelLabel}</p>
            </div>
            <div className="text-center border-x border-outline-variant/30 px-md">
              <p className="text-label-sm uppercase text-on-surface-variant mb-xs">Issued</p>
              <p className="font-body-md font-bold text-primary">
                {certificate.issuedAt.toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="text-center">
              <p className="text-label-sm uppercase text-on-surface-variant mb-xs">Verification Code</p>
              <p className="font-body-md font-bold text-primary">{certificate.code}</p>
            </div>
          </div>

          <div className="flex justify-center items-end w-full z-10 mt-xl">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-secondary/20 flex items-center justify-center relative">
                <div className="w-20 h-20 rounded-full border-2 border-secondary flex flex-col items-center justify-center text-center p-2">
                  <span className="material-symbols-outlined text-secondary text-3xl">verified_user</span>
                  <p className="text-[8px] font-bold text-secondary uppercase leading-tight mt-1">
                    Official Certified Seal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {skillBreakdown.length > 0 && (
        <section className="bg-white p-lg rounded-xl shadow-sm border border-outline-variant/30 no-print">
          <h4 className="font-headline-md text-headline-md text-primary mb-md">Skill Breakdown</h4>
          <div className="space-y-sm">
            {skillBreakdown.map((b) => (
              <div key={b.skill} className="space-y-1">
                <div className="flex justify-between items-center text-label-md">
                  <span className="flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px] text-secondary">
                      {SKILL_ICON[b.skill] ?? "school"}
                    </span>
                    {b.skill.charAt(0) + b.skill.slice(1).toLowerCase()}
                  </span>
                  <span className="font-bold">{b.scorePct.toFixed(0)}%</span>
                </div>
                <div className="w-full h-2 bg-surface-container rounded-full">
                  <div
                    className="h-full bg-secondary-container rounded-full"
                    style={{ width: `${b.scorePct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import { prisma } from "@/lib/prisma";

const TYPE_ICON: Record<string, string> = {
  PDF: "picture_as_pdf",
  Video: "play_circle",
  Article: "article",
};

const SKILL_ICON: Record<string, string> = {
  GRAMMAR: "translate",
  LISTENING: "headphones",
  READING: "menu_book",
  WRITING: "edit_note",
  SPEAKING: "record_voice_over",
};

export default async function StudyPage() {
  const materials = await prisma.studyMaterial.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-7xl mx-auto w-full">
      <header>
        <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">Study Materials Library</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Resources to help you prepare for your next mock exam.
        </p>
      </header>

      {materials.length === 0 ? (
        <p className="text-on-surface-variant font-body-md">No study materials available yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {materials.map((m) => (
            <a
              key={m.id}
              href={m.url ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-container-lowest rounded-xl p-md shadow-sm border border-outline-variant flex flex-col gap-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <span className="material-symbols-outlined text-2xl text-primary">
                  {TYPE_ICON[m.type] ?? "description"}
                </span>
                {m.skill && (
                  <span className="flex items-center gap-xs px-2 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[16px]">{SKILL_ICON[m.skill]}</span>
                    {m.skill.charAt(0) + m.skill.slice(1).toLowerCase()}
                  </span>
                )}
              </div>
              <h3 className="font-headline-md text-headline-md text-primary">{m.title}</h3>
              {m.description && (
                <p className="font-body-sm text-body-sm text-on-surface-variant">{m.description}</p>
              )}
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider mt-auto">
                {m.type}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

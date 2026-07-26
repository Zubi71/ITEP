type GridItem = {
  answered: boolean;
  flagged: boolean;
};

export function QuestionGrid({
  items,
  currentIndex,
  onJump,
}: {
  items: GridItem[];
  currentIndex: number;
  onJump: (index: number) => void;
}) {
  const answeredCount = items.filter((i) => i.answered).length;

  return (
    <aside className="w-72 flex-none flex flex-col bg-surface-container-lowest border-r border-outline-variant p-md">
      <div className="mb-md">
        <h3 className="font-label-md text-label-md text-on-surface-variant font-bold mb-xs">
          SECTION PROGRESS
        </h3>
        <p className="font-body-sm text-body-sm text-outline">
          {answeredCount} of {items.length} questions completed
        </p>
      </div>
      <div className="grid grid-cols-5 gap-base overflow-y-auto custom-scrollbar pr-xs">
        {items.map((item, i) => {
          const isCurrent = i === currentIndex;
          let classes =
            "w-10 h-10 rounded flex items-center justify-center font-label-sm text-label-sm transition-all ";
          if (isCurrent) {
            classes += "bg-primary text-on-primary ring-2 ring-offset-2 ring-primary";
          } else if (item.flagged) {
            classes += "bg-secondary-fixed text-on-secondary-fixed border-2 border-secondary";
          } else if (item.answered) {
            classes += "bg-primary-fixed text-on-primary-fixed";
          } else {
            classes += "bg-surface-container text-on-surface-variant border border-outline-variant hover:bg-surface-container-high";
          }

          return (
            <button key={i} className={classes} onClick={() => onJump(i)}>
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="mt-auto pt-md space-y-sm">
        <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
          <div className="w-3 h-3 rounded bg-primary-fixed" /> <span>Answered</span>
        </div>
        <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
          <div className="w-3 h-3 rounded bg-secondary-fixed border border-secondary" /> <span>Flagged</span>
        </div>
        <div className="flex items-center gap-xs font-label-sm text-label-sm text-on-surface-variant">
          <div className="w-3 h-3 rounded bg-surface-container border border-outline-variant" />{" "}
          <span>Unanswered</span>
        </div>
      </div>
    </aside>
  );
}

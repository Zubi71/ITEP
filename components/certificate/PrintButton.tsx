"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print flex items-center gap-xs px-md py-sm bg-surface-container-highest text-on-surface rounded-lg hover:bg-surface-variant transition-colors"
    >
      <span className="material-symbols-outlined">print</span>
      <span className="font-label-md">Print</span>
    </button>
  );
}

import { Loader2, PlayCircle } from "lucide-react";

export default function RunBar({ allUploaded, isRunning, onRun, error }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 border-y border-(--rule) py-6">
      <button
        onClick={onRun}
        disabled={!allUploaded || isRunning}
        className={`
          flex items-center gap-2 rounded-full px-6 py-3 font-mono-tabular text-sm uppercase tracking-[0.2em]
          transition-colors
          ${
            !allUploaded || isRunning
              ? "cursor-not-allowed border border-(--rule) text-(--ink-dim)"
              : "border border-(--stamp-amber) text-(--stamp-amber) hover:bg-(--stamp-amber) hover:text-(--paper)"
          }
        `}
      >
        {isRunning ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Running 3-way match…
          </>
        ) : (
          <>
            <PlayCircle className="h-4 w-4" />
            Run Reconciliation
          </>
        )}
      </button>

      {!allUploaded && (
        <p className="font-mono-tabular text-xs text-(--ink-dim)">
          Attach all three documents to enable reconciliation
        </p>
      )}

      {error && (
        <p className="font-mono-tabular text-xs text-(--stamp-red)">{error}</p>
      )}
    </div>
  );
}
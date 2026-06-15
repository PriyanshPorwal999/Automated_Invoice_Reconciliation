export default function SummaryStrip({ summary }) {
  if (!summary) return null;

  return (
    <div className="rounded-lg border border-(--rule) bg-(--paper-raised) px-5 py-4">
      <p className="font-mono-tabular text-xs uppercase tracking-[0.2em] text-(--ink-dim)">
        Arbitration Summary
      </p>
      <p className="mt-1 text-(--ink)">{summary}</p>
    </div>
  );
}
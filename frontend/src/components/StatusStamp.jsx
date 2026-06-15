export default function StatusStamp({ status }) {
  const config = {
    matched: {
      label: "Matched",
      sub: "All checks passed",
      color: "var(--stamp-green)",
    },
    mismatch: {
      label: "Variance",
      sub: "Discrepancies found",
      color: "var(--stamp-amber)",
    },
    error: {
      label: "Error",
      sub: "Reconciliation failed",
      color: "var(--stamp-red)",
    },
  };

  const c = config[status] || config.error;

  return (
    <div className="flex justify-center py-4">
      <div
        className="animate-stamp select-none rounded-md border-[3px] px-8 py-3 text-center"
        style={{
          borderColor: c.color,
          color: c.color,
          transform: "rotate(-6deg)",
        }}
      >
        <p className="font-mono-tabular text-2xl font-bold uppercase tracking-[0.3em] md:text-3xl">
          {c.label}
        </p>
        <p className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] opacity-80">
          {c.sub}
        </p>
      </div>
    </div>
  );
}
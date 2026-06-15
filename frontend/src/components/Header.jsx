export default function Header({ apiStatus }) {
  return (
    <header className="border-b border-(--rule) px-6 py-5 md:px-10">
      <div className="mx-auto flex max-w-5xl items-end justify-between gap-4">
        <div>
          <p className="font-mono-tabular text-xs uppercase tracking-[0.25em] text-(--stamp-amber)">
            Three-Way Match
          </p>
          <h1 className="mt-1 text-3xl md:text-4xl text-(--ink)">
            Invoice Reconciliation Ledger
          </h1>
          <p className="mt-1 text-sm text-(--ink-dim)">
            Upload an Invoice, Purchase Order, and Goods Receipt Note to run an automated audit.
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-2 rounded-full border border-(--rule) px-3 py-1.5 text-xs font-mono-tabular text-(--ink-dim) sm:flex">
          <span
            className={`h-2 w-2 rounded-full ${
              apiStatus === "healthy"
                ? "bg-(--stamp-green)"
                : apiStatus === "checking"
                ? "bg-(--stamp-amber) animate-pulse"
                : "bg-(--stamp-red)"
            }`}
          />
          API {apiStatus === "healthy" ? "online" : apiStatus === "checking" ? "checking" : "offline"}
        </div>
      </div>
    </header>
  );
}
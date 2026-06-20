import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({ label, value, sub, trend, trendUp, icon: Icon, accent }) {
  return (
    <div className="rounded-lg border border-(--rule) bg-(--paper-raised) p-5">
      <div className="flex items-start justify-between">
        <p className="font-mono-tabular text-xs uppercase tracking-[0.15em] text-(--ink-dim)">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-(--ink-dim)" />}
      </div>
      <p className={`mt-2 text-2xl font-semibold ${accent || "text-(--ink)"}`} style={{ fontFamily: "var(--font-display)" }}>
        {value}
      </p>
      {(sub || trend) && (
        <div className="mt-1.5 flex items-center gap-1.5">
          {trend && (
            <>
              {trendUp
                ? <TrendingUp className="h-3 w-3 text-(--stamp-green)" />
                : <TrendingDown className="h-3 w-3 text-(--stamp-red)" />
              }
              <p className={`font-mono-tabular text-xs ${trendUp ? "text-(--stamp-green)" : "text-(--stamp-red)"}`}>{trend}</p>
            </>
          )}
          {sub && <p className="font-mono-tabular text-xs text-(--ink-dim)">{sub}</p>}
        </div>
      )}
    </div>
  );
}
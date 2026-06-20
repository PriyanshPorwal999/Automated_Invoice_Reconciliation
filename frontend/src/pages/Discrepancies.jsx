import { useState } from "react";
import StatusBadge from "../components/ui/StatusBadge";
import SectionHeader from "../components/ui/SectionHeader";
import { getMockDiscrepancies } from "../services/api";

const ALL = [
  ...getMockDiscrepancies(),
  { id: "VAR-005", invoice: "INV-2024-011", field: "Unit Price", invoiceVal: "₹8,200", poVal: "₹7,900", diff: "+₹300", severity: "low" },
  { id: "VAR-006", invoice: "INV-2024-013", field: "Quantity", invoiceVal: "200 units", poVal: "195 units", diff: "+5 units", severity: "medium" },
];

export default function Discrepancies() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? ALL : ALL.filter(d => d.severity === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeader label="Variance Management" title="Discrepancies" />
        <div className="flex gap-2 font-mono-tabular text-xs">
          {["all","high","medium","low"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`rounded-full border px-3 py-1 capitalize transition-colors
                ${filter === f ? "border-(--stamp-amber) text-(--stamp-amber)" : "border-(--rule) text-(--ink-dim) hover:text-(--ink)"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-(--rule)">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-(--rule) bg-(--paper-raised)">
              {["ID","Invoice","Field","Invoice Value","PO Value","Difference","Severity"].map(h => (
                <th key={h} className="px-4 py-3 font-mono-tabular text-xs uppercase tracking-[0.12em] text-(--ink-dim)">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id} className="border-b border-(--rule) last:border-0 hover:bg-(--paper-raised)/50 transition-colors">
                <td className="px-4 py-3 font-mono-tabular text-xs text-(--stamp-amber)">{d.id}</td>
                <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink-dim)">{d.invoice}</td>
                <td className="px-4 py-3 text-xs text-(--ink)">{d.field}</td>
                <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink)">{d.invoiceVal}</td>
                <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink)">{d.poVal}</td>
                <td className="px-4 py-3 font-mono-tabular text-xs text-(--stamp-amber)">{d.diff}</td>
                <td className="px-4 py-3"><StatusBadge status={d.severity} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
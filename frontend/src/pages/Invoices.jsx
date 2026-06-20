import { useState } from "react";
import StatusBadge from "../components/ui/StatusBadge";
import SectionHeader from "../components/ui/SectionHeader";
import { getMockInvoices } from "../services/api";

const ALL = [
  ...getMockInvoices(),
  { id: "INV-2024-007", vendor: "BuildMart", amount: 67300, status: "variance", date: "2024-06-11", po: "PO-8800" },
  { id: "INV-2024-008", vendor: "TechSupplies Ltd", amount: 23800, status: "matched", date: "2024-06-10", po: "PO-8795" },
  { id: "INV-2024-009", vendor: "Sigma Steel", amount: 412000, status: "pending", date: "2024-06-10", po: "PO-8791" },
];

export default function Invoices() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = ALL.filter(inv =>
    (status === "all" || inv.status === status) &&
    (inv.id.toLowerCase().includes(search.toLowerCase()) ||
     inv.vendor.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <SectionHeader label="Document Register" title="All Invoices" />
      <div className="flex flex-wrap gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search invoice or vendor..."
          className="rounded-md border border-(--rule) bg-(--paper-raised) px-3 py-2 font-mono-tabular text-xs text-(--ink) placeholder:text-(--ink-dim) focus:border-(--stamp-amber) focus:outline-none" />
        <div className="flex gap-2">
          {["all","matched","variance","pending"].map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`rounded-full border px-3 py-1.5 font-mono-tabular text-xs capitalize transition-colors
                ${status === s ? "border-(--stamp-amber) text-(--stamp-amber)" : "border-(--rule) text-(--ink-dim) hover:text-(--ink)"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-hidden rounded-lg border border-(--rule)">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-(--rule) bg-(--paper-raised)">
              {["Invoice ID","Vendor","Amount","PO Reference","Date","Status"].map(h => (
                <th key={h} className="px-4 py-3 font-mono-tabular text-xs uppercase tracking-[0.12em] text-(--ink-dim)">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(inv => (
              <tr key={inv.id} className="border-b border-(--rule) last:border-0 hover:bg-(--paper-raised)/50 transition-colors">
                <td className="px-4 py-3 font-mono-tabular text-xs text-(--stamp-amber)">{inv.id}</td>
                <td className="px-4 py-3 text-xs text-(--ink)">{inv.vendor}</td>
                <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink)">₹{inv.amount.toLocaleString()}</td>
                <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink-dim)">{inv.po}</td>
                <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink-dim)">{inv.date}</td>
                <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
import SectionHeader from "../components/ui/SectionHeader";
import StatusBadge from "../components/ui/StatusBadge";
import { getMockVendors } from "../services/api";

export default function Vendors() {
  const vendors = getMockVendors();
  return (
    <div className="space-y-6">
      <SectionHeader label="Supplier Management" title="Vendor Overview" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vendors.map(v => (
          <div key={v.name} className="rounded-lg border border-(--rule) bg-(--paper-raised) p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-(--ink)">{v.name}</p>
                <p className="font-mono-tabular text-xs text-(--ink-dim)">{v.invoices} invoices</p>
              </div>
              <StatusBadge status={v.status} />
            </div>
            <div className="mt-4">
              <div className="flex justify-between font-mono-tabular text-xs text-(--ink-dim)">
                <span>Match Rate</span>
                <span className="text-(--ink)">{v.matchRate}%</span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-(--rule)">
                <div className="h-1.5 rounded-full transition-all" style={{
                  width: `${v.matchRate}%`,
                  background: v.matchRate >= 90 ? "var(--stamp-green)" : v.matchRate >= 80 ? "var(--stamp-amber)" : "var(--stamp-red)"
                }} />
              </div>
            </div>
            <p className="mt-3 font-mono-tabular text-xs text-(--ink-dim)">
              Total value: <span className="text-(--ink)">₹{(v.totalValue/1000).toFixed(0)}K</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
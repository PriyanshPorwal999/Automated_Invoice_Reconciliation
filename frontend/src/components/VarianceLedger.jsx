const FIELD_LABELS = {
  total_amount: "Total Amount",
  tax: "Tax",
  quantity: "Quantity",
  unit_price: "Unit Price",
};

function formatValue(v) {
  if (v === null || v === undefined) return "—";
  return v;
}

export default function VarianceLedger({ variances }) {
  if (!variances || variances.length === 0) {
    return (
      <div className="rounded-lg border border-(--rule) bg-(--paper-raised) p-6 text-center">
        <p className="font-mono-tabular text-sm text-(--ink-dim)">
          No variances recorded. Every line balances.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-(--rule)">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-(--rule) bg-(--paper-raised) font-mono-tabular text-xs uppercase tracking-[0.15em] text-(--ink-dim)">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Field</th>
            <th className="px-4 py-3">Item Code</th>
            <th className="px-4 py-3">Invoice Value</th>
            <th className="px-4 py-3">PO / GRN Value</th>
          </tr>
        </thead>
        <tbody>
          {variances.map((v, i) => (
            <tr
              key={i}
              className="border-b border-(--rule) last:border-0 odd:bg-(--paper-raised)/40"
            >
              <td className="px-4 py-3 font-mono-tabular text-(--ink-dim)">
                {String(i + 1).padStart(2, "0")}
              </td>
              <td className="px-4 py-3 text-(--ink)">
                {FIELD_LABELS[v.field] || v.field}
              </td>
              <td className="px-4 py-3 font-mono-tabular text-(--ink-dim)">
                {v.item_code ?? "—"}
              </td>
              <td className="px-4 py-3 font-mono-tabular text-(--stamp-amber)">
                {formatValue(v.invoice)}
              </td>
              <td className="px-4 py-3 font-mono-tabular text-(--stamp-amber)">
                {formatValue(v.po ?? v.grn)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
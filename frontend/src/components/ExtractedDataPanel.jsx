import { useState } from "react";
import { ChevronDown } from "lucide-react";

const LABELS = {
  invoice_json: { title: "Invoice", code: "INV" },
  po_json: { title: "Purchase Order", code: "PO" },
  grn_json: { title: "Goods Receipt Note", code: "GRN" },
};

function DataBlock({ docKey, data }) {
  const [open, setOpen] = useState(true);
  const { title, code } = LABELS[docKey];
  const lineItems = data?.line_items || [];

  return (
    <div className="rounded-lg border border-(--rule) bg-(--paper-raised)">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <p className="font-mono-tabular text-xs uppercase tracking-[0.2em] text-(--stamp-amber)">
            {code}
          </p>
          <h3 className="text-base text-(--ink)">{title}</h3>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-(--ink-dim) transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-(--rule) px-4 py-3">
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono-tabular text-sm">
            {data?.total_amount !== undefined && (
              <p>
                <span className="text-(--ink-dim)">Total: </span>
                <span className="text-(--ink)">{data.total_amount}</span>
              </p>
            )}
            {data?.tax !== undefined && (
              <p>
                <span className="text-(--ink-dim)">Tax: </span>
                <span className="text-(--ink)">{data.tax}</span>
              </p>
            )}
          </div>

          {lineItems.length > 0 && (
            <table className="mt-3 w-full text-left text-xs">
              <thead>
                <tr className="border-b border-(--rule) font-mono-tabular uppercase tracking-[0.15em] text-(--ink-dim)">
                  <th className="py-2 pr-3">Item Code</th>
                  <th className="py-2 pr-3">Quantity</th>
                  {lineItems.some((li) => li.unit_price !== undefined) && (
                    <th className="py-2 pr-3">Unit Price</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {lineItems.map((item, i) => (
                  <tr key={i} className="border-b border-(--rule) last:border-0 font-mono-tabular">
                    <td className="py-2 pr-3 text-(--ink)">{item.item_code}</td>
                    <td className="py-2 pr-3 text-(--ink-dim)">{item.quantity}</td>
                    {lineItems.some((li) => li.unit_price !== undefined) && (
                      <td className="py-2 pr-3 text-(--ink-dim)">
                        {item.unit_price !== undefined ? item.unit_price : "—"}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExtractedDataPanel({ result }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <DataBlock docKey="invoice_json" data={result.invoice_json} />
      <DataBlock docKey="po_json" data={result.po_json} />
      <DataBlock docKey="grn_json" data={result.grn_json} />
    </div>
  );
}
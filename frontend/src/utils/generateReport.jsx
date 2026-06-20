export function generateReport(result) {
  const now = new Date();
  const timestamp = now.toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" });
  const reportId = `RPT-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}-${Date.now().toString().slice(-4)}`;

  const status = result.error
    ? "ERROR"
    : result.match_result?.status === "matched"
    ? "MATCHED"
    : "VARIANCE";

  const statusColor = status === "MATCHED" ? "#5fae6e" : status === "VARIANCE" ? "#e0a93a" : "#d9684f";

  const FIELD_LABELS = {
    vendor_name:       "Vendor Name",
    po_reference:      "PO Reference",
    invoice_reference: "Invoice Reference",
    total_amount:      "Total Amount",
    tax:               "Tax",
    quantity:          "Quantity",
    unit_price:        "Unit Price",
  };

  const renderDoc = (data, label, code) => {
    if (!data || Object.keys(data).length === 0) return "";
    const items = data.line_items || [];
    const rows = [
      ["Document Type",      data.document_type],
      ["Document No.",       data.document_number],
      ["Date",               data.document_date],
      ["Vendor",             data.vendor_name],
      ["Buyer",              data.buyer_name],
      ["PO Reference",       data.reference_po_number],
      ["Invoice Reference",  data.reference_invoice_number],
      ["Currency",           data.currency],
      ["Subtotal",           data.subtotal],
      ["CGST",               data.cgst],
      ["SGST",               data.sgst],
      ["IGST",               data.igst],
      ["Tax",                data.tax],
      ["Total Amount",       data.total_amount],
    ].filter(([, v]) => v !== undefined && v !== null && v !== "");

    return `
      <div class="doc-block">
        <div class="doc-header">
          <span class="doc-code">${code}</span>
          <span class="doc-label">${label}</span>
        </div>
        <table class="data-table">
          ${rows.map(([k, v], i) => `
            <tr style="background:${i%2===0?"#f7f6f2":"#fff"}">
              <td class="key">${k}</td>
              <td>${k === "Total Amount" ? `<strong>${v}</strong>` : v}</td>
            </tr>
          `).join("")}
        </table>
        ${items.length > 0 ? `
          <p class="sub-heading">Line Items</p>
          <table class="line-table">
            <thead>
              <tr><th>Description</th><th>Qty</th><th>Unit Price</th><th>Total</th></tr>
            </thead>
            <tbody>
              ${items.map(i => `
                <tr>
                  <td>${i.description ?? "—"}</td>
                  <td>${i.quantity ?? "—"}</td>
                  <td>${i.unit_price ?? "—"}</td>
                  <td>${i.total_price ?? "—"}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        ` : ""}
      </div>
    `;
  };

  const variances = result.match_result?.variances || [];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Reconciliation Report — ${reportId}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:"IBM Plex Mono","Courier New",monospace;font-size:11px;color:#1a1a1a;background:#fff;padding:40px 48px}
    .report-header{border-bottom:2px solid #1a1a1a;padding-bottom:16px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-end}
    .report-title{font-size:20px;font-weight:700;font-family:Georgia,serif}
    .report-sub{font-size:10px;color:#666;margin-top:2px;text-transform:uppercase;letter-spacing:.15em}
    .report-meta{text-align:right;font-size:10px;color:#444;line-height:1.6}
    .stamp-row{display:flex;justify-content:center;margin:20px 0 28px}
    .stamp{border:3px solid ${statusColor};color:${statusColor};padding:8px 28px;font-size:18px;font-weight:700;letter-spacing:.3em;text-transform:uppercase;transform:rotate(-5deg);display:inline-block;font-family:Georgia,serif}
    .summary-box{background:#f7f6f2;border-left:3px solid #c8b97a;padding:10px 14px;margin-bottom:28px;line-height:1.6}
    .summary-label{font-size:9px;text-transform:uppercase;letter-spacing:.2em;color:#888;margin-bottom:4px}
    .section-heading{font-size:9px;text-transform:uppercase;letter-spacing:.2em;color:#888;border-bottom:1px solid #ddd;padding-bottom:4px;margin:24px 0 12px}
    .docs-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
    .doc-block{border:1px solid #ddd;border-radius:4px;overflow:hidden}
    .doc-header{background:#f7f6f2;border-bottom:1px solid #ddd;padding:6px 10px;display:flex;align-items:center;gap:8px}
    .doc-code{font-size:9px;text-transform:uppercase;letter-spacing:.2em;color:#c8a84b;font-weight:700}
    .doc-label{font-size:11px;font-weight:600}
    .data-table{width:100%;border-collapse:collapse;font-size:10px}
    .data-table tr{border-bottom:1px solid #eee}
    .data-table td{padding:4px 10px}
    .data-table td.key{color:#888;width:45%}
    .sub-heading{font-size:9px;text-transform:uppercase;letter-spacing:.15em;color:#888;padding:6px 10px 4px;border-top:1px solid #eee}
    .line-table{width:100%;border-collapse:collapse;font-size:10px}
    .line-table th{background:#f7f6f2;text-align:left;padding:4px 8px;font-size:9px;text-transform:uppercase;letter-spacing:.1em;color:#888;border-top:1px solid #eee;border-bottom:1px solid #eee}
    .line-table td{padding:4px 8px;border-bottom:1px solid #f0f0f0}
    .variance-table-wrap{border:1px solid #ddd;border-radius:4px;overflow:hidden}
    .variance-table{width:100%;border-collapse:collapse;font-size:10px}
    .variance-table th{background:#f7f6f2;padding:6px 12px;text-align:left;font-size:9px;text-transform:uppercase;letter-spacing:.12em;color:#888;border-bottom:1px solid #ddd}
    .variance-table td{padding:6px 12px;border-bottom:1px solid #eee}
    .variance-table tr:last-child td{border-bottom:none}
    .diff{color:${statusColor};font-weight:600}
    .no-variance{border:1px solid #ddd;border-radius:4px;padding:16px;text-align:center;color:#5fae6e}
    .report-footer{border-top:1px solid #ddd;margin-top:40px;padding-top:10px;font-size:9px;color:#aaa;display:flex;justify-content:space-between}
    @media print{body{padding:20px 28px} @page{margin:.5in;size:A4}}
  </style>
</head>
<body>
  <div class="report-header">
    <div>
      <div class="report-sub">Automated Invoice Reconciliation</div>
      <div class="report-title">Reconciliation Report</div>
    </div>
    <div class="report-meta">
      <div><strong>Report ID:</strong> ${reportId}</div>
      <div><strong>Generated:</strong> ${timestamp}</div>
      <div><strong>System:</strong> FastAPI · LangGraph · Gemini</div>
    </div>
  </div>

  <div class="stamp-row"><div class="stamp">${status}</div></div>

  ${result.summary ? `<div class="summary-box"><div class="summary-label">Arbitration Summary</div>${result.summary}</div>` : ""}

  <div class="section-heading">Extracted Document Data</div>
  <div class="docs-grid">
    ${renderDoc(result.invoice_json, "Invoice", "INV")}
    ${renderDoc(result.po_json, "Purchase Order", "PO")}
    ${renderDoc(result.grn_json, "Goods Receipt Note", "GRN")}
  </div>

  <div class="section-heading">Variance Ledger</div>
  ${variances.length === 0
    ? `<div class="no-variance">✓ No variances found — all fields match</div>`
    : `<div class="variance-table-wrap">
        <table class="variance-table">
          <thead><tr><th>#</th><th>Field</th><th>Invoice Value</th><th>PO / GRN Value</th></tr></thead>
          <tbody>
            ${variances.map((v, i) => `
              <tr>
                <td>${String(i+1).padStart(2,"0")}</td>
                <td>${FIELD_LABELS[v.field] || v.field}</td>
                <td class="diff">${v.invoice ?? "—"}</td>
                <td class="diff">${v.po ?? v.grn ?? "—"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>`
  }

  <div class="report-footer">
    <span>Automated Invoice Reconciliation System</span>
    <span>${reportId} · ${timestamp}</span>
  </div>
</body>
</html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.onload = () => { win.focus(); win.print(); };
}
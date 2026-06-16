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

  const renderDoc = (data, label, code) => {
    if (!data || Object.keys(data).length === 0) return "";
    const items = data.line_items || [];
    return `
      <div class="doc-block">
        <div class="doc-header">
          <span class="doc-code">${code}</span>
          <span class="doc-label">${label}</span>
        </div>
        <table class="data-table">
          <tr><td class="key">Document Type</td><td>${data.document_type ?? "—"}</td></tr>
          <tr><td class="key">Vendor</td><td>${data.vendor_name ?? "—"}</td></tr>
          <tr><td class="key">Document No.</td><td>${data.document_number ?? "—"}</td></tr>
          <tr><td class="key">Date</td><td>${data.document_date ?? "—"}</td></tr>
          <tr><td class="key">Currency</td><td>${data.currency ?? "—"}</td></tr>
          <tr><td class="key">Subtotal</td><td>${data.subtotal ?? "—"}</td></tr>
          <tr><td class="key">Tax</td><td>${data.tax ?? "—"}</td></tr>
          <tr><td class="key">Total Amount</td><td><strong>${data.total_amount ?? "—"}</strong></td></tr>
        </table>
        ${items.length > 0 ? `
          <p class="sub-heading">Line Items</p>
          <table class="line-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(i => `
                <tr>
                  <td>${i.item_code ?? "—"}</td>
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

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>Reconciliation Report — ${reportId}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: "IBM Plex Mono", "Courier New", monospace;
          font-size: 11px;
          color: #1a1a1a;
          background: #fff;
          padding: 40px 48px;
        }

        /* Header */
        .report-header {
          border-bottom: 2px solid #1a1a1a;
          padding-bottom: 16px;
          margin-bottom: 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .report-title {
          font-size: 20px;
          font-weight: 700;
          letter-spacing: -0.02em;
          font-family: Georgia, serif;
        }
        .report-sub {
          font-size: 10px;
          color: #666;
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }
        .report-meta { text-align: right; font-size: 10px; color: #444; line-height: 1.6; }

        /* Status stamp */
        .stamp-row {
          display: flex;
          justify-content: center;
          margin: 20px 0 28px;
        }
        .stamp {
          border: 3px solid ${statusColor};
          color: ${statusColor};
          padding: 8px 28px;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          transform: rotate(-5deg);
          display: inline-block;
          font-family: Georgia, serif;
        }

        /* Summary */
        .summary-box {
          background: #f7f6f2;
          border-left: 3px solid #c8b97a;
          padding: 10px 14px;
          margin-bottom: 28px;
          font-size: 11px;
          line-height: 1.6;
        }
        .summary-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #888;
          margin-bottom: 4px;
        }

        /* Section headings */
        .section-heading {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #888;
          border-bottom: 1px solid #ddd;
          padding-bottom: 4px;
          margin: 24px 0 12px;
        }

        /* Doc blocks */
        .docs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .doc-block {
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        .doc-header {
          background: #f7f6f2;
          border-bottom: 1px solid #ddd;
          padding: 6px 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .doc-code {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #c8a84b;
          font-weight: 700;
        }
        .doc-label { font-size: 11px; font-weight: 600; }

        .data-table { width: 100%; border-collapse: collapse; font-size: 10px; }
        .data-table tr { border-bottom: 1px solid #eee; }
        .data-table tr:last-child { border-bottom: none; }
        .data-table td { padding: 4px 10px; }
        .data-table td.key { color: #888; width: 45%; }

        .sub-heading {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #888;
          padding: 6px 10px 4px;
          border-top: 1px solid #eee;
        }

        .line-table { width: 100%; border-collapse: collapse; font-size: 10px; }
        .line-table th {
          background: #f7f6f2;
          text-align: left;
          padding: 4px 8px;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #888;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }
        .line-table td { padding: 4px 8px; border-bottom: 1px solid #f0f0f0; }
        .line-table tr:last-child td { border-bottom: none; }

        /* Variance table */
        .variance-table { width: 100%; border-collapse: collapse; font-size: 10px; }
        .variance-table th {
          background: #f7f6f2;
          padding: 6px 12px;
          text-align: left;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #888;
          border-bottom: 1px solid #ddd;
        }
        .variance-table td { padding: 6px 12px; border-bottom: 1px solid #eee; }
        .variance-table tr:last-child td { border-bottom: none; }
        .variance-table .diff { color: ${statusColor}; font-weight: 600; }
        .variance-table-wrap { border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }

        /* No variances */
        .no-variance {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 16px;
          text-align: center;
          color: #5fae6e;
          font-size: 11px;
        }

        /* Footer */
        .report-footer {
          border-top: 1px solid #ddd;
          margin-top: 40px;
          padding-top: 10px;
          font-size: 9px;
          color: #aaa;
          display: flex;
          justify-content: space-between;
        }

        @media print {
          body { padding: 20px 28px; }
          @page { margin: 0.5in; size: A4; }
        }
      </style>
    </head>
    <body>

      <!-- Header -->
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

      <!-- Status stamp -->
      <div class="stamp-row">
        <div class="stamp">${status}</div>
      </div>

      <!-- Summary -->
      ${result.summary ? `
        <div class="summary-box">
          <div class="summary-label">Arbitration Summary</div>
          ${result.summary}
        </div>
      ` : ""}

      <!-- Extracted Documents -->
      <div class="section-heading">Extracted Document Data</div>
      <div class="docs-grid">
        ${renderDoc(result.invoice_json, "Invoice", "INV")}
        ${renderDoc(result.po_json, "Purchase Order", "PO")}
        ${renderDoc(result.grn_json, "Goods Receipt Note", "GRN")}
      </div>

      <!-- Variances -->
      <div class="section-heading">Variance Ledger</div>
      ${variances.length === 0
        ? `<div class="no-variance">✓ No variances found — all fields match across Invoice, PO, and GRN</div>`
        : `<div class="variance-table-wrap">
            <table class="variance-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Field</th>
                  <th>Item Code</th>
                  <th>Invoice Value</th>
                  <th>PO / GRN Value</th>
                </tr>
              </thead>
              <tbody>
                ${variances.map((v, i) => `
                  <tr>
                    <td>${String(i+1).padStart(2,"0")}</td>
                    <td>${v.field}</td>
                    <td>${v.item_code ?? "—"}</td>
                    <td class="diff">${v.invoice ?? "—"}</td>
                    <td class="diff">${v.po ?? v.grn ?? "—"}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>`
      }

      <!-- Footer -->
      <div class="report-footer">
        <span>Automated Invoice Reconciliation System</span>
        <span>${reportId} · ${timestamp}</span>
      </div>

    </body>
    </html>
  `;

  // Open in new tab and trigger print dialog (Save as PDF)
  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.onload = () => {
    win.focus();
    win.print();
  };
}
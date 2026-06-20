import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, CheckCircle2, Loader2, AlertCircle, PlayCircle, FileDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SectionHeader from "../components/ui/SectionHeader";
import StatusBadge from "../components/ui/StatusBadge";
import { uploadDocument, runReconciliation } from "../services/api";
import { generateReport } from "../utils/generateReport";

const DOC_TYPES = [
  { key: "invoice", code: "INV", title: "Invoice",            desc: "Vendor invoice PDF" },
  { key: "po",      code: "PO",  title: "Purchase Order",     desc: "Approved purchase order PDF" },
  { key: "grn",     code: "GRN", title: "Goods Receipt Note", desc: "Warehouse receipt confirmation PDF" },
];

const FIELD_LABELS = {
  vendor_name:       "Vendor Name",
  po_reference:      "PO Reference",
  invoice_reference: "Invoice Reference",
  total_amount:      "Total Amount",
  tax:               "Tax",
  quantity:          "Quantity",
  unit_price:        "Unit Price",
};

function DropSlot({ doc, state, onUpload }) {
  const onDrop = useCallback(accepted => { if (accepted[0]) onUpload(accepted[0]); }, [onUpload]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "application/pdf": [".pdf"] }, maxFiles: 1,
  });
  const { status, fileName, error } = state;

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-lg border p-5 transition-colors
        ${isDragActive ? "border-(--stamp-amber) bg-(--paper-raised)" : "border-(--rule) bg-(--paper-raised)"}
        ${status === "uploaded" ? "border-(--stamp-green)/50" : ""}
        ${status === "error"    ? "border-(--stamp-red)/50"   : ""}
        hover:border-(--stamp-amber)/60`}
    >
      <input {...getInputProps()} />
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono-tabular text-xs uppercase tracking-[0.2em] text-(--stamp-amber)">{doc.code}</p>
          <h3 className="mt-1 text-base text-(--ink)" style={{ fontFamily: "var(--font-display)" }}>{doc.title}</h3>
          <p className="text-xs text-(--ink-dim)">{doc.desc}</p>
        </div>
        {status === "uploading" && <Loader2    className="h-5 w-5 animate-spin text-(--stamp-amber)" />}
        {status === "uploaded"  && <CheckCircle2 className="h-5 w-5 text-(--stamp-green)" />}
        {status === "error"     && <AlertCircle  className="h-5 w-5 text-(--stamp-red)" />}
        {status === "idle"      && <FileText     className="h-5 w-5 text-(--ink-dim)" />}
      </div>
      <div className="mt-4 border-t border-dashed border-(--rule) pt-3">
        <p className="truncate font-mono-tabular text-xs text-(--ink-dim)">
          {fileName || (isDragActive ? "Drop PDF here" : "Drag & drop PDF, or click")}
        </p>
        {error && <p className="mt-1 font-mono-tabular text-xs text-(--stamp-red)">{error}</p>}
      </div>
    </div>
  );
}

function ExtractedCard({ code, label, data }) {
  if (!data || Object.keys(data).length === 0) return null;
  const items = data.line_items || [];

  return (
    <div className="rounded-lg border border-(--rule) bg-(--paper-raised) p-4">
      <p className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-(--stamp-amber)">{code}</p>
      <p className="mt-0.5 text-sm font-medium text-(--ink)" style={{ fontFamily: "var(--font-display)" }}>{label}</p>
      <div className="mt-3 space-y-1 font-mono-tabular text-xs">
        {data.vendor_name             && <p><span className="text-(--ink-dim)">Vendor: </span><span className="text-(--ink)">{data.vendor_name}</span></p>}
        {data.buyer_name              && <p><span className="text-(--ink-dim)">Buyer: </span><span className="text-(--ink)">{data.buyer_name}</span></p>}
        {data.document_number         && <p><span className="text-(--ink-dim)">Doc No: </span><span className="text-(--ink)">{data.document_number}</span></p>}
        {data.document_date           && <p><span className="text-(--ink-dim)">Date: </span><span className="text-(--ink)">{data.document_date}</span></p>}
        {data.reference_po_number     && <p><span className="text-(--ink-dim)">PO Ref: </span><span className="text-(--ink)">{data.reference_po_number}</span></p>}
        {data.reference_invoice_number && <p><span className="text-(--ink-dim)">Inv Ref: </span><span className="text-(--ink)">{data.reference_invoice_number}</span></p>}
        {data.subtotal    !== undefined && <p><span className="text-(--ink-dim)">Subtotal: </span><span className="text-(--ink)">{data.subtotal}</span></p>}
        {data.cgst        !== undefined && <p><span className="text-(--ink-dim)">CGST: </span><span className="text-(--ink)">{data.cgst}</span></p>}
        {data.sgst        !== undefined && <p><span className="text-(--ink-dim)">SGST: </span><span className="text-(--ink)">{data.sgst}</span></p>}
        {data.igst        !== undefined && <p><span className="text-(--ink-dim)">IGST: </span><span className="text-(--ink)">{data.igst}</span></p>}
        {data.tax         !== undefined && <p><span className="text-(--ink-dim)">Tax: </span><span className="text-(--ink)">{data.tax}</span></p>}
        {data.total_amount !== undefined && <p><span className="text-(--ink-dim)">Total: </span><span className="font-bold text-(--ink)">{data.total_amount}</span></p>}
        {items.length > 0              && <p className="text-(--ink-dim)">Line items: {items.length}</p>}
      </div>
    </div>
  );
}

function VarianceLedger({ variances }) {
  if (!variances || variances.length === 0) {
    return (
      <div className="rounded-lg border border-(--stamp-green)/30 bg-(--paper-raised) p-5 text-center">
        <p className="font-mono-tabular text-sm text-(--stamp-green)">✓ No variances — all fields match</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-(--rule)">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-(--rule) bg-(--paper-raised)">
            {["#", "Field", "Invoice Value", "PO / GRN Value"].map(h => (
              <th key={h} className="px-4 py-3 font-mono-tabular text-xs uppercase tracking-[0.12em] text-(--ink-dim)">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variances.map((v, i) => (
            <tr key={i} className="border-b border-(--rule) last:border-0 odd:bg-(--paper-raised)/40">
              <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink-dim)">{String(i+1).padStart(2,"0")}</td>
              <td className="px-4 py-3 text-xs text-(--ink)">{FIELD_LABELS[v.field] || v.field}</td>
              <td className="px-4 py-3 font-mono-tabular text-xs text-(--stamp-amber)">{v.invoice ?? "—"}</td>
              <td className="px-4 py-3 font-mono-tabular text-xs text-(--stamp-amber)">{v.po ?? v.grn ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ResultPanel({ result }) {
  const status = result.error
    ? "error"
    : result.match_result?.status === "matched"
    ? "matched"
    : "variance";

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl text-(--ink)" style={{ fontFamily: "var(--font-display)" }}>
            Reconciliation Result
          </h2>
          <StatusBadge status={status} />
        </div>
        <button
          onClick={() => generateReport(result)}
          className="flex items-center gap-2 rounded-full border border-(--stamp-amber) px-4 py-2 font-mono-tabular text-xs uppercase tracking-[0.15em] text-(--stamp-amber) transition-colors hover:bg-(--stamp-amber) hover:text-(--paper)"
        >
          <FileDown className="h-3.5 w-3.5" />
          Generate Report
        </button>
      </div>

      {result.error && (
        <div className="rounded-lg border border-(--stamp-red)/40 bg-(--paper-raised) px-5 py-4">
          <p className="font-mono-tabular text-xs uppercase tracking-[0.15em] text-(--stamp-red)">Error</p>
          <p className="mt-1 text-sm text-(--ink)">{result.error}</p>
        </div>
      )}

      {result.summary && (
        <div className="rounded-lg border border-(--rule) bg-(--paper-raised) px-5 py-4">
          <p className="font-mono-tabular text-xs uppercase tracking-[0.15em] text-(--ink-dim)">Arbitration Summary</p>
          <p className="mt-1 text-sm text-(--ink)">{result.summary}</p>
        </div>
      )}

      <div>
        <p className="mb-3 font-mono-tabular text-xs uppercase tracking-[0.2em] text-(--ink-dim)">Extracted Document Data</p>
        <div className="grid gap-4 md:grid-cols-3">
          <ExtractedCard code="INV" label="Invoice"            data={result.invoice_json} />
          <ExtractedCard code="PO"  label="Purchase Order"     data={result.po_json} />
          <ExtractedCard code="GRN" label="Goods Receipt Note" data={result.grn_json} />
        </div>
      </div>

      <div>
        <p className="mb-3 font-mono-tabular text-xs uppercase tracking-[0.2em] text-(--ink-dim)">Variance Ledger</p>
        <VarianceLedger variances={result.match_result?.variances} />
      </div>
    </div>
  );
}

export default function Upload() {
  const [docs, setDocs] = useState({
    invoice: { status: "idle", fileName: null, filePath: null, error: null },
    po:      { status: "idle", fileName: null, filePath: null, error: null },
    grn:     { status: "idle", fileName: null, filePath: null, error: null },
  });
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult]       = useState(null);

  const handleUpload = async (key, file) => {
    setDocs(p => ({ ...p, [key]: { status: "uploading", fileName: file.name, filePath: null, error: null } }));
    try {
      const data = await uploadDocument(file, key);
      // dev2 backend returns uploaded_files[0].file_path
      const filePath = data.uploaded_files?.[0]?.file_path || null;
      setDocs(p => ({ ...p, [key]: { status: "uploaded", fileName: file.name, filePath, error: null } }));
      toast.success(`${key.toUpperCase()} uploaded`);
    } catch (e) {
      setDocs(p => ({
        ...p,
        [key]: { status: "error", fileName: file.name, filePath: null, error: e?.response?.data?.detail || "Upload failed" }
      }));
      toast.error(`Failed to upload ${key}`);
    }
  };

  const allUploaded = DOC_TYPES.every(d => docs[d.key].status === "uploaded");

  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      // dev2 backend: POST /reconcile/ requires JSON body with file paths
      const data = await runReconciliation({
        invoice_pdf_path: docs.invoice.filePath,
        po_pdf_path:      docs.po.filePath,
        grn_pdf_path:     docs.grn.filePath,
      });
      setResult(data);
      toast.success("Reconciliation complete");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Reconciliation failed");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--paper-raised)",
            color: "var(--ink)",
            border: "1px solid var(--rule)",
            fontSize: 13,
            fontFamily: "var(--font-mono)",
          },
        }}
      />

      <SectionHeader label="Step 1" title="Attach Source Documents" />
      <div className="grid gap-4 md:grid-cols-3">
        {DOC_TYPES.map(doc => (
          <DropSlot
            key={doc.key}
            doc={doc}
            state={docs[doc.key]}
            onUpload={f => handleUpload(doc.key, f)}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center gap-2 border-y border-(--rule) py-6">
        <button
          onClick={handleRun}
          disabled={!allUploaded || isRunning}
          className={`flex items-center gap-2 rounded-full px-6 py-3 font-mono-tabular text-sm uppercase tracking-[0.15em] transition-colors
            ${!allUploaded || isRunning
              ? "cursor-not-allowed border border-(--rule) text-(--ink-dim)"
              : "border border-(--stamp-amber) text-(--stamp-amber) hover:bg-(--stamp-amber) hover:text-(--paper)"
            }`}
        >
          {isRunning
            ? <><Loader2 className="h-4 w-4 animate-spin" />Running 3-way match…</>
            : <><PlayCircle className="h-4 w-4" />Run Reconciliation</>
          }
        </button>
        {!allUploaded && (
          <p className="font-mono-tabular text-xs text-(--ink-dim)">
            Attach all three documents to continue
          </p>
        )}
      </div>

      {result && <ResultPanel result={result} />}
    </div>
  );
}
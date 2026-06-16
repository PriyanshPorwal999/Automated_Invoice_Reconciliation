import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, CheckCircle2, Loader2, AlertCircle, PlayCircle, FileDown } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SectionHeader from "../components/ui/SectionHeader";
import StatusBadge from "../components/ui/StatusBadge";
import { uploadDocument, runReconciliation } from "../services/api";
import { generateReport } from "../utils/generateReport.jsx";
const DOC_TYPES = [
  { key: "invoice", code: "INV", title: "Invoice", desc: "Vendor invoice PDF" },
  { key: "po", code: "PO", title: "Purchase Order", desc: "Approved purchase order PDF" },
  { key: "grn", code: "GRN", title: "Goods Receipt Note", desc: "Warehouse receipt confirmation PDF" },
];

function DropSlot({ doc, state, onUpload }) {
  const onDrop = useCallback(accepted => { if (accepted[0]) onUpload(accepted[0]); }, [onUpload]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "application/pdf": [".pdf"] }, maxFiles: 1
  });
  const { status, fileName, error } = state;

  return (
    <div {...getRootProps()} className={`cursor-pointer rounded-lg border p-5 transition-colors
      ${isDragActive ? "border-(--stamp-amber) bg-(--paper-raised)" : "border-(--rule) bg-(--paper-raised)"}
      ${status === "uploaded" ? "border-(--stamp-green)/50" : ""}
      ${status === "error" ? "border-(--stamp-red)/50" : ""}
      hover:border-(--stamp-amber)/60`}>
      <input {...getInputProps()} />
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono-tabular text-xs uppercase tracking-[0.2em] text-(--stamp-amber)">{doc.code}</p>
          <h3 className="mt-1 text-base text-(--ink)" style={{ fontFamily: "var(--font-display)" }}>{doc.title}</h3>
          <p className="text-xs text-(--ink-dim)">{doc.desc}</p>
        </div>
        {status === "uploading" && <Loader2 className="h-5 w-5 animate-spin text-(--stamp-amber)" />}
        {status === "uploaded" && <CheckCircle2 className="h-5 w-5 text-(--stamp-green)" />}
        {status === "error" && <AlertCircle className="h-5 w-5 text-(--stamp-red)" />}
        {status === "idle" && <FileText className="h-5 w-5 text-(--ink-dim)" />}
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

// function ResultPanel({ result }) {
//   const status = result.error ? "error" : result.match_result?.status === "matched" ? "matched" : "variance";
//   return (
//     <div className="mt-8 space-y-6">
//       <div className="flex items-center gap-4">
//         <h2 className="text-xl text-(--ink)" style={{ fontFamily: "var(--font-display)" }}>Reconciliation Result</h2>
//         <StatusBadge status={status} />
//       </div>

//       {result.summary && (
//         <div className="rounded-lg border border-(--rule) bg-(--paper-raised) px-5 py-4">
//           <p className="font-mono-tabular text-xs uppercase tracking-[0.15em] text-(--ink-dim)">Summary</p>
//           <p className="mt-1 text-sm text-(--ink)">{result.summary}</p>
//         </div>
//       )}

//       <div className="grid gap-4 md:grid-cols-3">
//         {[["invoice_json","INV","Invoice"],["po_json","PO","Purchase Order"],["grn_json","GRN","GRN"]].map(([key,code,label]) => {
//           const d = result[key] || {};
//           const items = d.line_items || [];
//           return (
//             <div key={key} className="rounded-lg border border-(--rule) bg-(--paper-raised) p-4">
//               <p className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-(--stamp-amber)">{code}</p>
//               <p className="mt-0.5 text-sm text-(--ink)">{label}</p>
//               <div className="mt-3 space-y-1 font-mono-tabular text-xs">
//                 {d.total_amount !== undefined && <p><span className="text-(--ink-dim)">Total: </span><span className="text-(--ink)">{d.total_amount}</span></p>}
//                 {d.tax !== undefined && <p><span className="text-(--ink-dim)">Tax: </span><span className="text-(--ink)">{d.tax}</span></p>}
//                 {items.length > 0 && <p className="text-(--ink-dim)">Line items: {items.length}</p>}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {result.match_result?.variances?.length > 0 && (
//         <div className="overflow-hidden rounded-lg border border-(--rule)">
//           <table className="w-full text-left text-sm">
//             <thead>
//               <tr className="border-b border-(--rule) bg-(--paper-raised)">
//                 {["Field","Item","Invoice","PO / GRN"].map(h => (
//                   <th key={h} className="px-4 py-3 font-mono-tabular text-xs uppercase tracking-[0.12em] text-(--ink-dim)">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {result.match_result.variances.map((v, i) => (
//                 <tr key={i} className="border-b border-(--rule) last:border-0">
//                   <td className="px-4 py-3 text-xs text-(--ink)">{v.field}</td>
//                   <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink-dim)">{v.item_code ?? "—"}</td>
//                   <td className="px-4 py-3 font-mono-tabular text-xs text-(--stamp-amber)">{v.invoice ?? "—"}</td>
//                   <td className="px-4 py-3 font-mono-tabular text-xs text-(--stamp-amber)">{v.po ?? v.grn ?? "—"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
function ResultPanel({ result }) {
  const status = result.error ? "error" : result.match_result?.status === "matched" ? "matched" : "variance";

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl text-(--ink)" style={{ fontFamily: "var(--font-display)" }}>
            Reconciliation Result
          </h2>
          <StatusBadge status={status} />
        </div>

        {/* Generate Report button */}
        <button
          onClick={() => generateReport(result)}
          className="flex items-center gap-2 rounded-full border border-(--stamp-amber) px-4 py-2 font-mono-tabular text-xs uppercase tracking-[0.15em] text-(--stamp-amber) transition-colors hover:bg-(--stamp-amber) hover:text-(--paper)"
        >
          <FileDown className="h-3.5 w-3.5" />
          Generate Report
        </button>
      </div>

      {result.summary && (
        <div className="rounded-lg border border-(--rule) bg-(--paper-raised) px-5 py-4">
          <p className="font-mono-tabular text-xs uppercase tracking-[0.15em] text-(--ink-dim)">Summary</p>
          <p className="mt-1 text-sm text-(--ink)">{result.summary}</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {[["invoice_json","INV","Invoice"],["po_json","PO","Purchase Order"],["grn_json","GRN","GRN"]].map(([key,code,label]) => {
          const d = result[key] || {};
          const items = d.line_items || [];
          return (
            <div key={key} className="rounded-lg border border-(--rule) bg-(--paper-raised) p-4">
              <p className="font-mono-tabular text-[10px] uppercase tracking-[0.2em] text-(--stamp-amber)">{code}</p>
              <p className="mt-0.5 text-sm text-(--ink)">{label}</p>
              <div className="mt-3 space-y-1 font-mono-tabular text-xs">
                {d.total_amount !== undefined && <p><span className="text-(--ink-dim)">Total: </span><span className="text-(--ink)">{d.total_amount}</span></p>}
                {d.tax !== undefined && <p><span className="text-(--ink-dim)">Tax: </span><span className="text-(--ink)">{d.tax}</span></p>}
                {items.length > 0 && <p className="text-(--ink-dim)">Line items: {items.length}</p>}
              </div>
            </div>
          );
        })}
      </div>

      {result.match_result?.variances?.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-(--rule)">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-(--rule) bg-(--paper-raised)">
                {["Field","Item","Invoice","PO / GRN"].map(h => (
                  <th key={h} className="px-4 py-3 font-mono-tabular text-xs uppercase tracking-[0.12em] text-(--ink-dim)">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.match_result.variances.map((v, i) => (
                <tr key={i} className="border-b border-(--rule) last:border-0">
                  <td className="px-4 py-3 text-xs text-(--ink)">{v.field}</td>
                  <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink-dim)">{v.item_code ?? "—"}</td>
                  <td className="px-4 py-3 font-mono-tabular text-xs text-(--stamp-amber)">{v.invoice ?? "—"}</td>
                  <td className="px-4 py-3 font-mono-tabular text-xs text-(--stamp-amber)">{v.po ?? v.grn ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
export default function Upload() {
  const [docs, setDocs] = useState({
    invoice: { status: "idle" },
    po: { status: "idle" },
    grn: { status: "idle" }
  });
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async (key, file) => {
    setDocs(p => ({ ...p, [key]: { status: "uploading", fileName: file.name } }));
    try {
      await uploadDocument(file, key);
      setDocs(p => ({ ...p, [key]: { status: "uploaded", fileName: file.name } }));
      toast.success(`${key.toUpperCase()} uploaded`);
    } catch (e) {
      setDocs(p => ({ ...p, [key]: { status: "error", fileName: file.name, error: e?.response?.data?.detail || "Upload failed" } }));
      toast.error(`Failed to upload ${key}`);
    }
  };

  const allUploaded = DOC_TYPES.every(d => docs[d.key].status === "uploaded");

  const handleRun = async () => {
    setIsRunning(true);
    setResult(null);
    try {
      const data = await runReconciliation();
      setResult(data);
      toast.success("Reconciliation complete");
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      toast.error("Reconciliation failed");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div>
      <Toaster position="top-right" toastOptions={{ style: { background: "var(--paper-raised)", color: "var(--ink)", border: "1px solid var(--rule)", fontSize: 13, fontFamily: "var(--font-mono)" } }} />
      <SectionHeader label="Step 1" title="Attach Source Documents" />
      <div className="grid gap-4 md:grid-cols-3">
        {DOC_TYPES.map(doc => (
          <DropSlot key={doc.key} doc={doc} state={docs[doc.key]} onUpload={f => handleUpload(doc.key, f)} />
        ))}
      </div>
      <div className="mt-6 flex flex-col items-center gap-2 border-y border-(--rule) py-6">
        <button
          onClick={handleRun}
          disabled={!allUploaded || isRunning}
          className={`flex items-center gap-2 rounded-full px-6 py-3 font-mono-tabular text-sm uppercase tracking-[0.15em] transition-colors
            ${!allUploaded || isRunning
              ? "cursor-not-allowed border border-(--rule) text-(--ink-dim)"
              : "border border-(--stamp-amber) text-(--stamp-amber) hover:bg-(--stamp-amber) hover:text-(--paper)"}`}
        >
          {isRunning
            ? <><Loader2 className="h-4 w-4 animate-spin" />Running 3-way match…</>
            : <><PlayCircle className="h-4 w-4" />Run Reconciliation</>}
        </button>
        {!allUploaded && <p className="font-mono-tabular text-xs text-(--ink-dim)">Attach all three documents to continue</p>}
      </div>
      {result && <ResultPanel result={result} />}
    </div>
  );
}
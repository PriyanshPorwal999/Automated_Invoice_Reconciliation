import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const LABELS = {
  invoice: { title: "Invoice", code: "INV", desc: "Vendor invoice (PDF)" },
  po: { title: "Purchase Order", code: "PO", desc: "Approved purchase order (PDF)" },
  grn: { title: "Goods Receipt Note", code: "GRN", desc: "Warehouse receipt confirmation (PDF)" },
};

export default function DocumentSlot({ documentType, onUpload, status, fileName, errorMessage }) {
  const { title, code, desc } = LABELS[documentType];
  const [isDragReject, setDragReject] = useState(false);

  const onDrop = useCallback(
    (accepted, rejected) => {
      setDragReject(rejected.length > 0);
      if (accepted.length > 0) {
        onUpload(accepted[0]);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    multiple: false,
  });

  const isUploaded = status === "uploaded";
  const isUploading = status === "uploading";
  const isError = status === "error";

  return (
    <div
      {...getRootProps()}
      className={`
        relative cursor-pointer rounded-lg border p-5 transition-colors
        ${isDragActive ? "border-(--stamp-amber) bg-(--paper-raised)" : "border-(--rule) bg-(--paper-raised)"}
        ${isUploaded ? "border-(--stamp-green)/50" : ""}
        ${isError || isDragReject ? "border-(--stamp-red)/60" : ""}
        hover:border-(--stamp-amber)/60
      `}
    >
      <input {...getInputProps()} />

      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono-tabular text-xs uppercase tracking-[0.2em] text-(--stamp-amber)">
            {code} · 01
          </p>
          <h3 className="mt-1 text-lg text-(--ink)">{title}</h3>
          <p className="mt-0.5 text-xs text-(--ink-dim)">{desc}</p>
        </div>

        <div className="shrink-0">
          {isUploading && <Loader2 className="h-5 w-5 animate-spin text-(--stamp-amber)" />}
          {isUploaded && <CheckCircle2 className="h-5 w-5 text-(--stamp-green)" />}
          {isError && <AlertCircle className="h-5 w-5 text-(--stamp-red)" />}
          {status === "idle" && <FileText className="h-5 w-5 text-(--ink-dim)" />}
        </div>
      </div>

      <div className="mt-4 border-t border-dashed border-(--rule) pt-3">
        {fileName ? (
          <p className="truncate font-mono-tabular text-xs text-(--ink-dim)">{fileName}</p>
        ) : (
          <p className="font-mono-tabular text-xs text-(--ink-dim)">
            {isDragActive ? "Drop PDF to attach" : "Drag & drop PDF, or click to browse"}
          </p>
        )}

        {isError && errorMessage && (
          <p className="mt-1 font-mono-tabular text-xs text-(--stamp-red)">{errorMessage}</p>
        )}

        {isDragReject && (
          <p className="mt-1 font-mono-tabular text-xs text-(--stamp-red)">Only PDF files are accepted</p>
        )}
      </div>
    </div>
  );
}
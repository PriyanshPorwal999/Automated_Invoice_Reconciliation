import { useEffect, useState } from "react";
import Header from "../components/Header";
import DocumentSlot from "../components/DocumentSlot";
import RunBar from "../components/RunBar";
import StatusStamp from "../components/StatusStamp";
import SummaryStrip from "../components/SummaryStrip";
import ExtractedDataPanel from "../components/ExtractedDataPanel";
import VarianceLedger from "../components/VarianceLedger";
import { getHealth, uploadDocument, runReconciliation } from "../services/api";

const DOC_TYPES = ["invoice", "po", "grn"];

export default function ReconciliationWorkspace() {
  const [apiStatus, setApiStatus] = useState("checking");
  const [docState, setDocState] = useState({
    invoice: { status: "idle", fileName: null, error: null },
    po: { status: "idle", fileName: null, error: null },
    grn: { status: "idle", fileName: null, error: null },
  });
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    getHealth()
      .then((data) => setApiStatus(data?.status === "healthy" ? "healthy" : "offline"))
      .catch(() => setApiStatus("offline"));
  }, []);

  const handleUpload = async (documentType, file) => {
    setDocState((prev) => ({
      ...prev,
      [documentType]: { status: "uploading", fileName: file.name, error: null },
    }));

    try {
      await uploadDocument(file, documentType);
      setDocState((prev) => ({
        ...prev,
        [documentType]: { status: "uploaded", fileName: file.name, error: null },
      }));
    } catch (err) {
      setDocState((prev) => ({
        ...prev,
        [documentType]: {
          status: "error",
          fileName: file.name,
          error: err?.response?.data?.detail || "Upload failed",
        },
      }));
    }
  };

  const allUploaded = DOC_TYPES.every((t) => docState[t].status === "uploaded");

  const handleRun = async () => {
    setIsRunning(true);
    setRunError(null);
    setResult(null);

    try {
      const data = await runReconciliation();

      if (data?.error) {
        setRunError(data.error);
      }

      setResult(data);
    } catch (err) {
      setRunError(err?.response?.data?.detail || "Reconciliation failed. Check the backend logs.");
    } finally {
      setIsRunning(false);
    }
  };

  const stampStatus = result?.error
    ? "error"
    : result?.match_result?.status === "matched"
    ? "matched"
    : result?.match_result?.status === "mismatch"
    ? "mismatch"
    : null;

  return (
    <div className="min-h-screen">
      <Header apiStatus={apiStatus} />

      <main className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        <section>
          <p className="font-mono-tabular text-xs uppercase tracking-[0.2em] text-(--ink-dim)">
            Step 1 — Attach Source Documents
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {DOC_TYPES.map((type) => (
              <DocumentSlot
                key={type}
                documentType={type}
                onUpload={(file) => handleUpload(type, file)}
                status={docState[type].status}
                fileName={docState[type].fileName}
                errorMessage={docState[type].error}
              />
            ))}
          </div>

          <RunBar allUploaded={allUploaded} isRunning={isRunning} onRun={handleRun} error={runError} />
        </section>

        {result && (
          <section className="mt-10">
            <p className="font-mono-tabular text-xs uppercase tracking-[0.2em] text-(--ink-dim)">
              Step 2 — Reconciliation Result
            </p>

            {stampStatus && <StatusStamp status={stampStatus} />}

            {result.error && (
              <div className="rounded-lg border border-(--stamp-red)/50 bg-(--paper-raised) px-5 py-4">
                <p className="font-mono-tabular text-xs uppercase tracking-[0.2em] text-(--stamp-red)">
                  Error
                </p>
                <p className="mt-1 text-(--ink)">{result.error}</p>
              </div>
            )}

            {!result.error && (
              <div className="mt-4 flex flex-col gap-6">
                <SummaryStrip summary={result.summary} />

                <div>
                  <p className="mb-3 font-mono-tabular text-xs uppercase tracking-[0.2em] text-(--ink-dim)">
                    Extracted Document Data
                  </p>
                  <ExtractedDataPanel result={result} />
                </div>

                <div>
                  <p className="mb-3 font-mono-tabular text-xs uppercase tracking-[0.2em] text-(--ink-dim)">
                    Variance Ledger
                  </p>
                  <VarianceLedger variances={result.match_result?.variances} />
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="border-t border-(--rule) px-6 py-6 text-center md:px-10">
        <p className="font-mono-tabular text-xs text-(--ink-dim)">
          Automated Invoice Reconciliation — FastAPI · LangGraph · Gemini
        </p>
      </footer>
    </div>
  );
}
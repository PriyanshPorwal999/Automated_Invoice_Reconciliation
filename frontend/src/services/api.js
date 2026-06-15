import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

/**
 * GET /health
 * Returns: { status: "healthy" }
 */
export const getHealth = async () => {
  const res = await api.get("/health");
  return res.data;
};

/**
 * POST /upload
 * multipart/form-data: files[] + document_type ("invoice" | "po" | "grn")
 * Returns: { message, uploaded_count }
 */
export const uploadDocument = async (file, documentType) => {
  const formData = new FormData();
  formData.append("files", file);
  formData.append("document_type", documentType);

  const res = await api.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

/**
 * POST /reconcile/
 * Returns the full graph state:
 * {
 *   invoice_pdf_path, po_pdf_path, grn_pdf_path,
 *   invoice_json, po_json, grn_json,
 *   match_result: { status: "matched" | "mismatch", variances: [...] },
 *   summary,
 *   error
 * }
 */
export const runReconciliation = async () => {
  const res = await api.post("/reconcile/");
  return res.data;
};

export default api;
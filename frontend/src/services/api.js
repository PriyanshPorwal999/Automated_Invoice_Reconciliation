import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

export const getHealth = () => api.get("/health").then(r => r.data);

/**
 * POST /upload
 * Returns: { message, uploaded_count, uploaded_files: [{ filename, document_type, file_path }] }
 */
export const uploadDocument = (file, documentType) => {
  const fd = new FormData();
  fd.append("files", file);
  fd.append("document_type", documentType);
  return api.post("/upload", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(r => r.data);
};

/**
 * POST /reconcile/
 * Body: { invoice_pdf_path, po_pdf_path, grn_pdf_path }
 * Returns full GraphState
 */
export const runReconciliation = (paths) =>
  api.post("/reconcile/", paths).then(r => r.data);

// ── Mock data for dashboard pages ─────────────────────────────────
export const getMockMetrics = () => ({
  totalInvoices: 1284,
  matched: 1147,
  variances: 89,
  pending: 48,
  matchRate: 89.3,
  totalValue: 2847500,
  avgProcessingTime: "2.4 min",
  savedThisMonth: 184200,
});

export const getMockInvoices = () => [
  { id: "INV-2024-001", vendor: "TechSupplies Ltd", amount: 45200, status: "matched", date: "2024-06-14", po: "PO-8821" },
  { id: "INV-2024-002", vendor: "Office Depot", amount: 12800, status: "variance", date: "2024-06-13", po: "PO-8819" },
  { id: "INV-2024-003", vendor: "Global Freight Co", amount: 89500, status: "pending", date: "2024-06-13", po: "PO-8815" },
  { id: "INV-2024-004", vendor: "CloudServ Inc", amount: 32100, status: "matched", date: "2024-06-12", po: "PO-8810" },
  { id: "INV-2024-005", vendor: "Raw Materials Corp", amount: 156700, status: "variance", date: "2024-06-12", po: "PO-8808" },
  { id: "INV-2024-006", vendor: "Logistics Plus", amount: 28400, status: "matched", date: "2024-06-11", po: "PO-8802" },
];

export const getMockDiscrepancies = () => [
  { id: "VAR-001", invoice: "INV-2024-002", field: "Unit Price", invoiceVal: "₹4,800", poVal: "₹4,500", diff: "+₹300", severity: "medium" },
  { id: "VAR-002", invoice: "INV-2024-005", field: "Quantity", invoiceVal: "145 units", poVal: "140 units", diff: "+5 units", severity: "high" },
  { id: "VAR-003", invoice: "INV-2024-007", field: "Tax", invoiceVal: "18%", poVal: "12%", diff: "+6%", severity: "high" },
  { id: "VAR-004", invoice: "INV-2024-009", field: "Total Amount", invoiceVal: "₹92,400", poVal: "₹91,800", diff: "+₹600", severity: "low" },
];

export const getMockVendors = () => [
  { name: "TechSupplies Ltd", invoices: 142, matchRate: 96.5, totalValue: 842000, status: "excellent" },
  { name: "Office Depot", invoices: 89, matchRate: 78.4, totalValue: 234000, status: "review" },
  { name: "Global Freight Co", invoices: 201, matchRate: 91.2, totalValue: 1240000, status: "good" },
  { name: "CloudServ Inc", invoices: 67, matchRate: 99.1, totalValue: 189000, status: "excellent" },
  { name: "Raw Materials Corp", invoices: 156, matchRate: 72.1, totalValue: 2100000, status: "review" },
];

export const getMockChartData = () => ({
  monthly: [
    { month: "Jan", matched: 142, variance: 18, pending: 12 },
    { month: "Feb", matched: 158, variance: 14, pending: 9 },
    { month: "Mar", matched: 171, variance: 22, pending: 15 },
    { month: "Apr", matched: 165, variance: 11, pending: 8 },
    { month: "May", matched: 189, variance: 16, pending: 11 },
    { month: "Jun", matched: 201, variance: 19, pending: 14 },
  ],
  variance: [
    { name: "Unit Price", value: 38 },
    { name: "Quantity", value: 29 },
    { name: "Tax", value: 18 },
    { name: "Total Amount", value: 15 },
  ],
});

export const getMockAuditLogs = () => [
  { id: 1, action: "Invoice Uploaded", invoice: "INV-2024-006", user: "System", time: "2 min ago", type: "upload" },
  { id: 2, action: "Reconciliation Run", invoice: "INV-2024-006", user: "System", time: "2 min ago", type: "reconcile" },
  { id: 3, action: "Variance Flagged", invoice: "INV-2024-005", user: "System", time: "1 hr ago", type: "flag" },
  { id: 4, action: "Invoice Matched", invoice: "INV-2024-004", user: "System", time: "3 hr ago", type: "match" },
  { id: 5, action: "Manual Review", invoice: "INV-2024-002", user: "Priya S.", time: "5 hr ago", type: "review" },
];

export const getMockAlerts = () => [
  { id: 1, title: "High variance on INV-2024-005", desc: "Quantity mismatch of 5 units (₹42,500)", severity: "high", time: "1 hr ago" },
  { id: 2, title: "Tax rate discrepancy", desc: "INV-2024-007 shows 18% vs PO 12%", severity: "high", time: "2 hr ago" },
  { id: 3, title: "Vendor review needed", desc: "Raw Materials Corp match rate below 75%", severity: "medium", time: "4 hr ago" },
  { id: 4, title: "Pending invoices aging", desc: "3 invoices pending >24 hours", severity: "low", time: "6 hr ago" },
];

export default api;
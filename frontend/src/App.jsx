import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Discrepancies from "./pages/Discrepancies";
import Vendors from "./pages/Vendors";
import Invoices from "./pages/Invoices";
import AuditTrail from "./pages/AuditTrail";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="upload" element={<Upload />} />
          <Route path="discrepancies" element={<Discrepancies />} />
          <Route path="vendors" element={<Vendors />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="audit" element={<AuditTrail />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import UploadAudit from "../pages/UploadAudit";
import AuditLogs from "../pages/AuditLogs";
import EmailHistory from "../component/emails/EmailHistory.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/upload" element={<UploadAudit />} />
        {/* <Route path="/logs" element={<AuditLogs />} /> */}
        <Route path="/emails" element={<EmailHistory />} />
      </Routes>
    </BrowserRouter>
  );
}
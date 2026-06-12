import Sidebar from "../component/layout/sidebar.jsx";
import AuditTable from "../component/logs/AuditTable.jsx";

export default function AuditLogs() {
  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-white">
          Audit Logs
        </h1>

        <p className="text-slate-400 mt-2">
          Complete history of document audits
        </p>

        <div className="mt-8">
          <AuditTable />
        </div>
      </main>
    </div>
  );
}
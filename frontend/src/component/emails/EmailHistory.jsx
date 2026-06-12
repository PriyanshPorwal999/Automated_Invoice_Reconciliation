import Sidebar from "../layout/sidebar.jsx";
import EmailHistoryTable from "../emails/EmailHistoryTable.jsx";

export default function EmailHistory() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-white">
          Email History
        </h1>

        <p className="text-slate-400 mt-2">
          Previously generated vendor communications
        </p>

        <div className="mt-8">
          <EmailHistoryTable />
        </div>
      </main>
    </div>
  );
}
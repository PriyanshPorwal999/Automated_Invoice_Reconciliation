import Sidebar from "../component/layout/sidebar.jsx";
import UploadCard from "../component/upload/uploadCard.jsx";
import AgentProgress from "../component/upload/AgentProgress.jsx";

export default function UploadAudit() {
  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-white text-4xl font-bold">
          Upload & Audit
        </h1>

        <div className="grid grid-cols-2 gap-6 mt-8">
          <UploadCard />

          <AgentProgress />
        </div>
      </main>
    </div>
  );
}
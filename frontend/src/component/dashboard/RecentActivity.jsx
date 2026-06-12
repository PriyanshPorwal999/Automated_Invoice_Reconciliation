export default function RecentActivity({
  logs,
}) {
  return (
    <div className="bg-slate-900 rounded-3xl p-6">
      <h2 className="text-white text-xl mb-4">
        Recent Activity
      </h2>

      {logs.map((log) => (
        <div
          key={log.id}
          className="py-3 border-b border-slate-800"
        >
          <p className="text-white">
            {log.vendor_name}
          </p>

          <p className="text-slate-400 text-sm">
            {log.status}
          </p>
        </div>
      ))}
    </div>
  );
}
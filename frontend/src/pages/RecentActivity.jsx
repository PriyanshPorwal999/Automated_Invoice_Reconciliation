import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
} from "lucide-react";

export default function RecentActivity({ logs = [] }) {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "clean":
        return (
          <CheckCircle className="w-5 h-5 text-green-400" />
        );

      case "defective":
        return (
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
        );

      case "critical":
        return (
          <AlertCircle className="w-5 h-5 text-red-400" />
        );

      default:
        return (
          <AlertTriangle className="w-5 h-5 text-gray-400" />
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "clean":
        return "text-green-400";

      case "defective":
        return "text-yellow-400";

      case "critical":
        return "text-red-400";

      default:
        return "text-slate-400";
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">
          Recent Activity
        </h2>

        <span className="text-sm text-slate-400">
          Latest Audits
        </span>
      </div>

      <div className="space-y-4">
        {logs.length > 0 ? (
          logs.map((log) => (
            <div
              key={log.id}
              className="
                flex
                items-start
                gap-4
                p-4
                rounded-2xl
                bg-slate-800/50
                hover:bg-slate-800
                transition
              "
            >
              <div>
                {getStatusIcon(log.status)}
              </div>

              <div className="flex-1">
                <h3 className="text-white font-medium">
                  {log.vendor_name}
                </h3>

                <p className="text-slate-400 text-sm mt-1">
                  {log.remarks}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <span
                    className={`text-sm font-medium ${getStatusColor(
                      log.status
                    )}`}
                  >
                    {log.status}
                  </span>

                  <span className="text-slate-500 text-sm">
                    Defects: {log.defect_count}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-500">
                {new Date(
                  log.audited_at
                ).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-400">
              No recent activity found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
import { Upload, AlertTriangle, CheckCircle2, Eye, RefreshCw } from "lucide-react";
import SectionHeader from "../components/ui/SectionHeader";
import { getMockAuditLogs } from "../services/api";

const typeIcon = { upload: Upload, flag: AlertTriangle, match: CheckCircle2, review: Eye, reconcile: RefreshCw };
const typeColor = { upload: "text-(--ink-dim)", flag: "text-(--stamp-amber)", match: "text-(--stamp-green)", review: "text-(--stamp-amber)", reconcile: "text-(--stamp-green)" };

export default function AuditTrail() {
  const logs = getMockAuditLogs();
  return (
    <div className="space-y-6">
      <SectionHeader label="System Log" title="Audit Trail" />
      <div className="overflow-hidden rounded-lg border border-(--rule)">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-(--rule) bg-(--paper-raised)">
              {["Type","Action","Invoice","User","Timestamp"].map(h => (
                <th key={h} className="px-4 py-3 font-mono-tabular text-xs uppercase tracking-[0.12em] text-(--ink-dim)">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map(log => {
              const Icon = typeIcon[log.type] || RefreshCw;
              return (
                <tr key={log.id} className="border-b border-(--rule) last:border-0 hover:bg-(--paper-raised)/50 transition-colors">
                  <td className="px-4 py-3"><Icon className={`h-4 w-4 ${typeColor[log.type]}`} /></td>
                  <td className="px-4 py-3 text-xs text-(--ink)">{log.action}</td>
                  <td className="px-4 py-3 font-mono-tabular text-xs text-(--stamp-amber)">{log.invoice}</td>
                  <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink-dim)">{log.user}</td>
                  <td className="px-4 py-3 font-mono-tabular text-xs text-(--ink-dim)">{log.time}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
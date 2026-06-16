import { useState } from "react";
import { Menu, Bell, X, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { getMockAlerts } from "../../services/api";

const severityIcon = { high: AlertTriangle, medium: Info, low: CheckCircle };
const severityColor = {
  high: "text-(--stamp-red)",
  medium: "text-(--stamp-amber)",
  low: "text-(--stamp-green)"
};

export default function AppHeader({ onMenuClick, apiStatus }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [alerts, setAlerts] = useState(getMockAlerts());

  const dismiss = (id) => setAlerts(a => a.filter(x => x.id !== id));

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-(--rule) bg-(--paper)/95 px-4 backdrop-blur md:px-6">
      <button onClick={onMenuClick} className="text-(--ink-dim) md:hidden">
        <Menu className="h-5 w-5" />
      </button>

      <div className="hidden md:block" />

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1.5 rounded-full border border-(--rule) px-3 py-1 font-mono-tabular text-xs text-(--ink-dim) sm:flex">
          <span className={`h-1.5 w-1.5 rounded-full ${
            apiStatus === "healthy" ? "bg-(--stamp-green)" :
            apiStatus === "checking" ? "bg-(--stamp-amber) animate-pulse" :
            "bg-(--stamp-red)"
          }`} />
          API {apiStatus === "healthy" ? "online" : apiStatus === "checking" ? "checking" : "offline"}
        </div>

        <div className="relative">
          <button
            onClick={() => setNotifOpen(o => !o)}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-(--rule) text-(--ink-dim) hover:text-(--ink) transition-colors"
          >
            <Bell className="h-4 w-4" />
            {alerts.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-(--stamp-red) font-mono-tabular text-[9px] text-white">
                {alerts.length}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-10 z-50 w-80 rounded-lg border border-(--rule) bg-(--paper-raised) shadow-xl">
              <div className="flex items-center justify-between border-b border-(--rule) px-4 py-3">
                <p className="font-mono-tabular text-xs uppercase tracking-[0.15em] text-(--ink-dim)">Alerts</p>
                <button onClick={() => setNotifOpen(false)} className="text-(--ink-dim) hover:text-(--ink)">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {alerts.length === 0 ? (
                <p className="px-4 py-6 text-center font-mono-tabular text-xs text-(--ink-dim)">No active alerts</p>
              ) : (
                <div className="max-h-80 overflow-y-auto">
                  {alerts.map(a => {
                    const Icon = severityIcon[a.severity];
                    return (
                      <div key={a.id} className="flex gap-3 border-b border-(--rule) px-4 py-3 last:border-0">
                        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${severityColor[a.severity]}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-(--ink)">{a.title}</p>
                          <p className="mt-0.5 font-mono-tabular text-[10px] text-(--ink-dim)">{a.desc}</p>
                          <p className="mt-0.5 font-mono-tabular text-[10px] text-(--ink-dim)">{a.time}</p>
                        </div>
                        <button onClick={() => dismiss(a.id)} className="shrink-0 text-(--ink-dim) hover:text-(--stamp-red)">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
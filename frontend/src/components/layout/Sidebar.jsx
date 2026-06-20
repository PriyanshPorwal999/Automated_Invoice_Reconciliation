import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Upload, BarChart3, Users,
  ClipboardList, FileText, X, ScrollText
} from "lucide-react";

const links = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/upload", icon: Upload, label: "Upload & Reconcile" },
  { to: "/discrepancies", icon: ClipboardList, label: "Discrepancies" },
  { to: "/vendors", icon: Users, label: "Vendors" },
  { to: "/invoices", icon: FileText, label: "Invoices" },
  { to: "/audit", icon: ScrollText, label: "Audit Trail" },
  { to: "/reports", icon: BarChart3, label: "Reports" },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 bg-black/60 md:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen w-60 flex-col border-r border-(--rule)
        bg-(--paper) flex transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex
      `}>
        <div className="flex items-center justify-between border-b border-(--rule) px-5 py-4">
          <div>
            <p className="font-mono-tabular text-[10px] uppercase tracking-[0.25em] text-(--stamp-amber)">
              Automated
            </p>
            <h1 className="text-base font-semibold text-(--ink)" style={{ fontFamily: "var(--font-display)" }}>
              Invoice Ledger
            </h1>
          </div>
          <button onClick={onClose} className="text-(--ink-dim) md:hidden">
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors
                ${isActive
                  ? "bg-(--paper-raised) text-(--stamp-amber) font-medium"
                  : "text-(--ink-dim) hover:bg-(--paper-raised) hover:text-(--ink)"
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-(--rule) px-5 py-3">
          <p className="font-mono-tabular text-[10px] text-(--ink-dim)">FastAPI · LangGraph · Gemini</p>
        </div>
      </aside>
    </>
  );
}
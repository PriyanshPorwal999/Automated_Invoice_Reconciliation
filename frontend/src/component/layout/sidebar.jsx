import {
  LayoutDashboard,
  Upload,
  FileText,
  Mail,
} from "lucide-react";

import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-slate-900 border-r border-slate-800">
      <div className="p-6">
        <h1 className="text-white text-2xl font-bold">
          Audit AI
        </h1>
      </div>

      <nav className="space-y-2 px-4">
        <NavLink
          to="/"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:bg-slate-800"
        >
          <LayoutDashboard />
          Dashboard
        </NavLink>

        <NavLink
          to="/upload"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:bg-slate-800"
        >
          <Upload />
          Upload Audit
        </NavLink>

        <NavLink
          to="/logs"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:bg-slate-800"
        >
          <FileText />
          Audit Logs
        </NavLink>

        <NavLink
          to="/emails"
          className="flex items-center gap-3 p-3 rounded-xl text-slate-300 hover:bg-slate-800"
        >
          <Mail />
          Email History
        </NavLink>
      </nav>
    </aside>
  );
}
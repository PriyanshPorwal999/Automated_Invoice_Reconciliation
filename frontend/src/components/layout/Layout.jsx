import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";
import { getHealth } from "../../services/api";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState("checking");

  useEffect(() => {
    getHealth()
      .then(d => setApiStatus(d?.status === "healthy" ? "healthy" : "offline"))
      .catch(() => setApiStatus("offline"));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-(--paper)">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader onMenuClick={() => setSidebarOpen(true)} apiStatus={apiStatus} />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
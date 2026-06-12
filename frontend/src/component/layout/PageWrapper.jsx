import Sidebar from "./Sidebar.jsx";
import Navbar from "./Navbar.jsx";

export default function PageWrapper({
  children,
}) {
  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
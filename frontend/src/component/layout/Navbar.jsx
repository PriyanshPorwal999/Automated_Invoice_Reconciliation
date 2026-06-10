import {
  Bell,
  Search,
  UserCircle2,
} from "lucide-react";

export default function Navbar() {
  return (
    <header
      className="
      h-20
      bg-slate-900/80
      backdrop-blur-md
      border-b
      border-slate-800
      px-8
      flex
      items-center
      justify-between
      "
    >
      {/* Left */}
      <div>
        <h1 className="text-white text-xl font-bold">
          Financial Audit AI
        </h1>

        <p className="text-slate-400 text-sm">
          Multi-Agent Financial Compliance Platform
        </p>
      </div>

      {/* Center */}
      <div className="hidden md:flex items-center">
        <div
          className="
          flex
          items-center
          gap-3
          bg-slate-800
          px-4
          py-2
          rounded-xl
          w-80
          "
        >
          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search vendors..."
            className="
            bg-transparent
            outline-none
            text-white
            w-full
            "
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <button
          className="
          relative
          p-2
          rounded-xl
          bg-slate-800
          hover:bg-slate-700
          transition
          "
        >
          <Bell className="text-white" />

          <span
            className="
            absolute
            -top-1
            -right-1
            w-3
            h-3
            bg-red-500
            rounded-full
            "
          />
        </button>

        <div className="flex items-center gap-3">
          <UserCircle2
            size={40}
            className="text-violet-400"
          />

          <div>
            <p className="text-white font-medium">
              Admin
            </p>

            <p className="text-slate-400 text-sm">
              Finance Team
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

import { Bell, Search } from "lucide-react";

function Header() {
  return (
    <header className="flex items-center justify-between mb-8">

      {/* Left Section */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h2>

        <p className="text-slate-500 mt-1">
          Welcome back! Ready to learn something new?
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        <button className="p-3 bg-white rounded-xl border border-slate-200">
          <Search size={20} />
        </button>

        <button className="p-3 bg-white rounded-xl border border-slate-200">
          <Bell size={20} />
        </button>

        <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">
          K
        </div>

      </div>

    </header>
  );
}

export default Header;

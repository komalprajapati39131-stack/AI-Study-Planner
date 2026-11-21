
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  Target,
  ChartNoAxesCombined,
  Settings
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Syllabus Analyzer", icon: BookOpen },
  { name: "Study Planner", icon: Brain },
  { name: "Daily Quiz", icon: Target },
  { name: "Performance", icon: ChartNoAxesCombined },
  { name: "Settings", icon: Settings },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-6 hidden md:block">

      <h1 className="text-xl font-bold text-indigo-600 mb-10">
        AI StudyMate
      </h1>

      <nav className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={item.name}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer ${
                index === 0
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon size={20} />
              {item.name}
            </div>
          );
        })}
      </nav>

    </aside>
  );
}

export default Sidebar;

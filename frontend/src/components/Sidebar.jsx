import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  MessageCircle,
  Brain,
  Map,
  ClipboardCheck,
  BarChart3,
  Target,
} from "lucide-react";

function Sidebar() {
  const links = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "AI Mentor", path: "/chat", icon: MessageCircle },
    { name: "Skill Gap", path: "/skill-gap", icon: Brain },
    { name: "Learning Roadmap", path: "/roadmap", icon: Map },
    { name: "Assessment", path: "/assessment", icon: ClipboardCheck },
    { name: "Results", path: "/results", icon: BarChart3 },
    { name: "Career Readiness", path: "/readiness", icon: Target },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-950 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">
        SkillPath<span className="text-blue-400">-AI</span>
      </h1>

      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  Brain,
  FlaskConical,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "../../lib/auth";
import { brand } from "../../config/brand";

const nav = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/models", icon: Brain, label: "Models" },
  { to: "/experiments", icon: FlaskConical, label: "AI Lab" },
  { to: "/projects", icon: FolderKanban, label: "Projects" },
  { to: "/tasks", icon: CheckSquare, label: "Tasks" },
  { to: "/team", icon: Users, label: "Team" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar({ collapsed, onToggle }) {
  const { user } = useAuth();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-cyan/10 bg-surface/95 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-cyan/10 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan/20 to-purple/20">
          <Sparkles className="text-cyan" size={20} />
        </div>
        {!collapsed && (
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-text">{brand.name}</p>
            <p className="text-[10px] uppercase tracking-widest text-cyan/70">Mission Control</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                isActive
                  ? "bg-cyan/10 text-cyan glow-cyan"
                  : "text-muted hover:bg-cyan/5 hover:text-text"
              )
            }
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-cyan/10 p-3">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 rounded-lg p-2 hover:bg-cyan/5"
        >
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`}
            alt=""
            className="h-9 w-9 rounded-full border border-cyan/20"
          />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted">
                {user?.department || user?.role}
              </p>
            </div>
          )}
        </NavLink>
        <button
          onClick={onToggle}
          className="mt-2 flex w-full items-center justify-center rounded-lg py-2 text-muted hover:bg-cyan/5 hover:text-cyan"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}

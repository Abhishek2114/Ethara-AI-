import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, ChevronDown, ChevronLeft, ChevronRight, LogOut, Search } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { brand } from "../../config/brand";
import { getNavForRole } from "../../config/navigation";
import { RoleBadge } from "../ui/RoleBadge";
import { ActionInbox } from "../inbox/ActionInbox";
import { cn } from "../../lib/utils";

export function TaskTrackLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const nav = getNavForRole(user?.role);
  const [collapsed, setCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen bg-bg">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-surface transition-all duration-200",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
            {brand.shortName}
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight text-text">{brand.name}</span>
          )}
        </div>

        {/* User info */}
        {!collapsed && (
          <div className="border-b border-border px-4 py-3">
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatar}
                alt=""
                className="h-8 w-8 rounded-full bg-elevated object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">{user?.name}</p>
                <RoleBadge role={user?.role} className="mt-0.5" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:bg-elevated hover:text-text"
                )
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && label}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle + sign out */}
        <div className="border-t border-border p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm text-muted transition-colors hover:bg-elevated hover:text-text"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm text-muted transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <LogOut size={16} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-all duration-200",
          collapsed ? "ml-16" : "ml-60"
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-bg/80 px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            {/* Breadcrumb area - empty for now, provides left spacing */}
          </div>
          <div className="flex items-center gap-2">
            <ActionInbox />
            <a
              href="#"
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-elevated hover:text-text"
              onClick={(e) => e.preventDefault()}
            >
              <BookOpen size={15} /> Wiki
            </a>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-elevated"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-xs font-semibold text-accent">
                  {initials}
                </span>
                <span className="text-sm text-text-secondary">{user?.name?.split(" ")[0]}</span>
                <ChevronDown size={14} className="text-muted" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

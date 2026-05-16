import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { BookOpen, ChevronDown, LogOut } from "lucide-react";
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
      <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-border bg-surface">
        <div className="flex items-center gap-2 border-b border-border px-4 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-teal text-sm font-bold text-bg">
            {brand.shortName}
          </div>
          <span className="font-semibold text-text">{brand.name}</span>
        </div>

        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar}
              alt=""
              className="h-10 w-10 rounded-full bg-card object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <RoleBadge role={user?.role} className="mt-1" />
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  isActive
                    ? "border-l-2 border-teal bg-teal/10 text-teal"
                    : "text-muted hover:bg-card hover:text-text"
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 border-t border-border px-4 py-3 text-sm text-muted hover:text-danger"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </aside>

      <div className="ml-56 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-end gap-4 border-b border-border bg-bg/90 px-6 backdrop-blur">
          <ActionInbox />
          <a
            href="#"
            className="flex items-center gap-1.5 text-sm text-muted hover:text-teal"
            onClick={(e) => e.preventDefault()}
          >
            <BookOpen size={16} /> Wiki
          </a>
          <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-card">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal/20 text-xs font-semibold text-teal">
              {initials}
            </span>
            <span className="text-sm">{user?.name?.split(" ")[0]}</span>
            <ChevronDown size={14} className="text-muted" />
          </button>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

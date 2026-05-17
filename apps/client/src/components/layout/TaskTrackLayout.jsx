import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Bell, 
  HelpCircle, 
  BookOpen, 
  LogOut, 
  User, 
  Settings, 
  Briefcase,
  Layers
} from "lucide-react";
import { useAuth } from "../../lib/auth";
import { brand } from "../../config/brand";
import { getNavForRole } from "../../config/navigation";
import { RoleBadge } from "../ui/RoleBadge";
import { ActionInbox } from "../inbox/ActionInbox";
import { cn } from "../../lib/utils";
import AuthLogo from "../ui/AuthLogo";
import { useToast } from "../../hooks/useToast";

export function TaskTrackLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const nav = getNavForRole(user?.role);

  const initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Keyboard shortcut listener for ⌘K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchModal((prev) => !prev);
      }
      if (e.key === "Escape") {
        setShowSearchModal(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Generate dynamic breadcrumbs
  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);
    const breadcrumbMap = {
      dashboard: "Dashboard",
      taskers: "My Taskers",
      "task-review": "Task Review",
      attendance: "Attendance",
      reports: "Reports Panel",
      leave: "Leave Management",
      projects: "Projects and Allocations",
      analytics: "Team Analytics",
    };

    return ["AstralHQ", ...paths.map((p) => breadcrumbMap[p] || p)];
  };

  return (
    <div className="flex min-h-screen bg-bg text-text select-none">
      
      {/* ⌘K Command Palette Dialog */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-border-strong bg-surface p-4 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 border-b border-border pb-3">
              <Search className="text-primary" size={18} />
              <input
                type="text"
                autoFocus
                placeholder="Search resources, users, tasks or operations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white outline-none"
              />
              <span className="text-[10px] bg-card px-2 py-0.5 rounded border border-border text-muted font-mono">
                ESC
              </span>
            </div>

            <div className="space-y-1 max-h-60 overflow-y-auto">
              <span className="block text-[10px] font-bold uppercase text-muted tracking-wider px-2 mb-2">
                Quick Navigation
              </span>
              {nav
                .filter((item) => !searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item) => (
                  <button
                    key={item.to}
                    onClick={() => {
                      navigate(item.to);
                      setShowSearchModal(false);
                    }}
                    className="flex items-center gap-3 w-full rounded-xl px-3 py-2 text-xs font-semibold text-text-secondary hover:bg-card hover:text-white text-left transition-colors"
                  >
                    <item.icon size={14} className="text-primary" />
                    {item.label}
                  </button>
                ))}
            </div>
            
            <div className="border-t border-border pt-3 flex justify-between items-center text-[10px] text-muted">
              <span>Use ↑↓ arrows to navigate, Enter to select</span>
              <span>AstralHQ Command Suite</span>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Left Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border bg-surface transition-all duration-300",
          sidebarCollapsed ? "w-20" : "w-60"
        )}
      >
        {/* Sidebar Header with logo & collapse */}
        <div className="flex items-center justify-between border-b border-border px-4 py-4 min-h-[60px]">
          <div className="flex items-center overflow-hidden">
            <AuthLogo size="sm" iconOnly={sidebarCollapsed} />
          </div>
        </div>

        {/* Workspace Switcher */}
        <div className="px-3 py-3 border-b border-border">
          <div
            onClick={() => toast("Ethara Operations is your default active enterprise workspace.", "info")}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-border bg-card/60 p-2 cursor-pointer hover:border-border-strong transition-all select-none",
              sidebarCollapsed && "justify-center"
            )}
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <Layers size={14} />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1 leading-none">
                <span className="block text-xs font-bold text-white truncate">Ethara Ops</span>
                <span className="block text-[9px] text-muted mt-0.5">Enterprise Suite</span>
              </div>
            )}
          </div>
        </div>

        {/* User Workspace Info bar */}
        {!sidebarCollapsed && (
          <div className="border-b border-border p-4 bg-card/20">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150"}
                alt=""
                className="h-9 w-9 rounded-xl bg-card object-cover border border-border"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white leading-none">{user?.name}</p>
                <RoleBadge role={user?.role} className="mt-1.5" />
              </div>
            </div>
          </div>
        )}

        {/* Collapsible primary nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl py-3 px-3 text-xs font-bold transition-all relative group",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted border border-transparent hover:bg-card hover:text-white"
                )}
            >
              <Icon size={16} className="shrink-0" />
              {!sidebarCollapsed && <span>{label}</span>}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-surface border border-border rounded text-[10px] font-bold text-white opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl">
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer Action controls */}
        <div className="border-t border-border p-3 space-y-1">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="flex items-center justify-center gap-2 w-full rounded-xl py-2 px-3 text-xs font-bold text-muted hover:bg-card hover:text-white transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight size={15} /> : <div className="flex items-center gap-2"><ChevronLeft size={15} /> Collapse</div>}
          </button>
          
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 w-full rounded-xl py-2.5 px-3 text-xs font-bold text-muted hover:text-danger hover:bg-danger/5 transition-all",
              sidebarCollapsed && "justify-center"
            )}
          >
            <LogOut size={15} className="shrink-0" />
            {!sidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Container Area */}
      <div
        className={cn(
          "flex min-h-screen flex-1 flex-col transition-all duration-300",
          sidebarCollapsed ? "ml-20" : "ml-60"
        )}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-[60px] items-center justify-between border-b border-border bg-bg/95 px-6 backdrop-blur">
          {/* Dynamic Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-muted">
            {getBreadcrumbs().map((b, idx, arr) => (
              <span key={idx} className="flex items-center gap-2">
                <span className={idx === arr.length - 1 ? "text-white" : ""}>{b}</span>
                {idx < arr.length - 1 && <span className="text-muted/40 font-normal">/</span>}
              </span>
            ))}
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-4">
            {/* Mock Global Command Palette Input Trigger */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-3 rounded-xl border border-border bg-card/50 hover:bg-card py-1.5 px-3 text-xs text-muted transition-all w-48 hover:border-border-strong text-left"
            >
              <Search size={14} className="text-primary shrink-0" />
              <span>Search...</span>
              <span className="ml-auto text-[9px] font-mono text-muted/60 bg-surface px-1.5 py-0.5 rounded border border-border leading-none">
                ⌘K
              </span>
            </button>

            {/* Custom inbox component */}
            <ActionInbox />

            {/* Wiki Link */}
            <a
              href="#"
              className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors"
              onClick={(e) => { e.preventDefault(); toast("AstralHQ Operations Wiki is currently locked for review.", "info"); }}
            >
              <BookOpen size={14} /> Wiki
            </a>

            {/* User Dropdown */}
            <div className="flex items-center gap-2 border-l border-border pl-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary border border-primary/20">
                {initials}
              </span>
              <span className="text-xs font-bold text-white hidden sm:inline">
                {user?.name?.split(" ")[0]}
              </span>
            </div>
          </div>
        </header>

        {/* 12-column Content Layout Grid */}
        <main className="flex-1 p-6 md:p-8 max-w-[1440px] w-full mx-auto animate-in fade-in duration-300">
          <div className="grid grid-cols-1 gap-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

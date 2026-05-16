import { useEffect } from "react";
import { Search, Bell, LogOut } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { Button } from "../ui/Button";

export function Header({ onOpenPalette }) {
  const { logout } = useAuth();

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenPalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onOpenPalette]);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-cyan/10 bg-bg/80 px-4 backdrop-blur-xl md:px-6">
      <button
        onClick={onOpenPalette}
        className="glass flex flex-1 max-w-md items-center gap-2 rounded-lg px-4 py-2 text-sm text-muted transition hover:border-cyan/20 hover:text-text"
      >
        <Search size={16} />
        <span>Search missions, tasks, projects…</span>
        <kbd className="ml-auto hidden rounded border border-cyan/20 px-1.5 py-0.5 text-xs sm:inline">
          ⌘K
        </kbd>
      </button>
      <div className="flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-muted hover:bg-cyan/5 hover:text-cyan">
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan animate-pulse" />
        </button>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut size={16} />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </header>
  );
}

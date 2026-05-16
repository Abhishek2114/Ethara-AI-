import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, LayoutDashboard, FolderKanban, CheckSquare } from "lucide-react";

const items = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Tasks", to: "/tasks", icon: CheckSquare },
  { label: "Team", to: "/team", icon: CheckSquare },
  { label: "Analytics", to: "/analytics", icon: LayoutDashboard },
  { label: "Settings", to: "/settings", icon: LayoutDashboard },
];

export function CommandPalette({ open, onClose }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  const filtered = items.filter((i) =>
    i.label.toLowerCase().includes(q.toLowerCase())
  );

  const go = (to) => {
    navigate(to);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 glass rounded-xl p-2 glow-cyan"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center gap-2 border-b border-cyan/10 px-3 py-2">
              <Search size={18} className="text-cyan" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type a command…"
                className="flex-1 bg-transparent text-text outline-none"
              />
            </div>
            <ul className="max-h-64 overflow-auto py-1">
              {filtered.map((item) => (
                <li key={item.to}>
                  <button
                    onClick={() => go(item.to)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted hover:bg-cyan/10 hover:text-cyan"
                  >
                    <item.icon size={16} />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

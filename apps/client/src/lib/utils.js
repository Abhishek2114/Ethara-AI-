export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelative(date) {
  const diff = new Date(date) - new Date();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days}d left`;
}

export const STATUS_COLORS = {
  PENDING: "bg-slate-500/20 text-slate-300",
  IN_PROGRESS: "bg-cyan/20 text-cyan",
  COMPLETED: "bg-success/20 text-success",
  BLOCKED: "bg-danger/20 text-danger",
};

export const PRIORITY_COLORS = {
  LOW: "text-muted",
  MEDIUM: "text-cyan",
  HIGH: "text-warning",
  URGENT: "text-danger",
};

export const KANBAN_COLUMNS = [
  { id: "PENDING", title: "Pending", color: "#94A3B8" },
  { id: "IN_PROGRESS", title: "In Progress", color: "#00E5FF" },
  { id: "COMPLETED", title: "Completed", color: "#10B981" },
  { id: "BLOCKED", title: "Blocked", color: "#EF4444" },
];

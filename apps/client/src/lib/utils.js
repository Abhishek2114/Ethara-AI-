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
  PENDING: "bg-elevated text-muted",
  IN_PROGRESS: "bg-accent/10 text-accent",
  COMPLETED: "bg-success/10 text-success",
  BLOCKED: "bg-danger/10 text-danger",
};

export const PRIORITY_COLORS = {
  LOW: "text-muted",
  MEDIUM: "text-accent",
  HIGH: "text-warning",
  URGENT: "text-danger",
};

export const KANBAN_COLUMNS = [
  { id: "PENDING", title: "Pending", color: "#707070" },
  { id: "IN_PROGRESS", title: "In Progress", color: "#0091FF" },
  { id: "COMPLETED", title: "Completed", color: "#30A46C" },
  { id: "BLOCKED", title: "Blocked", color: "#E5484D" },
];

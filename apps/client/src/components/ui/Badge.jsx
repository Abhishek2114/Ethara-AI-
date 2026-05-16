import { cn } from "../../lib/utils";

export function Badge({ children, variant = "default", className }) {
  const variants = {
    default: "bg-cyan/10 text-cyan",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    purple: "bg-purple/10 text-purple",
    muted: "bg-surface text-muted",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

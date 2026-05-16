import { cn } from "../../lib/utils";

export function Input({ label, error, className, ...props }) {
  return (
    <label className="block space-y-1.5">
      {label && <span className="text-sm font-medium text-text-secondary">{label}</span>}
      <input
        className={cn(
          "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text placeholder:text-muted outline-none transition-colors",
          "hover:border-border-hover focus:border-accent focus:ring-1 focus:ring-accent/30",
          error && "border-danger/50 focus:border-danger focus:ring-danger/30",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
}

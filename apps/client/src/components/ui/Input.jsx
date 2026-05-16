import { cn } from "../../lib/utils";

export function Input({ label, error, className, ...props }) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm font-medium text-text/90">{label}</span>}
      <input
        className={cn(
          "w-full rounded-lg border border-cyan/40 bg-surface px-4 py-3 text-text placeholder:text-muted/50 outline-none transition hover:border-cyan/60 focus:border-cyan/80 focus:ring-2 focus:ring-cyan/30",
          error && "border-danger/70",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs font-medium text-danger/90">{error}</span>}
    </label>
  );
}

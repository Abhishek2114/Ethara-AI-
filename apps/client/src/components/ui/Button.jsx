import { cn } from "../../lib/utils";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  loading,
  ...props
}) {
  const variants = {
    primary:
      "bg-accent text-white font-medium hover:bg-accent-hover active:scale-[0.98] disabled:opacity-50",
    secondary:
      "bg-elevated text-text border border-border font-medium hover:bg-card hover:border-border-hover",
    ghost:
      "text-text-secondary hover:text-text hover:bg-elevated",
    danger:
      "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
  };

  const sizes = {
    sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
    md: "h-9 px-4 text-sm gap-2 rounded-lg",
    lg: "h-11 px-5 text-sm gap-2 rounded-lg",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}

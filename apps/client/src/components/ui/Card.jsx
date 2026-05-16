import { cn } from "../../lib/utils";

export function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 transition-colors",
        hover && "hover:border-border-hover hover:bg-elevated",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, trend, color = "accent" }) {
  const colors = {
    accent: "text-accent",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
  };

  const bgColors = {
    accent: "bg-accent/10",
    success: "bg-success/10",
    warning: "bg-warning/10",
    danger: "bg-danger/10",
  };

  return (
    <Card hover>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className={cn("mt-1 text-2xl font-semibold tracking-tight", colors[color])}>{value}</p>
          {trend && <p className="mt-1 text-xs text-text-secondary">{trend}</p>}
        </div>
        {Icon && (
          <div className={cn("rounded-lg p-2", bgColors[color], colors[color])}>
            <Icon size={18} />
          </div>
        )}
      </div>
    </Card>
  );
}

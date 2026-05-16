import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

export function Card({ children, className, hover = false, ...props }) {
  const Comp = hover ? motion.div : "div";
  const motionProps = hover
    ? { whileHover: { y: -2 }, transition: { duration: 0.2 } }
    : {};

  return (
    <Comp
      className={cn("glass rounded-xl p-6 glow-cyan-hover transition-all border border-cyan/10", className)}
      {...motionProps}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function StatCard({ label, value, icon: Icon, trend, color = "cyan" }) {
  const colors = {
    cyan: "text-cyan",
    success: "text-success",
    warning: "text-warning",
    danger: "text-danger",
    purple: "text-purple",
  };
  return (
    <Card hover className="relative overflow-hidden">
      <motion.div
        className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-cyan/5 blur-2xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
      <motion.div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className={cn("mt-1 font-display text-3xl font-bold", colors[color])}>{value}</p>
          {trend && <p className="mt-1 text-xs text-muted">{trend}</p>}
        </div>
        {Icon && (
          <div className={cn("rounded-lg bg-cyan/10 p-2.5", colors[color])}>
            <Icon size={20} />
          </div>
        )}
      </motion.div>
    </Card>
  );
}

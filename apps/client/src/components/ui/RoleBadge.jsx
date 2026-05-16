import { ROLE_BADGE_CLASS, ROLE_LABELS } from "../../config/brand";
import { cn } from "../../lib/utils";

export function RoleBadge({ role, className }) {
  return (
    <span
      className={cn(
        "inline-block rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
        ROLE_BADGE_CLASS[role] || ROLE_BADGE_CLASS.TASKER,
        className
      )}
    >
      {ROLE_LABELS[role] || role}
    </span>
  );
}

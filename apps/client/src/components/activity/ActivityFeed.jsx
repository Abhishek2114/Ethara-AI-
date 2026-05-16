import { Activity, RefreshCw } from "lucide-react";
import { activityApi } from "../../lib/api";
import { usePolling } from "../../hooks/usePolling";
import { useState } from "react";

const TYPE_STYLES = {
  LEAVE_REQUESTED: "text-warning",
  LEAVE_APPROVED: "text-success",
  LEAVE_REJECTED: "text-danger",
  TASK_REVIEWED: "text-accent",
  PROJECT_FLAGGED: "text-warning",
  CHECK_IN: "text-accent",
  WORK_COMPLETED: "text-success",
};

function timeAgo(date) {
  const s = Math.floor((Date.now() - new Date(date)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function ActivityFeed({ limit = 12, compact = false }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    return activityApi
      .list(limit)
      .then((r) => setActivities(r.data.data.activities || []))
      .finally(() => setLoading(false));
  };

  usePolling(load, 25000);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-accent" />
          <h2 className="text-sm font-semibold text-text">Live Activity</h2>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-md p-1 text-muted transition-colors hover:bg-elevated hover:text-text"
          aria-label="Refresh"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      <div className={`divide-y divide-border overflow-y-auto ${compact ? "max-h-64" : "max-h-80"}`}>
        {loading && activities.length === 0 ? (
          <div className="space-y-3 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 animate-pulse rounded-full bg-elevated" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-elevated" />
                  <div className="h-2.5 w-1/2 animate-pulse rounded bg-elevated" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No recent activity</p>
        ) : (
          activities.map((a) => (
            <div key={a.id} className="flex gap-3 px-4 py-3">
              {a.actor?.avatar ? (
                <img src={a.actor.avatar} alt="" className="h-7 w-7 rounded-full bg-elevated" />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-elevated text-xs text-muted">
                  {a.actor?.name?.[0] || "S"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className={`text-sm leading-snug ${TYPE_STYLES[a.type] || "text-text-secondary"}`}>{a.message}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {a.actor?.name || "System"} - {timeAgo(a.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

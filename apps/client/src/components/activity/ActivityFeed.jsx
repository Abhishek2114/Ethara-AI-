import { Activity, RefreshCw } from "lucide-react";
import { activityApi } from "../../lib/api";
import { usePolling } from "../../hooks/usePolling";
import { useState } from "react";

const TYPE_STYLES = {
  LEAVE_REQUESTED: "text-warning",
  LEAVE_APPROVED: "text-success",
  LEAVE_REJECTED: "text-danger",
  TASK_REVIEWED: "text-teal",
  PROJECT_FLAGGED: "text-amber-400",
  CHECK_IN: "text-cyan-400",
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
    <div className={`rounded-xl border border-border bg-card ${compact ? "" : ""}`}>
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-teal" />
          <h2 className="font-semibold">Live Activity</h2>
        </div>
        <button type="button" onClick={load} className="text-muted hover:text-text" aria-label="Refresh">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>
      <div className={`divide-y divide-border overflow-y-auto ${compact ? "max-h-64" : "max-h-80"}`}>
        {loading && activities.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">Loading activity…</p>
        ) : activities.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No recent activity</p>
        ) : (
          activities.map((a) => (
            <div key={a.id} className="flex gap-3 px-4 py-3">
              {a.actor?.avatar ? (
                <img src={a.actor.avatar} alt="" className="h-8 w-8 rounded-full bg-surface" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface text-xs">•</div>
              )}
              <div className="min-w-0 flex-1">
                <p className={`text-sm ${TYPE_STYLES[a.type] || "text-text"}`}>{a.message}</p>
                <p className="text-xs text-muted">
                  {a.actor?.name || "System"} · {timeAgo(a.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

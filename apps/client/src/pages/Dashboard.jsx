import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, CheckCircle2, CalendarOff, FolderKanban, Download, RefreshCw, Plus, Check, X } from "lucide-react";
import { dashboardApi, leaveApi } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useToast } from "../hooks/useToast";
import { ActivityFeed } from "../components/activity/ActivityFeed";
import { usePolling } from "../hooks/usePolling";

const KPI_CONFIG = [
  { key: "myTaskers", label: "My Taskers", icon: Users, color: "border-blue-500" },
  { key: "tasksReviewed", label: "Tasks Reviewed", icon: CheckCircle2, color: "border-green-500" },
  { key: "leaveRequests", label: "Leave Requests", icon: CalendarOff, color: "border-cyan-500" },
  { key: "activeProjects", label: "Active Projects", icon: FolderKanban, color: "border-amber-500" },
];

const MANAGER_ROLES = ["QUALITY_REVIEWER", "PROJECT_LEAD", "ADMIN"];

function StatusBadge({ status }) {
  const map = {
    PRESENT: "bg-success/20 text-success",
    ABSENT: "bg-danger/20 text-danger",
    IDLE: "bg-muted/20 text-muted",
    ON_LEAVE: "bg-warning/20 text-warning",
  };
  return (
    <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${map[status] || map.IDLE}`}>
      {status}
    </span>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isManager = MANAGER_ROLES.includes(user?.role);

  const load = () => {
    setLoading(true);
    dashboardApi.stats().then((r) => setData(r.data.data)).finally(() => setLoading(false));
  };

  usePolling(load, 30000);

  const handleLeave = async (id, status) => {
    try {
      await leaveApi.updateStatus(id, status);
      toast(`Leave ${status.toLowerCase()}`, "success");
      load();
    } catch (e) {
      toast(e.response?.data?.error?.message || "Failed", "error");
    }
  };

  if (loading && !data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-teal border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{data?.title || "Dashboard"}</h1>
          <p className="mt-1 text-sm text-muted">{data?.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted hover:text-text">
            <Download size={16} /> Export
          </button>
          <button type="button" onClick={load} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted hover:text-text">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPI_CONFIG.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className={`rounded-xl border border-border bg-card p-4 border-t-2 ${color}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{label}</p>
              <Icon size={18} className="text-muted" />
            </div>
            <p className="mt-2 text-3xl font-bold">{data?.kpis?.[key] ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="font-semibold">My Taskers</h2>
                <Link to="/taskers" className="text-xs text-teal hover:underline">View all</Link>
              </div>
              <div className="max-h-64 divide-y divide-border overflow-y-auto">
                {(data?.myTaskers || []).map((t) => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                    <img src={t.avatar} alt="" className="h-9 w-9 rounded-full bg-surface" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted">{t.project || "No project"}</p>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="font-semibold">Pending leave</h2>
                <Link to="/leave" className="text-xs text-teal hover:underline">Manage</Link>
              </div>
              {(data?.leaveRequests || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted">
                  <CalendarOff size={28} className="mb-2 opacity-40" />
                  <p className="text-sm">No pending requests</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {data.leaveRequests.map((l) => (
                    <div key={l.id} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{l.user?.name || user?.name}</p>
                          <p className="text-xs text-muted">
                            {new Date(l.startDate).toLocaleDateString()} – {new Date(l.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        {!isManager && (
                          <span className="rounded bg-warning/20 px-2 py-0.5 text-xs text-warning">{l.status}</span>
                        )}
                      </div>
                      {isManager && l.status === "PENDING" && (
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleLeave(l.id, "APPROVED")}
                            className="flex flex-1 items-center justify-center gap-1 rounded bg-success/20 py-1 text-xs text-success"
                          >
                            <Check size={12} /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLeave(l.id, "REJECTED")}
                            className="flex flex-1 items-center justify-center gap-1 rounded bg-danger/20 py-1 text-xs text-danger"
                          >
                            <X size={12} /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Allocated Projects</h2>
              <Link to="/projects" className="flex items-center gap-1 rounded-lg bg-teal px-3 py-1.5 text-sm font-medium text-bg">
                <Plus size={16} /> Request Project
              </Link>
            </div>
            <p className="text-sm text-muted">
              {data?.kpis?.activeProjects ?? 0} live projects ·{" "}
              <Link to="/projects" className="text-teal hover:underline">Open projects grid →</Link>
            </p>
          </div>
        </div>

        <ActivityFeed limit={15} />
      </div>
    </div>
  );
}

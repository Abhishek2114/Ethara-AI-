import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, CheckCircle2, CalendarOff, FolderKanban, Download, RefreshCw, Plus, Check, X, ArrowUpRight } from "lucide-react";
import { dashboardApi, leaveApi } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useToast } from "../hooks/useToast";
import { ActivityFeed } from "../components/activity/ActivityFeed";
import { usePolling } from "../hooks/usePolling";

const KPI_CONFIG = [
  { key: "myTaskers", label: "My Taskers", icon: Users, color: "accent" },
  { key: "tasksReviewed", label: "Tasks Reviewed", icon: CheckCircle2, color: "success" },
  { key: "leaveRequests", label: "Leave Requests", icon: CalendarOff, color: "warning" },
  { key: "activeProjects", label: "Active Projects", icon: FolderKanban, color: "accent" },
];

const COLOR_MAP = {
  accent: { text: "text-accent", bg: "bg-accent/10" },
  success: { text: "text-success", bg: "bg-success/10" },
  warning: { text: "text-warning", bg: "bg-warning/10" },
  danger: { text: "text-danger", bg: "bg-danger/10" },
};

const MANAGER_ROLES = ["QUALITY_REVIEWER", "PROJECT_LEAD", "ADMIN"];

function StatusBadge({ status }) {
  const map = {
    PRESENT: "bg-success/10 text-success",
    ABSENT: "bg-danger/10 text-danger",
    IDLE: "bg-elevated text-muted",
    ON_LEAVE: "bg-warning/10 text-warning",
  };
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${map[status] || map.IDLE}`}>
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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">{data?.title || "Dashboard"}</h1>
          <p className="mt-0.5 text-sm text-muted">{data?.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-elevated hover:text-text"
          >
            <Download size={15} /> Export
          </button>
          <button
            type="button"
            onClick={load}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-elevated hover:text-text"
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPI_CONFIG.map(({ key, label, icon: Icon, color }) => {
          const c = COLOR_MAP[color];
          return (
            <div key={key} className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-border-hover">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted">{label}</p>
                <div className={`rounded-lg p-1.5 ${c.bg}`}>
                  <Icon size={16} className={c.text} />
                </div>
              </div>
              <p className={`mt-3 text-3xl font-semibold tracking-tight ${c.text}`}>
                {data?.kpis?.[key] ?? 0}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            {/* My Taskers panel */}
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="text-sm font-semibold text-text">My Taskers</h2>
                <Link to="/taskers" className="flex items-center gap-1 text-xs text-accent hover:underline">
                  View all <ArrowUpRight size={12} />
                </Link>
              </div>
              <div className="max-h-64 divide-y divide-border overflow-y-auto">
                {(data?.myTaskers || []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center text-muted">
                    <Users size={24} className="mb-2 opacity-40" />
                    <p className="text-sm">No taskers assigned</p>
                  </div>
                ) : (
                  (data?.myTaskers || []).map((t) => (
                    <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                      <img src={t.avatar} alt="" className="h-8 w-8 rounded-full bg-elevated" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-text">{t.name}</p>
                        <p className="truncate text-xs text-muted">{t.project || "No project"}</p>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pending leave panel */}
            <div className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <h2 className="text-sm font-semibold text-text">Pending Leave</h2>
                <Link to="/leave" className="flex items-center gap-1 text-xs text-accent hover:underline">
                  Manage <ArrowUpRight size={12} />
                </Link>
              </div>
              {(data?.leaveRequests || []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted">
                  <CalendarOff size={24} className="mb-2 opacity-40" />
                  <p className="text-sm">No pending requests</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {data.leaveRequests.map((l) => (
                    <div key={l.id} className="px-4 py-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-text">{l.user?.name || user?.name}</p>
                          <p className="text-xs text-muted">
                            {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                          </p>
                        </div>
                        {!isManager && (
                          <span className="rounded-md bg-warning/10 px-2 py-0.5 text-xs font-medium text-warning">{l.status}</span>
                        )}
                      </div>
                      {isManager && l.status === "PENDING" && (
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleLeave(l.id, "APPROVED")}
                            className="flex flex-1 items-center justify-center gap-1 rounded-md bg-success/10 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/20"
                          >
                            <Check size={12} /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleLeave(l.id, "REJECTED")}
                            className="flex flex-1 items-center justify-center gap-1 rounded-md bg-danger/10 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/20"
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

          {/* Allocated Projects */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-text">Allocated Projects</h2>
              <Link
                to="/projects"
                className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
              >
                <Plus size={14} /> Request Project
              </Link>
            </div>
            <p className="mt-3 text-sm text-muted">
              {data?.kpis?.activeProjects ?? 0} live projects{" "}
              <Link to="/projects" className="text-accent hover:underline">
                Open projects grid
              </Link>
            </p>
          </div>
        </div>

        {/* Activity Feed */}
        <ActivityFeed limit={15} />
      </div>
    </div>
  );
}

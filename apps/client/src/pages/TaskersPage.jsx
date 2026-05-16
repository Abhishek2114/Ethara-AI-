import { useEffect, useState } from "react";
import { BarChart3, RefreshCw } from "lucide-react";
import { analyticsApi } from "../lib/api";

function StatusPill({ status }) {
  const cls =
    status === "PRESENT"
      ? "bg-success/10 text-success"
      : status === "ABSENT"
        ? "bg-danger/10 text-danger"
        : "bg-elevated text-muted";
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase ${cls}`}>
      {status}
    </span>
  );
}

export default function TaskersPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    analyticsApi
      .team()
      .then((r) => setData(r.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const s = data?.summary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">My Taskers</h1>
          <p className="mt-0.5 text-sm text-muted">Team performance breakdown</p>
        </div>
        <button
          type="button"
          onClick={load}
          className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-elevated hover:text-text"
        >
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      {/* Analytics card */}
      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-accent" />
            <h2 className="text-sm font-semibold text-text">Team Performance Analytics</h2>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid gap-px border-b border-border sm:grid-cols-4">
          {[
            { label: "Completion Rate", value: `${s?.completionRate ?? 0}%`, color: "text-success" },
            { label: "Avg Quality", value: `${s?.avgQuality ?? 0}%`, color: "text-accent" },
            { label: "Today's Output", value: s?.todayOutput ?? 0, color: "text-accent" },
            { label: "Open Blockers", value: s?.openBlockers ?? 0, color: "text-danger" },
          ].map((item) => (
            <div key={item.label} className="bg-surface/50 p-4 text-center">
              <p className={`text-2xl font-semibold tracking-tight ${item.color}`}>{item.value}</p>
              <p className="mt-1 text-xs text-muted">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted">
                <th className="px-5 py-3 font-medium">Tasker</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Tasks Total</th>
                <th className="px-5 py-3 font-medium">Completed</th>
                <th className="px-5 py-3 font-medium">Today</th>
                <th className="px-5 py-3 font-medium">Quality</th>
                <th className="px-5 py-3 font-medium">AHT</th>
                <th className="px-5 py-3 font-medium">Completion</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-sm text-muted">
                    <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  </td>
                </tr>
              ) : (
                (data?.taskers || []).map((t) => (
                  <tr key={t.id} className="border-b border-border/50 transition-colors hover:bg-elevated/50">
                    <td className="px-5 py-3 font-medium text-text">{t.name}</td>
                    <td className="px-5 py-3">
                      <StatusPill status={t.status} />
                    </td>
                    <td className="px-5 py-3 text-text-secondary">{t.tasksTotal}</td>
                    <td className="px-5 py-3 text-success">{t.completed}</td>
                    <td className="px-5 py-3 text-text-secondary">{t.today}</td>
                    <td className="px-5 py-3 text-text-secondary">{t.quality != null ? `${t.quality}%` : "-"}</td>
                    <td className="px-5 py-3 text-text-secondary">{t.aht != null ? `${t.aht}m` : "-"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-elevated">
                          <div
                            className="h-full rounded-full bg-success transition-all"
                            style={{ width: `${t.completion}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted">{t.completion}%</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

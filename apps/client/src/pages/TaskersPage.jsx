import { useEffect, useState } from "react";
import { BarChart3, RefreshCw } from "lucide-react";
import { analyticsApi } from "../lib/api";

function StatusPill({ status }) {
  const cls = status === "PRESENT" ? "bg-success/20 text-success" : status === "ABSENT" ? "bg-danger/20 text-danger" : "bg-muted/20 text-muted";
  return <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${cls}`}>{status}</span>;
}

export default function TaskersPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const load = () => { setLoading(true); analyticsApi.team().then((r) => setData(r.data.data)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const s = data?.summary;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">My Taskers</h1><p className="text-sm text-muted">Team performance breakdown</p></div>
        <button type="button" onClick={load} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"><RefreshCw size={16} /> Refresh</button>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-4 flex items-center gap-2"><BarChart3 size={18} className="text-teal" /><h2 className="font-semibold">Team Performance Analytics</h2></div>
        <div className="mb-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-surface p-4 text-center"><p className="text-3xl font-bold text-success">{s?.completionRate ?? 0}%</p><p className="text-xs text-muted">Completion Rate</p></div>
          <div className="rounded-lg bg-surface p-4 text-center"><p className="text-3xl font-bold text-cyan-400">{s?.avgQuality ?? 0}%</p><p className="text-xs text-muted">Avg Quality</p></div>
          <div className="rounded-lg bg-surface p-4 text-center"><p className="text-3xl font-bold text-cyan-400">{s?.todayOutput ?? 0}</p><p className="text-xs text-muted">Today&apos;s Output</p></div>
          <div className="rounded-lg bg-surface p-4 text-center"><p className="text-3xl font-bold text-danger">{s?.openBlockers ?? 0}</p><p className="text-xs text-muted">Open Blockers</p></div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead><tr className="border-b border-border text-xs uppercase text-muted">
              <th className="pb-3 pr-4">Tasker</th><th className="pb-3 pr-4">Status</th><th className="pb-3 pr-4">Tasks Total</th>
              <th className="pb-3 pr-4">Completed</th><th className="pb-3 pr-4">Today</th><th className="pb-3 pr-4">Quality</th><th className="pb-3 pr-4">AHT</th><th className="pb-3">Completion</th>
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={8} className="py-8 text-center text-muted">Loading…</td></tr> : (data?.taskers || []).map((t) => (
                <tr key={t.id} className="border-b border-border/50">
                  <td className="py-3 pr-4 font-medium">{t.name}</td>
                  <td className="py-3 pr-4"><StatusPill status={t.status} /></td>
                  <td className="py-3 pr-4">{t.tasksTotal}</td>
                  <td className="py-3 pr-4 text-success">{t.completed}</td>
                  <td className="py-3 pr-4">{t.today}</td>
                  <td className="py-3 pr-4">{t.quality != null ? `${t.quality}%` : "—"}</td>
                  <td className="py-3 pr-4">{t.aht != null ? `${t.aht}m` : "—"}</td>
                  <td className="py-3"><div className="flex items-center gap-2"><div className="h-2 w-24 overflow-hidden rounded-full bg-surface"><div className="h-full bg-success" style={{ width: `${t.completion}%` }} /></div><span className="text-xs text-muted">{t.completion}%</span></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

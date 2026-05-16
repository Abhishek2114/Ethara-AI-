import { useEffect, useState } from "react";
import { CalendarOff, Plus, RefreshCw, FileText, Check, X } from "lucide-react";
import { leaveApi } from "../lib/api";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../lib/auth";

const TABS = ["ALL", "PENDING", "APPROVED", "REJECTED"];
const MANAGER_ROLES = ["QUALITY_REVIEWER", "PROJECT_LEAD", "ADMIN"];

export default function LeavePage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("ALL");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ startDate: "", endDate: "", reason: "" });
  const { toast } = useToast();
  const isManager = MANAGER_ROLES.includes(user?.role);

  const load = () => {
    setLoading(true);
    leaveApi
      .list({ status, startDate: start || undefined, endDate: end || undefined })
      .then((r) => setItems(r.data.data.leaves || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [status, start, end]);

  const apply = async (e) => {
    e.preventDefault();
    try {
      await leaveApi.create(form);
      toast("Leave submitted", "success");
      setShowForm(false);
      load();
    } catch (err) {
      toast(err.response?.data?.error?.message || "Failed", "error");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await leaveApi.updateStatus(id, newStatus);
      toast(`Leave ${newStatus.toLowerCase()}`, "success");
      load();
    } catch (err) {
      toast(err.response?.data?.error?.message || "Failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <p className="text-sm text-muted">
            {isManager ? "Approve team leave & track capacity" : "Apply & manage your leaves"}
          </p>
        </div>
        <div className="flex gap-2">
          {user?.role === "TASKER" && (
            <button type="button" onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-bg">
              <Plus size={16} /> Apply Leave
            </button>
          )}
          <button type="button" onClick={load} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={apply} className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-3">
          <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm" required />
          <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="rounded-lg border border-border bg-surface px-3 py-2 text-sm" required />
          <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} placeholder="Reason" className="rounded-lg border border-border bg-surface px-3 py-2 text-sm" />
          <button type="submit" className="rounded-lg bg-teal py-2 text-sm font-medium text-bg sm:col-span-3">Submit</button>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t} type="button" onClick={() => setStatus(t)} className={`rounded-full px-4 py-1.5 text-xs font-medium ${status === t ? "bg-teal text-bg" : "border border-border text-muted"}`}>{t}</button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm">
        <CalendarOff size={16} className="text-muted" />
        <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="rounded border border-border bg-surface px-2 py-1" />
        <span className="text-muted">to</span>
        <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="rounded border border-border bg-surface px-2 py-1" />
        <span className="ml-auto text-muted">{items.length} results</span>
      </div>

      {loading ? (
        <p className="text-center text-muted">Loading…</p>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-border bg-card py-16 text-muted">
          <FileText size={40} className="mb-3 opacity-40" />
          <p>No leave requests found for this filter</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((l) => (
            <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
              <div className="flex items-center gap-3">
                {l.user?.avatar && <img src={l.user.avatar} alt="" className="h-9 w-9 rounded-full" />}
                <div>
                  <p className="font-medium">{l.user?.name}</p>
                  <p className="text-xs text-muted">
                    {new Date(l.startDate).toLocaleDateString()} – {new Date(l.endDate).toLocaleDateString()}
                    {l.reason && ` · ${l.reason}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded px-2 py-0.5 text-xs font-bold ${l.status === "APPROVED" ? "bg-success/20 text-success" : l.status === "REJECTED" ? "bg-danger/20 text-danger" : "bg-warning/20 text-warning"}`}>{l.status}</span>
                {isManager && l.status === "PENDING" && (
                  <>
                    <button type="button" onClick={() => updateStatus(l.id, "APPROVED")} className="flex items-center gap-1 rounded-lg bg-success/20 px-3 py-1.5 text-xs text-success hover:bg-success/30">
                      <Check size={14} /> Approve
                    </button>
                    <button type="button" onClick={() => updateStatus(l.id, "REJECTED")} className="flex items-center gap-1 rounded-lg bg-danger/20 px-3 py-1.5 text-xs text-danger hover:bg-danger/30">
                      <X size={14} /> Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

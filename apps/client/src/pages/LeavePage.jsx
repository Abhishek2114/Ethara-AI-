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

  useEffect(() => {
    load();
  }, [status, start, end]);

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

  const inputClass =
    "rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition-colors hover:border-border-hover focus:border-accent focus:ring-1 focus:ring-accent/30";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Leave Management</h1>
          <p className="mt-0.5 text-sm text-muted">
            {isManager ? "Approve team leave & track capacity" : "Apply & manage your leaves"}
          </p>
        </div>
        <div className="flex gap-2">
          {user?.role === "TASKER" && (
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              <Plus size={15} /> Apply Leave
            </button>
          )}
          <button
            type="button"
            onClick={load}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-secondary transition-colors hover:bg-elevated hover:text-text"
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
      </div>

      {/* Leave form */}
      {showForm && (
        <form onSubmit={apply} className="rounded-xl border border-border bg-card p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className={inputClass}
              required
            />
            <input
              type="date"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className={inputClass}
              required
            />
            <input
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              placeholder="Reason"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="mt-3 w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover sm:w-auto sm:px-6"
          >
            Submit
          </button>
        </form>
      )}

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setStatus(t)}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-colors ${
              status === t
                ? "bg-accent text-white"
                : "border border-border text-muted hover:border-border-hover hover:text-text-secondary"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Date range filter */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm">
        <CalendarOff size={15} className="text-muted" />
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-text outline-none transition-colors focus:border-accent"
        />
        <span className="text-muted">to</span>
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-text outline-none transition-colors focus:border-accent"
        />
        <span className="ml-auto text-xs text-muted">{items.length} results</span>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-elevated" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-border bg-card py-16 text-muted">
          <FileText size={36} className="mb-3 opacity-40" />
          <p className="text-sm">No leave requests found for this filter</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((l) => (
            <div
              key={l.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 transition-colors hover:border-border-hover"
            >
              <div className="flex items-center gap-3">
                {l.user?.avatar && (
                  <img src={l.user.avatar} alt="" className="h-8 w-8 rounded-full bg-elevated" />
                )}
                <div>
                  <p className="text-sm font-medium text-text">{l.user?.name}</p>
                  <p className="text-xs text-muted">
                    {new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}
                    {l.reason && ` - ${l.reason}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                    l.status === "APPROVED"
                      ? "bg-success/10 text-success"
                      : l.status === "REJECTED"
                        ? "bg-danger/10 text-danger"
                        : "bg-warning/10 text-warning"
                  }`}
                >
                  {l.status}
                </span>
                {isManager && l.status === "PENDING" && (
                  <>
                    <button
                      type="button"
                      onClick={() => updateStatus(l.id, "APPROVED")}
                      className="flex items-center gap-1 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-medium text-success transition-colors hover:bg-success/20"
                    >
                      <Check size={13} /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => updateStatus(l.id, "REJECTED")}
                      className="flex items-center gap-1 rounded-lg bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/20"
                    >
                      <X size={13} /> Reject
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

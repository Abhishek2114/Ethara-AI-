import { useEffect, useState } from "react";
import { CalendarCheck, LogIn, RefreshCw } from "lucide-react";
import { attendanceApi } from "../lib/api";
import { useToast } from "../hooks/useToast";

function StatusBadge({ status }) {
  const map = {
    PRESENT: "bg-success/10 text-success",
    ABSENT: "bg-danger/10 text-danger",
    LATE: "bg-warning/10 text-warning",
  };
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${map[status] || "bg-elevated text-muted"}`}>
      {status}
    </span>
  );
}

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    attendanceApi
      .list()
      .then((r) => setRecords(r.data.data.records || r.data.data.attendance || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const checkIn = async () => {
    try {
      await attendanceApi.checkIn();
      toast("Checked in", "success");
      load();
    } catch (e) {
      toast(e.response?.data?.error?.message || "Failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Attendance</h1>
          <p className="mt-0.5 text-sm text-muted">Daily check-in & team attendance</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={checkIn}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <LogIn size={15} /> Check In
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

      {/* Content */}
      {loading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-elevated" />
          ))}
        </div>
      ) : records.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-border bg-card py-16 text-muted">
          <CalendarCheck size={36} className="mb-3 opacity-40" />
          <p className="text-sm">No attendance records yet</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-xs uppercase tracking-wider text-muted">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Check In</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id} className="border-b border-border/50 transition-colors hover:bg-elevated/50">
                  <td className="px-5 py-3 text-text">{new Date(r.date).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="px-5 py-3 text-text-secondary">
                    {r.checkInAt ? new Date(r.checkInAt).toLocaleTimeString() : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

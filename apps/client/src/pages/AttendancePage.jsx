import { useEffect, useState } from "react";
import { CalendarCheck, LogIn, RefreshCw } from "lucide-react";
import { attendanceApi } from "../lib/api";
import { useToast } from "../hooks/useToast";

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const load = () => { setLoading(true); attendanceApi.list().then((r) => setRecords(r.data.data.records || r.data.data.attendance || [])).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);
  const checkIn = async () => {
    try { await attendanceApi.checkIn(); toast("Checked in", "success"); load(); } catch (e) { toast(e.response?.data?.error?.message || "Failed", "error"); }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">Attendance</h1><p className="text-sm text-muted">Daily check-in & team attendance</p></div>
        <div className="flex gap-2">
          <button type="button" onClick={checkIn} className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-bg"><LogIn size={16} /> Check In</button>
          <button type="button" onClick={load} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"><RefreshCw size={16} /> Refresh</button>
        </div>
      </div>
      {loading ? <p className="text-muted">Loading…</p> : records.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-border bg-card py-16 text-muted"><CalendarCheck size={40} className="mb-2 opacity-40" /><p>No attendance records yet</p></div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm"><thead><tr className="border-b border-border bg-card text-left text-xs uppercase text-muted"><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Check In</th></tr></thead>
          <tbody>{records.map((r) => (<tr key={r.id} className="border-b border-border/50"><td className="px-4 py-3">{new Date(r.date).toLocaleDateString()}</td><td className="px-4 py-3">{r.status}</td><td className="px-4 py-3">{r.checkInAt ? new Date(r.checkInAt).toLocaleTimeString() : "—"}</td></tr>))}</tbody></table>
        </div>
      )}
    </div>
  );
}

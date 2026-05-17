import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  LogIn,
  LogOut,
  RefreshCw,
  TrendingUp,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Coffee,
  ArrowRight
} from "lucide-react";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useToast } from "../../hooks/useToast";
import { format } from "date-fns";

export default function AttendanceDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [todayRecord, setTodayRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const timerRef = useRef(null);

  // Load dashboard data
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch 7-day history (which will contain today's record too if initialized)
      const res = await api.get("/attendance/history?days=7");
      const historyData = res.data.data?.history || res.data.history || [];
      setHistory(historyData);

      // 2. Identify today's record
      const todayStr = format(new Date(), "yyyy-MM-dd");
      const todayRec = historyData.find(
        (r) => format(new Date(r.date), "yyyy-MM-dd") === todayStr
      );

      setTodayRecord(todayRec || null);
    } catch (e) {
      console.error("Failed to load attendance details:", e);
      toast("Failed to load attendance records", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Update real-time duration clock when checked in
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (todayRecord && todayRecord.checkIn && !todayRecord.checkOut) {
      const startTime = new Date(todayRecord.checkIn).getTime();

      const updateClock = () => {
        const now = new Date().getTime();
        const diffMs = now - startTime;

        if (diffMs < 0) {
          setElapsedTime("00:00:00");
          return;
        }

        const secs = Math.floor((diffMs / 1000) % 60);
        const mins = Math.floor((diffMs / (1000 * 60)) % 60);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));

        const formatNum = (n) => String(n).padStart(2, "0");
        setElapsedTime(`${formatNum(hours)}:${formatNum(mins)}:${formatNum(secs)}`);
      };

      updateClock();
      timerRef.current = setInterval(updateClock, 1000);
    } else if (todayRecord && todayRecord.checkIn && todayRecord.checkOut) {
      // Checked out - show total completed duration
      const startTime = new Date(todayRecord.checkIn).getTime();
      const endTime = new Date(todayRecord.checkOut).getTime();
      const diffMs = endTime - startTime;

      if (diffMs > 0) {
        const secs = Math.floor((diffMs / 1000) % 60);
        const mins = Math.floor((diffMs / (1000 * 60)) % 60);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const formatNum = (n) => String(n).padStart(2, "0");
        setElapsedTime(`${formatNum(hours)}:${formatNum(mins)}:${formatNum(secs)}`);
      } else {
        setElapsedTime("00:00:00");
      }
    } else {
      setElapsedTime("00:00:00");
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [todayRecord]);

  // Handle Check-In
  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const res = await api.post("/attendance/check-in");
      toast("Checked in successfully!", "success");
      loadData();
    } catch (e) {
      const msg = e.response?.data?.error?.message || e.response?.data?.message || "Failed to check in";
      toast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Check-Out
  const handleCheckOut = async () => {
    setActionLoading(true);
    try {
      const res = await api.post("/attendance/check-out");
      toast("Checked out successfully!", "success");
      loadData();
    } catch (e) {
      const msg = e.response?.data?.error?.message || e.response?.data?.message || "Failed to check out";
      toast(msg, "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Status Styling Utilities
  const getStatusDetails = (status) => {
    switch (status) {
      case "PRESENT":
        return {
          label: "Present",
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
          dot: "bg-emerald-400",
          icon: CheckCircle2
        };
      case "ON_LEAVE":
        return {
          label: "On Leave",
          color: "text-sky-400 bg-sky-500/10 border-sky-500/30",
          dot: "bg-sky-400",
          icon: Coffee
        };
      case "IDLE":
        return {
          label: "Idle / Unchecked Out",
          color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
          dot: "bg-amber-400",
          icon: AlertCircle
        };
      case "ABSENT":
      default:
        return {
          label: "Absent",
          color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
          dot: "bg-rose-400",
          icon: AlertCircle
        };
    }
  };

  return (
    <div className="space-y-6 text-text">
      {/* Upper header action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Attendance Control</h1>
          <p className="text-sm text-muted">Real-time check-in, tracking, and daily summaries</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-card hover:text-white transition-colors"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-teal" : ""} />
            Refresh
          </button>
          <button
            onClick={() => navigate("/attendance/reports")}
            className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-bg hover:brightness-110 active:scale-98 transition-all"
          >
            Reports Panel <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & Action Box */}
        <div className="lg:col-span-2 space-y-6">
          {/* Greeting Box */}
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card/80 to-surface/40 p-6 shadow-xl">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-teal/10 blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150"}
                alt=""
                className="h-20 w-20 rounded-2xl object-cover border-2 border-border"
              />
              <div className="flex-1 space-y-1">
                <span className="text-xs uppercase font-semibold text-teal tracking-wider">Mission Command Control</span>
                <h2 className="text-2xl font-bold text-white">Welcome back, {user?.name}!</h2>
                <p className="text-sm text-muted">
                  Keep track of your active work session today. Make sure to check out at the end of your shift.
                </p>
              </div>
            </div>
          </div>

          {/* Real-time interactive actions console */}
          <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Briefcase className="text-teal" size={18} /> Daily Action Center
            </h3>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="animate-spin text-teal" size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Status Indicator & Clock */}
                <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-border bg-surface/30">
                  <span className="text-xs text-muted uppercase tracking-wider mb-2">Today's Session Duration</span>
                  <div className="text-4xl font-mono font-bold text-white tracking-widest flex items-center gap-1">
                    {elapsedTime}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    {todayRecord?.checkIn && !todayRecord?.checkOut ? (
                      <>
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs text-emerald-400 font-medium">Session in progress...</span>
                      </>
                    ) : todayRecord?.checkOut ? (
                      <span className="text-xs text-teal font-medium">Session completed today</span>
                    ) : (
                      <span className="text-xs text-muted">No active session started</span>
                    )}
                  </div>
                </div>

                {/* Main Action buttons */}
                <div className="flex flex-col gap-3 justify-center">
                  {!todayRecord?.checkIn ? (
                    /* Not checked in yet */
                    <button
                      onClick={handleCheckIn}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-3 w-full rounded-xl bg-teal py-4 px-6 text-bg font-bold hover:brightness-110 active:scale-98 transition-all disabled:opacity-50"
                    >
                      <LogIn size={20} />
                      Start Work (Check-In)
                    </button>
                  ) : !todayRecord?.checkOut ? (
                    /* Checked in, not checked out */
                    <button
                      onClick={handleCheckOut}
                      disabled={actionLoading}
                      className="flex items-center justify-center gap-3 w-full rounded-xl bg-rose-500 py-4 px-6 text-white font-bold hover:bg-rose-600 active:scale-98 transition-all disabled:opacity-50"
                    >
                      <LogOut size={20} />
                      End Work (Check-Out)
                    </button>
                  ) : (
                    /* Checked out */
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-teal/20 bg-teal/5 text-teal text-center">
                      <CheckCircle2 size={32} className="mb-2" />
                      <span className="font-semibold text-sm">Checked out successfully!</span>
                      <span className="text-xs text-muted mt-1">See you tomorrow morning.</span>
                    </div>
                  )}

                  <p className="text-center text-xs text-muted mt-2">
                    Logs and events are securely audited under compliance standards.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Today's Stats & Summary Card */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-xl h-full flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Clock className="text-teal" size={18} /> Today's Details
              </h3>

              {loading ? (
                <div className="flex justify-center items-center py-6">
                  <RefreshCw className="animate-spin text-teal" size={24} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-sm text-muted">Status</span>
                    {todayRecord ? (
                      (() => {
                        const style = getStatusDetails(todayRecord.status);
                        const Icon = style.icon;
                        return (
                          <span
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${style.color}`}
                          >
                            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                            <Icon size={12} />
                            {style.label}
                          </span>
                        );
                      })()
                    ) : (
                      <span className="text-xs px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 font-semibold">
                        Absent (Unrecorded)
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-sm text-muted">Check-In Time</span>
                    <span className="text-sm font-semibold text-white font-mono">
                      {todayRecord?.checkIn ? format(new Date(todayRecord.checkIn), "hh:mm:ss a") : "—"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-border/50">
                    <span className="text-sm text-muted">Check-Out Time</span>
                    <span className="text-sm font-semibold text-white font-mono">
                      {todayRecord?.checkOut ? format(new Date(todayRecord.checkOut), "hh:mm:ss a") : "—"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-muted">Date</span>
                    <span className="text-sm font-semibold text-white">
                      {format(new Date(), "EEEE, MMM dd")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 rounded-xl border border-border bg-surface/40 p-4 flex items-center gap-3">
              <TrendingUp className="text-teal shrink-0" size={20} />
              <div className="min-w-0">
                <span className="block text-xs text-muted uppercase tracking-wider">Weekly Metric</span>
                <span className="block text-sm font-medium text-white truncate">
                  View full analytics in Reports page.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7-day visual history layout */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="text-teal" size={18} /> Last 7 Days Overview
        </h3>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="animate-spin text-teal" size={32} />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted border border-border border-dashed rounded-xl">
            <Calendar size={36} className="opacity-30 mb-2" />
            <p className="text-sm">No recent attendance history records found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {history.map((record) => {
              const statusDetails = getStatusDetails(record.status);
              const isToday = format(new Date(record.date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

              // Calculate worked duration for history items
              let durationStr = "—";
              if (record.checkIn && record.checkOut) {
                const diffMs = new Date(record.checkOut).getTime() - new Date(record.checkIn).getTime();
                if (diffMs > 0) {
                  const hours = (diffMs / 3600000).toFixed(1);
                  durationStr = `${hours}h`;
                }
              }

              return (
                <div
                  key={record.id}
                  className={`flex flex-col justify-between p-4 rounded-xl border transition-all ${
                    isToday
                      ? "bg-teal/5 border-teal/40 ring-1 ring-teal/30"
                      : "bg-surface/30 border-border/80 hover:border-border"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="block text-xs text-muted">
                      {format(new Date(record.date), "EEE")}
                    </span>
                    <span className="block text-sm font-bold text-white">
                      {format(new Date(record.date), "MMM dd")}
                    </span>
                    {isToday && (
                      <span className="inline-block text-[10px] uppercase font-bold text-teal bg-teal/10 px-1.5 py-0.5 rounded border border-teal/20">
                        Today
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusDetails.color}`}
                    >
                      <span className={`h-1 w-1 rounded-full ${statusDetails.dot}`} />
                      {statusDetails.label.split(" ")[0]}
                    </span>

                    <div className="flex justify-between items-center text-[11px] text-muted pt-1">
                      <span>Worked:</span>
                      <span className="font-semibold text-white">{durationStr}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

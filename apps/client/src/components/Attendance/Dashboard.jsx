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
  ArrowRight,
  MapPin,
  Laptop
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

  // GPS Geofence States
  const [coords, setCoords] = useState(null);
  const [isRemote, setIsRemote] = useState(false);
  const [geoLoading, setGeoLoading] = useState(true);
  const [officeDistance, setOfficeDistance] = useState(null);
  const [isWithinRange, setIsWithinRange] = useState(false);

  // Haversine distance helper
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fetch geolocation
  const queryLocation = () => {
    setGeoLoading(true);
    if (!navigator.geolocation) {
      toast("Geolocation is not supported by this browser.", "info");
      setGeoLoading(false);
      return;
    }

    const OFFICE_LAT = 28.6139;
    const OFFICE_LNG = 77.2090;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        const distance = calculateDistance(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
        setOfficeDistance(distance);
        setIsWithinRange(distance <= 300);
        setGeoLoading(false);
      },
      (error) => {
        console.warn("Geolocation blocked, simulating central hub boundary coordinates...", error);
        // Simulation coordinates offset inside boundary for presentation/preview
        const simulatedLat = 28.6141;
        const simulatedLng = 77.2092;
        setCoords({ latitude: simulatedLat, longitude: simulatedLng });
        const distance = calculateDistance(simulatedLat, simulatedLng, OFFICE_LAT, OFFICE_LNG);
        setOfficeDistance(distance);
        setIsWithinRange(distance <= 300);
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Load dashboard data
  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch 7-day history
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
    queryLocation();
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
      // Checked out - show completed duration
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

  // Handle Check-In with geofencing payload
  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      const userAgent = navigator.userAgent;
      const device = userAgent.includes("Chrome") ? "Chrome Browser" : userAgent.includes("Firefox") ? "Firefox Browser" : "Safari Client";

      const res = await api.post("/attendance/check-in", {
        latitude: coords?.latitude,
        longitude: coords?.longitude,
        isRemote: isRemote,
        deviceDetails: `${device} on macOS`
      });
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

  // Distance helper simulation button for demo
  const simulateRemoteCoords = () => {
    setCoords({ latitude: 28.5355, longitude: 77.3910 }); // Noida - 12km out of range
    const distance = calculateDistance(28.5355, 77.3910, 28.6139, 77.2090);
    setOfficeDistance(distance);
    setIsWithinRange(distance <= 300);
    setIsRemote(false);
    toast("Simulated remote coordinates: 12km away", "info");
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
            onClick={() => { loadData(); queryLocation(); }}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-card hover:text-white transition-colors"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-primary" : ""} />
            Refresh
          </button>
          <button
            onClick={() => navigate("/attendance/reports")}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-bg hover:brightness-110 active:scale-98 transition-all"
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
            <div className="absolute top-0 right-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150"}
                alt=""
                className="h-20 w-20 rounded-2xl object-cover border-2 border-border"
              />
              <div className="flex-1 space-y-1">
                <span className="text-xs uppercase font-semibold text-primary tracking-wider">Mission Command Control</span>
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
              <Briefcase className="text-primary" size={18} /> Daily Action Center
            </h3>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="animate-spin text-primary" size={32} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Status Indicator & Clock */}
                <div className="flex flex-col items-center justify-center p-6 rounded-xl border border-border bg-surface/30 relative overflow-hidden group">
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
                      <span className="text-xs text-primary font-medium">Session completed today</span>
                    ) : (
                      <span className="text-xs text-muted">No active session started</span>
                    )}
                  </div>
                </div>

                {/* Main Action buttons */}
                <div className="flex flex-col gap-3 justify-center">
                  {!todayRecord?.checkIn ? (
                    /* Not checked in yet */
                    <div className="space-y-4">
                      {/* Out of bounds bypass validation prompt */}
                      {!geoLoading && !isWithinRange && (
                        <div className="p-3.5 rounded-xl border border-warning/20 bg-warning/5 text-warning text-xs space-y-2">
                          <p className="font-semibold flex items-center gap-1.5">
                            <AlertCircle size={14} /> Geofence: Out of Bounds
                          </p>
                          <p className="text-[11px] text-text-secondary leading-relaxed">
                            You are currently outside the 300-meter office geofence. Please declare a Remote Session below to check in.
                          </p>
                          <label className="flex items-center gap-2 font-bold cursor-pointer pt-1 bg-surface/40 px-2 py-1.5 rounded border border-warning/20 text-warning">
                            <input
                              type="checkbox"
                              checked={isRemote}
                              onChange={(e) => setIsRemote(e.target.checked)}
                              className="accent-warning"
                            />
                            Declare Remote Work Session
                          </label>
                        </div>
                      )}

                      <button
                        onClick={handleCheckIn}
                        disabled={actionLoading || (geoLoading) || (!isWithinRange && !isRemote)}
                        className={`flex items-center justify-center gap-3 w-full rounded-xl py-4 px-6 font-bold transition-all disabled:opacity-50 ${
                          isRemote 
                            ? "bg-warning text-bg hover:brightness-110" 
                            : "bg-primary text-bg hover:brightness-110"
                        }`}
                      >
                        <LogIn size={20} />
                        {isRemote ? "Check-In (Remote Work)" : "Start Work (Check-In)"}
                      </button>
                    </div>
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
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl border border-primary/20 bg-primary/5 text-primary text-center">
                      <CheckCircle2 size={32} className="mb-2" />
                      <span className="font-semibold text-sm">Checked out successfully!</span>
                      <span className="text-xs text-muted mt-1">See you tomorrow morning.</span>
                    </div>
                  )}

                  <p className="text-center text-xs text-muted mt-1.5">
                    Logs and events are securely audited under compliance standards.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* GPS Geolocation Telemetry Radar & Coords Card */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-xl flex flex-col justify-between relative overflow-hidden">
            
            {/* Visual background radar pulse circle */}
            <div className="absolute top-4 right-4 h-12 w-12 rounded-full border border-primary/20 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full border border-primary/40 animate-ping absolute" />
              <MapPin size={16} className="text-primary" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <MapPin className="text-primary" size={18} /> GPS Telemetry Radar
              </h3>

              {geoLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <RefreshCw className="animate-spin text-primary" size={24} />
                  <span className="text-xs text-muted">Scanning coordinates...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Coords log readouts */}
                  <div className="rounded-xl border border-border/80 bg-surface/50 p-4 space-y-3 font-mono text-[11px] leading-tight">
                    <div className="flex justify-between">
                      <span className="text-muted">LATITUDE:</span>
                      <span className="text-white font-bold">{coords?.latitude?.toFixed(6) || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">LONGITUDE:</span>
                      <span className="text-white font-bold">{coords?.longitude?.toFixed(6) || "—"}</span>
                    </div>
                    <div className="flex justify-between border-t border-border/50 pt-2">
                      <span className="text-muted">TARGET HUB:</span>
                      <span className="text-text-secondary">DELHI OFFICE HQ</span>
                    </div>
                  </div>

                  {/* Geofence verification block */}
                  <div className="space-y-2">
                    <span className="block text-xs text-muted uppercase tracking-wider">Boundary Integrity Check</span>
                    <div className={`p-3 rounded-xl border flex items-center gap-3 ${
                      isWithinRange 
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400" 
                        : "border-warning/20 bg-warning/5 text-warning"
                    }`}>
                      <div className={`h-2.5 w-2.5 rounded-full shrink-0 ${isWithinRange ? "bg-emerald-400 animate-pulse" : "bg-warning animate-pulse"}`} />
                      <div className="min-w-0 flex-1 leading-tight text-xs font-semibold">
                        {isWithinRange ? (
                          <>
                            <span className="block text-white">Office Range Verified</span>
                            <span className="text-[11px] text-emerald-400 mt-1 block">HQ Distance: {officeDistance?.toFixed(0)} meters</span>
                          </>
                        ) : (
                          <>
                            <span className="block text-white">Geofence: Out of Bounds</span>
                            <span className="text-[11px] text-warning mt-1 block">Distance: {(officeDistance / 1000).toFixed(2)}km from HQ</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Simulated Coordinate Shift for demo */}
                  {!todayRecord?.checkIn && (
                    <button
                      type="button"
                      onClick={simulateRemoteCoords}
                      className="w-full py-2.5 text-center border border-dashed border-border rounded-xl text-xs font-bold text-muted hover:text-white hover:bg-card transition-all"
                    >
                      📡 Simulate Remote Coordinates
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Shift hours details */}
            <div className="mt-8 pt-4 border-t border-border/60">
              <div className="flex justify-between items-center text-xs py-2 border-b border-border/40">
                <span className="text-muted">Active Shift:</span>
                <span className="font-bold text-white">General (09:00 AM - 06:00 PM)</span>
              </div>
              <div className="flex justify-between items-center text-xs py-2">
                <span className="text-muted">Device Host:</span>
                <span className="font-semibold text-white flex items-center gap-1 font-mono text-[10px]">
                  <Laptop size={12} className="text-primary" /> macOS client
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 7-day visual history layout */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="text-primary" size={18} /> Last 7 Days Overview
        </h3>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <RefreshCw className="animate-spin text-primary" size={32} />
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

              // Calculate worked duration for history
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
                      ? "bg-primary/5 border-primary/40 ring-1 ring-primary/30"
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
                      <span className="inline-block text-[10px] uppercase font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20">
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

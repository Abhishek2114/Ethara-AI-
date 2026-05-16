import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarOff, ClipboardCheck, Flag, Check, X, Inbox } from "lucide-react";
import { inboxApi, leaveApi, notificationsApi } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { useToast } from "../../hooks/useToast";
import { usePolling } from "../../hooks/usePolling";
import { cn } from "../../lib/utils";

const MANAGER_ROLES = ["QUALITY_REVIEWER", "PROJECT_LEAD", "ADMIN"];

export function ActionInbox() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [inbox, setInbox] = useState(null);
  const ref = useRef(null);
  const isManager = MANAGER_ROLES.includes(user?.role);

  const load = () =>
    inboxApi.get().then((r) => setInbox(r.data.data)).catch(() => {});

  usePolling(load, 20000, !!user);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleLeave = async (id, status) => {
    try {
      await leaveApi.updateStatus(id, status);
      toast(`Leave ${status.toLowerCase()}`, "success");
      load();
    } catch (e) {
      toast(e.response?.data?.error?.message || "Failed", "error");
    }
  };

  const count = inbox?.actionCount ?? 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "relative rounded-lg p-2 transition-colors",
          open ? "bg-teal/10 text-teal" : "text-muted hover:bg-card hover:text-text"
        )}
        aria-label="Action inbox"
      >
        <Bell size={20} />
        {count > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-96 max-h-[70vh] overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Inbox size={16} className="text-teal" />
              <span className="font-semibold">Action Inbox</span>
            </div>
            <span className="text-xs text-muted">{count} pending</span>
          </div>

          <div className="max-h-[60vh] overflow-y-auto p-2">
            {isManager && (inbox?.pendingLeaves?.length ?? 0) > 0 && (
              <section className="mb-3">
                <p className="mb-1 flex items-center gap-1 px-2 text-[10px] font-bold uppercase text-muted">
                  <CalendarOff size={12} /> Leave approvals
                </p>
                {inbox.pendingLeaves.map((l) => (
                  <div key={l.id} className="mb-1 rounded-lg border border-border bg-surface p-3">
                    <p className="text-sm font-medium">{l.user?.name}</p>
                    <p className="text-xs text-muted">
                      {new Date(l.startDate).toLocaleDateString()} – {new Date(l.endDate).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleLeave(l.id, "APPROVED")}
                        className="flex flex-1 items-center justify-center gap-1 rounded bg-success/20 py-1 text-xs text-success hover:bg-success/30"
                      >
                        <Check size={12} /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleLeave(l.id, "REJECTED")}
                        className="flex flex-1 items-center justify-center gap-1 rounded bg-danger/20 py-1 text-xs text-danger hover:bg-danger/30"
                      >
                        <X size={12} /> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            )}

            {isManager && (inbox?.pendingReviews?.length ?? 0) > 0 && (
              <section className="mb-3">
                <p className="mb-1 flex items-center gap-1 px-2 text-[10px] font-bold uppercase text-muted">
                  <ClipboardCheck size={12} /> Task reviews
                </p>
                {inbox.pendingReviews.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setOpen(false); navigate("/task-review"); }}
                    className="mb-1 w-full rounded-lg border border-border bg-surface p-3 text-left hover:border-teal/40"
                  >
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-muted">{item.user?.name} · {item.project?.code}</p>
                  </button>
                ))}
              </section>
            )}

            {(inbox?.recentFlags?.length ?? 0) > 0 && (
              <section className="mb-3">
                <p className="mb-1 flex items-center gap-1 px-2 text-[10px] font-bold uppercase text-muted">
                  <Flag size={12} /> Project flags
                </p>
                {inbox.recentFlags.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => { setOpen(false); navigate("/projects"); }}
                    className="mb-1 w-full rounded-lg border border-border bg-surface p-3 text-left hover:border-teal/40"
                  >
                    <p className="text-sm font-medium">{f.project?.code}</p>
                    <p className="text-xs text-muted">{f.user?.name}{f.note ? ` — ${f.note}` : ""}</p>
                  </button>
                ))}
              </section>
            )}

            {count === 0 && (
              <p className="py-8 text-center text-sm text-muted">All caught up — no pending actions</p>
            )}

            {(inbox?.notifications?.length ?? 0) > 0 && (
              <section>
                <p className="mb-1 px-2 text-[10px] font-bold uppercase text-muted">Notifications</p>
                {inbox.notifications.map((n) => (
                  <div key={n.id} className="mb-1 rounded-lg border border-border/50 px-3 py-2 text-xs">
                    <p className="font-medium">{n.title}</p>
                    <p className="text-muted">{n.message}</p>
                  </div>
                ))}
              </section>
            )}
          </div>

          <div className="border-t border-border p-2">
            <button
              type="button"
              onClick={() => notificationsApi.readAll().then(load)}
              className="w-full rounded-lg py-2 text-xs text-muted hover:bg-surface hover:text-text"
            >
              Mark all notifications read
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

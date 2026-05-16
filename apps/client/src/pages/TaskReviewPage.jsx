import { useEffect, useState } from "react";
import { ClipboardCheck, RefreshCw, Star, MessageSquare } from "lucide-react";
import { workItemsApi } from "../lib/api";
import { useToast } from "../hooks/useToast";
import { useAuth } from "../lib/auth";

const FILTERS = [
  { id: "needs_review", label: "Needs review" },
  { id: "reviewed", label: "Reviewed" },
  { id: "all", label: "All" },
];

const RUBRIC = [
  { score: 70, label: "Below standard", desc: "Rework required" },
  { score: 85, label: "Meets standard", desc: "Acceptable quality" },
  { score: 95, label: "Exceeds", desc: "High quality" },
  { score: 100, label: "Exceptional", desc: "Benchmark work" },
];

const MANAGER_ROLES = ["QUALITY_REVIEWER", "PROJECT_LEAD", "ADMIN"];

export default function TaskReviewPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("needs_review");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const { toast } = useToast();
  const canReview = MANAGER_ROLES.includes(user?.role);

  const load = () => {
    setLoading(true);
    workItemsApi
      .list({ filter })
      .then((r) => setItems(r.data.data.items || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const submitReview = async (id, qualityScore) => {
    try {
      await workItemsApi.review(id, { qualityScore, reviewComment: comment || undefined });
      toast("Review saved", "success");
      setSelected(null);
      setComment("");
      load();
    } catch {
      toast("Failed to save review", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Task Review</h1>
          <p className="text-sm text-muted">Quality rubric, comments & review queue</p>
        </div>
        <button type="button" onClick={load} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${
              filter === f.id ? "bg-teal text-bg" : "border border-border text-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-1">
          {loading ? (
            <p className="text-muted">Loading…</p>
          ) : items.length === 0 ? (
            <div className="rounded-xl border border-border bg-card py-12 text-center text-muted">
              <ClipboardCheck size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No items in this queue</p>
            </div>
          ) : (
            items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => { setSelected(item); setComment(item.reviewComment || ""); }}
                className={`w-full rounded-xl border p-3 text-left transition ${
                  selected?.id === item.id ? "border-teal bg-teal/5" : "border-border bg-card hover:border-teal/30"
                }`}
              >
                <p className="truncate text-sm font-medium">{item.title}</p>
                <p className="text-xs text-muted">{item.user?.name} · {item.project?.code || "—"}</p>
                {item.qualityScore != null && (
                  <span className="mt-1 inline-block text-xs text-success">
                    Scored {(item.qualityScore * 100).toFixed(0)}%
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        <div className="lg:col-span-2">
          {selected ? (
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">{selected.title}</h2>
              <p className="mt-1 text-sm text-muted">
                {selected.user?.name} · {selected.project?.code} · {selected.status}
                {selected.handleTimeMinutes != null && ` · ${selected.handleTimeMinutes}m AHT`}
              </p>

              {canReview && filter !== "reviewed" && (
                <>
                  <p className="mb-2 mt-6 text-xs font-bold uppercase text-muted">Quality rubric</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {RUBRIC.map((r) => (
                      <button
                        key={r.score}
                        type="button"
                        onClick={() => submitReview(selected.id, r.score)}
                        className="rounded-lg border border-border bg-surface p-3 text-left hover:border-teal hover:bg-teal/5"
                      >
                        <div className="flex items-center gap-2">
                          <Star size={14} className="text-teal" />
                          <span className="font-semibold">{r.score}%</span>
                          <span className="text-sm">{r.label}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted">{r.desc}</p>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 flex items-center gap-1 text-xs font-bold uppercase text-muted">
                      <MessageSquare size={12} /> Review comment
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Optional feedback for the tasker…"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                      rows={3}
                    />
                  </div>
                </>
              )}

              {selected.reviewedBy && (
                <p className="mt-4 text-xs text-muted">
                  Reviewed by {selected.reviewedBy.name}
                  {selected.reviewComment && ` — "${selected.reviewComment}"`}
                </p>
              )}
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-border text-muted">
              Select a task from the queue to review
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

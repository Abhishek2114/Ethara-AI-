import { useEffect, useState } from "react";
import { Flag, Plus, RefreshCw } from "lucide-react";
import { projectsApi } from "../lib/api";
import { brand } from "../config/brand";
import { useToast } from "../hooks/useToast";

export default function ProjectsTrackPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const load = () => {
    setLoading(true);
    projectsApi.list().then((r) => setProjects(r.data.data.projects || [])).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const flag = async (id) => {
    try {
      await projectsApi.flag(id, "Needs PL attention");
      toast("Flagged to Project Lead", "success");
      load();
    } catch (e) {
      toast(e.response?.data?.error?.message || "Failed", "error");
    }
  };

  const allocated = projects.filter((p) => p.allocationStatus === "ALLOCATED" || p.isAllocated);
  const title = allocated.length && allocated.length < projects.length ? "Allocated Projects" : "Projects";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted">{projects.length} projects from {brand.platform}</p>
        </div>
        <div className="flex gap-2">
          <button type="button" className="flex items-center gap-2 rounded-lg bg-teal px-4 py-2 text-sm font-medium text-bg"><Plus size={16} /> Request Project</button>
          <button type="button" onClick={load} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm"><RefreshCw size={16} /> Refresh</button>
        </div>
      </div>
      {loading ? <p className="text-muted">Loading…</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="flex flex-col rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-start justify-between gap-2">
                <p className="font-mono text-sm font-semibold">{p.code}</p>
                <span className="rounded border border-success/40 px-2 py-0.5 text-[10px] font-bold text-success">{p.lifecycle}</span>
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded bg-success/20 px-2 py-0.5 text-[10px] font-bold text-success">{p.allocationStatus}</span>
                {p.category && <span className="text-xs text-muted">{p.category}</span>}
              </div>
              <p className="mb-4 text-xs text-muted">Platform: {p.platform || brand.platform}</p>
              <button type="button" onClick={() => flag(p.id)} className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm hover:bg-surface">
                <Flag size={14} /> Flag to PL
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

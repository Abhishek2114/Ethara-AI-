import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FolderKanban, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { projectsApi } from "../lib/api";
import { Badge } from "../components/ui/Badge";
import { PageSkeleton } from "../components/ui/Skeleton";
import { useToast } from "../hooks/useToast";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const load = () =>
    projectsApi
      .list()
      .then((res) => setProjects(res.data.data.projects))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await projectsApi.create({ title, description, status: "ACTIVE" });
      toast("Project launched", "success");
      setShowForm(false);
      setTitle("");
      setDescription("");
      load();
    } catch {
      toast("Failed to create project", "error");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-muted hover:border-border-hover focus:border-accent focus:ring-1 focus:ring-accent/30";

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-text">Projects</h1>
          <p className="mt-0.5 text-sm text-muted">Active missions and initiatives</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <Plus size={15} /> New Project
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="rounded-xl border border-border bg-card p-5">
          <form onSubmit={create} className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              required
              className={inputClass}
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className={inputClass}
            />
            <button
              type="submit"
              className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Create
            </button>
          </form>
        </div>
      )}

      {/* Grid */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-border bg-card py-16 text-center">
          <FolderKanban className="mb-4 text-muted opacity-40" size={40} />
          <p className="text-sm text-muted">No projects yet. Launch your first one.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
            >
              <Link to={`/projects/${p.id}`}>
                <div className="group rounded-xl border border-border bg-card p-5 transition-colors hover:border-border-hover hover:bg-elevated">
                  <div className="flex items-start justify-between">
                    <Badge>{p.lifecycle}</Badge>
                    <ArrowUpRight
                      size={16}
                      className="text-muted opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </div>
                  <h3 className="mt-3 text-base font-semibold text-text">{p.title}</h3>
                  <p className="mt-1.5 line-clamp-2 text-sm text-muted">{p.category}</p>
                  <p className="mt-3 text-xs text-text-secondary">{p.taskCount} tasks</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

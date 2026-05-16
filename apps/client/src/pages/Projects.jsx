import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FolderKanban } from "lucide-react";
import { motion } from "framer-motion";
import { projectsApi } from "../lib/api";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
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

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Projects</h1>
          <p className="text-muted">Active missions and initiatives</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> New Project
        </Button>
      </div>

      {showForm && (
        <Card>
          <form onSubmit={create} className="grid gap-4 md:grid-cols-2">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              required
              className="rounded-lg border border-cyan/10 bg-surface px-4 py-2"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="rounded-lg border border-cyan/10 bg-surface px-4 py-2 md:col-span-2"
            />
            <Button type="submit">Create</Button>
          </form>
        </Card>
      )}

      {projects.length === 0 ? (
        <Card className="py-16 text-center">
          <FolderKanban className="mx-auto mb-4 text-muted" size={48} />
          <p className="text-muted">No projects yet. Launch your first mission.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link to={`/projects/${p.id}`}>
                <Card hover className="h-full">
                  <div className="flex items-start justify-between">
                    <Badge>{p.lifecycle}</Badge>
                  </div>
                  <h3 className="mt-3 font-display text-lg font-semibold">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{p.category}</p>
                  <p className="mt-3 text-xs text-muted">{p.taskCount} tasks</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

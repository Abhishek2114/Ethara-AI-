import { useEffect, useState } from "react";
import { tasksApi, projectsApi } from "../lib/api";
import { KanbanBoard } from "../components/tasks/KanbanBoard";
import { Card } from "../components/ui/Card";
import { PageSkeleton } from "../components/ui/Skeleton";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    const params = projectId ? { projectId } : {};
    return tasksApi
      .list(params)
      .then((res) => setTasks(res.data.data.tasks))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    projectsApi.list().then((res) => setProjects(res.data.data.projects));
  }, []);

  useEffect(() => {
    setLoading(true);
    load();
  }, [projectId]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Tasks</h1>
          <p className="text-muted">Drag tasks across mission phases</p>
        </div>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="rounded-lg border border-cyan/10 bg-surface px-4 py-2 text-sm"
        >
          <option value="">All projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title}
            </option>
          ))}
        </select>
      </div>
      <Card>
        <KanbanBoard tasks={tasks} onUpdate={load} />
      </Card>
    </div>
  );
}

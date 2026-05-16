import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectsApi, workItemsApi } from "../lib/api";
import { Badge } from "../components/ui/Badge";
import { PageSkeleton } from "../components/ui/Skeleton";
import { KanbanBoard } from "../components/tasks/KanbanBoard";
import { useToast } from "../hooks/useToast";
import { Plus } from "lucide-react";

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const { toast } = useToast();

  const load = () => {
    projectsApi
      .get(id)
      .then((res) => {
        setProject(res.data.data.project);
        return workItemsApi.listByProject(id);
      })
      .then((res) => {
        setTasks(res.data.items);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [id]);

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await workItemsApi.create({ title: taskTitle, projectId: id });
      toast("Task created", "success");
      setTaskTitle("");
      setShowTaskForm(false);
      load();
    } catch {
      toast("Failed to create task", "error");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-muted hover:border-border-hover focus:border-accent focus:ring-1 focus:ring-accent/30";

  if (loading) return <PageSkeleton />;
  if (!project)
    return <div className="py-16 text-center text-sm text-muted">Project not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Badge>{project.lifecycle}</Badge>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-text">{project.title}</h1>
          <p className="mt-0.5 text-sm text-muted">{project.category}</p>
        </div>
        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          <Plus size={15} /> New Task
        </button>
      </div>

      {/* New task form */}
      {showTaskForm && (
        <div className="rounded-xl border border-border bg-card p-5">
          <form onSubmit={createTask} className="flex gap-3">
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title"
              required
              className={inputClass + " flex-1"}
            />
            <button
              type="submit"
              className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
            >
              Add
            </button>
          </form>
        </div>
      )}

      {/* Kanban Board */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold text-text">Mission Board</h2>
        <KanbanBoard tasks={tasks} onUpdate={load} />
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { projectsApi, workItemsApi, authApi } from "../lib/api";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
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
    projectsApi.get(id).then((res) => {
      setProject(res.data.data.project);
      return workItemsApi.listByProject(id);
    }).then((res) => {
      setTasks(res.data.items);
    }).finally(() => setLoading(false));
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

  if (loading) return <PageSkeleton />;
  if (!project) return <div className="p-8 text-center text-muted">Project not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Badge>{project.lifecycle}</Badge>
          <h1 className="mt-2 font-display text-3xl font-bold">{project.title}</h1>
          <p className="text-muted">{project.category}</p>
        </div>
        <Button onClick={() => setShowTaskForm(!showTaskForm)}>
          <Plus size={18} /> New Task
        </Button>
      </div>

      {showTaskForm && (
        <Card>
          <form onSubmit={createTask} className="flex gap-4">
            <input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task title"
              required
              className="flex-1 rounded-lg border border-cyan/10 bg-surface px-4 py-2"
            />
            <Button type="submit">Add</Button>
          </form>
        </Card>
      )}

      <Card>
        <h2 className="mb-4 font-display font-semibold">Mission Board</h2>
        <KanbanBoard tasks={tasks} onUpdate={load} />
      </Card>
    </div>
  );
}

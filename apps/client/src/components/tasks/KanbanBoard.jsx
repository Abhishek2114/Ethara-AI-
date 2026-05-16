import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Calendar } from "lucide-react";
import { KANBAN_COLUMNS, cn, formatDate, PRIORITY_COLORS } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { workItemsApi } from "../../lib/api";
import { useToast } from "../../hooks/useToast";

const COLUMN_COLORS = {
  PENDING: { dot: "#707070", border: "border-border" },
  IN_PROGRESS: { dot: "#0091FF", border: "border-accent/20" },
  COMPLETED: { dot: "#30A46C", border: "border-success/20" },
  BLOCKED: { dot: "#E5484D", border: "border-danger/20" },
};

function TaskCard({ task, isDragging }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: task.id,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="cursor-grab rounded-lg border border-border bg-card p-3 transition-colors hover:border-border-hover active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <button {...attributes} {...listeners} className="mt-0.5 text-muted hover:text-text-secondary">
          <GripVertical size={14} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text">{task.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {task.priority && <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>}
            {task.dueDate && (
              <span className="flex items-center gap-1 text-xs text-muted">
                <Calendar size={11} />
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
          {task.user && (
            <img
              src={task.user.avatar || `https://ui-avatars.com/api/?name=${task.user.name}&background=random`}
              alt=""
              className="mt-2 h-6 w-6 rounded-full border border-border"
              title={task.user.name}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function KanbanBoard({ tasks, onUpdate }) {
  const { toast } = useToast();
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const byColumn = KANBAN_COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks
      .filter((t) => t.status === col.id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    return acc;
  }, {});

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    const newStatus = over.id.length > 15 ? task.status : over.id;

    if (task.status === newStatus) return;

    try {
      await workItemsApi.updateStatus(task.id, newStatus);
      onUpdate();
      toast("Task status updated", "success");
    } catch {
      toast("Failed to update task", "error");
    }
  };

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(e) => setActiveId(e.active.id)}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {KANBAN_COLUMNS.map((col) => {
          const colors = COLUMN_COLORS[col.id] || COLUMN_COLORS.PENDING;
          return (
            <div key={col.id} className="flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: colors.dot }}
                />
                <h3 className="text-sm font-semibold text-text">{col.title}</h3>
                <span className="rounded-md bg-elevated px-1.5 py-0.5 text-xs text-muted">
                  {byColumn[col.id]?.length || 0}
                </span>
              </div>
              <SortableContext
                id={col.id}
                items={byColumn[col.id]?.map((t) => t.id) || []}
                strategy={verticalListSortingStrategy}
              >
                <div
                  className={cn(
                    "min-h-[200px] flex-1 space-y-2 rounded-xl border border-dashed bg-surface/30 p-2",
                    colors.border
                  )}
                  data-status={col.id}
                >
                  {byColumn[col.id]?.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}

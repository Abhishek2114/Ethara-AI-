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
import { motion } from "framer-motion";
import { GripVertical, Calendar } from "lucide-react";
import { KANBAN_COLUMNS, cn, formatDate, PRIORITY_COLORS } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { workItemsApi } from "../../lib/api";
import { useToast } from "../../hooks/useToast";

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
      className="glass cursor-grab rounded-lg border border-cyan/5 p-3 active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        <button {...attributes} {...listeners} className="mt-0.5 text-muted hover:text-cyan">
          <GripVertical size={14} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text">{task.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {task.priority && <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>}
            {task.dueDate && (
              <span className="flex items-center gap-1 text-xs text-muted">
                <Calendar size={12} />
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
          {task.user && (
            <img
              src={task.user.avatar || `https://ui-avatars.com/api/?name=${task.user.name}&background=random`}
              alt=""
              className="mt-2 h-6 w-6 rounded-full border border-cyan/20"
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
        {KANBAN_COLUMNS.map((col) => (
          <div key={col.id} className="flex flex-col">
            <motion.div
              className="mb-3 flex items-center gap-2"
              style={{ color: col.color }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: col.color, boxShadow: `0 0 8px ${col.color}` }}
              />
              <h3 className="font-display text-sm font-semibold">{col.title}</h3>
              <span className="text-xs text-muted">({byColumn[col.id]?.length || 0})</span>
            </motion.div>
            <SortableContext
              id={col.id}
              items={byColumn[col.id]?.map((t) => t.id) || []}
              strategy={verticalListSortingStrategy}
            >
              <div
                className="min-h-[200px] flex-1 space-y-2 rounded-xl border border-dashed border-cyan/10 bg-surface/50 p-2"
                data-status={col.id}
              >
                {byColumn[col.id]?.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
}

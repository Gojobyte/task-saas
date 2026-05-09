"use client";

import { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import { TaskCard } from "@/components/kanban/TaskCard";

const COLUMNS = [
  { id: "BACKLOG", title: "Backlog", color: "bg-slate-400" },
  { id: "IN_PROGRESS", title: "In Progress", color: "bg-blue-500" },
  { id: "REVIEW", title: "Review", color: "bg-purple-500" },
  { id: "DONE", title: "Done", color: "bg-green-500" },
];

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: { name: string | null } | null;
  dueDate: string | null;
  _count: { subtasks: number };
}

export default function KanbanPage({ params }: { params: Promise<{ slug: string; projectId: string }> }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async ({ projectId }) => {
      const res = await fetch(`/api/tasks?projectId=${projectId}`);
      if (res.ok) setTasks(await res.json());
      setLoading(false);
    });
  }, []);

  const getColumnTasks = (status: string) => tasks.filter((t) => t.status === status);

  const handleCreateTask = async () => {
    const title = prompt("Task title:");
    if (!title) return;
    const { projectId } = await params;
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, projectId, status: "BACKLOG" }),
    });
    if (res.ok) setTasks((prev) => [...prev, await res.json()]);
  };

  if (loading) return <div className="h-96 bg-slate-100 animate-pulse rounded-xl" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Board</h1>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button onClick={handleCreateTask} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.id} className="bg-slate-100 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${col.color}`} />
              <h3 className="font-semibold text-slate-700 text-sm">{col.title}</h3>
              <span className="text-xs text-slate-500 ml-auto">{getColumnTasks(col.id).length}</span>
            </div>
            <div className="space-y-3">
              {getColumnTasks(col.id).map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

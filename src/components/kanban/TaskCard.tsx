"use client";

import { Calendar, MessageSquare } from "lucide-react";

interface Task {
  id: string;
  title: string;
  priority: string;
  assignee: { name: string | null } | null;
  dueDate: string | null;
  _count: { subtasks: number };
}

const priorityColor: Record<string, string> = {
  URGENT: "border-l-red-500",
  HIGH: "border-l-orange-500",
  MEDIUM: "border-l-yellow-500",
  LOW: "border-l-slate-300",
};

export function TaskCard({ task }: { task: Task }) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 border-l-2 p-3 cursor-pointer hover:shadow-md transition-shadow ${priorityColor[task.priority] || "border-l-slate-300"}`}>
      <p className="text-sm font-medium text-slate-900 mb-2">{task.title}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className="flex items-center gap-1 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
        {task.assignee?.name && (
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-medium">
            {task.assignee.name.charAt(0)}
          </div>
        )}
      </div>
    </div>
  );
}

import { Suspense } from "react";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Plus, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

export default async function WorkspaceDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");
  const { slug } = await params;

  const workspace = await prisma.workspace.findUnique({ where: { slug } });
  if (!workspace) redirect("/onboarding");

  const [totalTasks, doneTasks, inProgressTasks, reviewTasks, backlogTasks, recentTasks, overdueTasks] = await Promise.all([
    prisma.task.count({ where: { project: { workspaceId: workspace.id } } }),
    prisma.task.count({ where: { project: { workspaceId: workspace.id }, status: "DONE" } }),
    prisma.task.count({ where: { project: { workspaceId: workspace.id }, status: "IN_PROGRESS" } }),
    prisma.task.count({ where: { project: { workspaceId: workspace.id }, status: "REVIEW" } }),
    prisma.task.count({ where: { project: { workspaceId: workspace.id }, status: "BACKLOG" } }),
    prisma.task.findMany({ where: { project: { workspaceId: workspace.id } }, take: 5, orderBy: { updatedAt: "desc" }, include: { project: true, assignee: true } }),
    prisma.task.count({ where: { project: { workspaceId: workspace.id }, dueDate: { lt: new Date() }, status: { not: "DONE" } } }),
  ]);

  const projects = await prisma.project.findMany({ where: { workspaceId: workspace.id }, include: { _count: { select: { tasks: true } } } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <Link href={`/${slug}/projects/${projects[0]?.id || "new"}`} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus className="w-4 h-4" /> New Task
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{totalTasks}</p>
          <p className="text-xs text-slate-500 mt-1">Total</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-500">{backlogTasks}</p>
          <p className="text-xs text-slate-500 mt-1">Backlog</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{inProgressTasks}</p>
          <p className="text-xs text-slate-500 mt-1">In Progress</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{reviewTasks}</p>
          <p className="text-xs text-slate-500 mt-1">Review</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{doneTasks}</p>
          <p className="text-xs text-slate-500 mt-1">Done</p>
        </div>
      </div>

      {overdueTasks > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <p className="text-sm text-red-800"><strong>{overdueTasks}</strong> overdue task{overdueTasks > 1 ? "s" : ""} need your attention</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Recent Tasks</h2>
          {recentTasks.length === 0 ? (
            <p className="text-slate-500 text-sm">No tasks yet. Create your first task!</p>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${task.status === "DONE" ? "bg-green-500" : task.status === "IN_PROGRESS" ? "bg-blue-500" : task.status === "REVIEW" ? "bg-purple-500" : "bg-slate-300"}`} />
                    <div>
                      <p className="text-sm font-medium text-slate-900">{task.title}</p>
                      <p className="text-xs text-slate-500">{task.project.name}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${task.priority === "URGENT" ? "bg-red-100 text-red-700" : task.priority === "HIGH" ? "bg-orange-100 text-orange-700" : task.priority === "MEDIUM" ? "bg-yellow-100 text-yellow-700" : "bg-slate-100 text-slate-600"}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-slate-900 mb-4">Projects</h2>
          {projects.length === 0 ? (
            <p className="text-slate-500 text-sm">No projects yet.</p>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <Link key={project.id} href={`/${slug}/projects/${project.id}`} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0 hover:bg-slate-50 -mx-2 px-2 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: project.color }} />
                    <p className="text-sm font-medium text-slate-900">{project.name}</p>
                  </div>
                  <span className="text-xs text-slate-500">{project._count.tasks} tasks</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

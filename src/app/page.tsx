"use client";

import { useState } from "react";
import {
  CheckCircle2, Circle, Plus, Calendar, Users, BarChart3,
  Settings, Bell, Search, Menu, X, ChevronRight, Clock,
  AlertCircle, ArrowUp, MoreHorizontal, Filter, LayoutGrid,
  List, Star, Trash2, Edit3,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────
type Priority = "high" | "medium" | "low";
type Status = "todo" | "in-progress" | "done";

interface Task {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  avatar: string;
  dueDate: string;
  tags: string[];
}

// ─── Data ───────────────────────────────────────────────────────
const initialTasks: Task[] = [
  {
    id: "1", title: "Refactoriser l'authentification",
    description: "Migrer vers NextAuth v5 avec les nouveaux patterns",
    status: "in-progress", priority: "high", assignee: "Adoum S.", avatar: "AS",
    dueDate: "2026-05-15", tags: ["Backend", "Sécurité"],
  },
  {
    id: "2", title: "Design système v2",
    description: "Créer les composants UI pour la nouvelle version",
    status: "in-progress", priority: "high", assignee: "Fatima H.", avatar: "FH",
    dueDate: "2026-05-12", tags: ["Design", "Frontend"],
  },
  {
    id: "3", title: "API endpoints des rapports",
    description: "Implémenter les endpoints pour les analytics",
    status: "todo", priority: "medium", assignee: "Youssouf A.", avatar: "YA",
    dueDate: "2026-05-18", tags: ["API", "Backend"],
  },
  {
    id: "4", title: "Tests E2E dashboard",
    description: "Écrire les tests Playwright pour le dashboard",
    status: "todo", priority: "medium", assignee: "Marie D.", avatar: "MD",
    dueDate: "2026-05-20", tags: ["Testing"],
  },
  {
    id: "5", title: "Optimisation des images",
    description: "Implémenter le lazy loading et WebP",
    status: "done", priority: "low", assignee: "Jean-Pierre", avatar: "JP",
    dueDate: "2026-05-08", tags: ["Performance"],
  },
  {
    id: "6", title: "Documentation API",
    description: "Documenter tous les endpoints avec OpenAPI",
    status: "done", priority: "medium", assignee: "Amina O.", avatar: "AO",
    dueDate: "2026-05-05", tags: ["Docs"],
  },
  {
    id: "7", title: "Intégration Stripe",
    description: "Ajouter les webhooks et la gestion des abonnements",
    status: "todo", priority: "high", assignee: "Brahim S.", avatar: "BS",
    dueDate: "2026-05-22", tags: ["Backend", "Payments"],
  },
  {
    id: "8", title: "Page de destination",
    description: "Créer la landing page marketing",
    status: "done", priority: "low", assignee: "Zeinab A.", avatar: "ZA",
    dueDate: "2026-05-01", tags: ["Frontend", "Marketing"],
  },
];

const columns: { id: Status; label: string; color: string }[] = [
  { id: "todo", label: "À faire", color: "#64748b" },
  { id: "in-progress", label: "En cours", color: "#3b82f6" },
  { id: "done", label: "Terminé", color: "#22c55e" },
];

// ─── Priority Badge ─────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: Priority }) {
  const config = {
    high: { color: "text-red-400", bg: "bg-red-500/15", label: "Haute" },
    medium: { color: "text-yellow-400", bg: "bg-yellow-500/15", label: "Moyenne" },
    low: { color: "text-green-400", bg: "bg-green-500/15", label: "Basse" },
  };
  const c = config[priority];
  return (
    <span className={`${c.bg} ${c.color} text-xs px-2 py-0.5 rounded-full font-medium`}>
      {c.label}
    </span>
  );
}

// ─── Task Card ──────────────────────────────────────────────────
function TaskCard({ task, onStatusChange }: { task: Task; onStatusChange: (id: string, status: Status) => void }) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4 hover:border-[#475569] transition-all group cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <PriorityBadge priority={task.priority} />
        <button className="opacity-0 group-hover:opacity-100 text-[#64748b] hover:text-white transition-all">
          <MoreHorizontal size={16} />
        </button>
      </div>
      <h4 className="text-white font-medium text-sm mb-1">{task.title}</h4>
      <p className="text-[#64748b] text-xs mb-3 line-clamp-2">{task.description}</p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.map((tag) => (
          <span key={tag} className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#334155]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-[9px] font-bold">
            {task.avatar}
          </div>
          <span className="text-[#94a3b8] text-xs">{task.assignee}</span>
        </div>
        <div className="flex items-center gap-1 text-[#64748b]">
          <Clock size={12} />
          <span className="text-xs">{task.dueDate.slice(5)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Stats Card ─────────────────────────────────────────────────
function StatsCard({ label, value, change, icon: Icon, color }: {
  label: string; value: string; change: string; icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#94a3b8] text-sm">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
        <ArrowUp size={12} /> {change}
      </p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────
export default function TaskSaasPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const filterByStatus = (status: Status) => tasks.filter((t) => t.status === status);

  const navItems = [
    { icon: LayoutGrid, label: "Tableau", active: true },
    { icon: List, label: "Liste" },
    { icon: Calendar, label: "Calendrier" },
    { icon: BarChart3, label: "Rapports" },
    { icon: Users, label: "Équipe" },
    { icon: Settings, label: "Paramètres" },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-[240px] bg-[#1e293b] border-r border-[#334155] flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#334155]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
            <CheckCircle2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">TaskFlow</h1>
            <p className="text-[#64748b] text-[10px]">SaaS Pro</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-[#64748b]">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                item.active ? "bg-violet-500/15 text-violet-400" : "text-[#94a3b8] hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-[#334155]">
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-lg p-3">
            <p className="text-white text-xs font-medium">Plan Pro</p>
            <p className="text-[#64748b] text-[10px] mt-1">12/50 projets actifs</p>
            <div className="w-full bg-[#334155] rounded-full h-1.5 mt-2">
              <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: "24%" }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="lg:ml-[240px] min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0f172a]/80 backdrop-blur-xl border-b border-[#1e293b]">
          <div className="flex items-center justify-between px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-[#94a3b8]">
                <Menu size={22} />
              </button>
              <div>
                <h2 className="text-white font-semibold">Projet Principal</h2>
                <p className="text-[#64748b] text-xs">{tasks.length} tâches · {filterByStatus("in-progress").length} en cours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-2">
                <Search size={14} className="text-[#64748b]" />
                <input type="text" placeholder="Rechercher..." className="bg-transparent text-sm text-white placeholder-[#64748b] outline-none w-32" />
              </div>
              <button className="relative text-[#94a3b8] hover:text-white">
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-violet-500 rounded-full text-[9px] text-white flex items-center justify-center">5</span>
              </button>
              <button className="bg-violet-500 hover:bg-violet-600 text-white text-sm px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
                <Plus size={16} />
                <span className="hidden sm:inline">Ajouter</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard label="Total Tâches" value={String(tasks.length)} change="+3 cette semaine" icon={CheckCircle2} color="bg-violet-500/15 text-violet-400" />
            <StatsCard label="En cours" value={String(filterByStatus("in-progress").length)} change="+2 cette semaine" icon={Clock} color="bg-blue-500/15 text-blue-400" />
            <StatsCard label="Terminées" value={String(filterByStatus("done").length)} change="+5 cette semaine" icon={CheckCircle2} color="bg-green-500/15 text-green-400" />
            <StatsCard label="En retard" value="2" change="-1 vs hier" icon={AlertCircle} color="bg-red-500/15 text-red-400" />
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-lg">Tableau Kanban</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-[#1e293b] rounded-lg p-1">
                <button
                  onClick={() => setView("kanban")}
                  className={`p-1.5 rounded-md transition-all ${view === "kanban" ? "bg-violet-500 text-white" : "text-[#94a3b8]"}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-1.5 rounded-md transition-all ${view === "list" ? "bg-violet-500 text-white" : "text-[#94a3b8]"}`}
                >
                  <List size={16} />
                </button>
              </div>
              <button className="flex items-center gap-1 text-[#94a3b8] hover:text-white text-sm bg-[#1e293b] border border-[#334155] rounded-lg px-3 py-1.5">
                <Filter size={14} />
                Filtrer
              </button>
            </div>
          </div>

          {/* Kanban Board */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map((col) => (
              <div key={col.id} className="bg-[#0f172a] rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.color }} />
                    <h4 className="text-white font-medium text-sm">{col.label}</h4>
                    <span className="text-[#64748b] text-xs bg-[#1e293b] px-2 py-0.5 rounded-full">
                      {filterByStatus(col.id).length}
                    </span>
                  </div>
                  <button className="text-[#64748b] hover:text-white">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="space-y-3">
                  {filterByStatus(col.id).map((task) => (
                    <TaskCard key={task.id} task={task} onStatusChange={() => {}} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

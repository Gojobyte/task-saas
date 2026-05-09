"use client";

import { Bell, Search } from "lucide-react";

interface HeaderProps {
  slug: string;
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export function Header({ slug, user }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search tasks..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-slate-100"><Bell className="w-5 h-5 text-slate-600" /></button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
            {user.name?.charAt(0) || "?"}
          </div>
        </div>
      </div>
    </header>
  );
}

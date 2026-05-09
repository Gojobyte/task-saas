import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const projectId = req.nextUrl.searchParams.get("projectId");
  const tasks = await prisma.task.findMany({
    where: projectId ? { projectId } : {},
    include: { assignee: { select: { name: true } }, _count: { select: { subtasks: true } } },
    orderBy: { position: "asc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { title, projectId, status, priority, assigneeId, dueDate, description } = await req.json();
  const task = await prisma.task.create({
    data: { title, projectId, status: status || "BACKLOG", priority: priority || "MEDIUM", assigneeId, dueDate: dueDate ? new Date(dueDate) : null, description, createdBy: session.user.id },
    include: { assignee: { select: { name: true } }, _count: { select: { subtasks: true } } },
  });
  return NextResponse.json(task, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...data } = await req.json();
  if (data.dueDate) data.dueDate = new Date(data.dueDate);
  const task = await prisma.task.update({ where: { id }, data });
  return NextResponse.json(task);
}

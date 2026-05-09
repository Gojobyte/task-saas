import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const workspaceId = req.nextUrl.searchParams.get("workspaceId");
  const projects = await prisma.project.findMany({
    where: workspaceId ? { workspaceId } : { workspace: { members: { some: { userId: session.user.id } } } },
    include: { _count: { select: { tasks: true } } },
  });
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name, workspaceId, color } = await req.json();
  const project = await prisma.project.create({ data: { name, workspaceId, color: color || "#3B82F6" } });
  return NextResponse.json(project, { status: 201 });
}

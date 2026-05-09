import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const workspaces = await prisma.workspace.findMany({
    where: { members: { some: { userId: session.user.id } } },
    include: { _count: { select: { projects: true, members: true } } },
  });
  return NextResponse.json(workspaces);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { name } = await req.json();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const workspace = await prisma.workspace.create({
    data: { name, slug, ownerId: session.user.id, members: { create: { userId: session.user.id, role: "OWNER" } } },
  });
  return NextResponse.json(workspace);
}

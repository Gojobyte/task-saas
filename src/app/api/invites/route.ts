import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { workspaceId, email, role } = await req.json();
  const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const invite = await prisma.inviteToken.create({
    data: { workspaceId, email, role: role || "MEMBER", token, expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  });
  return NextResponse.json(invite, { status: 201 });
}

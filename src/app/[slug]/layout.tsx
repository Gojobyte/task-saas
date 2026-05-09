import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/workspace/Sidebar";
import { Header } from "@/components/workspace/Header";

export default async function WorkspaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  const { slug } = await params;

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar slug={slug} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header slug={slug} user={session.user} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

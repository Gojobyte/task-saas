import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export default async function RegisterPage() {
  const session = await auth();
  if (session) redirect("/onboarding");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Create account</h1>
        <p className="text-slate-500 text-center mb-8">Start managing your tasks</p>
        <form action={async (fd) => { "use server"; const name = fd.get("name") as string; const email = fd.get("email") as string; const password = fd.get("password") as string; const hash = await bcrypt.hash(password, 12); await prisma.user.create({ data: { name, email, passwordHash: hash } }); await signIn("credentials", { email, password, redirectTo: "/onboarding" }); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input name="name" type="text" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input name="email" type="email" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input name="password" type="password" required minLength={8} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Create account</button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">Already have an account? <Link href="/login" className="text-blue-600 font-medium">Sign in</Link></p>
      </div>
    </div>
  );
}

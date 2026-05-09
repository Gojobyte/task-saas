import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/onboarding");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Welcome back</h1>
        <p className="text-slate-500 text-center mb-8">Sign in to your workspace</p>
        <form action={async (fd) => { "use server"; await signIn("credentials", { email: fd.get("email") as string, password: fd.get("password") as string, redirectTo: "/onboarding" }); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input name="email" type="email" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input name="password" type="password" required className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Sign in</button>
        </form>
        <form action={async () => { "use server"; await signIn("google", { redirectTo: "/onboarding" }); }}>
          <button type="submit" className="w-full mt-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-colors">Continue with Google</button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-6">No account? <Link href="/register" className="text-blue-600 font-medium">Sign up</Link></p>
      </div>
    </div>
  );
}

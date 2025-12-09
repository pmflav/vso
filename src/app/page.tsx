import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ComingSoon() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 selection:bg-blue-100 selection:text-blue-900">

      {/* Abstract Background Shapes */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] bg-indigo-50/40 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full px-6 text-center space-y-8 z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">

        {/* Brand Logo/Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-blue-900/10">
          C
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            CoreVantz<br />
            <span className="text-slate-400">Solutions</span>
          </h1>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Coming Soon
          </div>

          <p className="text-slate-500 text-lg leading-relaxed pt-2">
            The intelligent, sovereign vSO for Australian business is currently in private beta.
          </p>
        </div>

        <div className="pt-8 flex flex-col gap-4">
          {/* Admin Login Link */}
          <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors">
            Existing Member Login &rarr;
          </Link>
        </div>

        <div className="pt-12 text-xs text-slate-400 font-medium">
          <p>&copy; 2024 CoreVantz Solutions Pty Ltd.</p>
          <p>ABN 40 845 517 263</p>
        </div>

      </div>
    </div>
  );
}

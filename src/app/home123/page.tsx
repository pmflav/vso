import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-50 selection:bg-blue-100 selection:text-blue-900">

      {/* Abstract Background Shapes */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-[100px] delay-700" />
        <div className="absolute bottom-[-10%] left-[20%] w-[800px] h-[800px] bg-indigo-50/40 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/50 bg-white/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
              C
            </div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">CoreVantz</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="#features" className="hover:text-blue-600 transition-colors">Capabilities</Link>
            <Link href="#sovereign" className="hover:text-blue-600 transition-colors">Sovereignty</Link>
            <Link href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <button className="px-5 py-2 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                  Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden md:block text-sm font-medium text-slate-600 hover:text-slate-900">
                  Log in
                </Link>
                <Link href="/login">
                  <button className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-100 shadow-sm text-sm font-medium text-blue-700 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Accepting Australian SMBs for Early Access
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            Meet your Virtual<br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Sovereign Officer</span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <strong className="text-slate-700">Like a CSM, but better.</strong> CoreVantz provides an AI-driven vSO that handles compliance, grants, and operations solely for Australian businesses.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <Link href="/login">
              <button className="px-8 py-4 rounded-full bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all hover:scale-105 shadow-xl shadow-slate-900/20 w-full sm:w-auto">
                Start Your vSO Journey
              </button>
            </Link>
            <button className="px-8 py-4 rounded-full bg-white text-slate-600 border border-slate-200 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all w-full sm:w-auto">
              View Demo
            </button>
          </div>

          {/* Hero UI Mockup */}
          <div className="mt-20 relative mx-auto w-full max-w-5xl animate-in fade-in slide-in-from-bottom-12 duration-1200 delay-700">
            <div className="rounded-2xl border border-slate-200 shadow-2xl overflow-hidden relative group bg-white">
              <Image
                src="/assets/hero_dashboard.png"
                alt="CoreVantz Dashboard"
                width={1920}
                height={1080}
                className="w-full h-auto opacity-90 hover:opacity-100 transition-opacity duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Floating Badges */}
            <div className="absolute -right-8 top-12 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-bounce delay-1000 hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-xl">🛡️</div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Compliance Score</p>
                  <p className="text-lg font-bold text-slate-900">98/100</p>
                </div>
              </div>
            </div>

            <div className="absolute -left-8 bottom-12 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-pulse hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xl">💰</div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">New Grant Found</p>
                  <p className="text-lg font-bold text-slate-900">$50,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why a vSO is better than a CSM</h2>
            <p className="text-slate-500">Traditional Customer Success Managers are reactive. Your CoreVantz vSO is proactive, intelligent, and deeply integrated into the Australian regulatory landscape.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                🧠
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Proactive Intelligence</h3>
              <p className="text-slate-500 leading-relaxed">
                Stops waiting for you to ask. Your vSO monitors your business 24/7, suggesting grants, flagging compliance risks, and optimizing operations automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-emerald-600/20 group-hover:scale-110 transition-transform">
                🇦🇺
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Sovereign Focus</h3>
              <p className="text-slate-500 leading-relaxed">
                Built specifically for Australia. Deep integration with the ABR, Fair Work Ombudsman, and ATO means we speak your language, not generic "global" compliance.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:shadow-lg transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white text-2xl mb-6 shadow-lg shadow-purple-600/20 group-hover:scale-110 transition-transform">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Cost Efficient</h3>
              <p className="text-slate-500 leading-relaxed">
                Get the strategic oversight of a C-suite executive for a fraction of the cost. No sick days, no training required—just instant value.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEO / Trust Section */}
      <section id="sovereign" className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl border border-slate-700">🔒</div>
                <span className="font-medium">Encrypted at Rest</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-xl border border-slate-700">🛡️</div>
                <span className="font-medium">Zero Trust Auth</span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            {/* Abstract Map Graphic */}
            <div className="relative w-96 h-96">
              <div className="absolute inset-0 bg-blue-600 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
              <div className="w-full h-full bg-slate-800/50 border border-slate-700 rounded-3xl backdrop-blur-sm flex items-center justify-center relative shadow-2xl overflow-hidden group">
                <Image
                  src="/assets/sovereignty.png"
                  alt="Australian Data Sovereignty"
                  width={500}
                  height={500}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-slate-900/80 backdrop-blur border border-slate-600 px-6 py-3 rounded-xl shadow-xl flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-mono text-sm">Sydney, AU (ap-southeast-2)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white text-xs font-bold">C</div>
              <span className="font-bold text-lg text-slate-900">CoreVantz</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm">
              Empowering Australian small businesses with intelligent, sovereign virtual operations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-blue-600">vSO Features</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Grant Scout</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Compliance</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-blue-600">About Us</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Contact</Link></li>
              <li><Link href="#" className="hover:text-blue-600">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400">
          <p>&copy; 2024 CoreVantz Solutions Pty Ltd. All rights reserved. ABN 40 845 517 263.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Made with ❤️ in Melbourne</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

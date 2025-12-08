import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl w-full text-center space-y-8 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-sm text-sm text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Australian Data Sovereignty Guaranteed</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-bold tracking-tight bg-gradient-to-b from-white to-slate-400 text-transparent bg-clip-text">
          OzCore vOS
        </h1>

        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The Vertical Operating System replacing the fragmented stack for Aussie tradies and professionals.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
          <button className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-900/20">
            Join the Waitlist
          </button>
          <button className="px-8 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium border border-slate-800 transition-all">
            See How It Works
          </button>
        </div>

        <div className="pt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-slate-500 text-sm font-medium">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xl">🇦🇺</div>
            <span>Sovereign Cloud</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xl">🏛️</div>
            <span>ABR Integrated</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xl">⚖️</div>
            <span>Fair Work Compliant</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xl">🔒</div>
            <span>Zero Trust Auth</span>
          </div>
        </div>
      </div>
    </main>
  );
}

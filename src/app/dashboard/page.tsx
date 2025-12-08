import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch Organisation Details
    const { data: profile } = await supabase
        .from('profiles')
        .select('organisation_id, organisations(legal_name, tier)')
        .eq('id', user!.id)
        .single()

    const orgName = (profile?.organisations as any)?.legal_name || 'Your Business'
    const tier = (profile?.organisations as any)?.tier || 'Solo'

    return (
        <div className="p-8 space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-slate-400">Welcome back to {orgName}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-800 text-emerald-400 text-xs font-medium uppercase tracking-wider">
                    {tier} Plan
                </span>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Active Deals" value="0" change="+0%" />
                <StatCard title="Pipeline Value" value="$0.00" change="+0%" />
                <StatCard title="Compliance Score" value="100%" change="Safe" color="emerald" />
            </div>

            {/* Empty State / Call to Action */}
            <div className="p-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center text-3xl">
                    🚀
                </div>
                <h3 className="text-xl font-semibold text-white">Ready to grow?</h3>
                <p className="text-slate-400 max-w-md">
                    Phase 3 will unlock your CRM and Operations modules. For now, your data foundation is secure and compliant.
                </p>
            </div>
        </div>
    )
}

function StatCard({ title, value, change, color = 'blue' }: any) {
    const isEmerald = color === 'emerald'
    return (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <span className="text-sm text-slate-500 font-medium">{title}</span>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-white">{value}</span>
                <span className={`text-sm ${isEmerald ? 'text-emerald-400' : 'text-blue-400'}`}>{change}</span>
            </div>
        </div>
    )
}

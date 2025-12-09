import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch basic profile for name if available
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, organisation_id')
        .eq('id', user?.id)
        .single()

    const name = profile?.full_name || user?.email?.split('@')[0] || 'User'
    const date = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Good morning, {name}
                    </h1>
                    <p className="text-slate-500 mt-1">Here's what's happening in your business today.</p>
                </div>
                <div className="text-right">
                    <div className="text-sm text-slate-500 uppercase tracking-widest font-semibold">{date}</div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Estimated Revenue"
                    value="$0.00"
                    trend="+0% this month"
                    icon="💰"
                    color="blue"
                />
                <MetricCard
                    title="Compliance Score"
                    value="98/100"
                    trend="ABR Verified"
                    icon="🛡️"
                    color="emerald"
                />
                <MetricCard
                    title="Active Deals"
                    value="3"
                    trend="1 closing soon"
                    icon="🤝"
                    color="purple"
                />
                <MetricCard
                    title="Open Tickets"
                    value="0"
                    trend="All clear"
                    icon="🎫"
                    color="amber"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content / Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
                            <span>⚡</span> Recent Activity
                        </h2>
                        <div className="space-y-4">
                            <ActivityItem
                                title="Compliance check completed"
                                desc="Your entity details were verified against the ABR."
                                time="2 hours ago"
                                icon="✅"
                            />
                            <ActivityItem
                                title="New login detected"
                                desc={`Login from ${user?.email}`}
                                time="Just now"
                                icon="🔐"
                            />
                            <ActivityItem
                                title="System Update"
                                desc="vOS has been updated to version 2.1.0"
                                time="Yesterday"
                                icon="🚀"
                            />
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900">
                            <span>💡</span> Suggested Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <ActionCard
                                title="Apply for Grants"
                                desc="3 new grants match your profile."
                                href="/dashboard/grants"
                            />
                            <ActionCard
                                title="Check Award Rates"
                                desc="Ensure you're paying staff correctly."
                                href="/dashboard/awards"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar / Quick Links */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-600 rounded-xl p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-bold text-lg text-white mb-2">Upgrade to Pro</h3>
                            <p className="text-sm text-blue-100/90 mb-4">Unlock advanced AI insights and unlimited storage.</p>
                            <button className="bg-white text-blue-600 hover:bg-blue-50 text-sm font-bold px-4 py-2 rounded-lg transition-colors w-full shadow-sm">
                                View Plans
                            </button>
                        </div>
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold mb-4 text-slate-900">System Status</h3>
                        <div className="space-y-3">
                            <StatusRow label="ATO Connect" status="Online" color="emerald" />
                            <StatusRow label="Fair Work API" status="Online" color="emerald" />
                            <StatusRow label="Banking Gateways" status="Operational" color="emerald" />
                            <StatusRow label="AI Inference" status="Degraded" color="amber" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function MetricCard({ title, value, trend, icon, color }: any) {
    return (
        <div className="bg-white border border-slate-200 p-6 rounded-xl relative overflow-hidden group hover:border-slate-300 transition-all shadow-sm">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2 rounded-lg bg-${color}-50 text-${color}-600`}>
                        {icon}
                    </div>
                    {/* Trend Pill */}
                    <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${color}-50 text-${color}-700`}>
                        {trend}
                    </span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
                <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
            </div>
        </div>
    )
}

function ActivityItem({ title, desc, time, icon }: any) {
    return (
        <div className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{title}</p>
                <p className="text-sm text-slate-500 truncate">{desc}</p>
            </div>
            <div className="text-xs text-slate-400 whitespace-nowrap">{time}</div>
        </div>
    )
}

function ActionCard({ title, desc, href }: any) {
    return (
        <Link
            href={href}
            className="block p-4 border border-slate-200 hover:border-blue-300 hover:shadow-md hover:shadow-blue-900/5 rounded-lg transition-all group bg-slate-50 hover:bg-white"
        >
            <h3 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                {title}
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </h3>
            <p className="text-sm text-slate-500 mt-1">{desc}</p>
        </Link>
    )
}

function StatusRow({ label, status, color }: any) {
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{label}</span>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full bg-${color}-500 animate-pulse`} />
                <span className={`font-medium text-${color}-700`}>{status}</span>
            </div>
        </div>
    )
}

'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>({ users: 0, tenants: 0, mrr: 0 })
    const [tenants, setTenants] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [impersonating, setImpersonating] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        loadDashboard()
    }, [])

    const loadDashboard = async () => {
        // Mock MRR and Token data for now as specific tables might be empty
        const { count: users } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
        const { data: tenantList } = await supabase.from('organisations').select('id, legal_name, tier, status, created_at')

        setStats({
            users: users || 0,
            tenants: tenantList?.length || 0,
            mrr: (tenantList?.filter(t => t.tier === 'scale').length || 0) * 299 + (tenantList?.filter(t => t.tier === 'growth').length || 0) * 99
        })
        setTenants(tenantList || [])
        setLoading(false)
    }

    const handleImpersonate = async (tenantId: string) => {
        setImpersonating(tenantId)
        // In a real scenario, this would call the Edge Function 'admin-impersonate'
        // which returns a specialised JWT. 
        // For this demo, we will simulate the "Action Log" and redirect.

        await supabase.from('admin_audit_logs').insert({
            action: 'IMPERSONATE_TENANT',
            target_tenant_id: tenantId,
            reason: 'Support Request Investigation'
        })

        // Simulator delay
        await new Promise(r => setTimeout(r, 1500))

        alert(`[SIMULATION] You would now be logged in as tenant ${tenantId}`)
        setImpersonating(null)
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    <span className="text-red-500">🛡️</span> Super Admin Portal
                </h1>
                <p className="text-slate-400">Global control plane for simple multi-tenancy.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total Tenants" value={stats.tenants} icon="🏢" color="blue" />
                <StatCard label="Active Users" value={stats.users} icon="👥" color="indigo" />
                <StatCard label="Est. MRR" value={`$${stats.mrr}`} icon="💰" color="emerald" />
                <StatCard label="AI Token Spend" value="$42.50" icon="🤖" color="purple" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Tenant Table */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                    <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                        <h3 className="font-semibold text-white">Tenant Directory</h3>
                        <input placeholder="Search tenants..." className="bg-slate-900 border border-slate-800 rounded px-3 py-1 text-sm text-white focus:outline-none focus:border-red-500" />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-950 text-slate-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Legal Name</th>
                                    <th className="px-6 py-3">Tier</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                                {loading ? (
                                    <tr><td colSpan={4} className="p-8 text-center">Loading directory...</td></tr>
                                ) : tenants.map((tenant) => (
                                    <tr key={tenant.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{tenant.legal_name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${tenant.tier === 'scale' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                }`}>
                                                {tenant.tier}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleImpersonate(tenant.id)}
                                                disabled={!!impersonating}
                                                className="text-xs bg-slate-800 hover:bg-red-900/30 hover:text-red-400 text-slate-300 px-3 py-1.5 rounded border border-slate-700 transition-all"
                                            >
                                                {impersonating === tenant.id ? 'Accessing...' : 'Impersonate'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* AI Cost Chart Simulation */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
                    <h3 className="font-semibold text-white mb-6">AI Usage (Tokens)</h3>
                    <div className="flex-1 flex items-end gap-2 h-64 border-b border-slate-700 pb-2">
                        {[45, 78, 23, 90, 56, 34, 67].map((h, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div
                                    className="bg-purple-600/50 hover:bg-purple-500 transition-all rounded-t w-full"
                                    style={{ height: `${h}%` }}
                                />
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-950 text-white text-xs px-2 py-1 rounded border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {h * 1000} tokens
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2 font-mono uppercase">
                        <span>Mon</span>
                        <span>Sun</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ label, value, icon, color }: { label: string, value: string | number, icon: string, color: string }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between group hover:border-slate-700 transition-all">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-${color}-500/10 text-${color}-500 border border-${color}-500/20 group-hover:bg-${color}-500/20 transition-colors`}>
                {icon}
            </div>
        </div>
    )
}

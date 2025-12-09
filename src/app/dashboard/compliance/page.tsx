import { createClient } from '@/lib/supabase/server'
import ComplianceCard from './compliance-card'

export const dynamic = 'force-dynamic'

export default async function CompliancePage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Disable caching for this page to ensure fresh data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*, organisations(*)')
        .eq('id', user!.id)
        .single()

    const org = profile?.organisations

    if (!org) return <div>Organisation not found</div>

    return (
        <div className="p-8 space-y-8 max-w-4xl">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Compliance & Entity</h1>
                    <p className="text-slate-400">Manage your sovereign entity details.</p>
                </div>
                <div className="px-3 py-1 bg-emerald-900/30 border border-emerald-800 text-emerald-400 rounded-full text-xs font-mono uppercase">
                    ABR Verified
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Org Card */}
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span>🏢</span> Organisation Details
                    </h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider">Legal Name</label>
                                <div className="text-white font-medium">{org.legal_name}</div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider">ABN</label>
                                <div className="text-mono text-slate-300 font-mono tracking-wide">{org.abn}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider">Entity Type</label>
                                <div className="text-slate-300">{org.entity_type}</div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider">GST Status</label>
                                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${org.gst_status?.toLowerCase().includes('registered')
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : 'bg-slate-800 text-slate-400'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${org.gst_status?.toLowerCase().includes('registered') ? 'bg-emerald-400' : 'bg-slate-500'
                                        }`} />
                                    {org.gst_status}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compliance Status */}
                <ComplianceCard org={org} />
            </div>
        </div>
    )
}

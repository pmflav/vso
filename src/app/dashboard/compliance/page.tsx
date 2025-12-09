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
        <div className="space-y-8 max-w-4xl h-full flex flex-col">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Compliance & Entity</h1>
                    <p className="text-slate-500">Manage your sovereign entity details.</p>
                </div>
                <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-xs font-mono uppercase font-semibold">
                    ABR Verified
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Org Card */}
                <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                        <span>🏢</span> Organisation Details
                    </h3>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Legal Name</label>
                                <div className="text-slate-900 font-medium">{org.legal_name}</div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">ABN</label>
                                <div className="text-mono text-slate-600 font-mono tracking-wide">{org.abn}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Entity Type</label>
                                <div className="text-slate-700">{org.entity_type}</div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 uppercase tracking-wider font-semibold">GST Status</label>
                                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${org.gst_status?.toLowerCase().includes('registered')
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                    }`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${org.gst_status?.toLowerCase().includes('registered') ? 'bg-emerald-500' : 'bg-slate-500'
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

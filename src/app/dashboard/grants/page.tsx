'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function GrantScoutPage() {
    const [grants, setGrants] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [scouting, setScouting] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchGrants()
    }, [])

    const fetchGrants = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase.from('profiles').select('organisation_id').eq('id', user.id).single()
        if (!profile) return

        const { data } = await supabase
            .from('grants')
            .select('*')
            .eq('organisation_id', profile.organisation_id)
            .order('match_score', { ascending: false })

        setGrants(data || [])
        setLoading(false)
    }

    const handleScout = async () => {
        setScouting(true)
        // Simulate "AI Scanning" delay
        await new Promise(resolve => setTimeout(resolve, 3000))

        const { data: { user } } = await supabase.auth.getUser()
        const { data: profile } = await supabase.from('profiles').select('organisation_id').eq('id', user!.id).single()
        if (!profile) return

        // Mock ingestion
        const newGrants = [
            {
                organisation_id: profile.organisation_id,
                title: 'Export Market Development Grant (EMDG)',
                description: 'Financial assistance for detailed marketing and promotional activities for international markets.',
                amount: 'Up to $770k',
                match_score: 95,
                deadline: new Date(Date.now() + 86400000 * 30).toISOString(),
                status: 'New'
            },
            {
                organisation_id: profile.organisation_id,
                title: 'R&D Tax Incentive',
                description: 'Tax offset for critical R&D activities to boost competitiveness.',
                amount: 'Tax Offset',
                match_score: 88,
                deadline: new Date(Date.now() + 86400000 * 60).toISOString(),
                status: 'New'
            },
            {
                organisation_id: profile.organisation_id,
                title: 'Sovereign Industrial Capability Priority Grant',
                description: 'Help for SMEs to build capabilities aligned with Defence priorities.',
                amount: '$50k - $1M',
                match_score: 92,
                deadline: new Date(Date.now() + 86400000 * 14).toISOString(),
                status: 'New'
            }
        ]

        // Insert only if they don't exist (very basic check by title for this demo)
        for (const grant of newGrants) {
            const { data: existing } = await supabase.from('grants').select('id').eq('title', grant.title).single()
            if (!existing) {
                await supabase.from('grants').insert(grant)
            }
        }

        await fetchGrants()
        setScouting(false)
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto h-full flex flex-col">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                        <span>🔭</span> Grant Scout
                    </h1>
                    <p className="text-slate-500 mt-1">AI-powered funding opportunities for your business.</p>
                </div>
                <button
                    onClick={handleScout}
                    disabled={scouting}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
                >
                    {scouting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                            Scouting...
                        </>
                    ) : (
                        <>
                            <span>🚀</span> Scout for Grants
                        </>
                    )}
                </button>
            </header>

            {/* Stats / Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                    <h4 className="text-slate-500 text-sm font-medium uppercase">Total Opportunities</h4>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{grants.length}</p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                    <h4 className="text-slate-500 text-sm font-medium uppercase">Potential Funding</h4>
                    <p className="text-3xl font-bold text-emerald-600 mt-2">~$1.5M</p>
                </div>
                <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                    <h4 className="text-slate-500 text-sm font-medium uppercase">Best Match</h4>
                    <p className="text-3xl font-bold text-purple-600 mt-2">
                        {grants.length > 0 ? Math.max(...grants.map(g => g.match_score)) + '%' : '-'}
                    </p>
                </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">Matched Opportunities</h3>
                {loading ? (
                    <div className="py-12 text-center text-slate-400">Loading grants...</div>
                ) : grants.length === 0 ? (
                    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-12 text-center space-y-4">
                        <div className="text-4xl">📭</div>
                        <h3 className="text-slate-900 font-medium">No grants found yet</h3>
                        <p className="text-slate-500 text-sm max-w-md mx-auto">
                            Run the "Grant Scout" to analyze your business profile against thousands of government and private funding opportunities.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {grants.map((grant) => (
                            <GrantCard key={grant.id} grant={grant} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

function GrantCard({ grant }: { grant: any }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-6 hover:border-purple-300 transition-all group relative overflow-hidden shadow-sm hover:shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="text-6xl text-slate-300">💰</span>
            </div>

            <div className="flex items-start justify-between relative z-10">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors">{grant.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${grant.match_score >= 90 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                            grant.match_score >= 70 ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                            {grant.match_score}% Match
                        </span>
                    </div>
                    <p className="text-slate-500 max-w-2xl text-sm leading-relaxed">{grant.description}</p>

                    <div className="flex items-center gap-6 pt-2 text-sm">
                        <div className="text-slate-600">
                            <span className="text-slate-400 mr-2">Amount:</span>
                            {grant.amount}
                        </div>
                        <div className="text-slate-600">
                            <span className="text-slate-400 mr-2">Deadline:</span>
                            {new Date(grant.deadline).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
                        Apply Now
                    </button>
                    <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-lg text-sm font-medium transition-colors">
                        Hide
                    </button>
                </div>
            </div>
        </div>
    )
}

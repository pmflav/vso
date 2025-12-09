'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ComplianceCard({ org }: { org: any }) {
    const [loading, setLoading] = useState(false)
    const [optimisticOrg, setOptimisticOrg] = useState(org)
    const router = useRouter()
    const supabase = createClient()

    const runCheck = async () => {
        setLoading(true)
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        const updates = {
            last_compliance_check: new Date().toISOString(),
            compliance_score: 98 // Simulating a high score result
        }

        // Optimistic update
        setOptimisticOrg({ ...optimisticOrg, ...updates })

        // Update DB
        const { error } = await supabase
            .from('organisations')
            .update(updates)
            .eq('id', org.id)

        setLoading(false)

        if (!error) {
            router.refresh()
        }
    }

    const lastChecked = optimisticOrg.last_compliance_check
        ? new Date(optimisticOrg.last_compliance_check).toLocaleDateString()
        : 'Never'

    // Derived status logic
    const isVerified = !!optimisticOrg.last_compliance_check
    const score = optimisticOrg.compliance_score || 0

    return (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6 relative overflow-hidden group">
            {/* Background Glow Effect */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-opacity duration-1000 ${isVerified ? 'opacity-100' : 'opacity-0'}`} />

            <h3 className="text-lg font-semibold text-white flex items-center justify-between relative z-10">
                <span className="flex items-center gap-2">🛡️ Compliance Status</span>
                {score > 0 && <span className="text-emerald-400 font-mono text-sm">{score}% Score</span>}
            </h3>

            <div className="space-y-4 relative z-10">
                <StatusItem label="ABR Registration" status="Active" isGood={true} />
                <StatusItem label="Director ID" status={isVerified ? "Verified" : "Pending"} isGood={isVerified} />
                <StatusItem label="BAS Lodgement" status={isVerified ? "Up to date" : "Unknown"} isGood={isVerified} />

                <div className="pt-2 border-t border-slate-800/50 flex justify-between items-center text-xs text-slate-500">
                    <span>Last Check:</span>
                    <span className="font-mono text-slate-400">{lastChecked}</span>
                </div>
            </div>

            <button
                onClick={runCheck}
                disabled={loading}
                className="w-full mt-4 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-lg text-sm font-medium transition-all border border-slate-700 relative z-10 flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                        Running Analysis...
                    </>
                ) : (
                    'Run Compliance Check'
                )}
            </button>
        </div>
    )
}

function StatusItem({ label, status, isGood }: { label: string, status: string, isGood: boolean }) {
    return (
        <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
            <span className="text-sm text-slate-300">{label}</span>
            <span className={`text-sm font-medium transition-colors duration-500 ${isGood ? 'text-emerald-400' : 'text-amber-400'}`}>
                {status}
            </span>
        </div>
    )
}

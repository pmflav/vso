'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ABNData = {
    abn: string
    entityName: string
    entityType: string
    gstStatus: string
    address: { state: string; postcode: string }
}

export default function OnboardingPage() {
    const [abn, setAbn] = useState('')
    const [data, setData] = useState<ABNData | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()
    const router = useRouter()

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setData(null)

        try {
            const { data: funcData, error: funcError } = await supabase.functions.invoke('lookup-abn', {
                body: { abn },
            })

            if (funcError) throw funcError
            if (funcData.error) throw new Error(funcData.error)

            setData(funcData)
        } catch (err: any) {
            setError(err.message || 'Failed to lookup ABN')
        } finally {
            setLoading(false)
        }
    }

    const handleConfirm = async () => {
        if (!data) return
        setLoading(true)

        try {
            // 1. Create Organisation
            const { data: org, error: orgError } = await supabase
                .from('organisations')
                .insert({
                    abn: data.abn,
                    legal_name: data.entityName,
                    entity_type: data.entityType,
                    gst_status: data.gstStatus,
                    tier: 'Solo'
                })
                .select()
                .single()

            if (orgError) throw orgError

            // 2. Link Profile to Organisation
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ organisation_id: org.id })
                .eq('id', (await supabase.auth.getUser()).data.user?.id)

            if (profileError) throw profileError

            // 3. Redirect
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="max-w-xl w-full space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                        Let's setup your business
                    </h1>
                    <p className="text-slate-400">Enter your ABN to auto-fetch your details from the ABR.</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleLookup} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="e.g. 51 835 430 479"
                            value={abn}
                            onChange={(e) => setAbn(e.target.value)}
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 rounded-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </form>

                    {error && (
                        <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 text-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    {data && (
                        <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="grid gap-4 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                                <div>
                                    <span className="text-xs text-slate-500 uppercase tracking-wider">Legal Name</span>
                                    <p className="text-lg font-medium text-white">{data.entityName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider">Entity Type</span>
                                        <p className="text-slate-300">{data.entityType}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-500 uppercase tracking-wider">GST Status</span>
                                        <p className="text-emerald-400">{data.gstStatus}</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02]"
                            >
                                Confirm & Create Account
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

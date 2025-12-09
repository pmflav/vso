'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [profile, setProfile] = useState<any>(null)
    const [organisation, setOrganisation] = useState<any>(null)

    // Form State
    const [fullName, setFullName] = useState('')
    const [jobTitle, setJobTitle] = useState('')

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    router.push('/login')
                    return
                }

                // Fetch Profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profileError) throw profileError

                setProfile(profileData)
                setFullName(profileData.full_name || '')
                setJobTitle(profileData.job_title || '')

                // Fetch Organisation if exists
                if (profileData.organisation_id) {
                    const { data: orgData, error: orgError } = await supabase
                        .from('organisations')
                        .select('*')
                        .eq('id', profileData.organisation_id)
                        .single()

                    if (!orgError) setOrganisation(orgData)
                }

            } catch (error: any) {
                console.error('Error fetching profile:', error)
                setMessage({ type: 'error', text: 'Failed to load profile data.' })
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [supabase, router])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setUpdating(true)
        setMessage(null)

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    job_title: jobTitle,
                })
                .eq('id', profile.id)

            if (error) throw error

            setMessage({ type: 'success', text: 'Profile updated successfully.' })
            router.refresh()
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile.' })
        } finally {
            setUpdating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <div className="text-slate-400 animate-pulse">Loading profile...</div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                    Your Profile
                </h1>
                <p className="text-slate-500">Manage your personal information and account settings.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b border-slate-100 mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold border border-blue-100">
                            {fullName.charAt(0) || '?'}
                        </div>
                        <div>
                            <p className="text-lg font-medium text-slate-900">{profile?.email}</p>
                            <p className="text-sm text-slate-400 font-mono">ID: {profile?.id?.slice(0, 8)}...</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Job Title</label>
                            <input
                                type="text"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                                placeholder="e.g. Manager"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Organisation</label>
                        <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-500 flex justify-between items-center">
                            <span className="text-slate-700 font-medium">{organisation?.legal_name || 'No Organisation Linked'}</span>
                            {organisation?.industry && (
                                <span className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-full shadow-sm">
                                    {organisation.industry}
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">Contact admin to update organisation details.</p>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-lg flex items-center gap-2 text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={updating}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
                        >
                            {updating ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

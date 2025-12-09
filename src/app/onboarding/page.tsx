'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type ABNData = {
    abn: string
    entityName: string
    entityType: string
    gstStatus: string
    address: { state: string; postcode: string }
}

export default function OnboardingPage() {
    const [step, setStep] = useState(0)

    // Step 0: Registration Data
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [abn, setAbn] = useState('')

    // ABN Data
    const [abnData, setAbnData] = useState<ABNData | null>(null)

    // Post-Registration State
    const [orgId, setOrgId] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Final Company Name (can be edited)
    const [companyName, setCompanyName] = useState('')

    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        // Prefill email if logged in
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user?.email) setEmail(user.email)
        }
        getUser()
    }, [supabase])

    // Step 0: Initial Search
    const handleInitialSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (abn.trim()) {
                // ABN Provided -> Lookup
                const { data: funcData, error: funcError } = await supabase.functions.invoke('lookup-abn', {
                    body: { abn },
                })

                if (funcError) throw funcError
                if (funcData.error) throw new Error(funcData.error)

                setAbnData(funcData)
                setCompanyName(funcData.entityName)
                setStep(1) // Move to Review ABN
            } else {
                // No ABN -> Manual Entry Logic

                // 1. Create Profile first
                const user = await createProfile()
                if (!user) return

                // 2. Go to Manual Name Entry
                // We haven't created the org yet because we don't have a name.
                // Step 4 will handle creation if orgId is null.
                setStep(4)
            }
        } catch (err: any) {
            setError(err.message || 'Failed to process details.')
        } finally {
            setLoading(false)
        }
    }

    const createProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('You must be logged in.')

        const fullName = `${firstName} ${lastName}`.trim()
        await supabase.from('profiles').update({ full_name: fullName }).eq('id', user.id)
        return user
    }

    // Step 1: Confirm ABN & Create Account
    const handleConfirmRegistration = async () => {
        if (!abnData) return
        setLoading(true)
        setError(null)

        try {
            const user = await createProfile()

            // Create Organisation from ABR data
            const { data: org, error: orgError } = await supabase
                .from('organisations')
                .insert({
                    legal_name: abnData.entityName,
                    abn: abnData.abn,
                    entity_type: abnData.entityType,
                    gst_status: abnData.gstStatus,
                    status: 'active'
                })
                .select()
                .single()

            if (orgError) throw orgError

            if (org) {
                await supabase.from('profiles').update({ organisation_id: org.id }).eq('id', user.id)
                setOrgId(org.id)
                setStep(2) // Move to Industry
            }

        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Setup failed')
        } finally {
            setLoading(false)
        }
    }

    // Handle submitting "Business Name" manually (Step 4 logic)
    const handleManualCompanySubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (orgId) {
                // Update existing (Step 4 standard flow)
                const { error } = await supabase.from('organisations').update({ legal_name: companyName }).eq('id', orgId)
                if (error) throw error
            } else {
                // Create new (Step 0 -> Step 4 flow)
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) throw new Error('No user')

                const { data: org, error: orgError } = await supabase
                    .from('organisations')
                    .insert({
                        legal_name: companyName,
                        status: 'active'
                    })
                    .select()
                    .single()

                if (orgError) throw orgError
                if (org) {
                    await supabase.from('profiles').update({ organisation_id: org.id }).eq('id', user.id)
                    setOrgId(org.id)
                    setStep(2) // Go to Industry now
                    setLoading(false)
                    return
                }
            }

            // If we were updating (standard Step 4), we are done
            router.refresh()
            router.push('/dashboard')

        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }


    // Step 2: Industry Selection
    const handleIndustry = async (industry: string) => {
        if (!orgId) return
        setLoading(true)
        try {
            const { error } = await supabase.from('organisations').update({ industry }).eq('id', orgId)
            if (error) throw error
            setStep(3)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Step 3: Role Selection
    const handleRole = async (role: string) => {
        setLoading(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user')

            const { error } = await supabase.from('profiles').update({ job_title: role }).eq('id', user.id)
            if (error) throw error

            // Standard flow: Step 4 is "Confirm Name".
            // If manual entry, we effectively just did that.
            // If we already entered name manually (companyName is set), maybe skip confirm?

            if (companyName) {
                // We can skip strict confirmation if they just typed it or we confirmed it from ABR
                // Actually standard flow goes Step 1 (ABR Confirm) -> Step 2 (Industry) -> Step 3 (Role) -> Step 4 (Confirm Name).
                // So we should go to Step 4.
                setStep(4)
            } else {
                setStep(4)
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900 font-sans">
            <div className="max-w-xl w-full">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg animate-in fade-in slide-in-from-top-2 text-sm">
                        {error}
                    </div>
                )}

                {/* Step 0: Initial Details + Optional ABN */}
                {step === 0 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                Let's find your business
                            </h1>
                            <p className="text-slate-500">Enter your details to get started.</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                            <form onSubmit={handleInitialSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="First Name *" value={firstName} onChange={setFirstName} required />
                                    <Input label="Last Name *" value={lastName} onChange={setLastName} required />
                                </div>
                                <Input label="Email Address *" value={email} onChange={setEmail} required type="email" />
                                <Input label="Australian Business Number (ABN)" value={abn} onChange={setAbn} placeholder="Optional - Enter if waiting for verification" />
                                <Button loading={loading}>{abn ? 'Verify Business' : 'Continue'}</Button>
                            </form>
                        </div>
                    </div>
                )}

                {/* Step 1: Review ABN Data */}
                {step === 1 && abnData && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-slate-900">Is this your business?</h1>
                            <p className="text-slate-500">We found these details on the Australian Business Register.</p>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
                            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 space-y-4">
                                <div>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Entity Name</span>
                                    <p className="text-xl font-semibold text-slate-900">{abnData.entityName}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">ABN</span>
                                        <p className="text-slate-700 font-mono">{abnData.abn}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Type</span>
                                        <p className="text-slate-700">{abnData.entityType}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Location</span>
                                        <p className="text-slate-700">{abnData.address.state}, {abnData.address.postcode}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">GST Status</span>
                                        <p className="text-emerald-600 font-medium">{abnData.gstStatus}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleConfirmRegistration}
                                    disabled={loading}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.02]"
                                >
                                    {loading ? 'Setting up...' : 'Yes, this is correct'}
                                </button>
                                <button
                                    onClick={() => setStep(0)}
                                    className="text-sm text-slate-500 hover:text-slate-800 transition-colors font-medium"
                                >
                                    No, search again
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Industry */}
                {step === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-slate-900">What industry are you in?</h1>
                            <p className="text-slate-500">We'll focus your experience based on your choice.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {['Marketing and Advertising', 'Technology and Services', 'Computer Software', 'Real Estate', 'Financial Services', 'Health, Wellness and Fitness', 'Education', 'Consulting', 'Retail'].map(ind => (
                                <OptionButton key={ind} onClick={() => handleIndustry(ind)} label={ind} />
                            ))}
                            <button className="col-span-1 md:col-span-2 text-slate-500 text-sm hover:text-slate-700 mt-2 font-medium">
                                Industry not listed? <span className="underline decoration-slate-400">Search all</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Role */}
                {step === 3 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-slate-900">Which best describes your role?</h1>
                            <p className="text-slate-500">This helps us surface the right tools and tips.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {['Owner', 'Executive Team', 'Manager', 'Employee', 'Student', 'Intern', 'Freelancer', 'Other'].map(role => (
                                <OptionButton key={role} onClick={() => handleRole(role)} label={role} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Final Name Check / Manual Entry */}
                {step === 4 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-slate-900">What is your company's name?</h1>
                            <p className="text-slate-500">We'll use your company name to make things feel more familiar.</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                            <form onSubmit={handleManualCompanySubmit} className="space-y-6">
                                <Input label="Company Name *" value={companyName} onChange={setCompanyName} required />
                                <Button loading={loading}>Continue to Dashboard</Button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

// Components

function Input({ label, value, onChange, required, type = 'text', placeholder }: any) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                {label}
            </label>
            <input
                type={type}
                required={required}
                value={value}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all placeholder:text-slate-400 text-base"
            />
        </div>
    )
}

function Button({ children, loading }: any) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-slate-900/20 transition-all hover:scale-[1.02] disabled:opacity-50 text-base"
        >
            {loading ? 'Processing...' : children}
        </button>
    )
}

function OptionButton({ label, onClick }: any) {
    return (
        <button
            onClick={onClick}
            className="p-4 bg-white text-slate-700 border border-slate-200 rounded-xl hover:border-slate-400 hover:shadow-md transition-all font-medium text-center text-sm"
        >
            {label}
        </button>
    )
}

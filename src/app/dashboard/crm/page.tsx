'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function CRMPage() {
    const [activeTab, setActiveTab] = useState<'deals' | 'contacts'>('deals')
    const [deals, setDeals] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    const [contacts, setContacts] = useState<any[]>([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const { data: dealsData } = await supabase
                .from('deals')
                .select('*, contacts(first_name, last_name)')

            setDeals(dealsData || [])

            const { data: contactsData } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false })

            setContacts(contactsData || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 space-y-6 h-full flex flex-col">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">CRM & Deals</h1>
                    <p className="text-slate-400">Manage your pipeline.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                        <button
                            onClick={() => setActiveTab('deals')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'deals' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Deals Board
                        </button>
                        <button
                            onClick={() => setActiveTab('contacts')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'contacts' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                        >
                            Contacts
                        </button>
                    </div>
                    {activeTab === 'deals' ? (
                        <button
                            onClick={() => (document.getElementById('new_deal_modal') as HTMLDialogElement)?.showModal()}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                            + New Deal
                        </button>
                    ) : (
                        <button
                            onClick={() => (document.getElementById('new_contact_modal') as HTMLDialogElement)?.showModal()}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                        >
                            + New Contact
                        </button>
                    )}
                </div>
            </header>

            <dialog id="new_deal_modal" className="bg-slate-900 border border-slate-800 text-white p-6 rounded-xl backdrop:bg-slate-950/80 w-full max-w-md">
                <form method="dialog" className="space-y-4" onSubmit={async (e) => {
                    const form = e.target as HTMLFormElement
                    const title = (form.elements.namedItem('title') as HTMLInputElement).value
                    const value = (form.elements.namedItem('value') as HTMLInputElement).value

                    if (!title) return

                    const { data: { user } } = await supabase.auth.getUser()
                    if (!user) return

                    const { data: profile } = await supabase.from('profiles').select('organisation_id').eq('id', user.id).single()
                    if (!profile) return

                    const { data: pipelines } = await supabase.from('pipelines').select('id').eq('organisation_id', profile.organisation_id).limit(1).single()

                    await supabase.from('deals').insert({
                        organisation_id: profile.organisation_id,
                        pipeline_id: pipelines?.id,
                        title,
                        value: value ? parseFloat(value) : 0,
                        stage: 'Lead'
                    })

                    fetchData()
                    form.reset()
                        ; (document.getElementById('new_deal_modal') as HTMLDialogElement)?.close()
                }}>
                    <h3 className="text-lg font-bold">New Deal</h3>
                    <input name="title" placeholder="Deal Title" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white" required />
                    <input name="value" type="number" placeholder="Value ($)" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white" />
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => (document.getElementById('new_deal_modal') as HTMLDialogElement)?.close()} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Create</button>
                    </div>
                </form>
            </dialog>

            <dialog id="new_contact_modal" className="bg-slate-900 border border-slate-800 text-white p-6 rounded-xl backdrop:bg-slate-950/80 w-full max-w-md">
                <form method="dialog" className="space-y-4" onSubmit={async (e) => {
                    const form = e.target as HTMLFormElement
                    const firstName = (form.elements.namedItem('first_name') as HTMLInputElement).value
                    const lastName = (form.elements.namedItem('last_name') as HTMLInputElement).value
                    const email = (form.elements.namedItem('email') as HTMLInputElement).value

                    if (!firstName) return

                    const { data: { user } } = await supabase.auth.getUser()
                    if (!user) return

                    const { data: profile } = await supabase.from('profiles').select('organisation_id').eq('id', user.id).single()
                    if (!profile) return

                    await supabase.from('contacts').insert({
                        organisation_id: profile.organisation_id,
                        first_name: firstName,
                        last_name: lastName,
                        email: email
                    })

                    fetchData()
                    form.reset()
                        ; (document.getElementById('new_contact_modal') as HTMLDialogElement)?.close()
                }}>
                    <h3 className="text-lg font-bold">New Contact</h3>
                    <input name="first_name" placeholder="First Name" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white" required />
                    <input name="last_name" placeholder="Last Name" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white" />
                    <input name="email" type="email" placeholder="Email" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white" />
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => (document.getElementById('new_contact_modal') as HTMLDialogElement)?.close()} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">Create</button>
                    </div>
                </form>
            </dialog>

            {loading ? (
                <div className="flex-1 flex items-center justify-center text-slate-500">Loading your pipeline...</div>
            ) : activeTab === 'deals' ? (
                <KanbanBoard deals={deals} />
            ) : (
                <ContactsView contacts={contacts} />
            )}
        </div>
    )
}

function KanbanBoard({ deals }: { deals: any[] }) {
    const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Won", "Lost"]

    return (
        <div className="flex-1 overflow-x-auto">
            <div className="flex gap-4 min-w-max h-full">
                {stages.map((stage) => (
                    <div key={stage} className="w-80 flex flex-col bg-slate-900/50 rounded-xl border border-slate-800/50">
                        <div className="p-4 border-b border-slate-800/50 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-sm rounded-t-xl z-10">
                            <span className="font-semibold text-slate-300">{stage}</span>
                            <span className="text-xs bg-slate-800 text-slate-500 px-2 py-1 rounded-full">
                                {deals.filter(d => d.stage === stage).length}
                            </span>
                        </div>
                        <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                            {deals.filter(d => d.stage === stage).map(deal => (
                                <div key={deal.id} className="p-4 bg-slate-800 border border-slate-700 rounded-lg shadow-sm hover:border-blue-500/50 transition-all cursor-pointer group">
                                    <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">{deal.title}</h4>
                                    <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                                        <span>{deal.value ? `$${deal.value.toLocaleString()}` : '-'}</span>
                                        {deal.expected_close_date && (
                                            <span>{new Date(deal.expected_close_date).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {deals.filter(d => d.stage === stage).length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-slate-800/50 rounded-lg">
                                    <span className="text-slate-600 text-sm">Empty</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ContactsView({ contacts }: { contacts: any[] }) {
    return (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-950 border-b border-slate-800">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Created</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {contacts.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                No contacts found. Add one to get started.
                            </td>
                        </tr>
                    ) : (
                        contacts.map(contact => (
                            <tr key={contact.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{contact.first_name} {contact.last_name}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-400">{contact.email || '-'}</td>
                                <td className="px-6 py-4 text-slate-500 text-sm">
                                    {new Date(contact.created_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

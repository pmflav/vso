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
        <div className="space-y-8 h-full flex flex-col">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">CRM & Deals</h1>
                    <p className="text-slate-500">Manage your pipeline.</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setActiveTab('deals')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'deals' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Deals Board
                        </button>
                        <button
                            onClick={() => setActiveTab('contacts')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'contacts' ? 'bg-slate-100 text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-900'}`}
                        >
                            Contacts
                        </button>
                    </div>
                    {activeTab === 'deals' ? (
                        <button
                            onClick={() => (document.getElementById('new_deal_modal') as HTMLDialogElement)?.showModal()}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                            + New Deal
                        </button>
                    ) : (
                        <button
                            onClick={() => (document.getElementById('new_contact_modal') as HTMLDialogElement)?.showModal()}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                        >
                            + New Contact
                        </button>
                    )}
                </div>
            </header>

            <dialog id="new_deal_modal" className="bg-white border border-slate-200 text-slate-900 p-6 rounded-xl backdrop:bg-slate-900/50 w-full max-w-md shadow-2xl">
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
                    <input name="title" placeholder="Deal Title" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-slate-900" required />
                    <input name="value" type="number" placeholder="Value ($)" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-slate-900" />
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => (document.getElementById('new_deal_modal') as HTMLDialogElement)?.close()} className="px-4 py-2 text-slate-500 hover:text-slate-900">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">Create</button>
                    </div>
                </form>
            </dialog>

            <dialog id="new_contact_modal" className="bg-white border border-slate-200 text-slate-900 p-6 rounded-xl backdrop:bg-slate-900/50 w-full max-w-md shadow-2xl">
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
                    <input name="first_name" placeholder="First Name" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-slate-900" required />
                    <input name="last_name" placeholder="Last Name" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-slate-900" />
                    <input name="email" type="email" placeholder="Email" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-slate-900" />
                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => (document.getElementById('new_contact_modal') as HTMLDialogElement)?.close()} className="px-4 py-2 text-slate-500 hover:text-slate-900">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800">Create</button>
                    </div>
                </form>
            </dialog>

            {loading ? (
                <div className="flex-1 flex items-center justify-center text-slate-400">Loading your pipeline...</div>
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
        <div className="flex-1 overflow-x-auto pb-4">
            <div className="flex gap-4 min-w-max h-full">
                {stages.map((stage) => (
                    <div key={stage} className="w-80 flex flex-col bg-slate-100 rounded-xl border border-slate-200">
                        <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-slate-100/90 backdrop-blur-sm rounded-t-xl z-10">
                            <span className="font-semibold text-slate-700">{stage}</span>
                            <span className="text-xs bg-white border border-slate-200 text-slate-500 px-2 py-1 rounded-full">
                                {deals.filter(d => d.stage === stage).length}
                            </span>
                        </div>
                        <div className="p-3 space-y-3 overflow-y-auto flex-1 custom-scrollbar">
                            {deals.filter(d => d.stage === stage).map(deal => (
                                <div key={deal.id} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-400 hover:shadow-md transition-all cursor-pointer group">
                                    <h4 className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{deal.title}</h4>
                                    <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                                        <span>{deal.value ? `$${deal.value.toLocaleString()}` : '-'}</span>
                                        {deal.expected_close_date && (
                                            <span>{new Date(deal.expected_close_date).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {deals.filter(d => d.stage === stage).length === 0 && (
                                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-lg mx-3 my-2">
                                    <span className="text-slate-400 text-sm">Empty</span>
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
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {contacts.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                No contacts found. Add one to get started.
                            </td>
                        </tr>
                    ) : (
                        contacts.map(contact => (
                            <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{contact.first_name} {contact.last_name}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{contact.email || '-'}</td>
                                <td className="px-6 py-4 text-slate-400 text-sm">
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

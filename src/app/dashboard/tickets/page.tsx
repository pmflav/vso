'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function TicketsPage() {
    const [tickets, setTickets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchTickets()
    }, [])

    const fetchTickets = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase.from('profiles').select('organisation_id').eq('id', user.id).single()
        if (!profile) return

        const { data } = await supabase
            .from('tickets')
            .select('*')
            .eq('organisation_id', profile.organisation_id)
            .order('created_at', { ascending: false })

        setTickets(data || [])
        setLoading(false)
    }

    const createTicket = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const title = formData.get('title') as string
        const priority = formData.get('priority') as string

        const { data: { user } } = await supabase.auth.getUser()
        const { data: profile } = await supabase.from('profiles').select('organisation_id').eq('id', user!.id).single()
        if (!profile) return

        await supabase.from('tickets').insert({
            organisation_id: profile.organisation_id,
            title,
            priority,
            status: 'Open',
            created_by: user!.id
        })

        setShowModal(false)
        fetchTickets()
    }

    return (
        <div className="space-y-8 h-full flex flex-col">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Service Tickets</h1>
                    <p className="text-slate-500">Manage customer support and internal requests.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
                >
                    + New Ticket
                </button>
            </header>

            {/* Kanban Board (Simplified to 3 columns) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
                <TicketColumn title="Open" tickets={tickets.filter(t => t.status === 'Open')} color="blue" />
                <TicketColumn title="In Progress" tickets={tickets.filter(t => t.status === 'In Progress')} color="amber" />
                <TicketColumn title="Resolved" tickets={tickets.filter(t => t.status === 'Resolved')} color="emerald" />
            </div>

            {/* New Ticket Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                        <h2 className="text-xl font-bold text-slate-900">Create New Ticket</h2>
                        <form onSubmit={createTicket} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                <input name="title" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none" placeholder="e.g. System outage" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                <select name="priority" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-slate-900 outline-none">
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-500 hover:text-slate-900">Cancel</button>
                                <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg">Create Ticket</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function TicketColumn({ title, tickets, color }: { title: string, tickets: any[], color: string }) {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col h-full min-h-[400px]">
            <div className={`flex items-center justify-between mb-4 pb-2 border-b border-slate-200`}>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium bg-${color}-50 text-${color}-600 border border-${color}-100`}>
                    {tickets.length}
                </span>
            </div>

            <div className="space-y-3">
                {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-white border border-slate-200 p-4 rounded-lg shadow-sm hover:border-slate-300 transition-colors">
                        <h4 className="font-medium text-slate-900 mb-2">{ticket.title}</h4>
                        <div className="flex items-center justify-between text-xs">
                            <span className={`px-1.5 py-0.5 rounded border ${ticket.priority === 'Critical' ? 'border-red-200 text-red-700 bg-red-50' :
                                ticket.priority === 'High' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                                    'border-slate-200 text-slate-500 bg-slate-50'
                                }`}>
                                {ticket.priority}
                            </span>
                            <span className="text-slate-500">{new Date(ticket.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

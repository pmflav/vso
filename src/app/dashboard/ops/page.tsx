'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

type Task = {
    id: string
    title: string
    status: 'todo' | 'in_progress' | 'done'
    due_date: string | null
}

export default function OpsPage() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [newTask, setNewTask] = useState('')
    const supabase = createClient()

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false })
        setTasks(data || [])
        setLoading(false)
    }

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTask.trim()) return

        // Get Org ID (hacky, ideally stored in context/hook)
        const { data: { user } } = await supabase.auth.getUser()
        const { data: profile } = await supabase.from('profiles').select('organisation_id').eq('id', user!.id).single()

        if (!profile?.organisation_id) return

        const { data, error } = await supabase.from('tasks').insert({
            organisation_id: profile.organisation_id,
            title: newTask,
            status: 'todo'
        }).select().single()

        if (data) {
            setTasks([data, ...tasks])
            setNewTask('')
        }
    }

    const updateStatus = async (id: string, newStatus: string) => {
        // Optimistic update
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus as any } : t))
        await supabase.from('tasks').update({ status: newStatus }).eq('id', id)
    }

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold text-white">Operations</h1>
                <p className="text-slate-400">Track tasks and workflows.</p>
            </header>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                    <form onSubmit={addTask} className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Add a new task..."
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-600 outline-none"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 rounded-lg transition-colors">
                            Add Task
                        </button>
                    </form>
                </div>

                <div className="divide-y divide-slate-800">
                    {loading ? (
                        <div className="p-8 text-center text-slate-500">Loading tasks...</div>
                    ) : tasks.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            No tasks yet. Add one above!
                        </div>
                    ) : (
                        tasks.map(task => (
                            <div key={task.id} className="p-4 flex items-center gap-4 hover:bg-slate-800/50 transition-colors group">
                                <button
                                    onClick={() => updateStatus(task.id, task.status === 'done' ? 'todo' : 'done')}
                                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${task.status === 'done'
                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500'
                                            : 'border-slate-600 text-transparent hover:border-slate-400'
                                        }`}
                                >
                                    ✓
                                </button>
                                <span className={`flex-1 text-sm ${task.status === 'done' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                    {task.title}
                                </span>
                                <select
                                    value={task.status}
                                    onChange={(e) => updateStatus(task.id, e.target.value)}
                                    className="bg-transparent text-xs text-slate-500 border border-slate-800 rounded px-2 py-1 outline-none hover:border-slate-600 focus:border-blue-500"
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

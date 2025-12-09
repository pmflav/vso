'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const links = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/crm', label: 'CRM', icon: '🤝' },
    { href: '/dashboard/compliance', label: 'Compliance', icon: '🛡️' },
    { href: '/dashboard/awards', label: 'Awards', icon: '📜' },
    { href: '/dashboard/grants', label: 'Grants', icon: '💰' },
    { href: '/dashboard/tickets', label: 'Tickets', icon: '🎫' },
    { href: '/dashboard/ops', label: 'Operations', icon: '⚙️' },
]

export default function DashboardNav() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        setLoading(true)
        await supabase.auth.signOut()
        router.refresh()
        router.replace('/login')
        setLoading(false)
    }

    return (
        <nav className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-2 shrink-0 h-screen sticky top-0">
            <div className="mb-6 px-4">
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 text-transparent bg-clip-text">
                    OzCore vOS
                </div>
                <p className="text-xs text-slate-500">Sovereign Business OS</p>
            </div>

            <div className="flex-1 flex flex-col gap-1">
                {links.map(link => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <span>{link.icon}</span>
                            {link.label}
                        </Link>
                    )
                })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <Link
                    href="/dashboard/profile"
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${pathname === '/dashboard/profile'
                            ? 'bg-blue-50 text-blue-700 border border-blue-100 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                >
                    <span>👤</span>
                    User Profile
                </Link>

                <button
                    onClick={handleLogout}
                    disabled={loading}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-all w-full text-left"
                >
                    <span>🚪</span>
                    {loading ? 'Signing out...' : 'Logout'}
                </button>
            </div>
        </nav>
    )
}

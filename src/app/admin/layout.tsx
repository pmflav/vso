import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    console.log('Admin check:', user.id, profile)

    if (profile?.role !== 'admin') {
        redirect('/dashboard')
    }

    return (
        <div className="flex min-h-screen bg-slate-950">
            {/* Admin Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/admin" className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                        <span className="text-red-500">🛡️</span> Admin
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavItem href="/admin" icon="📊" label="System Overview" active />
                    <NavItem href="/admin/users" icon="👥" label="Users & Access" />
                    <NavItem href="/admin/orgs" icon="🏢" label="Organisations" />
                    <NavItem href="/dashboard" icon="↩️" label="Back to User App" />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-2 text-slate-400">
                        <div className="w-8 h-8 rounded-full bg-red-900/50 text-red-400 flex items-center justify-center font-bold">
                            A
                        </div>
                        <div className="text-xs truncate max-w-[120px]">
                            {user.email}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: string; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active
                ? 'bg-red-600/10 text-red-400 border border-red-600/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </Link>
    )
}

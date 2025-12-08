import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
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

    // Check if user has an organisation
    const { data: profile } = await supabase
        .from('profiles')
        .select('organisation_id')
        .eq('id', user.id)
        .single()

    if (!profile?.organisation_id) {
        redirect('/onboarding')
    }

    return (
        <div className="flex min-h-screen bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/dashboard" className="text-2xl font-bold text-white tracking-tight">
                        OzCore <span className="text-emerald-500">vOS</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <NavItem href="/dashboard" icon="📊" label="Overview" active />
                    <NavItem href="/dashboard/crm" icon="👥" label="CRM & Deals" />
                    <NavItem href="/dashboard/ops" icon="⚡" label="Operations" />
                    <NavItem href="/dashboard/compliance" icon="⚖️" label="Compliance" />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <div className="flex items-center gap-3 px-4 py-2 text-slate-400">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                            {user.email?.[0].toUpperCase()}
                        </div>
                        <div className="text-xs truncate max-w-[120px]">
                            {user.email}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}

function NavItem({ href, icon, label, active = false }: { href: string; icon: string; label: string; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${active
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
        >
            <span>{icon}</span>
            <span>{label}</span>
        </Link>
    )
}

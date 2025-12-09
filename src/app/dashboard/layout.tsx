import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from './nav'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Basic Auth Check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900">
            <DashboardNav />
            <main className="flex-1 p-8 overflow-y-auto h-screen">
                {children}
            </main>
        </div>
    )
}


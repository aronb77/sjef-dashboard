'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function getDashboardData() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return null
    }

    // 1. Fetch Profile (Credits)
    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, company_name, credits')
        .eq('id', user.id)
        .single()

    // 2. Count Active Quotes (Verzonden)
    const { count: activeCount } = await supabase
        .from('quotes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'verzonden')
        .eq('user_id', user.id)

    // 3. Fetch Recent Quotes (Limit 5)
    const { data: recentQuotes } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

    // 4. Fetch Agenda Items (Future dates, not rejected)
    const { data: agendaItems } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .gt('datum_klus', new Date().toISOString())
        .neq('status', 'afgewezen')
        .order('datum_klus', { ascending: true })

    // 5. Fetch Revenue Data (Accepted, last 6 months)
    const distinctMonths = 6
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - distinctMonths)

    const { data: revenueQuotes } = await supabase
        .from('quotes')
        .select('totaal_bedrag, created_at')
        .eq('user_id', user.id)
        .eq('status', 'geaccepteerd')
        .gte('created_at', sixMonthsAgo.toISOString())

    // Process Revenue Data for Chart
    // Format: { name: 'Jan', total: 1500 }
    const revenueMap = new Map<string, number>()

    // Initialize last 6 months with 0
    for (let i = distinctMonths - 1; i >= 0; i--) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const monthName = d.toLocaleDateString('nl-NL', { month: 'short' }) // e.g., 'nov'
        // Capitalize first letter
        const name = monthName.charAt(0).toUpperCase() + monthName.slice(1)
        revenueMap.set(name, 0)
    }

    // Fill with actual data
    revenueQuotes?.forEach(q => {
        const d = new Date(q.created_at)
        const monthName = d.toLocaleDateString('nl-NL', { month: 'short' })
        const name = monthName.charAt(0).toUpperCase() + monthName.slice(1)

        if (revenueMap.has(name)) {
            revenueMap.set(name, (revenueMap.get(name) || 0) + Number(q.totaal_bedrag))
        }
    })

    const chartData = Array.from(revenueMap.entries()).map(([name, total]) => ({
        name,
        total
    }))

    return {
        profile: {
            ...profile,
            credits_balance: profile?.credits || 0
        },
        stats: {
            activeQuotes: activeCount || 0
        },
        recentQuotes: recentQuotes || [],
        agenda: agendaItems || [],
        revenueChart: chartData
    }
}

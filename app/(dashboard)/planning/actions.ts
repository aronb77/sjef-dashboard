'use server'

import { createClient } from "@/utils/supabase/server"

export async function getScheduledJobs() {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return []
    }

    const { data: quotes, error } = await supabase
        .from('quotes')
        .select('*')
        .eq('user_id', user.id)
        .not('datum_klus', 'is', null)
        .neq('status', 'afgewezen')
        .order('datum_klus', { ascending: true })

    if (error) {
        console.error('Error fetching scheduled jobs:', error)
        return []
    }

    return quotes
}

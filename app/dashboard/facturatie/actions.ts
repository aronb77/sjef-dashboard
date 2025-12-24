'use server'

import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function getBillingInfo() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 1. Fetch Profile for Credits
    const { data: profile } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', user.id)
        .maybeSingle()

    // Fallback: 0 credits if profile not found or credits is null
    const credits = profile?.credits ?? 0
    const maxCredits = 50
    const progress = Math.min((credits / maxCredits) * 100, 100)

    // 2. Fetch License
    const { data: rawLicense } = await supabase
        .from('licenses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

    // Default fallback if no license found
    const license = rawLicense || { status: 'free', plan: 'none', ends_at: null }

    const planInfo = {
        name: license.plan || 'Gratis',
        status: license.status || 'inactive',
        price: license.plan === 'pro' ? '€ 29' : '€ 0',
        ends_at: license.ends_at,
    }

    // 3. Mock Invoices
    const invoices = [
        { id: "INV-2024-001", date: "01-12-2024", amount: "€ 29,00", status: "Betaald" },
        { id: "INV-2024-002", date: "01-11-2024", amount: "€ 29,00", status: "Betaald" },
        { id: "INV-2024-003", date: "01-10-2024", amount: "€ 29,00", status: "Betaald" },
    ]

    return {
        credits: {
            current: credits,
            max: maxCredits,
            progress: progress
        },
        plan: planInfo,
        invoices: invoices
    }
}

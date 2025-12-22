'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updatePdfSettings(settings: any) {
    const supabase = await createClient()

    // 1. Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { success: false, error: "Niet ingelogd" }
    }

    // 2. Update profiles table
    // We update the 'pdf_settings' column for the current user's entry
    // Since 'id' in 'profiles' matches 'user.id'
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ pdf_settings: settings })
        .eq('id', user.id)

    if (updateError) {
        console.error("Error updating PDF settings:", updateError)
        return { success: false, error: "Kon instellingen niet opslaan" }
    }

    // 3. Revalidate
    revalidatePath('/dashboard/settings')
    return { success: true }
}

export async function getPdfSettings() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('pdf_settings')
        .eq('id', user.id)
        .single()

    if (error || !data) return null
    return data.pdf_settings
}

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

    // 2. Extract and clean phone number
    let rawPhone = settings.phone_number || ''
    // Remove everything except digits
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '')

    // 3. Create settings object (WITHOUT phone_number)
    const pdfSettingsToSave = { ...settings }
    delete pdfSettingsToSave.phone_number

    // 4. Update BOTH columns
    const { error: updateError } = await supabase
        .from('profiles')
        .update({
            pdf_settings: pdfSettingsToSave,
            phone_number: cleanPhone
        })
        .eq('id', user.id)

    if (updateError) {
        console.error("Error updating PDF settings:", updateError)
        return { success: false, error: "Kon instellingen niet opslaan" }
    }

    // 5. Revalidate
    revalidatePath('/dashboard/settings')
    return { success: true }
}

export async function getPdfSettings() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('pdf_settings, phone_number')
        .eq('id', user.id)
        .single()

    if (error || !data) return null

    // Merge phone_number into the settings object for the frontend
    return {
        ...data.pdf_settings,
        phone_number: data.phone_number
    }
}

export async function uploadLogo(formData: FormData) {
    const supabase = await createClient()

    // 1. Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return { success: false, error: "Niet ingelogd" }
    }

    const file = formData.get('file') as File
    if (!file) {
        return { success: false, error: "Geen bestand ontvangen" }
    }

    // 2. Validation
    if (file.size > 2 * 1024 * 1024) {
        return { success: false, error: "Bestand is te groot (max 2MB)" }
    }

    // 3. Upload
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${Date.now()}_logo.${fileExt}`

    const { error: uploadError } = await supabase.storage
        .from('logos')
        .upload(fileName, file)

    if (uploadError) {
        console.error("Upload error:", uploadError)
        return { success: false, error: "Upload mislukt" }
    }

    // 4. Get Public URL
    const { data } = supabase.storage
        .from('logos')
        .getPublicUrl(fileName)

    return { success: true, url: data.publicUrl }
}

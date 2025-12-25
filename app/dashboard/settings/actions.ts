'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export async function updatePdfSettings(settings: any) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { success: false, error: "Niet ingelogd" }
    }

    console.log("Saving for user:", user.id);

    // 1. Clean phone number
    let rawPhone = settings.phone_number || ''
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '')

    // 2. Create settings object (WITHOUT top-level fields)
    const pdfSettingsToSave = { ...settings }
    delete pdfSettingsToSave.phone_number
    delete pdfSettingsToSave.kvk_number
    delete pdfSettingsToSave.vat_number

    // 3. Update with .select() to verify if it worked
    const { data, error: updateError } = await supabase
        .from('profiles')
        .update({
            pdf_settings: pdfSettingsToSave,
            phone_number: cleanPhone,
            kvk_number: settings.kvk_number || null,
            vat_number: settings.vat_number || null
        })
        .eq('id', user.id)
        .select()

    if (updateError) {
        console.error("Supabase Error:", updateError)
        return { success: false, error: updateError.message }
    }

    // 4. Check if a row was actually updated
    if (!data || data.length === 0) {
        console.error("Update failed: No row found for ID", user.id)
        return { success: false, error: "Update mislukt: Profiel niet gevonden. Check RLS policies." }
    }

    revalidatePath('/dashboard/settings')
    revalidatePath('/dashboard/offertes') // Also revalidate quotes if they use this
    return { success: true }
}

export async function getPdfSettings() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('profiles')
        .select('pdf_settings, phone_number, kvk_number, vat_number')
        .eq('id', user.id)
        .single()

    if (error || !data) return null

    // Merge separate columns into the settings object for the frontend
    return {
        ...data.pdf_settings,
        phone_number: data.phone_number,
        kvk_number: data.kvk_number,
        vat_number: data.vat_number
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

'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getAccountData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (error) {
        console.error('Error fetching account data:', error)
        return null
    }

    // Parse pdf_settings safely
    let pdfSettings = {}
    try {
        if (typeof profile.pdf_settings === 'string') {
            pdfSettings = JSON.parse(profile.pdf_settings)
        } else if (typeof profile.pdf_settings === 'object') {
            pdfSettings = profile.pdf_settings || {}
        }
    } catch (e) {
        console.error("Error parsing pdf_settings", e)
    }

    // Mapping based on user request
    return {
        companyName: profile.company_name || profile.bedrijfs_naam || '', // fallback to legacy
        phone: profile.phone_number || '',
        kvk: profile.kvk_number || '',
        btw: profile.vat_number || '',
        // Address data from pdf_settings
        address: (pdfSettings as any).address || '',
        postcode: (pdfSettings as any).postcode || '',
        city: (pdfSettings as any).city || '',
        email: (pdfSettings as any).email || user.email || '' // Fallback to auth email if not in settings
    }
}

export async function updateAccountData(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Not authenticated" }
    }

    const companyName = formData.get('companyName') as string
    const phone = formData.get('phone') as string
    const kvk = formData.get('kvk') as string
    const btw = formData.get('btw') as string

    const address = formData.get('address') as string
    const postcode = formData.get('postcode') as string
    const city = formData.get('city') as string
    const email = formData.get('email') as string

    // 1. Fetch current profile to get existing pdf_settings to update deeply/merge
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('pdf_settings')
        .eq('id', user.id)
        .single()

    let currentSettings = {}
    if (currentProfile?.pdf_settings) {
        if (typeof currentProfile.pdf_settings === 'string') {
            try { currentSettings = JSON.parse(currentProfile.pdf_settings) } catch (e) { }
        } else {
            currentSettings = currentProfile.pdf_settings
        }
    }

    // 2. Merge new address data into pdf_settings
    const updatedPdfSettings = {
        ...currentSettings,
        address,
        postcode,
        city,
        email
    }

    // 3. Update profiles table
    const { error } = await supabase
        .from('profiles')
        .update({
            // company_name is assigned below
            company_name: companyName,
            phone_number: phone,
            kvk_number: kvk,
            vat_number: btw, // Map 'btw' form field to 'vat_number' column
            pdf_settings: updatedPdfSettings
        })
        .eq('id', user.id)

    if (error) {
        console.error("Error updating account:", error)
        return { error: error.message }
    }

    revalidatePath('/dashboard/account')
    revalidatePath('/dashboard/settings')
    return { success: true }
}

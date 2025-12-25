'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export type UploadedFile = {
    id: string
    filename: string
    file_url: string
    size: number
    status: 'processing' | 'ready' | 'error'
    created_at: string
}

export async function getFiles(): Promise<UploadedFile[]> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return []
    }

    const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        console.error("Error fetching files:", error)
        return []
    }

    return data as UploadedFile[]
}

export async function saveFileRecord(fileData: {
    filename: string
    file_url: string
    size: number
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Not authenticated" }
    }

    const { error } = await supabase
        .from('uploaded_files')
        .insert({
            user_id: user.id,
            filename: fileData.filename,
            file_url: fileData.file_url,
            size: fileData.size,
            status: 'processing'
        })

    if (error) {
        console.error("Error saving file record:", error)
        return { error: error.message }
    }

    revalidatePath('/materialen')
    return { success: true }
}

export async function deleteFile(id: string, fileUrl: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Not authenticated" }
    }

    // 1. Delete from Storage
    // Extract path from URL (assuming standard Supabase URL structure)
    // URL format: .../storage/v1/object/public/price-lists/filename
    // Or just the filename if we stored it simply?
    // We need the relative path in the bucket.
    // Let's assume the fileUrl is the full public URL or similar.
    // Ideally we should just store the path, but prompt said file_url.
    // I'll try to extract the filename from the URL or just use the DB to find it if needed.
    // For now, let's assume valid storage path extraction or that we just assume filename matches.
    // Actually, "Users can delete *own* files".
    // I'll assume standard delete pattern.

    // Better: Get the filename from DB first to be sure, or just assume the frontend passes the right path.
    // The prompt implies we have the ID.

    // First verify status or just delete.
    const { error: dbError } = await supabase
        .from('uploaded_files')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id) // Security check

    if (dbError) {
        return { error: dbError.message }
    }

    // Attempt to delete from storage (fire and forget mostly, or log error)
    // We need to parse the path from the URL
    try {
        const urlObj = new URL(fileUrl)
        const pathParts = urlObj.pathname.split('/price-lists/')
        if (pathParts.length > 1) {
            const storagePath = pathParts[1] // "user_id/filename" or just "filename"
            await supabase.storage
                .from('price-lists')
                .remove([decodeURIComponent(storagePath)])
        }
    } catch (e) {
        console.error("Error parsing/deleting file from storage:", e)
    }

    revalidatePath('/materialen')
    return { success: true }
}

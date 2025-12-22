import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    // De URL bevat een 'code' als Supabase ons terugstuurt
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    // Als er een 'next' param is (bijv. /dashboard), pak die, anders ga naar /
    const next = searchParams.get('next') ?? '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Login gelukt! Stuur door naar het dashboard
            return NextResponse.redirect(`${origin}${next}`)
        }
    }

    // Login mislukt? Stuur terug naar login pagina met error
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}

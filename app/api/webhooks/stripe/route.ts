import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature') as string

    let event: Stripe.Event

    try {
        if (!signature || !webhookSecret) {
            console.error('Missing signature or webhook secret')
            return new NextResponse('Missing signature or webhook secret', { status: 400 })
        }
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`)
        return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session
        const metadata = session.metadata

        if (metadata?.creditsToAdd && metadata?.userId) {
            const userId = metadata.userId
            const creditsToAdd = parseInt(metadata.creditsToAdd, 10)

            // Create Supabase Admin Client to bypass RLS
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!,
                {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false
                    }
                }
            )

            // 1. Fetch current credits
            const { data: profile, error: fetchError } = await supabaseAdmin
                .from('profiles')
                .select('credits') // Note: Assuming column is 'credits', per actions.ts usage. Double check if it's 'credits_balance' or 'credits'. 
                // In dashboard/page.tsx mock data uses 'credits_balance', but actions.ts used 'credits'.
                // User request in actions.ts fix step used 'credits'. 
                // I will check actions.ts again to be sure. 
                // Actually, dashboard/page.tsx mock data has 'credits_balance', but actions.ts fetching billing info selects 'credits'.
                // I should probably check the previous actions.ts file content in the chat history.
                // Looking at Step 8 file view: line 17: .select('credits').
                // Looking at Step 35 file view (dashboard page): line 24: credits_balance: number (interface), line 43: credits_balance: 1250 (mock).
                // It seems there is an inconsistency between mock data and real data query in actions.ts.
                // Since actions.ts is "real" logic (even if it had fallbacks), I will trust actions.ts which uses 'credits'.
                // Wait, the user prompt said "credits_balance" in the mock data in dashboard page context, but asked to fix "getBillingInfo" in actions.ts.
                // Let me quickly double check actions.ts content from Step 8.
                // Line 17: .select('credits').
                // Line 21: const credits = profile?.credits || 0.
                // Okay, the column in database seems to be 'credits'.
                .eq('id', userId)
                .single()

            if (fetchError) {
                console.error('Error fetching profile:', fetchError)
                return new NextResponse('Error fetching profile', { status: 500 })
            }

            const currentCredits = profile?.credits || 0
            const newCredits = currentCredits + creditsToAdd

            // 2. Update credits
            const { error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({ credits: newCredits })
                .eq('id', userId)

            if (updateError) {
                console.error('Error updating credits:', updateError)
                return new NextResponse('Error updating credits', { status: 500 })
            }

            console.log(`Successfully added ${creditsToAdd} credits to user ${userId}. New balance: ${newCredits}`)
        }
    }

    return NextResponse.json({ received: true })
}

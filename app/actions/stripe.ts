'use server'

import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { createClient } from '@/utils/supabase/server'
import { CREDIT_PACKAGES, SUBSCRIPTION_PLANS } from '@/lib/stripe-config'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover',
})

export async function createCheckoutSession(priceId: string) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // 1. Determine Mode & Metadata
    const creditPackage = CREDIT_PACKAGES.find((p) => p.id === priceId)
    const subscriptionPlan = SUBSCRIPTION_PLANS.find((p) => p.id === priceId)

    if (!creditPackage && !subscriptionPlan) {
        throw new Error('Invalid Price ID')
    }

    const isSubscription = !!subscriptionPlan
    const mode = isSubscription ? 'subscription' : 'payment'

    let metadata: Record<string, string> = {
        userId: user.id
    }

    if (creditPackage) {
        metadata = {
            ...metadata,
            creditsToAdd: creditPackage.credits.toString(),
        }
    } else if (subscriptionPlan && subscriptionPlan.credits) {
        // Give initial credits for the first month immediately via webhook
        metadata = {
            ...metadata,
            creditsToAdd: subscriptionPlan.credits.toString(),
        }
    }

    // 2. Create Session
    const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // For subscriptions, we might need to check if they already have a customer ID in our DB
    // But for this MVP, we'll let Stripe handle customer creation or use email mapping if possible.
    // Better: Retrieve customer ID from 'subscriptions' table if exists, but we'll stick to simple flow.
    // If we have a customer_id in profiles/subscriptions, we should use it. 
    // For now, pass email to pre-fill.

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
        mode: mode,
        payment_method_types: ['card', 'ideal'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        success_url: `${origin}/dashboard?payment=success`,
        cancel_url: `${origin}/dashboard?payment=cancelled`,
        customer_email: user.email,
        metadata: metadata,
        // If it's a subscription, we might want to allow promotion codes
        allow_promotion_codes: true,
    }

    // If it's a one-time payment, we can add invoice_creation: { enabled: true } if needed, 
    // but usually not strictly required for credits unless B2B.

    const session = await stripe.checkout.sessions.create(sessionConfig)

    if (!session.url) {
        throw new Error('Failed to create checkout session')
    }

    redirect(session.url)
}

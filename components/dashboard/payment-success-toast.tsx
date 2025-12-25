"use client"

import { useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import confetti from "canvas-confetti"

export function PaymentSuccessToast() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const hasRun = useRef(false)

    useEffect(() => {
        if (hasRun.current) return

        const paymentStatus = searchParams.get("payment")

        if (paymentStatus === "success") {
            hasRun.current = true

            // Show toast
            toast.success("Betaling geslaagd!", {
                description: "Je credits zijn succesvol bijgeschreven.",
                duration: 5000,
            })

            // Fire confetti
            const end = Date.now() + 3 * 1000
            const colors = ["#f97316", "#ffffff"]

                ; (function frame() {
                    confetti({
                        particleCount: 2,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: colors,
                    })
                    confetti({
                        particleCount: 2,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: colors,
                    })

                    if (Date.now() < end) {
                        requestAnimationFrame(frame)
                    }
                })()

            // Remove query param
            const newUrl = window.location.pathname
            window.history.replaceState({}, "", newUrl)

            // Refresh data (critical for updating credits in sidebar)
            router.refresh()
        } else if (paymentStatus === "cancelled") {
            hasRun.current = true
            toast.error("Betaling geannuleerd", {
                description: "Er zijn geen credits afgeschreven.",
            })
            const newUrl = window.location.pathname
            window.history.replaceState({}, "", newUrl)
        }
    }, [searchParams, router])

    return null
}

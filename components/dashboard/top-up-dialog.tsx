'use client'

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Check, Loader2 } from 'lucide-react'
import { CREDIT_PACKAGES, SUBSCRIPTION_PLANS } from '@/lib/stripe-config'
import { createCheckoutSession } from '@/app/actions/stripe'
import { cn } from '@/lib/utils'

export function TopUpDialog({ children }: { children?: React.ReactNode }) {
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const handlePurchase = async (priceId: string) => {
        try {
            setLoadingId(priceId)
            await createCheckoutSession(priceId)
        } catch (error) {
            console.error('Checkout error:', error)
            setLoadingId(null)
            // Ideally show a toast here
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children || (
                    <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 h-12 px-6">
                        <Plus className="w-4 h-4 mr-2" />
                        Nieuwe Opname
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] bg-slate-50">
                <DialogHeader>
                    <DialogTitle>Kies een bundel</DialogTitle>
                    <DialogDescription>
                        Koop extra credits of neem een abonnement voor structureel voordeel.
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="credits" className="w-full mt-4">
                    <TabsList className="grid w-full grid-cols-2 mb-8">
                        <TabsTrigger value="credits">Credits Bijkopen</TabsTrigger>
                        <TabsTrigger value="subscription">Abonnement Wijzigen</TabsTrigger>
                    </TabsList>

                    <TabsContent value="credits">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {CREDIT_PACKAGES.map((pkg) => (
                                <Card key={pkg.id} className={cn("relative flex flex-col hover:border-orange-200 transition-all", pkg.popular && "border-orange-500 shadow-md ring-1 ring-orange-500")}>
                                    {pkg.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                            Populair
                                        </div>
                                    )}
                                    <CardHeader className="text-center pb-2">
                                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                                        <CardDescription>{pkg.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col items-center justify-center py-6">
                                        <span className="text-4xl font-bold font-mono text-slate-900">{pkg.credits}</span>
                                        <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold mt-1">Credits</span>
                                        <div className="mt-4 text-lg font-bold text-slate-700">{pkg.price}</div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            className={cn("w-full", pkg.popular ? "bg-orange-500 hover:bg-orange-600" : "")}
                                            onClick={() => handlePurchase(pkg.id)}
                                            disabled={loadingId !== null}
                                        >
                                            {loadingId === pkg.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                "Koop nu"
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="subscription">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {SUBSCRIPTION_PLANS.map((plan) => (
                                <Card key={plan.id} className="flex flex-col hover:border-blue-200 transition-all">
                                    <CardHeader className="text-center pb-2">
                                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                                        <div className="text-2xl font-bold text-slate-900 my-2">{plan.price}</div>
                                        <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-1 py-6">
                                        <ul className="space-y-2 text-sm text-slate-600">
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-500" />
                                                <span>Alle basis functies</span>
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-500" />
                                                <span>Priority support</span>
                                            </li>
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        <Button
                                            variant="outline"
                                            className="w-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                            onClick={() => handlePurchase(plan.id)}
                                            disabled={loadingId !== null}
                                        >
                                            {loadingId === plan.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                "Kies Plan"
                                            )}
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

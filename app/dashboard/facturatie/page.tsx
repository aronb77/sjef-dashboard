"use client" // Note: This should NOT be use client if we want async server component data fetching. 
// Wait, the user plan says "Make the Page component async." and "Roep getBillingInfo aan."
// Server Actions can be called from Client Components, BUT async page components are Server Components.
// If I use "use client", I cannot use async/await top level for data fetching in the same way.
// I should remove "use client" and make it a Server Component.
// BUT, the page uses Shadcn UI components which might need client interactivity?
// Card, Badge, etc are usually fine in SC.
// Charting logic or interactivity needs Client. Progress is fine?
// The user asked specifically: "Maak de Page component async."
// So I will remove "use client" and import the action.
// Let's verify imports.

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table" 
// Table might be client? No, typically server rendered table is fine.
// Let's assume standard Shadcn components are SC compatible unless they use hooks.
// Check if standard Shadcn components are client or server. Usually they are client components "use client" inside them?
// Actually most shadcn components have "use client" directive inside them if needed. 
// So I can import them in a Server Component.
// HOWEVER, I need to be careful.

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, CreditCard, Check, Zap } from "lucide-react"
import { getBillingInfo } from "./actions"

export default async function BillingPage() {
    const { credits, plan, invoices } = await getBillingInfo()

    const isPlanActive = plan.status === 'active' || plan.status === 'trial'
    const statusColor = isPlanActive ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-slate-100 text-slate-600 hover:bg-slate-100"
    const statusText = plan.status === 'trial' ? 'Proefperiode' : plan.status === 'active' ? 'Actief' : 'Inactief'

    // Format date if exists, otherwise show placeholder
    const renewalDate = plan.ends_at
        ? new Date(plan.ends_at).toLocaleDateString('nl-NL', { day: '2-digit', month: 'long', year: 'numeric' })
        : "Geen datum"

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Facturatie & Abonnement</h1>
                <p className="text-slate-500 mt-1">Beheer je abonnement, credits en facturen.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">

                {/* CURRENT PLAN */}
                <Card className="border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="h-24 w-24 text-orange-500" />
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Huidig Abonnement
                            <Badge variant="secondary" className={statusColor}>
                                {statusText}
                            </Badge>
                        </CardTitle>
                        <CardDescription>Je huidige plan en vernieuwingsdatum.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-4xl font-extrabold text-slate-900 capitalize">{plan.name} Plan</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-900">{plan.price}</span>
                            <span className="text-slate-500">/ maand</span>
                        </div>
                        <div className="text-sm text-slate-500">
                            Volgende factuur op <span className="font-medium text-slate-700">{renewalDate}</span>
                        </div>
                    </CardContent>
                    <CardFooter className="flex gap-3 pt-4">
                        <Button variant="outline" className="w-full">Plan Wijzigen</Button>
                        <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">Opzeggen</Button>
                    </CardFooter>
                </Card>

                {/* CREDITS */}
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            Credits Balans
                        </CardTitle>
                        <CardDescription>Credits voor het genereren van AI offertes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className="text-3xl font-bold text-slate-900">{credits.current} <span className="text-lg text-slate-400 font-normal">/ {credits.max}</span></span>
                                <span className="text-sm font-medium text-slate-600">{Math.round(credits.progress)}% gebruikt</span>
                            </div>
                            <Progress value={credits.progress} className="h-3 bg-slate-100" />
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border border-slate-100 flex gap-3 text-sm text-slate-600">
                            <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p>Credits worden elke maand op de 1e gereset naar {credits.max}. Ongebruikte credits vervallen.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button className="w-full bg-orange-500 hover:bg-orange-600">
                            <Zap className="mr-2 h-4 w-4" />
                            Extra Credits Kopen
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            {/* INVOICE HISTORY */}
            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Factuurgeschiedenis</CardTitle>
                    <CardDescription>Overzicht van al je facturen.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Factuurnummer</TableHead>
                                <TableHead>Datum</TableHead>
                                <TableHead>Bedrag</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Download</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.length > 0 ? (
                                invoices.map((invoice: any) => (
                                    <TableRow key={invoice.id}>
                                        <TableCell className="font-medium text-slate-900">{invoice.id}</TableCell>
                                        <TableCell className="text-slate-500">{invoice.date}</TableCell>
                                        <TableCell className="text-slate-900">{invoice.amount}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-green-100 text-green-700 font-normal hover:bg-green-100">
                                                {invoice.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                        Geen facturen gevonden.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

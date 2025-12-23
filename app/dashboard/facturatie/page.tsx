"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, CreditCard, Check, Zap } from "lucide-react"

// Mock Data
const INVOICES = [
    { id: "INV-2024-001", date: "01-12-2024", amount: "€ 29,00", status: "Betaald" },
    { id: "INV-2024-002", date: "01-11-2024", amount: "€ 29,00", status: "Betaald" },
    { id: "INV-2024-003", date: "01-10-2024", amount: "€ 29,00", status: "Betaald" },
]

export default function BillingPage() {
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
                            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Actief</Badge>
                        </CardTitle>
                        <CardDescription>Je huidige plan en vernieuwingsdatum.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-4xl font-extrabold text-slate-900">Pro Plan</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-900">€ 29</span>
                            <span className="text-slate-500">/ maand</span>
                        </div>
                        <div className="text-sm text-slate-500">
                            Volgende factuur op <span className="font-medium text-slate-700">01 januari 2025</span>
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
                                <span className="text-3xl font-bold text-slate-900">12 <span className="text-lg text-slate-400 font-normal">/ 50</span></span>
                                <span className="text-sm font-medium text-slate-600">24% gebruikt</span>
                            </div>
                            <Progress value={24} className="h-3 bg-slate-100" />
                            {/* Note: Shadcn Progress usually takes value as prop. 
                                 Wait, if I modified progress.tsx or installed default, it should work. 
                                 Standard shadcn progress is just <Progress value={33} />
                             */}
                        </div>
                        <div className="bg-slate-50 p-3 rounded-md border border-slate-100 flex gap-3 text-sm text-slate-600">
                            <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                            <p>Credits worden elke maand op de 1e gereset naar 50. Ongebruikte credits vervallen.</p>
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
                            {INVOICES.map((invoice) => (
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
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

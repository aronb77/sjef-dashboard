"use client"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { TopUpDialog } from "@/components/dashboard/top-up-dialog";
import { PaymentSuccessToast } from "@/components/dashboard/payment-success-toast";
import {
    Plus,
    FileText,
    CreditCard,
    Activity,
    MoreHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";

// Types
interface Profile {
    id: string;
    full_name: string;
    company_name: string;
    credits_balance: number;
}

interface Quote {
    id: string;
    title: string;
    status: 'concept' | 'sent' | 'accepted';
    amount: number;
    created_at: string;
}

export default function DashboardPage() {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Mock Data
    const profile: Profile = {
        id: "mock-user-1",
        full_name: "Sjef Bouwmeester",
        company_name: "Bouwbedrijf Sjef B.V.",
        credits_balance: 1250
    };

    const allQuotes: Quote[] = [
        {
            id: "q-101",
            title: "Renovatie Keuken Herengracht",
            status: "sent",
            amount: 4500,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        },
        {
            id: "q-102",
            title: "Schilderwerk Buitenom",
            status: "concept",
            amount: 2800,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        },
        {
            id: "q-103",
            title: "Badkamer Installatie",
            status: "accepted",
            amount: 8200,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
        },
        {
            id: "q-104",
            title: "Dakinspectie & Reparatie",
            status: "sent",
            amount: 650,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
        },
        {
            id: "q-105",
            title: "Uitbouw Woonkamer",
            status: "concept",
            amount: 25000,
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
        }
    ];

    const activeQuotesCount = allQuotes.filter(q => q.status !== 'accepted').length;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Intl.DateTimeFormat('nl-NL', { dateStyle: 'short' }).format(new Date(dateStr));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'accepted': return 'bg-green-100 text-green-700 border-green-200 hover:bg-green-100';
            case 'sent': return 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100';
            case 'concept': return 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-100';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'accepted': return 'Geaccepteerd';
            case 'sent': return 'Verzonden';
            case 'concept': return 'Concept';
            default: return status;
        }
    };

    const QuoteList = ({ quotes }: { quotes: Quote[] }) => (
        <Card className="rounded-xl border-slate-200 shadow-sm bg-white overflow-hidden border-t-0 rounded-t-none">
            {quotes.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                    <p>Geen offertes gevonden.</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-100">
                    {quotes.map((quote) => (
                        <div key={quote.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200 transition-all">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-slate-900">{quote.title || "Naamloze Klus"}</span>
                                    <span className="text-xs font-mono text-slate-500">{formatDate(quote.created_at)}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="hidden md:block text-right">
                                    <div className="font-medium font-mono text-slate-900">{formatCurrency(quote.amount)}</div>
                                </div>
                                <Badge variant="secondary" className={cn("rounded-md px-2.5 py-1 capitalize border", getStatusColor(quote.status))}>
                                    {getStatusLabel(quote.status)}
                                </Badge>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                                    <MoreHorizontal className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );

    return (
        <div className="p-8 font-sans text-slate-900 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold font-sans tracking-tight text-slate-900">
                        {profile ? `Goedemiddag, ${profile.full_name.split(' ')[0]} ` : "Goedemiddag"}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {profile?.company_name || "Sjef Dashboard"}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                        <div className="flex flex-col items-end">
                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Credits</span>
                            <span className="text-xl font-bold font-mono tabular-nums text-slate-900 leading-none">
                                {profile?.credits_balance ?? 0}
                            </span>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                            <CreditCard className="w-4 h-4" />
                        </div>
                    </div>
                    <TopUpDialog>
                        <Button className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 h-12 px-6">
                            <Plus className="w-4 h-4 mr-2" />
                            Nieuwe Opname
                        </Button>
                    </TopUpDialog>
                </div>
            </header>

            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="rounded-xl border-slate-200 shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Lopende Offertes</CardTitle>
                        <FileText className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono text-slate-900">{activeQuotesCount}</div>
                        <p className="text-xs text-slate-400 mt-1">Actief in de pijplijn</p>
                    </CardContent>
                </Card>

                <Card className="rounded-xl border-slate-200 shadow-sm bg-white">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Credits Balans</CardTitle>
                        <Activity className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold font-mono text-slate-900">
                            {profile.credits_balance}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">Beschikbaar voor opnames</p>
                    </CardContent>
                </Card>

                <RevenueChart />
            </div>

            {/* Main Content Area: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Quote List with Tabs (2/3 width) */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-slate-900">Recente Klussen</h2>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900">
                            Alles bekijken
                        </Button>
                    </div>

                    <Tabs defaultValue="all" className="w-full">
                        <TabsList className="bg-slate-100 p-1 rounded-lg w-full justify-start mb-0 rounded-b-none border-b border-slate-200">
                            <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Alles</TabsTrigger>
                            <TabsTrigger value="concept" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Concept</TabsTrigger>
                            <TabsTrigger value="sent" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Verzonden</TabsTrigger>
                            <TabsTrigger value="accepted" className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Geaccepteerd</TabsTrigger>
                        </TabsList>
                        <TabsContent value="all" className="mt-0">
                            <QuoteList quotes={allQuotes} />
                        </TabsContent>
                        <TabsContent value="concept" className="mt-0">
                            <QuoteList quotes={allQuotes.filter(q => q.status === 'concept')} />
                        </TabsContent>
                        <TabsContent value="sent" className="mt-0">
                            <QuoteList quotes={allQuotes.filter(q => q.status === 'sent')} />
                        </TabsContent>
                        <TabsContent value="accepted" className="mt-0">
                            <QuoteList quotes={allQuotes.filter(q => q.status === 'accepted')} />
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Column: Agenda (1/3 width) */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Agenda</h2>
                        <Card className="rounded-xl border-slate-200 shadow-sm bg-white p-4">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md w-full flex justify-center"
                                modifiers={{
                                    booked: [new Date(Date.now() + 1000 * 60 * 60 * 24 * 2)] // Mock event
                                }}
                                modifiersStyles={{
                                    booked: { border: '2px solid #F97316' }
                                }}
                            />
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <h3 className="text-sm font-semibold text-slate-900 mb-2">Vandaag</h3>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-slate-900">Opname: Herengracht</span>
                                        <span className="text-xs text-slate-500 font-mono">14:00 - 15:30</span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

            </div>
            <PaymentSuccessToast />
        </div>
    );
}

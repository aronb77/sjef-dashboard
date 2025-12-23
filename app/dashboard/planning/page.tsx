"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, CalendarDays, Clock, CheckCircle2, CircleDashed } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock Data
const PLANNED_JOBS = [
    {
        id: "job-1",
        customer: "Fam. Jansen",
        initials: "FJ",
        address: "Kerkstraat 12, Amsterdam",
        date: new Date(2025, 0, 15), // Jan 15, 2025 - NOTE: Month is 0-indexed in JS Date
        status: "gepland",
        time: "08:00 - 16:00"
    },
    {
        id: "job-2",
        customer: "Bouwbedrijf De Wit",
        initials: "BW",
        address: "Industrieweg 45, Rotterdam",
        date: new Date(2025, 0, 16),
        status: "gepland",
        time: "07:30 - 15:30"
    },
    {
        id: "job-3",
        customer: "Mevr. Bakker",
        initials: "MB",
        address: "Lindenlaan 8, Utrecht",
        date: new Date(2025, 0, 10),
        status: "afgerond",
        time: "09:00 - 12:00"
    },
    {
        id: "job-4",
        customer: "Hr. Visser",
        initials: "HV",
        address: "Dorpstraat 1, Eindhoven",
        date: new Date(2023, 11, 23), // Today?
        status: "gepland",
        time: "08:30 - 17:00"
    },
    {
        id: "job-5",
        customer: "Project X",
        initials: "PX",
        address: "Nieuwbouwwijk 3, Almere",
        date: new Date(2025, 0, 20),
        status: "gepland",
        time: "07:00 - 16:00"
    },
    // Add current date for testing "Today"
    {
        id: "job-today",
        customer: "Spoedklus B.V.",
        initials: "SK",
        address: "Hoofdstraat 99, Den Haag",
        date: new Date(),
        status: "gepland",
        time: "10:00 - 14:00"
    }

]

export default function PlanningPage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    // Filter jobs based on selected date
    // If no date selected, show all (or maybe future?)
    // For specific requirement: "Zorg dat als ik op een datum in de kalender klik, de lijst rechts hierop filtert"

    // Let's create a derived list for display.
    // If a date is selected, we show jobs for that date.
    // If NO date is selected (or just initially), maybe we show the full upcoming list? 
    // The prompt says "Groepeer de items logisch (bijv. "Vandaag", "Deze Week", "Aankomend")".
    // Let's try to mix both: if filtered, show filtered. If not, show grouped.

    const selectedDateJobs = date
        ? PLANNED_JOBS.filter(job =>
            job.date.getDate() === date.getDate() &&
            job.date.getMonth() === date.getMonth() &&
            job.date.getFullYear() === date.getFullYear()
        )
        : [];

    const isDateSelected = !!date;

    const formatDateDisplay = (dateObj: Date) => {
        return new Intl.DateTimeFormat('nl-NL', { day: 'numeric', month: 'short' }).format(dateObj).toUpperCase();
    }

    // Helper for rendering a single job card
    const JobCard = ({ job }: { job: typeof PLANNED_JOBS[0] }) => (
        <Card key={job.id} className="mb-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-orange-500">
            <CardContent className="p-4 flex items-center gap-4">
                {/* Date Box */}
                <div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] bg-orange-50 rounded-lg text-orange-700">
                    <span className="text-xl font-bold">{job.date.getDate()}</span>
                    <span className="text-xs font-semibold uppercase">{new Intl.DateTimeFormat('nl-NL', { month: 'short' }).format(job.date)}</span>
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-slate-900">{job.customer}</h3>
                        {job.status === 'afgerond' ? (
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Afgerond
                            </Badge>
                        ) : (
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 gap-1">
                                <CircleDashed className="w-3 h-3" /> Gepland
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {job.time}
                        </div>
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.address}
                        </div>
                    </div>
                </div>

                {/* Avatar */}
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-slate-200 text-slate-600 font-medium text-xs">
                        {job.initials}
                    </AvatarFallback>
                </Avatar>
            </CardContent>
        </Card>
    )

    return (
        <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-2rem)] flex flex-col">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Planning</h1>
                <p className="text-slate-500 mt-1">Beheer je klussen en agenda.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full min-h-0">
                {/* Left Column: Calendar & Stats */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border-0 w-full flex justify-center"
                        />
                    </div>

                    <Card className="bg-slate-900 text-white border-0 shadow-lg">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-2 mb-4 text-slate-400">
                                <CalendarDays className="h-5 w-5" />
                                <span className="text-sm font-medium uppercase tracking-wider">Quick Stats</span>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-3xl font-bold">8</div>
                                    <div className="text-sm text-slate-400">Klussen deze maand</div>
                                </div>
                                <div className="h-px bg-slate-800" />
                                <div>
                                    <div className="text-3xl font-bold text-green-400">60%</div>
                                    <div className="text-sm text-slate-400">Beschikbaarheid</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Agenda List */}
                <div className="lg:col-span-8 bg-slate-50/50 rounded-xl border border-slate-200 flex flex-col min-h-0">
                    <div className="p-4 border-b border-slate-200 bg-white rounded-t-xl flex justify-between items-center">
                        <h2 className="font-semibold text-slate-900">
                            {isDateSelected && date
                                ? `Agenda voor ${date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}`
                                : "Aankomende Klussen"
                            }
                        </h2>
                        {isDateSelected && (
                            <button
                                onClick={() => setDate(undefined)}
                                className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                            >
                                Toon alles
                            </button>
                        )}
                    </div>

                    <ScrollArea className="flex-1 p-4">
                        {isDateSelected ? (
                            selectedDateJobs.length > 0 ? (
                                selectedDateJobs.map(job => <JobCard key={job.id} job={job} />)
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-500">
                                    <CalendarDays className="h-10 w-10 mb-2 opacity-20" />
                                    <p>Geen klussen gepland op deze dag.</p>
                                </div>
                            )
                        ) : (
                            // Show all grouped (simplified for now: just list all future/sorted)
                            <div className="space-y-6">
                                {/* Group: Vandaag */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">Vandaag & Aankomend</h4>
                                    {PLANNED_JOBS.sort((a, b) => a.date.getTime() - b.date.getTime()).map(job => (
                                        <JobCard key={job.id} job={job} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}

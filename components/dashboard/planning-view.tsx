"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, CalendarDays, Clock, CheckCircle2, CircleDashed, FileText } from "lucide-react"
import { format, isSameDay, parseISO } from "date-fns"
import { nl } from "date-fns/locale"

interface Job {
    id: string
    klant_naam: string
    datum_klus: string
    status: string
    pdf_url: string | null
    [key: string]: any
}

interface PlanningViewProps {
    initialJobs: Job[]
}

export function PlanningView({ initialJobs }: PlanningViewProps) {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    // Convert string dates to Date objects for comparison
    const jobs = initialJobs.map(job => ({
        ...job,
        dateObj: new Date(job.datum_klus)
    }))

    const selectedDateJobs = date
        ? jobs.filter(job => isSameDay(job.dateObj, date))
        : [];

    const isDateSelected = !!date;

    const getInitials = (name: string) => {
        if (!name) return "?";
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    // Helper for rendering a single job card
    const JobCard = ({ job }: { job: typeof jobs[0] }) => (
        <Card key={job.id} className="mb-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-orange-500">
            <CardContent className="p-4 flex items-center gap-4">
                {/* Date Box */}
                <div className="flex flex-col items-center justify-center min-w-[60px] h-[60px] bg-orange-50 rounded-lg text-orange-700">
                    <span className="text-xl font-bold">{format(job.dateObj, 'd')}</span>
                    <span className="text-xs font-semibold uppercase">{format(job.dateObj, 'MMM', { locale: nl })}</span>
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-slate-900">{job.klant_naam || "Onbekende Klant"}</h3>
                        {job.status === 'geaccepteerd' ? ( // Using 'geaccepteerd' as 'confirmed/planned' effectively
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 gap-1">
                                <CircleDashed className="w-3 h-3" /> Gepland
                            </Badge>
                        ) : (
                            // Other statuses
                            <Badge variant="outline" className="text-slate-600 gap-1">
                                <FileText className="w-3 h-3" /> {job.status}
                            </Badge>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            09:00 - 17:00 {/* Placeholder time, not in DB yet */}
                        </div>
                        {/* Location would go here if in DB */}
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            Locatie onbekend
                        </div>
                    </div>
                </div>

                {/* Avatar */}
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                    <AvatarFallback className="bg-slate-200 text-slate-600 font-medium text-xs">
                        {getInitials(job.klant_naam)}
                    </AvatarFallback>
                </Avatar>
            </CardContent>
        </Card>
    )

    // Calculate stats
    const currentMonth = new Date().getMonth();
    const jobsThisMonth = jobs.filter(j => j.dateObj.getMonth() === currentMonth && j.dateObj.getFullYear() === new Date().getFullYear()).length;


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
                            locale={nl}
                            modifiers={{
                                hasJob: (date) => jobs.some(job => isSameDay(job.dateObj, date))
                            }}
                            modifiersStyles={{
                                hasJob: {
                                    textDecoration: "underline",
                                    textDecorationColor: "#f97316", // orange-500
                                    textDecorationThickness: "2px",
                                    fontWeight: "bold"
                                }
                            }}
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
                                    <div className="text-3xl font-bold">{jobsThisMonth}</div>
                                    <div className="text-sm text-slate-400">Klussen deze maand</div>
                                </div>
                                <div className="h-px bg-slate-800" />
                                <div>
                                    <div className="text-3xl font-bold text-green-400">--%</div>
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
                                ? `Agenda voor ${format(date, 'EEEE d MMMM', { locale: nl })}`
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
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-widest pl-1">Aankomend</h4>
                                    {jobs.length > 0 ? jobs.map(job => (
                                        <JobCard key={job.id} job={job} />
                                    )) : (
                                        <p className="text-sm text-slate-500 pl-1">Geen geplande klussen gevonden.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}

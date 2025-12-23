"use client"

import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, MoreHorizontal, Plus, MapPin, Mail, Phone, UserPlus } from "lucide-react"
import { CustomerSheet, Customer, Quote } from "@/components/dashboard/customer-sheet"

// --- MOCK DATA ---
const MOCK_CUSTOMERS: Customer[] = [
    {
        id: "1",
        firstName: "Jan",
        lastName: "De Vries",
        email: "jan.devries@example.com",
        phone: "06-12345678",
        address: "Kerkstraat 1",
        zip: "1011AB",
        city: "Amsterdam",
        jobsCount: 3,
        notes: "Heeft een grote hond."
    },
    {
        id: "2",
        firstName: "Petra",
        lastName: "Jansen",
        companyName: "Jansen Design",
        email: "info@jansendesign.nl",
        phone: "030-9876543",
        address: "Oudegracht 123",
        zip: "3511AZ",
        city: "Utrecht",
        jobsCount: 1
    },
    {
        id: "3",
        firstName: "Kareem",
        lastName: "Al-Fayed",
        email: "kareem@example.com",
        phone: "06-87654321",
        address: "Coolsingel 50",
        zip: "3012AD",
        city: "Rotterdam",
        jobsCount: 0
    }
]

const MOCK_QUOTES: Quote[] = [
    { id: "OFF-2023-001", customerId: "1", date: "12 nov 2023", amount: "€ 4.500,-", status: "geaccepteerd" },
    { id: "OFF-2023-015", customerId: "1", date: "05 dec 2023", amount: "€ 1.250,-", status: "geaccepteerd" },
    { id: "OFF-2024-002", customerId: "1", date: "10 jan 2024", amount: "€ 8.500,-", status: "verzonden" },
    { id: "OFF-2024-003", customerId: "2", date: "14 jan 2024", amount: "€ 2.100,-", status: "concept" },
]

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isSheetOpen, setIsSheetOpen] = React.useState(false)
    const [selectedCustomer, setSelectedCustomer] = React.useState<Customer | null>(null)

    // Filter Logic
    const filteredCustomers = MOCK_CUSTOMERS.filter(customer => {
        const search = searchTerm.toLowerCase()
        return (
            customer.firstName.toLowerCase().includes(search) ||
            customer.lastName.toLowerCase().includes(search) ||
            customer.email.toLowerCase().includes(search) ||
            customer.city.toLowerCase().includes(search) ||
            (customer.companyName && customer.companyName.toLowerCase().includes(search))
        )
    })

    const handleOpenSheet = (customer: Customer | null) => {
        setSelectedCustomer(customer)
        setIsSheetOpen(true)
    }

    const getInitials = (firstName: string, lastName: string) => {
        return (firstName[0] + lastName[0]).toUpperCase()
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Klanten</h1>
                    <p className="text-slate-500 mt-1">Beheer je klantenbestand en bekijk contactgegevens.</p>
                </div>
                <Button onClick={() => handleOpenSheet(null)} className="bg-orange-500 hover:bg-orange-600">
                    <UserPlus className="mr-2 h-4 w-4" /> Nieuwe Klant
                </Button>
            </div>

            {/* Filters & Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Zoek op naam, stad of email..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[300px]">Naam</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Locatie</TableHead>
                            <TableHead>Aantal Klussen</TableHead>
                            <TableHead className="text-right">Acties</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                                <TableRow
                                    key={customer.id}
                                    className="cursor-pointer hover:bg-slate-50/80"
                                    onClick={() => handleOpenSheet(customer)}
                                >
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-slate-200 bg-white text-slate-600">
                                                <AvatarFallback>{getInitials(customer.firstName, customer.lastName)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-slate-900 font-semibold">
                                                    {customer.firstName} {customer.lastName}
                                                </span>
                                                {customer.companyName && (
                                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                                        <Building2Icon className="w-3 h-3" /> {customer.companyName}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-sm text-slate-600">
                                            <div className="flex items-center gap-2">
                                                <Mail className="w-3.5 h-3.5 text-slate-400" />
                                                {customer.email}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                                {customer.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <MapPin className="w-4 h-4 text-slate-400" />
                                            {customer.city}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                                            {customer.jobsCount} offertes
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Acties</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => handleOpenSheet(customer)}>
                                                        Bewerken
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>Nieuwe Offerte</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        Verwijderen
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                                    Geen klanten gevonden.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <CustomerSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                customer={selectedCustomer}
                customerQuotes={MOCK_QUOTES}
            />
        </div>
    )
}

function Building2Icon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
            <path d="M10 6h4" />
            <path d="M10 10h4" />
            <path d="M10 14h4" />
            <path d="M10 18h4" />
        </svg>
    )
}

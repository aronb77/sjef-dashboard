"use client"

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
    FileText,
    MapPin,
    Phone,
    Mail,
    Building2,
    User,
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    XCircle
} from "lucide-react"

// Mock Types
export interface Customer {
    id: string
    firstName: string
    lastName: string
    companyName?: string
    email: string
    phone: string
    address: string
    zip: string
    city: string
    notes?: string
    jobsCount: number
}

export interface Quote {
    id: string
    customerId: string
    date: string
    amount: string
    status: 'concept' | 'verzonden' | 'geaccepteerd' | 'afgewezen'
}

interface CustomerSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    customer: Customer | null
    customerQuotes: Quote[]
}

export function CustomerSheet({ open, onOpenChange, customer, customerQuotes }: CustomerSheetProps) {
    const isNew = !customer

    // Filter quotes for this customer if existing
    const history = customer && customerQuotes
        ? customerQuotes.filter(q => q.customerId === customer.id)
        : []

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <SheetTitle>{isNew ? "Nieuwe Klant" : "Klantdetails"}</SheetTitle>
                    <SheetDescription>
                        {isNew
                            ? "Voeg een nieuwe klant toe aan je database."
                            : `Bekijk en bewerk gegevens van ${customer?.firstName} ${customer?.lastName}.`
                        }
                    </SheetDescription>
                </SheetHeader>

                <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="details">Details</TabsTrigger>
                        <TabsTrigger value="history" disabled={isNew}>Geschiedenis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-4">
                        <div className="space-y-2">
                            <Label>Bedrijfsnaam (Optioneel)</Label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input className="pl-9" placeholder="Bouwbedrijf X" defaultValue={customer?.companyName} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Voornaam</Label>
                                <Input placeholder="Jan" defaultValue={customer?.firstName} />
                            </div>
                            <div className="space-y-2">
                                <Label>Achternaam</Label>
                                <Input placeholder="Jansen" defaultValue={customer?.lastName} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Emailadres</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input className="pl-9" type="email" placeholder="jan@example.com" defaultValue={customer?.email} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Telefoonnummer</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input className="pl-9" type="tel" placeholder="06 12345678" defaultValue={customer?.phone} />
                            </div>
                        </div>

                        <div className="space-y-1 pt-2">
                            <Label>Adresgegevens</Label>
                            <div className="grid grid-cols-4 gap-2">
                                <Input className="col-span-3" placeholder="Straat + Huisnummer" defaultValue={customer?.address} />
                                <Input placeholder="Postcode" defaultValue={customer?.zip} />
                                <Input className="col-span-4" placeholder="Stad" defaultValue={customer?.city} />
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <Label>Notities</Label>
                            <Input className="h-20" placeholder="Bijv. poortcode, hond aanwezig..." defaultValue={customer?.notes} />
                        </div>

                        <div className="pt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => onOpenChange(false)}>Annuleren</Button>
                            <Button className="bg-orange-500 hover:bg-orange-600">Opslaan</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="history" className="h-[500px]">
                        <ScrollArea className="h-full pr-4">
                            {history.length > 0 ? (
                                <div className="space-y-3">
                                    {history.map((quote) => (
                                        <div key={quote.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-sm">Offerte #{quote.id}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        <CalendarIcon className="h-3 w-3" /> {quote.date}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-sm">{quote.amount}</div>
                                                <Badge
                                                    variant={quote.status === 'geaccepteerd' ? 'default' : 'outline'}
                                                    className={
                                                        quote.status === 'geaccepteerd' ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200' :
                                                            quote.status === 'verzonden' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                quote.status === 'afgewezen' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                    'text-slate-500'
                                                    }
                                                >
                                                    {quote.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                                    <p>Nog geen offertes gevonden voor deze klant.</p>
                                    <Button variant="link" className="text-orange-600">Nieuwe offerte maken</Button>
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </SheetContent>
        </Sheet>
    )
}

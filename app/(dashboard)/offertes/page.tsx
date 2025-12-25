import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreHorizontal, FileText, Eye, Pencil, Trash } from "lucide-react"
import { getQuotes } from "./actions"
import Link from "next/link"

export default async function QuotesPage() {
    const quotes = await getQuotes();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "-";
        return new Intl.DateTimeFormat('nl-NL', { dateStyle: 'short' }).format(new Date(dateStr));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'geaccepteerd':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Geaccepteerd</Badge>
            case 'verzonden':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Verzonden</Badge>
            case 'afgewezen':
                return <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border-red-100">Afgewezen</Badge>
            default: // concept
                return <Badge variant="outline" className="text-slate-600">Concept</Badge>
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mijn Offertes</h1>
                    <p className="text-slate-500 mt-1">Beheer al je offertes op één plek.</p>
                </div>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-md">
                    <Plus className="w-4 h-4 mr-2" />
                    Nieuwe Offerte
                </Button>
            </div>

            {/* Content */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                {quotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <FileText className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Nog geen offertes</h3>
                        <p className="text-slate-500 max-w-sm mt-1 mb-6">
                            Je hebt nog geen offertes aangemaakt. Maak je eerste offerte aan om te beginnen.
                        </p>
                        <Button variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Maak eerste offerte
                        </Button>
                    </div>
                ) : (
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="w-[300px]">Klant</TableHead>
                                <TableHead>Datum</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Bedrag</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quotes.map((quote) => (
                                <TableRow key={quote.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                                <FileText className="h-4 w-4" />
                                            </div>
                                            {quote.klant_naam || "Naamloos"}
                                        </div>
                                    </TableCell>
                                    <TableCell>{formatDate(quote.datum_klus || quote.created_at)}</TableCell>
                                    <TableCell>{getStatusBadge(quote.status)}</TableCell>
                                    <TableCell className="text-right font-mono font-medium">
                                        {formatCurrency(quote.totaal_bedrag || 0)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4 text-slate-400" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acties</DropdownMenuLabel>
                                                {quote.pdf_url ? (
                                                    <DropdownMenuItem asChild>
                                                        <Link href={quote.pdf_url} target="_blank" rel="noopener noreferrer">
                                                            <Eye className="mr-2 h-4 w-4" /> Bekijk PDF
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem disabled>
                                                        <Eye className="mr-2 h-4 w-4" /> PDF niet beschikbaar
                                                    </DropdownMenuItem>
                                                )}

                                                <DropdownMenuItem>
                                                    <Pencil className="mr-2 h-4 w-4" /> Bewerken
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                                    <Trash className="mr-2 h-4 w-4" /> Verwijderen
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    )
}

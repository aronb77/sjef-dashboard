"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { Upload, Settings2, Loader2 } from "lucide-react"
import { updatePdfSettings, getPdfSettings } from "./actions"
import { toast } from "sonner"

export default function ConfiguratorPage() {
    // CONFIG STATE
    const [config, setConfig] = useState({
        companyName: "Bouwbedrijf Sjef B.V.",
        accentColor: "orange-500", // 'orange-500', 'blue-600', 'slate-900'
        showRowNumbers: true,
        showHours: true,
        showVat: true,
        validityDays: 14,
        showSignature: true,
        itemCount: 25
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

    // LOAD SETTINGS
    useEffect(() => {
        async function loadSettings() {
            try {
                const savedSettings = await getPdfSettings()
                if (savedSettings && Object.keys(savedSettings).length > 0) {
                    setConfig(prev => ({ ...prev, ...savedSettings }))
                }
            } catch (error) {
                console.error("Failed to load settings", error)
                toast.error("Kon instellingen niet laden.")
            } finally {
                setIsLoading(false)
            }
        }
        loadSettings()
    }, [])

    // SAVE SETTINGS
    const handleSave = async () => {
        setIsSaving(true)
        try {
            const result = await updatePdfSettings(config)
            if (result.success) {
                toast.success("Instellingen opgeslagen!")
            } else {
                toast.error(result.error || "Er ging iets mis.")
            }
        } catch (error) {
            toast.error("Netwerkfout bij opslaan.")
        } finally {
            setIsSaving(false)
        }
    }

    // MOCK TABLE DATA GENERATOR
    const lineItems = Array.from({ length: config.itemCount }).map((_, i) => ({
        description: i === 0 ? "Voorbereidende werkzaamheden en transport" :
            i % 3 === 0 ? "Leveren en monteren van wandcontactdoos" :
                i % 3 === 1 ? "Frezen van leidingwerk in bestaande muur" :
                    "Afmonteren en testen van elektra groep",
        quantity: i % 2 === 0 ? 2 : 4.5,
        unit: 'uur',
        price: i % 2 === 0 ? 55.00 : 45.00
    }))

    // PAGINATION LOGIC
    // Page 1 has Header + Client Info (~350px used). Leaves room for ~12 items.
    // Page 2+ has full height (~900px usable). Leaves room for ~24 items.
    const ITEMS_PAGE_1 = 12
    const ITEMS_PAGE_N = 24

    const pages = []
    let remainingItems = [...lineItems]

    // First Page
    if (remainingItems.length > 0) {
        pages.push(remainingItems.splice(0, ITEMS_PAGE_1))
    }

    // Subsequent Pages
    while (remainingItems.length > 0) {
        pages.push(remainingItems.splice(0, ITEMS_PAGE_N))
    }

    const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);
    const vat = subtotal * 0.21;
    const total = subtotal + vat;

    // HELPERS
    const updateConfig = (key: string, value: any) => {
        setConfig(prev => ({ ...prev, [key]: value }))
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(amount);
    }

    const getAccentClass = (type: 'text' | 'bg' | 'border') => {
        switch (config.accentColor) {
            case 'blue-600': return type === 'text' ? 'text-blue-600' : type === 'bg' ? 'bg-blue-600' : 'border-blue-600';
            case 'slate-900': return type === 'text' ? 'text-slate-900' : type === 'bg' ? 'bg-slate-900' : 'border-slate-900';
            default: return type === 'text' ? 'text-orange-500' : type === 'bg' ? 'bg-orange-500' : 'border-orange-500';
        }
    }

    const EditorSidebar = ({ className }: { className?: string }) => (
        <div className={cn("flex flex-col h-full bg-slate-950 text-slate-50", className)}>
            <div className="p-4 border-b border-slate-800">
                <h2 className="text-lg font-bold tracking-tight text-white mb-2">Offerte Configurator</h2>
                <p className="text-xs text-slate-400">Pas de layout en styling van je PDF aan.</p>
            </div>

            <ScrollArea className="flex-1">
                {isLoading ? (
                    <div className="flex items-center justify-center h-40 text-slate-500">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Laden...
                    </div>
                ) : (
                    <div className="p-4 space-y-6">
                        <Accordion type="single" collapsible defaultValue="branding" className="w-full">

                            {/* GROUP 1: BRANDING */}
                            <AccordionItem value="branding" className="border-slate-800">
                                <AccordionTrigger className="text-slate-200 hover:text-white">Identiteit & Branding</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Bedrijfsnaam</Label>
                                        <Input
                                            value={config.companyName}
                                            onChange={(e) => updateConfig('companyName', e.target.value)}
                                            className="bg-slate-900 border-slate-800 text-slate-200 focus-visible:ring-orange-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Accent Kleur</Label>
                                        <div className="flex gap-3">
                                            {['orange-500', 'blue-600', 'slate-900'].map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => updateConfig('accentColor', color)}
                                                    className={cn(
                                                        "h-8 w-8 rounded-full border-2 transition-all",
                                                        config.accentColor === color ? "border-white scale-110" : "border-transparent opacity-70 hover:opacity-100",
                                                        color === 'orange-500' ? "bg-orange-500" : color === 'blue-600' ? "bg-blue-600" : "bg-slate-900"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-400">Logo</Label>
                                        <div className="border border-dashed border-slate-800 rounded-md p-4 flex flex-col items-center justify-center bg-slate-900/50 hover:bg-slate-900 transition-colors cursor-pointer">
                                            <Upload className="h-4 w-4 text-slate-500 mb-2" />
                                            <span className="text-xs text-slate-500">Sleep logo hierheen</span>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* GROUP 2: TABLE DETAILS */}
                            <AccordionItem value="table" className="border-slate-800">
                                <AccordionTrigger className="text-slate-200 hover:text-white">Tabel Opties</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-2">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-400">Toon Regelnummers</Label>
                                        <Switch
                                            checked={config.showRowNumbers}
                                            onCheckedChange={(checked) => updateConfig('showRowNumbers', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-400">Specificeer Uren</Label>
                                        <Switch
                                            checked={config.showHours}
                                            onCheckedChange={(checked) => updateConfig('showHours', checked)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-400">Toon BTW per regel</Label>
                                        <Switch
                                            checked={config.showVat}
                                            onCheckedChange={(checked) => updateConfig('showVat', checked)}
                                        />
                                    </div>

                                    <div className="space-y-3 pt-2 border-t border-slate-800">
                                        <div className="flex justify-between">
                                            <Label className="text-slate-400">Aantal Regels (Demo)</Label>
                                            <span className="text-xs font-mono text-slate-400">{config.itemCount}</span>
                                        </div>
                                        <Slider
                                            defaultValue={[25]}
                                            max={100}
                                            min={1}
                                            step={1}
                                            value={[config.itemCount]}
                                            onValueChange={(vals) => updateConfig('itemCount', vals[0])}
                                            className="py-2"
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            {/* GROUP 3: FOOTER */}
                            <AccordionItem value="footer" className="border-slate-800">
                                <AccordionTrigger className="text-slate-200 hover:text-white">Footer & Voorwaarden</AccordionTrigger>
                                <AccordionContent className="space-y-6 pt-2">
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <Label className="text-slate-400">Geldigheid</Label>
                                            <span className="text-xs font-mono text-slate-400">{config.validityDays} dagen</span>
                                        </div>
                                        <Slider
                                            defaultValue={[14]}
                                            max={30}
                                            min={7}
                                            step={1}
                                            value={[config.validityDays]}
                                            onValueChange={(vals) => updateConfig('validityDays', vals[0])}
                                            className="py-2"
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-slate-400">Ondertekenblok</Label>
                                        <Switch
                                            checked={config.showSignature}
                                            onCheckedChange={(checked) => updateConfig('showSignature', checked)}
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                )}
            </ScrollArea>

            <div className="p-4 border-t border-slate-800 bg-slate-950">
                <Button
                    onClick={handleSave}
                    disabled={isSaving || isLoading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 shadow-lg shadow-orange-900/20 disabled:opacity-50"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Opslaan...
                        </>
                    ) : "Template Opslaan"}
                </Button>
            </div>
        </div>
    )

    return (
        <div className="h-[calc(100vh-theme(spacing.16))] w-full overflow-hidden flex flex-col relative">

            {/* MOBILE HEADER FOR CONFIGURATOR */}
            <div className="lg:hidden h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 shrink-0">
                <span className="font-semibold text-slate-900">Live Preview</span>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                            <Settings2 className="h-4 w-4" />
                            Instellen
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[85%] sm:w-[400px] border-r border-slate-800 bg-slate-950">
                        <EditorSidebar />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex flex-row h-full overflow-hidden">

                {/* LEFT PANEL: EDITOR (DESKTOP) */}
                <div className="hidden lg:flex w-[400px] shrink-0 border-r border-slate-800 h-full z-10 shadow-xl overflow-hidden">
                    <EditorSidebar className="w-full" />
                </div>

                {/* RIGHT PANEL: PREVIEW */}
                <div className="flex-1 overflow-hidden h-full relative bg-slate-100/50">
                    <div className="h-full w-full overflow-y-auto p-4 md:p-8 lg:p-16 flex flex-col items-center gap-8">

                        {pages.map((pageItems, pageIndex) => {
                            const isFirstPage = pageIndex === 0
                            const isLastPage = pageIndex === pages.length - 1

                            return (
                                <div key={pageIndex} className="bg-white shadow-xl w-full max-w-[800px] aspect-[210/297] relative p-12 flex flex-col shrink-0 text-slate-900 origin-top scale-[0.4] sm:scale-[0.6] md:scale-[0.8] lg:scale-100 transition-transform duration-300 ease-out mx-auto">

                                    {/* PAGE HEADER - ONLY ON FIRST PAGE */}
                                    {isFirstPage ? (
                                        <>
                                            {/* Header (Identiteit) */}
                                            <div className={cn("flex justify-between items-start mb-12 border-b-2 pb-8", getAccentClass('border'))}>
                                                {/* Links: Logo */}
                                                <div className={cn("w-32 h-16 rounded flex items-center justify-center text-xs", getAccentClass('bg'), "text-white")}>
                                                    LOGO
                                                </div>

                                                {/* Rechts: Bedrijfsgegevens */}
                                                <div className="text-right text-sm text-slate-500 leading-relaxed">
                                                    <p className="font-bold text-slate-900">{config.companyName}</p>
                                                    <p>Bouwstraat 12</p>
                                                    <p>1234 AB, Amsterdam</p>
                                                    <p>info@sjef.ai</p>
                                                </div>
                                            </div>

                                            {/* Meta-Data (Klant & Offerte info) */}
                                            <div className="grid grid-cols-2 gap-8 mb-12 text-sm">
                                                {/* Klantblok */}
                                                <div>
                                                    <p className="font-bold text-slate-900 mb-2">Factuuradres</p>
                                                    <div className="text-slate-600">
                                                        <p>Mevr. J. Jansen</p>
                                                        <p>Herengracht 123</p>
                                                        <p>1015 BE, Amsterdam</p>
                                                    </div>
                                                </div>

                                                {/* Detailsblok */}
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Offertenummer:</span>
                                                        <span className="font-mono text-slate-900">#OFF-2025-001</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Datum:</span>
                                                        <span className="font-mono text-slate-900">21 DEC 2025</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-600">Geldig tot:</span>
                                                        <span className="font-mono text-slate-900">04 JAN 2026</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        // HEADER FOR SUBSEQUENT PAGES
                                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100 opacity-50">
                                            <span className="text-xs font-mono text-slate-400">#OFF-2025-001</span>
                                            <span className="text-xs font-mono text-slate-400">Pagina {pageIndex + 1} / {pages.length}</span>
                                        </div>
                                    )}

                                    {/* TABLE */}
                                    <div className="flex-1">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    {config.showRowNumbers && <th className="text-left p-3 font-bold text-slate-700 uppercase tracking-wider text-xs w-12">#</th>}
                                                    <th className="text-left p-3 font-bold text-slate-700 uppercase tracking-wider text-xs">Omschrijving</th>
                                                    {config.showHours && (
                                                        <th className="text-right p-3 font-bold text-slate-700 uppercase tracking-wider text-xs">
                                                            {config.itemCount > 0 && lineItems[0].unit ? 'Uren' : 'Aantal'}
                                                        </th>
                                                    )}
                                                    <th className="text-right p-3 font-bold text-slate-700 uppercase tracking-wider text-xs">Prijs</th>
                                                    {config.showVat && <th className="text-right p-3 font-bold text-slate-700 uppercase tracking-wider text-xs">BTW</th>}
                                                    <th className="text-right p-3 font-bold text-slate-700 uppercase tracking-wider text-xs">Totaal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pageItems.map((item, index) => (
                                                    <tr key={index} className="border-b border-slate-100 last:border-0">
                                                        {config.showRowNumbers && (
                                                            <td className="p-3 align-top font-mono text-slate-500 text-xs">
                                                                {(pageIndex * ITEMS_PAGE_N) + ((pageIndex === 0) ? 0 : (ITEMS_PAGE_1 - ITEMS_PAGE_N)) + index + 1}
                                                            </td>
                                                        )}
                                                        <td className="p-3 align-top font-sans text-slate-900">
                                                            {item.description}
                                                        </td>
                                                        {config.showHours && (
                                                            <td className="p-3 align-top text-right font-mono text-slate-700">
                                                                {item.quantity}
                                                            </td>
                                                        )}
                                                        <td className="p-3 align-top text-right font-mono text-slate-700">
                                                            {formatCurrency(item.price)}
                                                        </td>
                                                        {config.showVat && (
                                                            <td className="p-3 align-top text-right font-mono text-slate-700">
                                                                21%
                                                            </td>
                                                        )}
                                                        <td className="p-3 align-top text-right font-mono text-slate-700">
                                                            {formatCurrency(item.quantity * item.price)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* FOOTER - ONLY ON LAST PAGE */}
                                    {isLastPage && (
                                        <div className="mt-auto pt-8">
                                            <div className="flex justify-end">
                                                <div className="w-64">
                                                    <div className="flex justify-between mb-2 text-slate-500 text-sm">
                                                        <span>Subtotaal</span>
                                                        <span className="font-mono">{formatCurrency(subtotal)}</span>
                                                    </div>
                                                    <div className="flex justify-between mb-2 text-slate-500 text-sm">
                                                        <span>BTW (21%)</span>
                                                        <span className="font-mono">{formatCurrency(vat)}</span>
                                                    </div>

                                                    <div className="border-t-2 border-slate-900 pt-4 mt-4 flex justify-between items-baseline">
                                                        <span className="font-bold text-lg text-slate-900">Totaal</span>
                                                        <span className={cn("font-mono font-extrabold text-xl", getAccentClass('text'))}>{formatCurrency(total)}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* SIGNATURE BLOCK */}
                                            {config.showSignature && (
                                                <div className="mt-16 flex justify-between text-sm text-slate-900">
                                                    <div className="w-64 border-t border-slate-300 pt-4">
                                                        <p className="font-bold mb-8">Voor akkoord opdrachtgever:</p>
                                                        <div className="h-16 w-full bg-slate-50 border border-dashed border-slate-300 rounded mb-2"></div>
                                                        <div className="flex justify-between text-xs text-slate-500">
                                                            <span>Naam: ________________</span>
                                                            <span>Datum: ___ / ___ / ______</span>
                                                        </div>
                                                    </div>
                                                    <div className="w-64 border-t border-slate-300 pt-4">
                                                        <p className="font-bold mb-8">Voor akkoord {config.companyName}:</p>
                                                        <div className="h-16 w-full bg-slate-50 border border-dashed border-slate-300 rounded mb-2"></div>
                                                        <div className="flex justify-between text-xs text-slate-500">
                                                            <span>Naam: Sjef</span>
                                                            <span>Datum: 21 / 12 / 2025</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* PAGE FOOTER (Absolute) */}
                                    <div className="absolute bottom-12 left-12 right-12 text-[10px] text-slate-400 text-center">
                                        {/* Dynamic Validity? validityDays used in text? */}
                                        Afspraak is afspraak. Offerte is {config.validityDays} dagen geldig. Op al onze diensten zijn de algemene voorwaarden van toepassing. KVK: 12345678.
                                    </div>
                                </div>
                            )
                        })}

                    </div>
                </div>

            </div>
        </div>
    )
}

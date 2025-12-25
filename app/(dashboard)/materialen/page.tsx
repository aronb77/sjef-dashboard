'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client' // Need client component supabase for upload
import { getFiles, saveFileRecord, deleteFile, type UploadedFile } from './actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Upload,
    FileText,
    Trash,
    Loader2,
    AlertCircle,
    CheckCircle2
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Needs to be passed initial data or load it client side?
// The user prompt implied "Refresh de pagina", so maybe standard server component with client logic is better?
// I will make this a client component that fetches initial data or receives it.
// To keep it simple, I'll make the page a Server Component that passes data to a Client Component, or just use `use effect` fetching?
// Best practice: Server Page -> Client List.
// But the prompt says "Refresh de pagina", implies server actions.
// I'll make the whole page client for simplicity of upload/refresh cycle OR mix.
// Let's go with Client Page for the interactivity.

import { useEffect } from 'react'

export default function MaterialsPage() {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [isDragOver, setIsDragOver] = useState(false)

    const fetchFiles = useCallback(async () => {
        try {
            const data = await getFiles()
            setFiles(data)
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchFiles()
    }, [fetchFiles])

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement> | FileList) => {
        const fileList = e instanceof FileList ? e : e.target.files
        if (!fileList || fileList.length === 0) return

        const file = fileList[0]

        // Basic validation
        if (file.size > 10 * 1024 * 1024) { // 10MB limit example
            toast.error("Bestand is te groot (max 10MB)")
            return
        }

        setUploading(true)
        const supabase = createClient()

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
            // Store by user_id prefix usually good practice, but for RLS 'price-lists' checks owner.
            // I'll just put it in root or unique folder.
            // Let's use simplified unique name.

            const { data, error } = await supabase.storage
                .from('price-lists')
                .upload(fileName, file)

            if (error) {
                console.error(error)
                throw new Error(error.message)
            }

            // Get public URL? Policy says 'false' for public. 
            // So we need a signed URL OR just store the path.
            // The prompt says "file_url". 
            // If the bucket is private, we can't just access `file_url` publicly.
            // But we can store the path and generate signed URLs on demand, OR make bucket public.
            // User script: `values ('price-lists', 'price-lists', false)` -> Private.
            // So `file_url` should effectively be the storage path or we generate a signed URL each time.
            // For now I'll store the full Supabase Storage path/Url format so we can track it.
            // Actually, best to store the PATH in `file_url` or rename column to `file_path`.
            // But I must follow schema: `file_url text`.
            // I'll store the `data.path` as the reference.

            const filePath = data.path

            // Save to DB
            const saveResult = await saveFileRecord({
                filename: file.name,
                file_url: filePath, // Processed as internal path
                size: file.size
            })

            if (saveResult.error) {
                toast.error("Upload gelukt, maar database niet bijgewerkt.")
            } else {
                toast.success("Bestand succesvol geüpload!")
                fetchFiles()
            }

        } catch (err: any) {
            toast.error(err.message || "Upload mislukt")
        } finally {
            setUploading(false)
            // Reset input if needed
            const input = document.getElementById('file-upload') as HTMLInputElement
            if (input) input.value = ''
        }
    }

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const onDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFileSelect(e.dataTransfer.files)
        }
    }

    const handleDelete = async (id: string, url: string) => {
        if (!confirm("Weet je zeker dat je dit bestand wilt verwijderen?")) return

        const result = await deleteFile(id, url)
        if (result.success) {
            toast.success("Bestand verwijderd")
            setFiles(prev => prev.filter(f => f.id !== id))
        } else {
            toast.error("Kon bestand niet verwijderen")
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ready':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Klaar</Badge>
            case 'error':
                return <Badge className="bg-red-50 text-red-600 hover:bg-red-50 border-red-100"><AlertCircle className="w-3 h-3 mr-1" /> Fout</Badge>
            default:
                return <Badge variant="outline" className="text-slate-500"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Verwerken...</Badge>
        }
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B'
        const k = 1024
        const dm = 2
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mijn Leveranciers & Prijslijsten</h1>
                <p className="text-slate-500 mt-1">Upload prijslijsten (PDF, CSV, Excel) om ze doorzoekbaar te maken.</p>
            </div>

            <Card className="border-slate-200 border-dashed border-2 shadow-none bg-slate-50/50">
                <CardContent className="pt-6">
                    <div
                        className={cn(
                            "flex flex-col items-center justify-center p-8 rounded-lg transition-colors cursor-pointer",
                            isDragOver ? "bg-orange-50 border-orange-200" : "",
                            "border-2 border-transparent"
                        )}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                    >
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <Upload className={cn("h-8 w-8 text-slate-400", isDragOver && "text-orange-500")} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">Upload een bestand</h3>
                        <p className="text-sm text-slate-500 text-center max-w-sm mb-6">
                            Sleep je bestand hierheen of klik om te bladeren.
                            <br />
                            <span className="text-xs opacity-70">Ondersteund: PDF, CSV, XLSX</span>
                        </p>

                        <label htmlFor="file-upload">
                            <div className={cn(Button({ variant: "default" }), "cursor-pointer bg-slate-900 hover:bg-slate-800 text-white")}>
                                <FileText className="mr-2 h-4 w-4" />
                                Bestand Kiezen
                            </div>
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".pdf,.csv,.xlsx,.xls"
                            onChange={handleFileSelect}
                            disabled={uploading}
                        />

                        {uploading && (
                            <div className="mt-4 flex items-center text-orange-600 text-sm animate-pulse">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploaden...
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100">
                    <CardTitle>Geüploade Bestanden</CardTitle>
                    <CardDescription>Overzicht van al je materialen en statussen.</CardDescription>
                </CardHeader>
                <div className="bg-white min-h-[300px]">
                    {loading ? (
                        <div className="flex justify-center items-center py-20 text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : files.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                <FileText className="h-6 w-6 text-slate-300" />
                            </div>
                            <p className="text-slate-500">Nog geen bestanden geüpload.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead>Bestandsnaam</TableHead>
                                    <TableHead>Grootte</TableHead>
                                    <TableHead>Datum</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actie</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {files.map((file) => (
                                    <TableRow key={file.id} className="hover:bg-slate-50/50">
                                        <TableCell className="font-medium flex items-center gap-3">
                                            <div className="bg-blue-50 p-2 rounded text-blue-600">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            {file.filename}
                                        </TableCell>
                                        <TableCell className="text-slate-500 font-mono text-xs">{formatBytes(file.size)}</TableCell>
                                        <TableCell className="text-slate-500">
                                            {new Date(file.created_at).toLocaleDateString('nl-NL', {
                                                day: '2-digit', month: 'short', year: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(file.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDelete(file.id, file.file_url)}
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </Card>
        </div>
    )
}

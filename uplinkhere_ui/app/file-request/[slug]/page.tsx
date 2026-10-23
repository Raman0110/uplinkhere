"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Copy, Download, ExternalLink, File, LockKeyhole, RefreshCw, Search, Share2, Trash2 } from "lucide-react"
import toast from "react-hot-toast"

import { FileRequest, UploadRecord } from "@/app/types"
import LoadingState from "@/components/LoadingState"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { getApiError, getShareUrl } from "@/lib/api"
import { useAuthenticatedApi } from "@/lib/authenticated-api"
import { formatFileSize } from "@/lib/utils"

export default function FileRequestDetail() {
  const api = useAuthenticatedApi()
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [request, setRequest] = useState<FileRequest | null>(null)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [shareOpen, setShareOpen] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UploadRecord | "request" | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const { data } = await api.get<FileRequest>(`/file-request/manage/${encodeURIComponent(slug)}`)
      setRequest(data)
    } catch (err) {
      setError(getApiError(err, "We couldn’t load this request."))
    } finally {
      setLoading(false)
    }
  }, [api, slug])
  useEffect(() => { void load() }, [load])

  const files = useMemo(() => {
    const value = query.trim().toLowerCase()
    return (request?.uploads ?? []).filter((file) => !value || file.fileName.toLowerCase().includes(value))
  }, [query, request])
  const totalSize = (request?.uploads ?? []).reduce((sum, file) => sum + file.fileSize, 0)

  const copyLink = async () => {
    if (!request) return
    await navigator.clipboard.writeText(getShareUrl(request.slug))
    toast.success("Link copied")
  }

  const openFile = async (file: UploadRecord, preview = false) => {
    const previewWindow = preview ? window.open("", "_blank") : null
    try {
      const { data } = await api.get<Blob>(`/upload/download/${encodeURIComponent(file.id)}`, { responseType: "blob" })
      const url = URL.createObjectURL(data)
      if (preview) {
        if (previewWindow) previewWindow.location.href = url
        else window.open(url, "_blank", "noopener,noreferrer")
        window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
        return
      }

      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = file.fileName
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(url)
    } catch (error) {
      previewWindow?.close()
      toast.error(getApiError(error, "Unable to open this file."))
    }
  }

  const downloadAll = async () => {
    for (const file of request?.uploads ?? []) await openFile(file)
  }

  const confirmDelete = async () => {
    if (!request || !deleteTarget) return
    if (deleteTarget === "request") {
      setDeleting("request")
      try {
        await api.delete(`/file-request/${encodeURIComponent(request.slug)}`)
        toast.success("Request deleted")
        router.push("/")
      } catch (err) {
        toast.error(getApiError(err, "Unable to delete the request."))
        setDeleting(null)
      }
      return
    }

    setDeleting(deleteTarget.id)
    try {
      await api.delete(`/upload/${deleteTarget.id}`)
      setRequest((current) => current ? { ...current, uploads: current.uploads.filter((item) => item.id !== deleteTarget.id) } : current)
      toast.success("File deleted")
      setDeleteTarget(null)
    } catch (err) {
      toast.error(getApiError(err, "Unable to delete the file."))
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return <div className="page-shell flex min-h-screen items-center justify-center"><LoadingState label="Loading request" /></div>
  if (error || !request) return <div className="page-shell flex min-h-screen items-center justify-center"><Card className="w-full max-w-lg"><CardContent className="empty-state"><p className="font-medium text-foreground">Request unavailable</p><p>{error || "This request could not be found."}</p><div className="mt-4 flex gap-3"><Button asChild variant="outline"><Link href="/">Go home</Link></Button><Button onClick={() => void load()}><RefreshCw /> Retry</Button></div></CardContent></Card></div>

  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <header className="border-b bg-white/90 backdrop-blur-xl"><div className="page-shell flex h-16 items-center justify-between"><Button asChild variant="ghost" className="-ml-2 text-muted-foreground"><Link href="/">← All requests</Link></Button><div className="flex gap-2"><Button variant="outline" onClick={() => setShareOpen(true)}><Share2 /><span className="hidden sm:inline">Share</span></Button>{request.uploads.length > 0 && <Button onClick={() => void downloadAll()}><Download /><span className="hidden sm:inline">Download all</span></Button>}</div></div></header>

      <main className="page-shell py-8 sm:py-12">
        <section className="mb-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div><div className="flex items-center gap-2"><Badge variant={request.isExpired ? "secondary" : "outline"} className={!request.isExpired ? "border-emerald-200 bg-emerald-50 text-emerald-700" : ""}>{request.isExpired ? "Expired" : "Accepting uploads"}</Badge>{request.isPasswordProtected && <LockKeyhole className="size-3.5 text-muted-foreground" />}</div><h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">{request.title}</h1><p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">{request.description || "No instructions were added to this request."}</p></div>
          <div className="flex gap-8 text-sm"><div><p className="text-muted-foreground">Files</p><p className="mt-1 text-xl font-semibold">{request.uploads.length}</p></div><div><p className="text-muted-foreground">Total size</p><p className="mt-1 text-xl font-semibold">{formatFileSize(totalSize)}</p></div></div>
        </section>

        <Card>
          <CardHeader className="border-b sm:grid-cols-[1fr_auto] sm:items-center">
            <div><CardTitle>Received files</CardTitle><p className="mt-1 text-xs text-muted-foreground">Newest uploads first</p></div>
            {request.uploads.length > 0 && <div className="relative mt-3 w-full sm:mt-0 sm:w-64"><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search files" className="h-9 pl-9" /></div>}
          </CardHeader>
          <CardContent className="px-0">
            {request.uploads.length === 0 ? <div className="empty-state min-h-64"><span className="empty-icon"><File className="size-5" /></span><p className="font-medium text-foreground">Waiting for the first upload</p><p>Share the request link to start collecting files.</p><Button className="mt-4" onClick={() => setShareOpen(true)}>Share request</Button></div> : files.length === 0 ? <div className="empty-state min-h-48"><p className="font-medium text-foreground">No matching files</p><p>Try another search.</p></div> : <div className="divide-y">{files.slice().sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt)).map((file) => <div key={file.id} className="file-row"><span className="file-icon"><File className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{file.fileName}</p><p className="mt-1 text-xs text-muted-foreground">{formatFileSize(file.fileSize)} · {new Date(file.uploadedAt).toLocaleDateString()}</p></div><div className="flex items-center gap-1"><FileAction label="Preview"><Button variant="ghost" size="icon" onClick={() => void openFile(file, true)}><ExternalLink /></Button></FileAction><FileAction label="Download"><Button variant="ghost" size="icon" onClick={() => void openFile(file)}><Download /></Button></FileAction><FileAction label="Delete"><Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 hover:text-destructive" disabled={deleting === file.id} onClick={() => setDeleteTarget(file)}>{deleting === file.id ? <span className="spinner" /> : <Trash2 />}</Button></FileAction></div></div>)}</div>}
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between border-t pt-6 text-xs text-muted-foreground"><span>{request.expiresAt ? `Expires ${new Date(request.expiresAt).toLocaleString()}` : "No expiry date"}</span><Button variant="link" className="h-auto p-0 text-destructive" onClick={() => setDeleteTarget("request")}>Delete request</Button></div>
      </main>

      <Dialog open={shareOpen} onOpenChange={setShareOpen}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Share request</DialogTitle><DialogDescription>Anyone with the link{request.isPasswordProtected ? " and password" : ""} can upload files.</DialogDescription></DialogHeader><div className="flex items-center gap-2 rounded-lg border bg-muted/60 p-2 pl-3"><span className="min-w-0 flex-1 truncate text-sm">{getShareUrl(request.slug)}</span><Button onClick={() => void copyLink()}><Copy /> Copy</Button></div></DialogContent></Dialog>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(open) => !open && setDeleteTarget(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{deleteTarget === "request" ? "Delete this request?" : "Delete this file?"}</AlertDialogTitle><AlertDialogDescription>{deleteTarget === "request" ? "The request and every uploaded file will be permanently removed." : `“${deleteTarget?.fileName ?? "This file"}” will be permanently removed.`}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction variant="destructive" onClick={() => void confirmDelete()}>{deleting ? "Deleting…" : "Delete"}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </div>
  )
}

function FileAction({ label, children }: { label: string; children: React.ReactNode }) {
  return <Tooltip><TooltipTrigger asChild>{children}</TooltipTrigger><TooltipContent>{label}</TooltipContent></Tooltip>
}

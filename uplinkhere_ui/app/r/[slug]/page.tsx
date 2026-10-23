"use client"

import { ChangeEvent, DragEvent, useCallback, useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { Check, File, LockKeyhole, UploadCloud, X } from "lucide-react"
import toast from "react-hot-toast"

import { FileRequest, UploadedFile } from "@/app/types"
import LoadingState from "@/components/LoadingState"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { api, getApiError } from "@/lib/api"
import { formatFileSize } from "@/lib/utils"

const MAX_FILE_SIZE = 10 * 1024 * 1024
const MAX_FILES = 10

export default function UploadPage() {
  const { slug } = useParams<{ slug: string }>()
  const inputRef = useRef<HTMLInputElement>(null)
  const [request, setRequest] = useState<FileRequest | null>(null)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [password, setPassword] = useState("")
  const [verifiedPassword, setVerifiedPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [verifying, setVerifying] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [complete, setComplete] = useState(false)
  const [dragging, setDragging] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const { data } = await api.get<FileRequest>(`/file-request/getFileRequestsFromSlug/${encodeURIComponent(slug)}`)
      setRequest(data)
    } catch (err) {
      setError(getApiError(err, "This upload request is unavailable."))
    } finally {
      setLoading(false)
    }
  }, [slug])
  useEffect(() => { void load() }, [load])

  const addFiles = (selected: FileList | File[]) => {
    const incoming = Array.from(selected)
    const oversized = incoming.filter((file) => file.size > MAX_FILE_SIZE)
    if (oversized.length) toast.error(`${oversized.length} file${oversized.length > 1 ? "s are" : " is"} larger than 10 MB`)
    setFiles((current) => {
      const available = MAX_FILES - current.length
      const seen = new Set(current.map((item) => `${item.name}:${item.size}`))
      const valid = incoming.filter((file) => file.size <= MAX_FILE_SIZE && !seen.has(`${file.name}:${file.size}`)).slice(0, available)
      if (incoming.length > available) toast.error(`You can upload up to ${MAX_FILES} files at once`)
      return [...current, ...valid.map((file, index) => ({ id: `${file.name}-${file.size}-${Date.now()}-${index}`, name: file.name, size: file.size, type: file.type, file }))]
    })
  }

  const verify = async () => {
    if (!password) return
    setVerifying(true)
    try {
      await api.post("/file-request/checkRequestPassword", { slug, password })
      setVerifiedPassword(password)
    } catch (err) {
      toast.error(getApiError(err, "That password is not correct."))
    } finally {
      setVerifying(false)
    }
  }

  const upload = async () => {
    if (!files.length) return
    const body = new FormData()
    files.forEach((item) => body.append("files", item.file, item.name))
    setUploading(true)
    setProgress(0)
    try {
      await api.post(`/upload/${encodeURIComponent(slug)}`, body, {
        headers: verifiedPassword ? { "x-upload-password": verifiedPassword } : undefined,
        onUploadProgress: (event) => setProgress(event.total ? Math.round((event.loaded * 100) / event.total) : 0),
      })
      setProgress(100)
      setComplete(true)
      setFiles([])
    } catch (err) {
      toast.error(getApiError(err, "Your files could not be uploaded."))
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <PublicShell><LoadingState label="Opening upload request" /></PublicShell>
  if (error || !request) return <PublicShell><StateCard title="Request unavailable" description={error || "This request could not be found."}><Button variant="outline" className="mt-4" onClick={() => void load()}>Try again</Button></StateCard></PublicShell>
  if (request.isExpired) return <PublicShell><StateCard icon={<X />} title="This request has expired" description="Contact the request owner for a new upload link." /></PublicShell>
  if (request.isPasswordProtected && !verifiedPassword) return (
    <PublicShell>
      <Card className="shadow-[0_18px_55px_rgba(23,32,28,.08)]"><CardContent>
        <span className="empty-icon mx-auto"><LockKeyhole className="size-5" /></span>
        <h1 className="mt-2 text-center text-2xl font-semibold tracking-[-0.03em]">Password required</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Enter the password shared by the request owner.</p>
        <form className="mt-7 space-y-3" onSubmit={(event) => { event.preventDefault(); void verify() }}>
          <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" className="h-10" autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></div>
          <Button size="lg" disabled={!password || verifying} className="w-full">{verifying ? <><span className="spinner spinner-light" /> Checking…</> : "Continue"}</Button>
        </form>
      </CardContent></Card>
    </PublicShell>
  )
  if (complete) return <PublicShell><StateCard icon={<Check />} title="Files sent" description="Your upload is complete. It’s safe to close this page."><Button variant="outline" className="mt-4" onClick={() => { setComplete(false); setProgress(0) }}>Upload more files</Button></StateCard></PublicShell>

  return (
    <PublicShell wide>
      <div className="w-full">
        <div className="text-center"><p className="eyebrow">File request</p><h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{request.title}</h1><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">{request.description || "Select the files you’d like to send."}</p></div>
        <Card className="mt-8 shadow-[0_18px_55px_rgba(23,32,28,.07)]"><CardContent>
          <button type="button" onClick={() => inputRef.current?.click()} onDragEnter={() => setDragging(true)} onDragLeave={() => setDragging(false)} onDragOver={(event: DragEvent) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); setDragging(false); addFiles(event.dataTransfer.files) }} className={`drop-zone ${dragging ? "drop-zone-active" : ""}`}><UploadCloud className="size-6" /><span className="mt-4 font-medium">Drop files here or choose files</span><span className="mt-1 text-xs text-muted-foreground">Up to 10 files · 10 MB each</span></button>
          <input ref={inputRef} type="file" multiple className="hidden" onChange={(event: ChangeEvent<HTMLInputElement>) => { if (event.target.files) addFiles(event.target.files); event.target.value = "" }} />
          {files.length > 0 && <div className="mt-5 divide-y rounded-lg border">{files.map((item) => <div key={item.id} className="file-row"><span className="file-icon"><File className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.name}</p><p className="mt-1 text-xs text-muted-foreground">{formatFileSize(item.size)}</p></div><Button variant="ghost" size="icon" onClick={() => setFiles((current) => current.filter((file) => file.id !== item.id))} aria-label={`Remove ${item.name}`}><X /></Button></div>)}</div>}
          {uploading && <div className="mt-6" role="status"><div className="mb-2 flex justify-between text-xs text-muted-foreground"><span>Uploading files…</span><span>{progress}%</span></div><Progress value={progress} /></div>}
          <Button size="lg" onClick={() => void upload()} disabled={!files.length || uploading} className="mt-6 w-full">{uploading ? "Uploading…" : `Send ${files.length || ""} ${files.length === 1 ? "file" : "files"}`}</Button>
        </CardContent></Card>
        <p className="mt-5 text-center text-xs text-muted-foreground">Uploads are sent directly to the request owner.</p>
      </div>
    </PublicShell>
  )
}

function StateCard({ icon, title, description, children }: { icon?: React.ReactNode; title: string; description: string; children?: React.ReactNode }) {
  return <Card><CardContent className="empty-state">{icon && <span className="success-mark">{icon}</span>}<h1 className="text-xl font-semibold text-foreground">{title}</h1><p>{description}</p>{children}</CardContent></Card>
}

function PublicShell({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return <main className="flex min-h-screen items-center justify-center bg-[var(--canvas)] px-4 py-10"><div className={`w-full ${wide ? "max-w-2xl" : "max-w-md"}`}><div className="flex items-center justify-center gap-2"><span className="brand-mark">U</span><span className="text-sm font-semibold">uplink</span></div><div className="mt-8">{children}</div></div></main>
}

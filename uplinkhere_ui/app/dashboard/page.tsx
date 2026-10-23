"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRight, FilePlus2, RefreshCw, Search } from "lucide-react"

import { DashboardResponse, FileRequest } from "../types"
import RequestCard from "@/components/RequestCard"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { api, getApiError } from "@/lib/api"
import { formatFileSize } from "@/lib/utils"

export default function Dashboard() {
  const [requests, setRequests] = useState<FileRequest[]>([])
  const [stats, setStats] = useState({ totalUploads: 0, totalFileSize: 0 })
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadRequests = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const { data } = await api.get<DashboardResponse>("/file-request/getFileRequests")
      setRequests(data.requests ?? [])
      setStats({ totalUploads: data.totalUploads || 0, totalFileSize: data.totalFileSize || 0 })
    } catch (err) {
      setError(getApiError(err, "We couldn’t load your requests."))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { void loadRequests() }, [loadRequests])

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return requests
    return requests.filter((request) => [request.title, request.description, request.slug].some((field) => field?.toLowerCase().includes(value)))
  }, [query, requests])

  return (
    <div className="space-y-10">
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Workspace</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl">Collect files without the back-and-forth.</h1>
          <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground">Create a private upload link, share it, and keep every delivery in one place.</p>
        </div>
        <Button asChild size="lg" className="sm:hidden"><Link href="/create">New request <ArrowUpRight /></Link></Button>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        {[["Open requests", String(requests.filter((item) => !item.isExpired).length)], ["Files received", String(stats.totalUploads)], ["Storage used", formatFileSize(stats.totalFileSize)]].map(([label, value]) => (
          <Card key={label} size="sm"><CardContent><p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</p><p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">{value}</p></CardContent></Card>
        ))}
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-xl font-semibold tracking-[-0.025em]">File requests</h2><p className="mt-1 text-sm text-muted-foreground">{requests.length} total</p></div>
          {requests.length > 0 && <div className="relative w-full sm:w-64"><Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 pl-9" placeholder="Search requests" aria-label="Search requests" /></div>}
        </div>

        {loading ? (
          <div className="grid gap-3 lg:grid-cols-2">{Array.from({ length: 4 }).map((_, index) => <Card key={index}><CardContent className="space-y-4"><Skeleton className="h-5 w-20" /><Skeleton className="h-6 w-2/3" /><Skeleton className="h-10 w-full" /></CardContent></Card>)}</div>
        ) : error ? (
          <Card><CardContent className="empty-state"><p className="font-medium text-foreground">Unable to load requests</p><p>{error}</p><Button onClick={() => void loadRequests()} variant="outline" className="mt-4"><RefreshCw /> Try again</Button></CardContent></Card>
        ) : requests.length === 0 ? (
          <Card><CardContent className="empty-state"><span className="empty-icon"><FilePlus2 className="size-5" /></span><p className="font-medium text-foreground">No file requests yet</p><p>Create your first link and start collecting files.</p><Button asChild className="mt-4"><Link href="/create">Create a request</Link></Button></CardContent></Card>
        ) : filtered.length === 0 ? (
          <Card><CardContent className="empty-state"><p className="font-medium text-foreground">No matching requests</p><p>Try another search.</p></CardContent></Card>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">{filtered.map((request) => <RequestCard key={request.id} request={request} />)}</div>
        )}
      </section>
    </div>
  )
}

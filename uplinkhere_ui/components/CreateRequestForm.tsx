"use client"

import { FormEvent, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Copy, Eye, EyeOff, Sparkles } from "lucide-react"
import toast from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DateTimePicker } from "@/components/ui/date-time-picker"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { api, getApiError, getShareUrl } from "@/lib/api"

const initialForm = { title: "", description: "", slug: "", password: "", expiresAt: "", protected: false }

export default function CreateRequestForm() {
  const router = useRouter()
  const [form, setForm] = useState(initialForm)
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [createdSlug, setCreatedSlug] = useState("")

  const suggestedSlug = useMemo(() => form.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80), [form.title])
  const update = (key: keyof typeof form, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }))

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.title.trim()) return
    setSubmitting(true)
    try {
      const { data } = await api.post("/file-request", {
        title: form.title.trim(),
        description: form.description.trim(),
        slug: form.slug.trim(),
        password: form.protected ? form.password : undefined,
        expiresAt: form.expiresAt || undefined,
      })
      setCreatedSlug(data.request.slug)
      toast.success("Request created")
    } catch (error) {
      toast.error(getApiError(error, "Unable to create this request."))
    } finally {
      setSubmitting(false)
    }
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText(getShareUrl(createdSlug))
    toast.success("Link copied")
  }

  return (
    <>
      <div className="mx-auto max-w-3xl">
        <Button type="button" variant="ghost" className="-ml-2 mb-7 text-muted-foreground" onClick={() => router.push("/")}>← Back to requests</Button>
        <div className="mb-8">
          <p className="eyebrow">New request</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em]">Create an upload link</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-6 text-muted-foreground">Give people a clear place to send you files. Add a password or expiry only when you need them.</p>
        </div>

        <Card className="shadow-[0_16px_50px_rgba(23,32,28,.06)]">
          <CardContent>
            <form onSubmit={submit} className="space-y-7">
              <div className="grid gap-2">
                <Label htmlFor="title">Request title</Label>
                <Input id="title" className="h-10" required autoFocus value={form.title} onChange={(event) => update("title", event.target.value)} placeholder="Brand assets for Q4 campaign" />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between"><Label htmlFor="description">Instructions</Label><span className="text-xs text-muted-foreground">Optional</span></div>
                <Textarea id="description" rows={4} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Tell uploaders what you need and how files should be named." />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between"><Label htmlFor="slug">Custom link</Label><span className="text-xs text-muted-foreground">Optional</span></div>
                <div className="flex rounded-lg border border-input bg-background focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
                  <span className="flex items-center border-r bg-muted px-3 text-sm text-muted-foreground">/r/</span>
                  <Input id="slug" className="h-10 flex-1 border-0 shadow-none focus-visible:ring-0" value={form.slug} onChange={(event) => update("slug", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder={suggestedSlug || "campaign-assets"} />
                  <Button type="button" variant="ghost" size="icon-lg" onClick={() => update("slug", suggestedSlug)} disabled={!suggestedSlug} aria-label="Generate link from title"><Sparkles /></Button>
                </div>
              </div>

              <Separator />

              <div className="grid gap-7 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div><Label htmlFor="password-toggle">Password protection</Label><p className="mt-1 text-xs text-muted-foreground">Ask uploaders for a password.</p></div>
                    <Switch id="password-toggle" checked={form.protected} onCheckedChange={(checked) => update("protected", checked)} />
                  </div>
                  {form.protected && (
                    <div className="relative">
                      <Input required className="h-10 pr-10" type={showPassword ? "text" : "password"} value={form.password} onChange={(event) => update("password", event.target.value)} minLength={4} placeholder="At least 4 characters" />
                      <Button type="button" variant="ghost" size="icon-sm" className="absolute top-1.5 right-1.5" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>{showPassword ? <EyeOff /> : <Eye />}</Button>
                    </div>
                  )}
                </div>

                <div className="grid content-start gap-2">
                  <div className="flex items-center justify-between"><Label>Expiry date</Label><span className="text-xs text-muted-foreground">Optional</span></div>
                  <DateTimePicker value={form.expiresAt} onChange={(value) => update("expiresAt", value)} />
                </div>
              </div>

              <Separator />

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" size="lg" onClick={() => router.push("/")}>Cancel</Button>
                <Button type="submit" size="lg" className="min-w-36" disabled={submitting || !form.title.trim()}>{submitting ? <><span className="spinner spinner-light" /> Creating…</> : "Create request"}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <Dialog open={Boolean(createdSlug)} onOpenChange={(open) => !open && setCreatedSlug("")}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <span className="success-mark mb-2"><Check className="h-5 w-5" /></span>
            <DialogTitle className="text-xl">Your request is ready</DialogTitle>
            <DialogDescription>Share this link with anyone who needs to send you files.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-lg border bg-muted/60 p-2 pl-3">
            <span className="min-w-0 flex-1 truncate text-sm">{createdSlug ? getShareUrl(createdSlug) : ""}</span>
            <Button type="button" variant="outline" onClick={() => void copyLink()}><Copy /> Copy</Button>
          </div>
          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => { setCreatedSlug(""); setForm(initialForm) }}>Create another</Button>
            <Button onClick={() => router.push(`/file-request/${createdSlug}`)}>View request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

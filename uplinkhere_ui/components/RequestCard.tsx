import Link from "next/link"
import { ArrowUpRight, LockKeyhole } from "lucide-react"

import { FileRequest } from "@/app/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function RequestCard({ request }: { request: FileRequest }) {
  return (
    <Link href={`/file-request/${request.slug}`} className="group block rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40">
      <Card className="h-full transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_40px_rgba(23,32,28,.08)]">
        <CardContent className="flex flex-1 items-start justify-between gap-5">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant={request.isExpired ? "secondary" : "outline"} className={!request.isExpired ? "border-emerald-200 bg-emerald-50 text-emerald-700" : ""}>{request.isExpired ? "Expired" : "Active"}</Badge>
              {request.isPasswordProtected && <LockKeyhole className="size-3.5 text-muted-foreground" aria-label="Password protected" />}
            </div>
            <h3 className="mt-4 truncate text-lg font-semibold tracking-[-0.02em]">{request.title}</h3>
            <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">{request.description || "No instructions added."}</p>
          </div>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </CardContent>
        <CardFooter className="justify-between text-xs text-muted-foreground"><span className="truncate">/r/{request.slug}</span><span>{request.uploads?.length ?? 0} {(request.uploads?.length ?? 0) === 1 ? "file" : "files"}</span></CardFooter>
      </Card>
    </Link>
  )
}

import Link from "next/link"
import { Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SuccessPage() {
  return <main className="flex min-h-screen items-center justify-center bg-[var(--canvas)] p-4"><Card className="w-full max-w-md"><CardContent className="empty-state"><span className="success-mark"><Check className="size-5" /></span><h1 className="text-2xl font-semibold tracking-[-0.03em]">Upload complete</h1><p>Your files were sent successfully.</p><Button asChild className="mt-4"><Link href="/">Return home</Link></Button></CardContent></Card></main>
}

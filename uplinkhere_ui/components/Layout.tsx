import { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--canvas)]">
      <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(247,248,246,.88)] backdrop-blur-xl">
        <div className="page-shell flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3" aria-label="Uplink home">
            <span className="brand-mark" aria-hidden="true">U</span>
            <span className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--ink)]">uplink</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild size="lg" className="hidden sm:inline-flex">
              <Link href="/create">New request <ArrowUpRight /></Link>
            </Button>
            <UserButton />
          </div>
        </div>
      </header>
      <main className="page-shell py-8 sm:py-12">{children}</main>
    </div>
  );
}

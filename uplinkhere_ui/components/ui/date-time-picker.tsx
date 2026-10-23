"use client"

import { useState } from "react"
import { format, isToday, startOfToday } from "date-fns"
import { CalendarIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

function toLocalDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function DateTimePicker({
  value,
  onChange,
  className,
}: {
  value?: string
  onChange: (value: string) => void
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const selected = value ? new Date(value) : undefined

  const selectDate = (day?: Date) => {
    if (!day) return
    const next = new Date(day)
    if (selected) {
      next.setHours(selected.getHours(), selected.getMinutes(), 0, 0)
    } else if (isToday(day)) {
      const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000)
      next.setHours(oneHourFromNow.getHours(), oneHourFromNow.getMinutes(), 0, 0)
    } else {
      next.setHours(17, 0, 0, 0)
    }
    onChange(toLocalDateTime(next))
  }

  const selectTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number)
    const next = selected ? new Date(selected) : new Date()
    next.setHours(hours, minutes, 0, 0)
    onChange(toLocalDateTime(next))
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className={cn("h-10 flex-1 justify-start px-3 font-normal", !selected && "text-muted-foreground")}
          >
            <CalendarIcon data-icon="inline-start" />
            {selected ? format(selected, "MMM d, yyyy · h:mm a") : "Choose date and time"}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto overflow-hidden p-0">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={selectDate}
            disabled={{ before: startOfToday() }}
          />
          <div className="flex items-center gap-3 border-t p-3">
            <span className="text-xs font-medium text-muted-foreground">Time</span>
            <Input
              type="time"
              min={selected && isToday(selected) ? format(new Date(), "HH:mm") : undefined}
              value={selected ? format(selected, "HH:mm") : "17:00"}
              onChange={(event) => selectTime(event.target.value)}
              className="h-8 flex-1"
            />
            <Button type="button" size="sm" onClick={() => setOpen(false)} disabled={!selected}>Done</Button>
          </div>
        </PopoverContent>
      </Popover>
      {selected && (
        <Button type="button" variant="outline" size="icon-lg" onClick={() => onChange("")} aria-label="Remove expiry">
          <X />
        </Button>
      )}
    </div>
  )
}

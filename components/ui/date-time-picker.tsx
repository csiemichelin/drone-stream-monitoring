"use client"

import { useMemo, useState } from "react"
import { Calendar as CalendarIcon, Clock, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type DateTimePickerProps = {
  value: Date | null
  onChange: (value: Date | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

const pad = (num: number) => num.toString().padStart(2, "0")

const timeStringFromDate = (date: Date | null) =>
  date ? `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}` : "00:00:00"

const combineDateAndTime = (date: Date, time: string) => {
  const [hours, minutes, seconds] = time.split(":").map((part) => Number.parseInt(part, 10) || 0)
  const combined = new Date(date)
  combined.setHours(hours, minutes, seconds, 0)
  return combined
}

export function DateTimePicker({ value, onChange, placeholder = "Select date & time", disabled, className }: DateTimePickerProps) {
  const [open, setOpen] = useState(false)
  const display = useMemo(
    () =>
      value
        ? new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).format(value)
        : placeholder,
    [value, placeholder],
  )

  const timeString = timeStringFromDate(value)

  const handleDateSelect = (day?: Date) => {
    if (!day) return
    const combined = combineDateAndTime(day, timeString)
    onChange(combined)
  }

  const handleTimeChange = (next: string) => {
    const base = value ?? new Date()
    const combined = combineDateAndTime(base, next || "00:00:00")
    onChange(combined)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between text-left font-normal gap-2",
            !value && "text-muted-foreground",
            className,
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{display}</span>
          </div>
          {value ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onChange(null)
              }}
              className="p-1 rounded-full hover:bg-muted"
              aria-label="Clear date"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3 space-y-3" align="start">
        <Calendar mode="single" selected={value ?? undefined} onSelect={handleDateSelect} />
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <Input
            type="time"
            step={1}
            value={timeString}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="w-32"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

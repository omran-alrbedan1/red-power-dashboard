import React, { useEffect, useRef, useState, useLayoutEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { format, setHours, setMinutes } from "date-fns"
import { useTranslation } from "react-i18next"
import { TimeOption } from "@/types/customFormField.types"

interface TimePickerFieldProps {
  field: any
  timeOptions?: TimeOption
  disabled?: boolean
  inputClassName?: string
}

export const TimePickerField: React.FC<TimePickerFieldProps> = ({
  field,
  timeOptions,
  disabled,
  inputClassName,
}) => {
  const { t } = useTranslation("common")
  const [open, setOpen] = useState(false)
  const [placeAbove, setPlaceAbove] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const interval = timeOptions?.interval || 30

  useLayoutEffect(() => {
    if (!open) return
    const trigger = containerRef.current
    const popover = popoverRef.current
    if (!trigger || !popover) return
    const spaceBelow = window.innerHeight - trigger.getBoundingClientRect().bottom
    setPlaceAbove(popover.offsetHeight > spaceBelow)
  }, [open])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const timeSlots: Date[] = []
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      timeSlots.push(setMinutes(setHours(new Date(), hour), minute))
    }
  }

  const toKey = (value: Date) => format(value, "HH:mm")
  const selectedKey = field.value ? toKey(new Date(field.value)) : undefined
  const displayFormat = timeOptions?.format || "p"

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "w-full justify-start text-start font-normal",
          !field.value && "text-text-secondary",
          inputClassName
        )}
        disabled={disabled}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <Clock className="me-2 h-4 w-4" />
        {field.value
          ? format(new Date(field.value), displayFormat)
          : timeOptions?.placeholder || t("timePicker.placeholder")}
      </Button>
      {open && (
        <div
          ref={popoverRef}
          className={cn(
            "absolute z-50 w-full rounded-md border border-border bg-popover shadow-lg",
            placeAbove ? "bottom-full mb-1" : "top-full mt-1"
          )}
        >
          <div role="listbox" className="max-h-60 overflow-y-auto p-2">
            {timeSlots.map((time) => (
              <Button
                key={toKey(time)}
                type="button"
                variant="ghost"
                role="option"
                aria-selected={toKey(time) === selectedKey}
                className={cn(
                  "w-full justify-start px-3 py-2",
                  toKey(time) === selectedKey && "bg-primary/10 text-primary"
                )}
                onClick={() => {
                  field.onChange(time)
                  setOpen(false)
                }}
              >
                {format(time, displayFormat)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
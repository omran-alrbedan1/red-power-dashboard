import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { ChevronDown, Check } from "lucide-react"
import { Option } from "@/types/customFormField.types"

interface ComboboxFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  options?: Option[]
  searchPlaceholder?: string
  emptyMessage?: string
}

export const ComboboxField: React.FC<ComboboxFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  options = [],
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found",
}) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  const selectedOption = options.find((option) => option.value === field.value)

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "w-full justify-between text-start font-normal",
          !field.value && "text-text-secondary",
          inputClassName
        )}
        disabled={disabled}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        {selectedOption?.label ?? placeholder ?? "Select option"}
        <ChevronDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
      {open && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-lg">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      field.onChange(option.value)
                      setOpen(false)
                    }}
                    disabled={option.disabled}
                  >
                    <Check
                      className={cn(
                        "me-2 h-4 w-4",
                        field.value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
}
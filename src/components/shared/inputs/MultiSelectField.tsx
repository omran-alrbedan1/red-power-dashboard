import { useEffect, useRef, useState, type ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { ChevronDown, Check } from "lucide-react"
import type { Option } from "@/types/customFormField.types"

interface MultiSelectFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  options?: Option[]
  searchPlaceholder?: string
  emptyMessage?: string
  footer?: ReactNode
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  options = [],
  searchPlaceholder = "Search options...",
  emptyMessage = "No options found",
  footer,
}) => {
  const { t } = useTranslation("common")
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

  const selectedValues: string[] = field.value ?? []

  const handleToggle = (value: string) => {
    field.onChange(
      selectedValues.includes(value)
        ? selectedValues.filter((item) => item !== value)
        : [...selectedValues, value]
    )
  }

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
          !selectedValues.length && "text-text-secondary",
          inputClassName
        )}
        disabled={disabled}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        <ChevronDown className="me-2 h-4 w-4 shrink-0" />
        {selectedValues.length ? (
          <span className="flex flex-wrap gap-1">
            {selectedValues.map((value) => (
              <Badge key={value} variant="secondary" className="text-xs">
                {options.find((option) => option.value === value)?.label ?? value}
              </Badge>
            ))}
          </span>
        ) : (
          placeholder ?? t("common.form.selectOptions")
        )}
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
                    onSelect={() => handleToggle(option.value)}
                    disabled={option.disabled}
                  >
                    <Check
                      className={cn(
                        "me-2 h-4 w-4",
                        selectedValues.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {footer && (
            <div className="border-t border-border">
              {footer}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
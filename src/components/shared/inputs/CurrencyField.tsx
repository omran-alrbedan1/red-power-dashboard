import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface CurrencyFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  currency?: string
}

export const CurrencyField: React.FC<CurrencyFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  ariaLabel,
  ariaDescribedBy,
  currency = "USD",
}) => {
  const [displayValue, setDisplayValue] = useState("")
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, "")
    const numValue = parseFloat(value) || 0
    setDisplayValue(value)
    field.onChange(numValue)
  }
  
  return (
    <div className="relative group">
      <Input
        {...field}
        type="text"
        placeholder={placeholder || "0.00"}
        disabled={disabled}
        className={cn(inputClassName, "ps-14")}
        value={displayValue}
        onChange={handleChange}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      />
      <div className="absolute start-4 top-1/2 transform -translate-y-1/2 text-sm text-text-muted group-focus-within:text-primary transition-colors">
        {currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency}
      </div>
    </div>
  )
}
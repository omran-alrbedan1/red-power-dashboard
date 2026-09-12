import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface PercentageFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  min?: number
  max?: number
}

export const PercentageField: React.FC<PercentageFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  ariaLabel,
  ariaDescribedBy,
  min,
  max,
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
        placeholder={placeholder || "0"}
        disabled={disabled}
        className={cn(inputClassName, "pe-14")}
        value={displayValue}
        onChange={handleChange}
        min={min}
        max={max}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      />
      <div className="absolute end-4 top-1/2 transform -translate-y-1/2 text-sm text-text-muted group-focus-within:text-primary transition-colors">
        %
      </div>
    </div>
  )
}
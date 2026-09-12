import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"

interface PasswordFieldProps {
  field: any
  placeholder?: string
  disabled?: boolean
  inputClassName?: string
  ariaLabel?: string
  ariaDescribedBy?: string
  leftIcon?: React.ElementType
  iconPosition?: "left" | "right" | "both"
  iconClassName?: string
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  field,
  placeholder,
  disabled,
  inputClassName,
  ariaLabel,
  ariaDescribedBy,
  leftIcon: LeftIcon,
  iconPosition,
  iconClassName,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const hasLeftIcon = LeftIcon && (!iconPosition || iconPosition === "left" || iconPosition === "both")

  return (
    <div className="relative group">
      {hasLeftIcon && LeftIcon && (
        <div className="absolute start-4 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-primary">
          <LeftIcon className={cn("h-5 w-5 text-text-muted group-focus:text-primary", iconClassName)} />
        </div>
      )}
      <Input
        {...field}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          inputClassName,
          hasLeftIcon && "ps-14",
          "pe-14"
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute end-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4 group-focus:text-primary transition-colors" />
        ) : (
          <Eye className="h-4 w-4 group-focus:text-primary transition-colors" />
        )}
      </Button>
    </div>
  )
}
import React from "react"
import { cn } from "@/lib/utils"

interface BaseFieldProps {
  children: React.ReactNode
  leftIcon?: React.ElementType
  rightIcon?: React.ElementType
  hasLeftIcon?: boolean
  hasRightIcon?: boolean
  iconClassName?: string
}

export const BaseField: React.FC<BaseFieldProps> = ({
  children,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  hasLeftIcon,
  hasRightIcon,
  iconClassName,
}) => {
  if (hasLeftIcon || hasRightIcon) {
    return (
      <div className="relative group">
        {hasLeftIcon && LeftIcon && (
          <div className="absolute start-4 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-primary">
            <LeftIcon className={cn("h-5 w-5 text-text-muted group-focus-within:text-primary", iconClassName)} />
          </div>
        )}
        {children}
        {hasRightIcon && RightIcon && (
          <div className="absolute end-4 top-1/2 transform -translate-y-1/2 transition-colors group-focus-within:text-primary">
            <RightIcon className={cn("h-5 w-5 text-text-muted group-focus-within:text-primary", iconClassName)} />
          </div>
        )}
      </div>
    )
  }
  
  return <>{children}</>
}
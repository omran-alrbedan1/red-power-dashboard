import React from "react"
import { Ban, CircleCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface EmployeeStatusBadgeProps {
  isActive: boolean
  label?: string
  className?: string
}

export const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({
  isActive,
  label,
  className,
}) => {
  const active = isActive

  return (
    <Badge
      className={cn(
        "gap-1.5 border",
        active
          ? "border-green-500/25 bg-green-500/15 text-green-600"
          : "border-border bg-background-secondary text-text-secondary",
        className,
      )}
    >
      {active ? (
        <CircleCheck className="h-3.5 w-3.5" />
      ) : (
        <Ban className="h-3.5 w-3.5" />
      )}
      {label ?? (active ? "Active" : "Inactive")}
    </Badge>
  )
}

export default EmployeeStatusBadge
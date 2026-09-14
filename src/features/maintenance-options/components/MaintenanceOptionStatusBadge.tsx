import { Ban, CircleCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MaintenanceOptionStatusBadgeProps {
  isActive: boolean
  label?: string
  className?: string
}

export const MaintenanceOptionStatusBadge: React.FC<MaintenanceOptionStatusBadgeProps> = ({
  isActive,
  label,
  className,
}) => (
  <Badge
    className={cn(
      "gap-1.5 border",
      isActive
        ? "border-green-500/25 bg-green-500/15 text-green-600"
        : "border-border bg-background-secondary text-text-secondary",
      className,
    )}
  >
    {isActive ? (
      <CircleCheck className="h-3.5 w-3.5" />
    ) : (
      <Ban className="h-3.5 w-3.5" />
    )}
    {label ?? (isActive ? "Active" : "Inactive")}
  </Badge>
)
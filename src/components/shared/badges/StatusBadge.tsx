import React from "react"
import { CheckCircle2, Circle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusBadgeStatus = "open" | "closed"

const STATUS_META: Record<
  StatusBadgeStatus,
  { icon: React.ReactNode; className: string }
> = {
  open: {
    icon: <Circle className="h-2.5 w-2.5 fill-current" />,
    className:
      "border border-primary/25 bg-primary/10 text-primary",
  },
  closed: {
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    className:
      "border border-border bg-background-secondary text-text-secondary",
  },
}

export interface StatusBadgeProps {
  status: StatusBadgeStatus
  label?: string
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  label,
  className,
}) => {
  const meta = STATUS_META[status]

  return (
    <Badge className={cn("gap-1.5", meta.className, className)}>
      {meta.icon}
      {label ?? status}
    </Badge>
  )
}

export default StatusBadge
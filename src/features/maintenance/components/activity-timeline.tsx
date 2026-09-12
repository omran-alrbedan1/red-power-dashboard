import { useTranslation } from "react-i18next"
import { formatDateTime } from "@/lib/formatter"
import { Badge } from "@/components/ui/badge"
import { Lock, Plus, User, FileText } from "lucide-react"
import type { MaintenanceStatusEventRow } from "../types/maintenance-detail.types"
import { cn } from "@/lib/utils"

interface ActivityTimelineProps {
  events: MaintenanceStatusEventRow[]
}

const getActivityIcon = (status: string) => {
  if (status === "open") return Plus
  if (status === "closed") return Lock
  return FileText
}

const getActivityColor = (status: string) => {
  if (status === "open") return "text-primary"
  if (status === "closed") return "text-slate-400"
  return "text-muted-foreground"
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ events }) => {
  const { t, i18n } = useTranslation("maintenance")
  const isAr = i18n.language === "ar"

  if (events.length === 0) {
    return (
      <div className="p-4 text-center text-sm text-muted-foreground">
        {t("activity.noActivity")}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => {
        const Icon = getActivityIcon(event.toStatus)
        const iconColor = getActivityColor(event.toStatus)

        return (
          <div
            key={event.id}
            className={cn(
              "relative flex gap-4 pb-4",
              index !== events.length - 1 &&
                "border-e border-border/30 pe-4"
            )}
          >
            <div className="flex shrink-0 items-start">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full bg-muted/50",
                  iconColor
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-text-primary">
                  {t(`activity.status.${event.toStatus}`)}
                </p>
                <Badge variant="outline" className="text-xs">
                  {t(`statuses.${event.toStatus}`)}
                </Badge>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDateTime(event.createdAt, isAr ? "ar-SA" : "en-GB")}</span>
                {event.changedBy?.name && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {event.changedBy.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
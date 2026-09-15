import { useTranslation } from "react-i18next"
import { formatDateTime } from "@/lib/formatter"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Ban, CircleCheck, FileText, Lock, Pencil, Play, Plus, RotateCcw, Trash2, User, Wrench } from "lucide-react"
import type { MaintenanceActivityEvent } from "../types/api-maintenance.types"
import { cn } from "@/lib/utils"

interface ActivityTimelineProps {
  events: MaintenanceActivityEvent[]
}

const WORK_EVENT_TYPES = new Set([
  "WORK_CREATED",
  "WORK_UPDATED",
  "WORK_STARTED",
  "WORK_COMPLETED",
  "WORK_CANCELLED",
  "WORK_REOPENED",
  "WORK_REMOVED",
])

const getActivityIcon = (type: string) => {
  switch (type) {
    case "CARD_CREATED":
    case "WORK_CREATED":
      return Plus
    case "CARD_CLOSED":
      return Lock
    case "CARD_REOPENED":
    case "WORK_REOPENED":
      return RotateCcw
    case "WORK_STARTED":
      return Play
    case "WORK_COMPLETED":
      return CircleCheck
    case "WORK_CANCELLED":
      return Ban
    case "WORK_REMOVED":
      return Trash2
    case "WORK_UPDATED":
      return Pencil
    default:
      return FileText
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "WORK_COMPLETED":
      return "text-emerald-600"
    case "WORK_CANCELLED":
      return "text-amber-600"
    case "WORK_REMOVED":
    case "CARD_CLOSED":
      return "text-slate-400"
    case "WORK_STARTED":
    case "CARD_REOPENED":
    case "WORK_REOPENED":
    case "CARD_CREATED":
    case "WORK_CREATED":
      return "text-primary"
    default:
      return "text-muted-foreground"
  }
}

const getTypeKey = (type: string) => {
  const parts = type.split("_")
  const first = parts[0].toLowerCase()
  const rest = parts
    .slice(1)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
  return [first, ...rest].join("")
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
        const Icon = getActivityIcon(event.type)
        const iconColor = getActivityColor(event.type)
        const isWorkEvent = WORK_EVENT_TYPES.has(event.type)

        return (
          <div
            key={event.id}
            className={cn(
              "relative flex gap-4 pb-4",
              index !== events.length - 1 && "border-e border-border/30 pe-4"
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
                  {t(`activity.types.${getTypeKey(event.type)}`, {
                    description: event.work?.description ?? "",
                  })}
                </p>

                {isWorkEvent && <Wrench className="size-3.5 shrink-0 text-muted-foreground" />}
              </div>

              {(event.toStatus || event.fromStatus) && (
                <div className="flex flex-wrap items-center gap-2">
                  {event.fromStatus && (
                    <Badge variant="outline" className="text-xs">
                      {t(`activity.statusValue.${isWorkEvent ? "work" : "card"}.${event.fromStatus.toLowerCase()}`, { defaultValue: event.fromStatus.toLowerCase() })}
                    </Badge>
                  )}
                  {event.fromStatus && event.toStatus && (
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground rtl:rotate-180" />
                  )}
                  {event.toStatus && (
                    <Badge variant="outline" className="text-xs">
                      {t(`activity.statusValue.${isWorkEvent ? "work" : "card"}.${event.toStatus.toLowerCase()}`, { defaultValue: event.toStatus.toLowerCase() })}
                    </Badge>
                  )}
                </div>
              )}

              {event.reason && (
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold">{t("activity.reason")}:</span> {event.reason}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span>{formatDateTime(event.occurredAt, isAr ? "ar-SA" : "en-GB")}</span>
                {event.actor?.firstName || event.actor?.lastName || event.actor?.email ? (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {[event.actor.firstName, event.actor.lastName].filter(Boolean).join(" ") || event.actor.email}
                    </span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
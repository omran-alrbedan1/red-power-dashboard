import { useTranslation } from "react-i18next"
import { User } from "lucide-react"
import { formatDateTime } from "@/lib/formatter"
import type { MaintenanceWorkRow } from "../../types/maintenance-detail.types"
import { MaintenanceWorkActions, WorkStatusBadge } from "./MaintenanceWorkActions"

interface MaintenanceWorkItemProps {
  cardId: number
  work: MaintenanceWorkRow
  index: number
  readOnly?: boolean
}

export function MaintenanceWorkItem({ cardId, work, index, readOnly = false }: MaintenanceWorkItemProps) {
  const { t, i18n } = useTranslation("maintenance")
  const isAr = i18n.language === "ar"

  return (
    <div className="rounded-xl border border-border p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">{index + 1}.</span>
            <span className="font-semibold text-foreground">{work.description}</span>
            {work.isRequired && (
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{t("work.required")}</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <WorkStatusBadge work={work} />
            {work.estimatedCost !== null && work.estimatedCost !== undefined && (
              <span dir="ltr">{t("work.estimate")}: {work.estimatedCost}</span>
            )}
          </div>

          {(work.status === "completed" || work.status === "cancelled") && (
            <div className="mt-1 space-y-1 text-xs text-muted-foreground">
              {work.status === "completed" && work.completedAt && (
                <p className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-emerald-600">{t("work.completedOn")}</span>
                  {formatDateTime(work.completedAt, isAr ? "ar-SA" : "en-GB")}
                  {work.completedBy?.name && (
                    <span className="flex items-center gap-1">
                      <User className="size-3" />
                      {work.completedBy.name}
                    </span>
                  )}
                </p>
              )}

              {work.status === "cancelled" && (
                <>
                  {work.cancelledAt && (
                    <p className="flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-amber-600">{t("work.cancelledOn")}</span>
                      {formatDateTime(work.cancelledAt, isAr ? "ar-SA" : "en-GB")}
                      {work.cancelledBy?.name && (
                        <span className="flex items-center gap-1">
                          <User className="size-3" />
                          {work.cancelledBy.name}
                        </span>
                      )}
                    </p>
                  )}
                  {work.cancellationReason && (
                    <p className="flex items-center gap-1.5">
                      <span className="font-semibold text-amber-600">{t("work.cancellationReason")}:</span>
                      <span className="text-foreground">{work.cancellationReason}</span>
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <MaintenanceWorkActions cardId={cardId} work={work} readOnly={readOnly} />
      </div>
    </div>
  )
}
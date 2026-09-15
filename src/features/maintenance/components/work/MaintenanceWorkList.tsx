import { useTranslation } from "react-i18next"
import type { MaintenanceWorkRow } from "../../types/maintenance-detail.types"
import { MaintenanceWorkItem } from "./MaintenanceWorkItem"

interface MaintenanceWorkListProps {
  cardId: number
  works: MaintenanceWorkRow[]
  readOnly?: boolean
}

export function MaintenanceWorkList({ cardId, works, readOnly = false }: MaintenanceWorkListProps) {
  const { t } = useTranslation("maintenance")

  const workTotal = works
    .filter((item) => item.status !== "cancelled")
    .reduce((sum, item) => sum + (Number(item.estimatedCost) || 0), 0)

  if (works.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("work.noWork")}</p>
  }

  return (
    <div className="space-y-3">
      {[...works]
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((work, index) => (
          <MaintenanceWorkItem key={work.id} cardId={cardId} work={work} index={index} readOnly={readOnly} />
        ))}

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-sm font-semibold text-foreground">{t("work.total")}</span>
        <span className="text-lg font-bold text-primary" dir="ltr">{workTotal}</span>
      </div>
    </div>
  )
}
import { useTranslation } from "react-i18next"
import { AlertTriangle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { MaintenanceWorkRow } from "../types/maintenance-detail.types"
import { getClosureStatus } from "../utils/closure-guard"

interface ClosureGuardBadgeProps {
  requiredWorks: MaintenanceWorkRow[]
}

export const ClosureGuardBadge: React.FC<ClosureGuardBadgeProps> = ({
  requiredWorks,
}) => {
  const { t } = useTranslation("maintenance")
  const closure = getClosureStatus(requiredWorks)

  if (closure.remainingWork.length === 0) {
    return null
  }

  return (
    <Card className="border-amber-500/50 bg-amber-500/10">
      <div className="flex items-start gap-3 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium text-amber-500">
              {t("closureGuard.title")}
            </p>
            <Badge variant="outline" className="border-amber-500/50 text-amber-500">
              {closure.remainingWork.length}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("closureGuard.requiredWorkRemaining", { count: closure.remainingWork.length })}
          </p>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              {t("closureGuard.remainingWork")}
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {closure.remainingWork.map((work) => (
                <li key={work.id} className="flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-amber-500" />
                  <span>{work.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  )
}
import { useTranslation } from "react-i18next"
import { ClipboardList, Wrench, FileText } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate, formatCurrency } from "@/lib/formatter"
import type { CustomerHistory, WorkStatus } from "../types/visit-summary.types"

const STATUS_VARIANTS: Record<WorkStatus, Record<string, string>> = {
  pending: { labelKey: "history.statuses.pending", className: "bg-amber-500/15 text-amber-400" },
  in_progress: { labelKey: "history.statuses.in_progress", className: "bg-blue-500/15 text-blue-400" },
  completed: { labelKey: "history.statuses.completed", className: "bg-green-500/15 text-green-500" },
  cancelled: { labelKey: "history.statuses.cancelled", className: "bg-red-500/15 text-red-500" },
}

const StatusBadge: React.FC<{ status: WorkStatus }> = ({ status }) => {
  const { t } = useTranslation("customers")
  const config = STATUS_VARIANTS[status]
  if (!config) {
    return <Badge className="bg-gray-500/15 text-gray-400">{status}</Badge>
  }
  return <Badge className={config.className}>{t(config.labelKey)}</Badge>
}

interface CustomerHistoryProps {
  history?: CustomerHistory
  isLoading?: boolean
  maintenanceCards?: Array<{
    id: string
    receiptNumber: string
    status: string
    createdAt: string
    workCount: number
    totalCost: number
  }>
}

export const CustomerHistoryView: React.FC<CustomerHistoryProps> = ({
  history,
  isLoading,
  maintenanceCards,
}) => {
  const { t } = useTranslation("customers")

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-text-primary">
            {t("history.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          {t("history.noHistory")}
        </CardContent>
      </Card>
    )
  }

  const hasVisits = !!history && history.visits.length > 0
  const hasWork = !!history && history.workItems.length > 0
  const hasMaintenanceCards = !!maintenanceCards && maintenanceCards.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-text-primary">
          <ClipboardList className="h-5 w-5 text-primary" />
          {t("history.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasVisits && !hasWork && !hasMaintenanceCards ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("history.noHistory")}
          </p>
        ) : (
          <div className="space-y-6">
            {hasMaintenanceCards && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  {t("history.visits")}
                </h3>
                <div className="space-y-2">
                  {maintenanceCards!.map((card) => (
                    <div
                      key={card.id}
                      className="rounded-lg border border-border/60 bg-card/50 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-text-primary" dir="ltr">
                            {card.receiptNumber}
                          </span>
                        </div>
                        <Badge className="bg-sky-500/15 text-sky-400">
                          {card.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(card.createdAt)} · {card.workCount} {card.workCount === 1 ? 'work item' : 'work items'}
                      </p>
                      {card.totalCost > 0 && (
                        <p className="mt-1 text-xs font-medium text-text-primary">
                          {formatCurrency(card.totalCost)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {hasVisits && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  {t("history.visits")}
                </h3>
                <div className="space-y-2">
                  {history!.visits.map((visit) => (
                    <div
                      key={visit.id}
                      className="rounded-lg border border-border/60 bg-card/50 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium text-text-primary" dir="ltr">
                            {visit.receiptNumber}
                          </span>
                        </div>
                        <StatusBadge status={visit.status} />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(visit.date)} · {visit.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {hasWork && (
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-text-primary">
                  {t("history.work")}
                </h3>
                <div className="space-y-2">
                  {history!.workItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-border/60 bg-card/50 p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-primary" />
                        <span className="text-sm text-text-primary">
                          {item.description}
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        {item.estimatedCost != null && item.estimatedCost > 0 && (
                          <span className="text-xs font-medium text-text-primary">
                            {formatCurrency(item.estimatedCost)}
                          </span>
                        )}
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
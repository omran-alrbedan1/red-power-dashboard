import { useTranslation } from "react-i18next"
import { ClipboardList, FileText, CalendarDays, Gauge } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/formatter"
import type {
  CustomerHistoryPage,
  CustomerHistoryStatus,
} from "../types/visit-summary.types"

const STATUS_VARIANTS: Record<
  CustomerHistoryStatus,
  { labelKey: string; className: string }
> = {
  OPEN: { labelKey: "history.statuses.open", className: "bg-sky-500/15 text-sky-400" },
  CLOSED: {
    labelKey: "history.statuses.closed",
    className: "bg-green-500/15 text-green-500",
  },
}

const StatusBadge: React.FC<{ status: CustomerHistoryStatus }> = ({ status }) => {
  const { t } = useTranslation("customers")
  const config = STATUS_VARIANTS[status]
  if (!config) {
    return <Badge className="bg-gray-500/15 text-gray-400">{status}</Badge>
  }
  return <Badge className={config.className}>{t(config.labelKey)}</Badge>
}

const vehicleLabel = (vehicle: CustomerHistoryPage["data"][number]["vehicle"]) => {
  if (!vehicle) return "-"
  const name = [vehicle.make, vehicle.model].filter(Boolean).join(" ") || "-"
  return `${name} (${vehicle.plateNumber})`
}

interface CustomerHistoryProps {
  history?: CustomerHistoryPage
  isLoading?: boolean
}

export const CustomerHistoryView: React.FC<CustomerHistoryProps> = ({
  history,
  isLoading,
}) => {
  const { t } = useTranslation("customers")

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg text-text-primary">
            <ClipboardList className="h-5 w-5 text-primary" />
            {t("history.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          {t("history.loading")}
        </CardContent>
      </Card>
    )
  }

  const items = history?.data ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-text-primary">
          <ClipboardList className="h-5 w-5 text-primary" />
          {t("history.title")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("history.noHistory")}
          </p>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-border/60 bg-card/50 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <span
                      className="text-sm font-medium text-text-primary"
                      dir="ltr"
                    >
                      {item.receiptNumber ?? "-"}
                    </span>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5 text-primary" />
                  {formatDate(item.entryDate) ?? "-"}
                  {item.deliveryDate ? ` · ${formatDate(item.deliveryDate)}` : ""}
                </p>
                <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5 text-primary" />
                    {item.mileage ?? "-"}{" "}
                    {item.mileage != null ? "km" : ""}
                  </span>
                  <span>{vehicleLabel(item.vehicle)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
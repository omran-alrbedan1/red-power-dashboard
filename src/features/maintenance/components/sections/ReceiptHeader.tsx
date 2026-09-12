import { useTranslation } from "react-i18next"
import { Hash, Calendar } from "lucide-react"
import { MaintenanceStatusBadge } from "../StatusBadge"
import { formatDateTime } from "@/lib/formatter"
import type { MaintenanceCardStatus } from "../../types/maintenance-detail.types"

interface ReceiptHeaderProps {
  receiptNumber: string
  status: MaintenanceCardStatus
  createdAt: string
}

export const ReceiptHeader = ({
  receiptNumber,
  status,
  createdAt,
}: ReceiptHeaderProps) => {
  const { t } = useTranslation("maintenance")

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Hash className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">{t("receiptNumber")}:</span>
          <span className="font-semibold text-text-primary">{receiptNumber}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">{t("receivedAt")}:</span>
          <span className="font-medium text-text-primary">{formatDateTime(createdAt)}</span>
        </div>
      </div>
      <MaintenanceStatusBadge status={status} />
    </div>
  )
}
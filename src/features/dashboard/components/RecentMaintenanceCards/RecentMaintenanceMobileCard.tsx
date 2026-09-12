import React from "react"
import { CalendarDays, Car } from "lucide-react"
import { useTranslation } from "react-i18next"

import { StatusBadge } from "@/components/shared/badges"
import type { MaintenanceCardListRow } from "@/features/maintenance/types/maintenance-detail.types"
import { formatDate } from "@/lib/formatter"

interface RecentMaintenanceMobileCardProps {
  item: MaintenanceCardListRow
  onViewDetails: () => void
}

const RecentMaintenanceMobileCard: React.FC<
  RecentMaintenanceMobileCardProps
> = ({
  item,
  onViewDetails,
}) => {
  const { t, i18n } = useTranslation()

  const locale = i18n.language.startsWith("ar")
    ? "ar-SA"
    : "en-GB"

  return (
    <button
      type="button"
      onClick={onViewDetails}
      className="
        w-full rounded-xl
        border border-border/60
        bg-background-card
        p-4 text-start
        transition-colors
        hover:bg-background-secondary
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
      "
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="
            font-mono text-xs font-semibold
            text-text-primary
          "
          dir="ltr"
        >
          {item.cardNumber}
        </span>

        <StatusBadge
          status={item.status}
          label={t(
            `maintenance:statuses.${item.status}`,
          )}
        />
      </div>

      <p className="mt-3 truncate text-sm font-semibold text-text-primary">
        {item.customer.name}
      </p>

      <div
        className="
          mt-1 flex items-center gap-1.5
          text-xs text-text-muted
        "
      >
        <Car className="h-3.5 w-3.5 shrink-0" />

        <span className="truncate">
          {item.vehicle.make} {item.vehicle.model}
        </span>

        <span className="text-border">
          •
        </span>

        <span
          className="shrink-0"
          dir="ltr"
        >
          {item.vehicle.plateNumber}
        </span>
      </div>

      <div
        className="
          mt-3 flex items-center gap-1.5
          text-xs text-text-muted
        "
      >
        <CalendarDays className="h-3.5 w-3.5 shrink-0" />

        <span dir="ltr">
          {formatDate(
            item.receivedAt,
            locale,
          )}
        </span>
      </div>
    </button>
  )
}

export default RecentMaintenanceMobileCard
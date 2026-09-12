import {
  CalendarDays,
  Car,
  FileText,
  User,
  Wrench,
} from "lucide-react"
import type { TFunction } from "i18next"

import { StatusBadge } from "@/components/shared/badges"
import type { Column } from "@/components/shared/custom/DataTable"
import type { MaintenanceCardListRow } from "@/features/maintenance/types/maintenance-detail.types"
import { formatDate } from "@/lib/formatter"

interface CreateRecentMaintenanceColumnsParams {
  t: TFunction
  locale: string
}

export const createRecentMaintenanceColumns = ({
  t,
  locale,
}: CreateRecentMaintenanceColumnsParams): Column<MaintenanceCardListRow>[] => {
  return [
    {
      key: "cardNumber",
      header: t(
        "dashboard.recentMaintenance.card",
        "Card",
      ),
      headerIcon: FileText,

      cell: (card) => (
        <span
          className="
            font-mono font-semibold
            text-text-primary
          "
          dir="ltr"
        >
          {card.cardNumber}
        </span>
      ),
    },

    {
      key: "customer",
      header: t(
        "common.customer",
        "Customer",
      ),
      headerIcon: User,

      cell: (card) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-text-primary">
            {card.customer.name}
          </p>

          <p
            className="
              mt-0.5 truncate
              text-xs text-text-muted
            "
            dir="ltr"
          >
            {card.customer.phone}
          </p>
        </div>
      ),
    },

    {
      key: "vehicle",
      header: t(
        "common.vehicle",
        "Vehicle",
      ),
      headerIcon: Car,

      cell: (card) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-text-primary">
            {card.vehicle.make} {card.vehicle.model}
          </p>

          <p
            className="
              mt-0.5 truncate
              text-xs text-text-muted
            "
            dir="ltr"
          >
            {card.vehicle.plateNumber}
          </p>
        </div>
      ),
    },

    {
      key: "status",
      header: t(
        "common.status",
        "Status",
      ),
      headerIcon: Wrench,

      cell: (card) => (
        <StatusBadge
          status={card.status}
          label={t(
            `maintenance:statuses.${card.status}`,
          )}
        />
      ),
    },

    {
      key: "receivedAt",
      header: t(
        "dashboard.recentMaintenance.received",
        "Received",
      ),
      headerIcon: CalendarDays,

      cell: (card) => (
        <div
          className="
            flex items-center gap-2
            whitespace-nowrap
            text-text-muted
          "
        >
          <CalendarDays className="h-3.5 w-3.5 shrink-0" />

          <span dir="ltr">
            {formatDate(
              card.receivedAt,
              locale,
            )}
          </span>
        </div>
      ),
    },
  ]
}
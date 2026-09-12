import React from "react"
import { useTranslation } from "react-i18next"
import {
  CalendarDays,
  Gauge,
  Wrench,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"

import { formatDate } from "@/lib/formatter"

import type {
  CustomerHistoryPage,
  CustomerHistoryStatus,
} from "../types/visit-summary.types"

interface StatusConfig {
  labelKey: string
  className: string
}

const STATUS_VARIANTS: Record<
  CustomerHistoryStatus,
  StatusConfig
> = {
  OPEN: {
    labelKey:
      "history.statuses.open",
    className:
      "border-sky-500/20 bg-sky-500/10 text-sky-600",
  },

  CLOSED: {
    labelKey:
      "history.statuses.closed",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
  },
}

const HistoryStatusBadge: React.FC<{
  status: CustomerHistoryStatus
}> = ({
  status,
}) => {
  const { t } =
    useTranslation("customers")

  const config =
    STATUS_VARIANTS[status]

  if (!config) {
    return (
      <Badge
        variant="outline"
        className="
          border-gray-500/20
          bg-gray-500/10
          text-gray-500
        "
      >
        {status}
      </Badge>
    )
  }

  return (
    <Badge
      variant="outline"
      className={config.className}
    >
      {t(config.labelKey)}
    </Badge>
  )
}

const getVehicleLabel = (
  vehicle:
    CustomerHistoryPage["data"][number]["vehicle"],
) => {
  if (!vehicle) {
    return "—"
  }

  const name = [
    vehicle.make,
    vehicle.model,
  ]
    .filter(Boolean)
    .join(" ")

  if (!name) {
    return vehicle.plateNumber
  }

  return `${name} · ${vehicle.plateNumber}`
}

interface CustomerHistoryItemProps {
  item: CustomerHistoryPage["data"][number]
}

export const CustomerHistoryItem: React.FC<
  CustomerHistoryItemProps
> = ({
  item,
}) => {
  const { i18n } =
    useTranslation("customers")

  const locale =
    i18n.language.startsWith("ar")
      ? "ar-SA"
      : "en-GB"

  return (
    <div
      className="
        rounded-xl
        border border-border/60
        bg-background-secondary/15
        p-4
      "
    >
      <div
        className="
          flex flex-col
          justify-between
          gap-3
          sm:flex-row
          sm:items-center
        "
      >
        <div
          className="
            flex items-center
            gap-3
          "
        >
          <div
            className="
              flex h-10 w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
          >
            <Wrench className="h-4 w-4" />
          </div>

          <div>
            <p
              className="
                font-mono
                text-sm
                font-semibold
                text-text-primary
              "
              dir="ltr"
            >
              {item.receiptNumber ??
                "—"}
            </p>

            <p
              className="
                mt-0.5 text-xs
                text-text-muted
              "
            >
              {getVehicleLabel(
                item.vehicle,
              )}
            </p>
          </div>
        </div>

        <HistoryStatusBadge
          status={
            item.status
          }
        />
      </div>

      <div
        className="
          mt-4 grid gap-3
          border-t
          border-border/50
          pt-3
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        <div
          className="
            flex items-center
            gap-2 text-xs
            text-text-muted
          "
        >
          <CalendarDays
            className="
              h-3.5 w-3.5
              text-primary
            "
          />

          <span>
            {formatDate(
              item.entryDate,
              locale,
            ) ?? "—"}
          </span>
        </div>

        {item.deliveryDate && (
          <div
            className="
              flex items-center
              gap-2 text-xs
              text-text-muted
            "
          >
            <CalendarDays
              className="
                h-3.5 w-3.5
                text-primary
              "
            />

            <span>
              {formatDate(
                item.deliveryDate,
                locale,
              )}
            </span>
          </div>
        )}

        <div
          className="
            flex items-center
            gap-2 text-xs
            text-text-muted
          "
        >
          <Gauge
            className="
              h-3.5 w-3.5
              text-primary
            "
          />

          <span dir="ltr">
            {item.mileage != null
              ? `${item.mileage.toLocaleString()} km`
              : "—"}
          </span>
        </div>
      </div>
    </div>
  )
}
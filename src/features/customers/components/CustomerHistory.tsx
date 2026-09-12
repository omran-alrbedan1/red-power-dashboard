import React from "react"
import { useTranslation } from "react-i18next"
import {
  CalendarDays,
  ClipboardList,
  FileText,
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

interface CustomerHistoryProps {
  history?: CustomerHistoryPage
  isLoading?: boolean
}

export const CustomerHistoryView: React.FC<
  CustomerHistoryProps
> = ({
  history,
  isLoading = false,
}) => {
  const { t, i18n } =
    useTranslation("customers")

  const locale =
    i18n.language.startsWith("ar")
      ? "ar-SA"
      : "en-GB"

  const items =
    history?.data ?? []

  return (
    <section
      className="
        overflow-hidden rounded-2xl
        border border-border/60
        bg-background-card
        shadow-[0_8px_30px_rgba(15,23,42,0.045)]
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center gap-3
          border-b border-border/60
          px-5 py-4
        "
      >
        <div
          className="
            flex h-10 w-10
            items-center justify-center
            rounded-xl
            bg-primary/10
            text-primary
          "
        >
          <ClipboardList className="h-5 w-5" />
        </div>

        <div>
          <h2
            className="
              text-base font-bold
              text-text-primary
            "
          >
            {t(
              "history.title",
              "Maintenance History",
            )}
          </h2>

          <p
            className="
              mt-0.5 text-xs
              text-text-muted
            "
          >
            {t(
              "history.description",
              "Previous workshop visits for this customer",
            )}
          </p>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3 p-5">
          {Array.from({
            length: 3,
          }).map((_, index) => (
            <div
              key={index}
              className="
                h-24 animate-pulse
                rounded-xl
                bg-background-secondary
              "
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading &&
        items.length === 0 && (
          <div
            className="
              flex min-h-[210px]
              flex-col items-center
              justify-center
              px-6 py-10
              text-center
            "
          >
            <div
              className="
                flex h-14 w-14
                items-center justify-center
                rounded-2xl
                bg-background-secondary
                text-text-muted
              "
            >
              <FileText className="h-6 w-6" />
            </div>

            <p
              className="
                mt-4 text-sm
                font-semibold
                text-text-primary
              "
            >
              {t(
                "history.noHistory",
                "No maintenance history yet",
              )}
            </p>

            <p
              className="
                mt-1 max-w-md
                text-xs leading-5
                text-text-muted
              "
            >
              {t(
                "history.noHistoryDescription",
                "Maintenance records for this customer will appear here.",
              )}
            </p>
          </div>
        )}

      {/* History */}
      {!isLoading &&
        items.length > 0 && (
          <div className="space-y-3 p-5">
            {items.map(
              (item) => (
                <div
                  key={item.id}
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
              ),
            )}
          </div>
        )}
    </section>
  )
}
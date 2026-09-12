import React from "react"
import {
  ArrowRight,
  CalendarDays,
  Car,
  ClipboardList,
  FileText,
  User,
  Wrench,
} from "lucide-react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import { useMaintenanceCards } from "@/features/maintenance/hooks/useMaintenanceCards"
import type { MaintenanceCardListRow } from "@/features/maintenance/types/maintenance-detail.types"
import { StatusBadge } from "@/components/shared/badges"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { formatDate } from "@/lib/formatter"

interface MobileCardProps {
  item: MaintenanceCardListRow
  onViewDetails: () => void
}

const RecentMobileCard: React.FC<MobileCardProps> = ({
  item,
  onViewDetails,
}) => {
  const { t, i18n } = useTranslation()
  const isAr = i18n.language === "ar"

  return (
    <button
      type="button"
      onClick={onViewDetails}
      className="
        w-full rounded-xl border border-border/60
        bg-background-card p-4 text-start
        hover:bg-background-secondary
      "
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="font-mono text-xs font-semibold text-text-primary"
          dir="ltr"
        >
          {item.cardNumber}
        </span>

        <StatusBadge
          status={item.status}
          label={t(`maintenance:statuses.${item.status}`)}
        />
      </div>

      <p className="mt-2 truncate text-sm font-medium text-text-primary">
        {item.customer.name}
      </p>

      <p className="mt-1 truncate text-xs text-text-muted" dir="ltr">
        {item.vehicle.make} {item.vehicle.model} ·{" "}
        {item.vehicle.plateNumber}
      </p>

      <p className="mt-2 flex items-center gap-1.5 text-xs text-text-muted">
        <CalendarDays className="h-3.5 w-3.5" />

        {formatDate(item.receivedAt, isAr ? "ar-SA" : "en-GB")}
      </p>
    </button>
  )
}

const RecentMaintenanceCards: React.FC = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useMaintenanceCards({
    page: 1,
    limit: 5,
  })

  const cards = data?.items ?? []
  const isAr = i18n.language === "ar"

  const columns: Column<MaintenanceCardListRow>[] = [
    {
      key: "cardNumber",
      header: t("dashboard.recentMaintenance.card", "Card"),
      headerIcon: FileText,
      cell: (card) => (
        <span className="font-mono font-semibold text-text-primary" dir="ltr">
          {card.cardNumber}
        </span>
      ),
    },
    {
      key: "customer",
      header: t("common.customer", "Customer"),
      headerIcon: User,
      cell: (card) => (
        <div>
          <p className="text-text-primary">{card.customer.name}</p>
          <p className="text-xs text-text-muted" dir="ltr">
            {card.customer.phone}
          </p>
        </div>
      ),
    },
    {
      key: "vehicle",
      header: t("common.vehicle", "Vehicle"),
      headerIcon: Car,
      cell: (card) => (
        <div>
          <p className="text-text-primary">
            {card.vehicle.make} {card.vehicle.model}
          </p>
          <p className="text-xs text-text-muted" dir="ltr">
            {card.vehicle.plateNumber}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: t("common.status", "Status"),
      headerIcon: Wrench,
      cell: (card) => (
        <StatusBadge
          status={card.status}
          label={t(`maintenance:statuses.${card.status}`)}
        />
      ),
    },
    {
      key: "receivedAt",
      header: t("dashboard.recentMaintenance.received", "Received"),
      headerIcon: CalendarDays,
      cell: (card) => (
        <span className="text-text-muted" dir="ltr">
          {formatDate(card.receivedAt, isAr ? "ar-SA" : "en-GB")}
        </span>
      ),
    },
  ]

  const MobileCard = (props: {
    item: MaintenanceCardListRow
    onViewDetails: () => void
    t: (key: string, options?: unknown) => string
    isAr: boolean
  }) => (
    <RecentMobileCard
      item={props.item}
      onViewDetails={props.onViewDetails}
    />
  )

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
          flex items-center justify-between gap-4
          border-b border-border/60
          px-5 py-4
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-xl bg-primary/10 text-primary
            "
          >
            <ClipboardList className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-base font-bold text-text-primary">
              {t(
                "dashboard.recentMaintenance.title",
                "Recent Maintenance Cards",
              )}
            </h2>

            <p className="mt-0.5 text-xs text-text-muted">
              {t(
                "dashboard.recentMaintenance.description",
                "Latest cards received by the workshop",
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/maintenance")}
          className="
            inline-flex items-center gap-2
            rounded-lg border border-border
            px-3 py-2
            text-xs font-semibold text-text-secondary
            hover:bg-background-secondary
            hover:text-text-primary
            focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-primary
          "
        >
          {t("common.viewAll", "View All")}

          <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" />
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="divide-y divide-border/50">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-4 px-5 py-4"
            >
              <div className="h-9 w-9 animate-pulse rounded-lg bg-background-secondary" />

              <div className="flex-1">
                <div className="h-3 w-32 animate-pulse rounded bg-background-secondary" />
                <div className="mt-2 h-3 w-48 animate-pulse rounded bg-background-secondary" />
              </div>

              <div className="h-6 w-16 animate-pulse rounded-full bg-background-secondary" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <div className="flex flex-col items-center px-5 py-10 text-center">
          <p className="text-sm font-medium text-text-primary">
            {t(
              "dashboard.recentMaintenance.error",
              "Unable to load maintenance cards",
            )}
          </p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 text-sm font-semibold text-primary"
          >
            {t("common.retry", "Try again")}
          </button>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && cards.length === 0 && (
        <div className="flex flex-col items-center px-5 py-10 text-center">
          <div
            className="
              flex h-12 w-12 items-center justify-center
              rounded-xl bg-primary/10 text-primary
            "
          >
            <ClipboardList className="h-5 w-5" />
          </div>

          <p className="mt-3 text-sm font-semibold text-text-primary">
            {t(
              "dashboard.recentMaintenance.empty",
              "No maintenance cards yet",
            )}
          </p>

          <p className="mt-1 text-xs text-text-muted">
            {t(
              "dashboard.recentMaintenance.emptyDescription",
              "New workshop receipts will appear here.",
            )}
          </p>
        </div>
      )}

      {/* DataTable */}
      {!isLoading && !isError && cards.length > 0 && (
        <DataTable<MaintenanceCardListRow>
          data={cards}
          columns={columns}
          pagination={{
            total: cards.length,
            page: 1,
            lastPage: 1,
            perPage: 5,
          }}
          onPageChange={() => undefined}
          getRowId={(card) => card.id}
          onRowClick={(card) => navigate(`/maintenance/${card.id}`)}
          rowActions
          mobileCardComponent={MobileCard}
          emptyMessage={t("dashboard.recentMaintenance.empty")}
          className="rounded-none border-0 bg-transparent"
        />
      )}
    </section>
  )
}

export default RecentMaintenanceCards
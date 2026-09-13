import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  CalendarDays,
  FileText,
  User,
  Car,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import {
  DataTable,
  type Column,
} from "@/components/shared/custom/DataTable"
import { formatDate } from "@/lib/formatter"

import type { MaintenanceCardListRow } from "../types/maintenance-detail.types"
import { StatusBadge } from "@/components/shared/badges"

interface MaintenanceTableProps {
  cards: MaintenanceCardListRow[]
  loading?: boolean

  onRowClick: (card: MaintenanceCardListRow) => void

  pagination?: {
    total: number
    page: number
    totalPages: number
    perPage?: number
  }

  onPageChange?: (page: number) => void

  emptyMessage?: string

  emptyState?: {
    icon?: LucideIcon
    imageUrl?: string
    imageAlt?: string
    title?: string
    description?: string
    primaryAction?: {
      label: string
      icon?: LucideIcon
      onClick: () => void
    }
    secondaryAction?: {
      label: string
      onClick: () => void
    }
  }
}

interface MaintenanceMobileCardProps {
  item: MaintenanceCardListRow
  onViewDetails: () => void
}

const MaintenanceMobileCard: React.FC<MaintenanceMobileCardProps> = ({
  item,
  onViewDetails,
}) => {
  const { t, i18n } = useTranslation("maintenance")
  const locale = i18n.language.startsWith("ar") ? "ar-SA" : "en-GB"

  return (
    <button
      type="button"
      onClick={onViewDetails}
      className="w-full rounded-lg border border-border bg-card p-4 text-start shadow-sm transition-colors hover:bg-background-secondary"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-text-primary" dir="ltr">
            {item.cardNumber}
          </span>
        </div>
        <StatusBadge status={item.status} label={t(`statuses.${item.status}`)} />
      </div>

      <div className="mt-3 space-y-1 text-xs text-text-muted">
        <p className="flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-primary" />
          {item.customer.name}
        </p>
        <p className="flex items-center gap-1.5">
          <Car className="h-3.5 w-3.5 text-primary" />
          {item.vehicle.make} {item.vehicle.model}
          <span dir="ltr">({item.vehicle.plateNumber})</span>
        </p>
        <p className="flex items-center gap-1.5">
          <CalendarDays className="h-3.5 w-3.5 text-primary" />
          <span dir="auto">
            {formatDate(item.receivedAt, locale)}
          </span>
        </p>
      </div>
    </button>
  )
}

export const MaintenanceTable: React.FC<MaintenanceTableProps> = ({
  cards,
  loading = false,

  onRowClick,

  pagination,
  onPageChange,

  emptyMessage,
  emptyState,
}) => {
  const { t, i18n } = useTranslation("maintenance")
  const locale = i18n.language.startsWith("ar") ? "ar-SA" : "en-GB"

  const columns = useMemo<Column<MaintenanceCardListRow>[]>(
    () => [
      {
        key: "cardNumber",
        header: t("receiptNumber"),
        headerIcon: FileText,
        cell: (card) => (
          <span className="font-semibold text-text-primary" dir="ltr">
            {card.cardNumber}
          </span>
        ),
      },
      {
        key: "customer",
        header: t("list.customer"),
        headerIcon: User,
        cell: (card) => card.customer.name,
      },
      {
        key: "vehicle",
        header: t("list.vehicle"),
        headerIcon: Car,
        cell: (card) => (
          <span>
            {card.vehicle.make} {card.vehicle.model}
            <span className="text-text-muted" dir="ltr">
              {" "}({card.vehicle.plateNumber})
            </span>
          </span>
        ),
      },
      {
        key: "status",
        header: t("status"),
        headerIcon: Wrench,
        cell: (card) => (
          <StatusBadge status={card.status} label={t(`statuses.${card.status}`)} />
        ),
      },
      {
        key: "receivedAt",
        header: t("receivedAt"),
        headerIcon: CalendarDays,
        cell: (card) => (
          <span className="text-text-muted" dir="auto">
            {formatDate(card.receivedAt, locale)}
          </span>
        ),
      },
    ],
    [locale, t],
  )

  const tablePagination =
    pagination && onPageChange
      ? {
          total: pagination.total,
          page: pagination.page,
          lastPage: pagination.totalPages,
          perPage: pagination.perPage ?? 10,
        }
      : undefined

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-background-card shadow-[0_8px_30px_rgba(15,23,42,0.045)]">
      <DataTable<MaintenanceCardListRow>
        data={cards}
        columns={columns}
        loading={loading}
        pagination={tablePagination}
        onPageChange={onPageChange}
        getRowId={(card) => card.id}
        onRowClick={onRowClick}
        rowActions
        mobileCardComponent={MaintenanceMobileCard}
        emptyMessage={emptyMessage ?? t("list.noResults")}
        emptyState={emptyState}
        className="rounded-none border-0 bg-transparent"
      />
    </div>
  )
}
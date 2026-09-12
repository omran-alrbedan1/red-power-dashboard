import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  CalendarDays,
  ChevronRight,
  Phone,
  User,
  type LucideIcon,
} from "lucide-react"

import {
  DataTable,
  type Column,
} from "@/components/shared/custom/DataTable"
import { formatDate } from "@/lib/formatter"

import type { Customer } from "../types/customer.types"

interface CustomerTableProps {
  customers: Customer[]
  loading?: boolean

  onRowClick: (customer: Customer) => void

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

interface CustomerMobileCardProps {
  item: Customer
  onViewDetails: () => void
}

const getCustomerInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return "?"
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }

  return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
}

const CustomerMobileCard: React.FC<CustomerMobileCardProps> = ({
  item,
  onViewDetails,
}) => {
  const { t, i18n } = useTranslation("customers")

  const locale = i18n.language.startsWith("ar")
    ? "ar-SA"
    : "en-GB"

  return (
    <button
      type="button"
      onClick={onViewDetails}
      className="
        group relative w-full overflow-hidden
        rounded-2xl
        border border-border/60
        bg-background-card
        p-4 text-start
        shadow-[0_6px_20px_rgba(15,23,42,0.04)]
        transition-colors
        hover:border-primary/20
        hover:bg-background-secondary/40
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary
      "
    >
      {/* decorative accent */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -bottom-12 -end-10
          h-28 w-28
          rounded-full
          bg-primary/[0.06]
          blur-2xl
        "
      />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-xl
                bg-primary/10
                text-sm font-bold
                text-primary
              "
            >
              {getCustomerInitials(item.name)}
            </div>

            <div className="min-w-0">
              <p
                className="
                  truncate text-sm font-semibold
                  text-text-primary
                "
              >
                {item.name}
              </p>

              <div
                className="
                  mt-1 flex items-center gap-1.5
                  text-xs text-text-muted
                "
              >
                <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />

                <span dir="ltr">
                  {item.phone}
                </span>
              </div>
            </div>
          </div>

          <div
            className="
              flex h-8 w-8 shrink-0
              items-center justify-center
              rounded-full
              bg-background-secondary
              text-text-muted
              group-hover:bg-primary/10
              group-hover:text-primary
            "
          >
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </div>
        </div>

        <div
          className="
            mt-4 flex items-center justify-between
            border-t border-border/50
            pt-3
          "
        >
          <div
            className="
              flex items-center gap-2
              text-xs text-text-muted
            "
          >
            <CalendarDays className="h-3.5 w-3.5 text-primary" />

            <span>
              {t(
                "table.createdAt",
                "Created at",
              )}
            </span>
          </div>

          <span
            className="
              text-xs font-medium
              text-text-secondary
            "
            dir="ltr"
          >
            {formatDate(
              item.createdAt,
              locale,
            )}
          </span>
        </div>
      </div>
    </button>
  )
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading = false,

  onRowClick,

  pagination,
  onPageChange,

  emptyMessage,
  emptyState,
}) => {
  const { t, i18n } = useTranslation("customers")

  const locale = i18n.language.startsWith("ar")
    ? "ar-SA"
    : "en-GB"

  const columns = useMemo<Column<Customer>[]>(
    () => [
      {
        key: "name",

        header: t(
          "table.name",
          "Name",
        ),

        headerIcon: User,

        cell: (customer) => (
          <div className="flex min-w-0 items-center gap-3">
            <div
              className="
                flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-full
                bg-primary/10
                text-xs font-bold
                text-primary
              "
            >
              {getCustomerInitials(
                customer.name,
              )}
            </div>

            <span
              className="
                truncate font-semibold
                text-text-primary
              "
            >
              {customer.name}
            </span>
          </div>
        ),
      },

      {
        key: "phone",

        header: t(
          "table.phone",
          "Phone",
        ),

        headerIcon: Phone,

        cell: (customer) => (
          <div
            className="
              flex items-center  gap-2
              text-text-muted
            "
          >
            <Phone className="h-3.5 w-3.5 text-primary/70" />

            <span>
              {customer.phone}
            </span>
          </div>
        ),
      },

      {
        key: "createdAt",

        header: t(
          "table.createdAt",
          "Created at",
        ),

        headerIcon: CalendarDays,

        cell: (customer) => (
          <div
            className="
              flex items-center gap-2
              whitespace-nowrap
              text-text-muted
            "
          >
            <CalendarDays className="h-3.5 w-3.5 text-primary/70" />

            <span dir="ltr">
              {formatDate(
                customer.createdAt,
                locale,
              )}
            </span>
          </div>
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
          perPage:
            pagination.perPage ?? 10,
        }
      : undefined

  return (
    <div
      className="
        overflow-hidden rounded-xl
        border border-border/60
        bg-background-card
        shadow-[0_8px_30px_rgba(15,23,42,0.045)]
      "
    >
      <DataTable<Customer>
        data={customers}
        columns={columns}
        loading={loading}
        pagination={tablePagination}
        onPageChange={onPageChange}
        getRowId={(customer) =>
          customer.id
        }
        onRowClick={onRowClick}
        rowActions
        mobileCardComponent={
          CustomerMobileCard
        }
        emptyMessage={
          emptyMessage ??
          t(
            "empty",
            "No customers found",
          )
        }
        emptyState={emptyState}
        className="
          rounded-none
          border-0
          bg-transparent
        "
      />
    </div>
  )
}
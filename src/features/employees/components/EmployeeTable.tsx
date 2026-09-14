import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  Ban,
  CalendarDays,
  ChevronRight,
  CircleCheck,
  Mail,
  Power,
  ShieldCheck,
  User,
  type LucideIcon,
} from "lucide-react"

import {
  DataTable,
  type Column,
} from "@/components/shared/custom/DataTable"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/formatter"

import type { AppRole } from "@/features/auth/types/auth.types"
import {
  getEmployeeFullName,
  type Employee,
} from "../types/employee.types"
import { EmployeeStatusBadge } from "./EmployeeStatusBadge"

type EmployeeStatusMode = "activate" | "deactivate"

interface EmployeeTableProps {
  employees: Employee[]
  loading?: boolean
  onToggleStatus: (employee: Employee, mode: EmployeeStatusMode) => void

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

interface EmployeeMobileCardProps {
  item: Employee
  onViewDetails: () => void
  t: (key: string) => string
  isAr: boolean
}

const getEmployeeInitials = (employee: Employee) => {
  const name = getEmployeeFullName(employee)
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

const getRoleLabel = (role: AppRole, t: (key: string) => string) =>
  role === "SUPER_ADMIN" ? t("roles.superAdmin") : t("roles.admin")

const EmployeeMobileCard: React.FC<EmployeeMobileCardProps> = ({
  item,
  onViewDetails,
}) => {
  const { t, i18n } = useTranslation("employees")

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
              {getEmployeeInitials(item)}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">
                {getEmployeeFullName(item)}
              </p>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
                <Mail className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span dir="ltr">{item.email}</span>
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

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border/50 pt-3">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>{getRoleLabel(item.role, t)}</span>
          </div>

          <EmployeeStatusBadge
            isActive={item.isActive}
            label={t(item.isActive ? "status.active" : "status.inactive")}
          />

          <div className="ms-auto flex items-center gap-1.5 text-xs text-text-muted">
            <CalendarDays className="h-3.5 w-3.5 text-primary" />
            <span dir="ltr">
              {formatDate(item.createdAt, locale)}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  loading = false,
  onToggleStatus,
  pagination,
  onPageChange,
  emptyMessage,
  emptyState,
}) => {
  const { t, i18n } = useTranslation("employees")

  const locale = i18n.language.startsWith("ar")
    ? "ar-SA"
    : "en-GB"

  const columns = useMemo<Column<Employee>[]>(
    () => [
      {
        key: "name",
        header: t("table.name", "Name"),
        headerIcon: User,
        cell: (employee) => (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {getEmployeeInitials(employee)}
            </div>

            <span className="truncate font-semibold text-text-primary">
              {getEmployeeFullName(employee)}
            </span>
          </div>
        ),
      },

      {
        key: "email",
        header: t("table.email", "Email"),
        headerIcon: Mail,
        cell: (employee) => (
          <div className="flex items-center gap-2 text-text-muted">
            <Mail className="h-3.5 w-3.5 text-primary/70" />

            <span dir="ltr">{employee.email}</span>
          </div>
        ),
      },

      {
        key: "role",
        header: t("table.role", "Role"),
        headerIcon: ShieldCheck,
        cell: (employee) => (
          <div className="flex items-center gap-2 text-text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-primary/70" />

            <span>{getRoleLabel(employee.role, t)}</span>
          </div>
        ),
      },

      {
        key: "status",
        header: t("table.status", "Status"),
        headerIcon: CircleCheck,
        cell: (employee) => (
          <EmployeeStatusBadge
            isActive={employee.isActive}
            label={t(employee.isActive ? "status.active" : "status.inactive")}
          />
        ),
      },

      {
        key: "createdAt",
        header: t("table.createdAt", "Created At"),
        headerIcon: CalendarDays,
        cell: (employee) => (
          <div className="flex items-center gap-2 whitespace-nowrap text-text-muted">
            <CalendarDays className="h-3.5 w-3.5 text-primary/70" />

            <span dir="ltr">
              {formatDate(employee.createdAt, locale)}
            </span>
          </div>
        ),
      },

      {
        key: "actions",
        header: t("table.actions", "Actions"),
        align: "end",
        cell: (employee) =>
          employee.isActive ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1 text-text-secondary"
              onClick={(event) => {
                event.stopPropagation()
                onToggleStatus(employee, "deactivate")
              }}
            >
              <Ban className="h-3.5 w-3.5" />
              {t("deactivate", "Deactivate")}
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1 border-green-500/25 text-green-600"
              onClick={(event) => {
                event.stopPropagation()
                onToggleStatus(employee, "activate")
              }}
            >
              <Power className="h-3.5 w-3.5" />
              {t("activate", "Activate")}
            </Button>
          ),
      },
    ],
    [locale, t, onToggleStatus],
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
      <DataTable<Employee>
        data={employees}
        columns={columns}
        loading={loading}
        pagination={tablePagination}
        onPageChange={onPageChange}
        onRowClick={(employee) =>
          onToggleStatus(employee, employee.isActive ? "deactivate" : "activate")
        }
        getRowId={(employee) => employee.id}
        mobileCardComponent={EmployeeMobileCard}
        emptyMessage={emptyMessage ?? t("empty", "No employees found")}
        emptyState={emptyState}
        className="rounded-none border-0 bg-transparent"
      />
    </div>
  )
}
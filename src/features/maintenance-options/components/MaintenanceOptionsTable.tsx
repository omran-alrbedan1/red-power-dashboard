import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  Activity,
  Ban,
  ChevronRight,
  Code,
  ListOrdered,
  ListPlus,
  Pencil,
  Power,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column, type DataTableProps } from "@/components/shared/custom/DataTable"
import { MaintenanceOptionStatusBadge } from "./MaintenanceOptionStatusBadge"
import type { MaintenanceOptionRow } from "../types/maintenance-option.types"

interface MaintenanceOptionsTableProps {
  options: MaintenanceOptionRow[]
  loading?: boolean
  statusPending?: boolean
  onEdit: (option: MaintenanceOptionRow) => void
  onToggleStatus: (option: MaintenanceOptionRow) => void
  onDelete: (option: MaintenanceOptionRow) => void
  pagination?: {
    total: number
    page: number
    totalPages: number
    perPage: number
  }
  onPageChange?: (page: number) => void
  emptyMessage?: string
  emptyState?: DataTableProps<MaintenanceOptionRow>["emptyState"]
}

const OptionsMobileCard: React.FC<{
  item: MaintenanceOptionRow
  onViewDetails: () => void
  statusPending?: boolean
  onEdit: () => void
  onToggleStatus: () => void
  onDelete: () => void
}> = ({
  item,
  onViewDetails,
  statusPending = false,
  onEdit,
  onToggleStatus,
  onDelete,
}) => {
  const { t } = useTranslation("maintenance-options")

  return (
    <div
      className="overflow-hidden rounded-2xl border border-border/60 bg-background-card shadow-[0_6px_20px_rgba(15,23,42,0.04)]"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={onViewDetails}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") onViewDetails()
        }}
        className="w-full p-4 text-start transition-colors hover:bg-background-secondary/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-text-primary">
              {item.labelAr}
            </p>

            <p className="mt-0.5 truncate text-xs text-text-muted" dir="ltr">
              {item.labelEn}
            </p>

            <p className="mt-1 font-mono text-xs text-text-muted" dir="ltr">
              {item.code}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <MaintenanceOptionStatusBadge
              isActive={item.isActive}
              label={t(item.isActive ? "status.active" : "status.inactive")}
            />
            <ChevronRight className="h-4 w-4 text-text-muted rtl:rotate-180" />
          </div>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
          <ListOrdered className="h-3.5 w-3.5 text-primary" />
          {t("table.displayOrder", "Display Order")}: {item.displayOrder}
        </p>
      </div>

      <div className="flex items-center gap-2 border-t border-border/50 px-4 py-2.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-text-secondary"
          onClick={onEdit}
        >
          <Pencil className="h-3.5 w-3.5" />
          {t("actions.edit", "Edit")}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={statusPending}
          className={
            item.isActive
              ? "h-8 gap-1 text-text-secondary"
              : "h-8 gap-1 border-green-500/25 text-green-600"
          }
          onClick={onToggleStatus}
        >
          {item.isActive ? (
            <Ban className="h-3.5 w-3.5" />
          ) : (
            <Power className="h-3.5 w-3.5" />
          )}
          {t(
            item.isActive ? "actions.deactivate" : "actions.activate",
            item.isActive ? "Deactivate" : "Activate",
          )}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ms-auto h-8 gap-1 border-red-500/25 text-red-600"
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" />
          {t("actions.delete", "Delete")}
        </Button>
      </div>
    </div>
  )
}

export const MaintenanceOptionsTable: React.FC<MaintenanceOptionsTableProps> = ({
  options,
  loading = false,
  statusPending = false,
  onEdit,
  onToggleStatus,
  onDelete,
  pagination,
  onPageChange,
  emptyMessage,
  emptyState,
}) => {
  const { t } = useTranslation("maintenance-options")

  const columns = useMemo<Column<MaintenanceOptionRow>[]>(
    () => [
      {
        key: "label",
        header: t("table.name", "Name"),
        headerIcon: ListPlus,
        cell: (option) => (
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ListPlus className="h-4 w-4" />
            </div>

            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate font-semibold text-text-primary">
                {option.labelAr}
              </span>

              <span
                className="truncate text-xs text-text-muted"
                dir="ltr"
              >
                {option.labelEn}
              </span>
            </div>
          </div>
        ),
      },

      {
        key: "code",
        header: t("table.code", "Code"),
        headerIcon: Code,
        cell: (option) => (
          <span
            className="inline-flex rounded-md bg-background-secondary px-2 py-0.5 font-mono text-xs text-text-secondary"
            dir="ltr"
          >
            {option.code}
          </span>
        ),
      },

      {
        key: "displayOrder",
        header: t("table.displayOrder", "Display Order"),
        headerIcon: ListOrdered,
        align: "end",
        cell: (option) => (
          <span className="tabular-nums text-text-secondary" dir="ltr">
            {option.displayOrder}
          </span>
        ),
      },

      {
        key: "status",
        header: t("table.status", "Status"),
        headerIcon: Activity,
        cell: (option) => (
          <MaintenanceOptionStatusBadge
            isActive={option.isActive}
            label={t(option.isActive ? "status.active" : "status.inactive")}
          />
        ),
      },

      {
        key: "actions",
        header: t("table.actions", "Actions"),
        align: "end",
        cell: (option) => (
          <div className="flex items-center justify-end gap-1.5">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-text-muted hover:text-primary"
              aria-label={t("actions.edit", "Edit")}
              title={t("actions.edit", "Edit")}
              onClick={(event) => {
                event.stopPropagation()
                onEdit(option)
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={statusPending}
              className={
                option.isActive
                  ? "h-8 w-8 p-0 text-text-muted hover:text-primary"
                  : "h-8 w-8 p-0 text-green-600 hover:text-green-500"
              }
              aria-label={t(
                option.isActive ? "actions.deactivate" : "actions.activate",
              )}
              title={t(
                option.isActive ? "actions.deactivate" : "actions.activate",
              )}
              onClick={(event) => {
                event.stopPropagation()
                onToggleStatus(option)
              }}
            >
              {option.isActive ? (
                <Ban className="h-3.5 w-3.5" />
              ) : (
                <Power className="h-3.5 w-3.5" />
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-text-muted hover:text-red-600"
              aria-label={t("actions.delete", "Delete")}
              title={t("actions.delete", "Delete")}
              onClick={(event) => {
                event.stopPropagation()
                onDelete(option)
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [t, statusPending, onEdit, onToggleStatus, onDelete],
  )

  const mobileCard = (props: {
    item: MaintenanceOptionRow
    onViewDetails: () => void
    t: (key: string) => string
    isAr: boolean
  }) => (
    <OptionsMobileCard
      item={props.item}
      onViewDetails={props.onViewDetails}
      statusPending={statusPending}
      onEdit={() => onEdit(props.item)}
      onToggleStatus={() => onToggleStatus(props.item)}
      onDelete={() => onDelete(props.item)}
    />
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
      <DataTable<MaintenanceOptionRow>
        data={options}
        columns={columns}
        loading={loading}
        pagination={tablePagination}
        onPageChange={onPageChange}
        onRowClick={onEdit}
        getRowId={(option) => option.id}
        mobileCardComponent={mobileCard}
        emptyMessage={emptyMessage ?? t("empty", "No options found")}
        emptyState={emptyState}
        className="rounded-none border-0 bg-transparent"
      />
    </div>
  )
}
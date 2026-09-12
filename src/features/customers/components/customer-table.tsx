import { useTranslation } from "react-i18next"
import { User, Phone, CalendarDays, ChevronLeft } from "lucide-react"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { formatDate } from "@/lib/formatter"
import type { Customer } from "../types/customer.types"

interface CustomerTableProps {
  customers: Customer[]
  loading?: boolean
  onRowClick: (customer: Customer) => void
  pagination?: { total: number; page: number; totalPages: number }
  onPageChange: (page: number) => void
  emptyMessage?: string
}

interface MobileCardProps {
  item: Customer
  onViewDetails: () => void
}

const CustomerMobileCard: React.FC<MobileCardProps> = ({
  item,
  onViewDetails,
}) => {
  const { i18n } = useTranslation("customers")
  const isAr = i18n.language === "ar"

  return (
    <button
      type="button"
      onClick={onViewDetails}
      className="w-full rounded-lg border border-border bg-card p-4 text-start shadow-sm transition-colors hover:bg-background-secondary"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {item.name}
            </p>
            <p className="text-xs text-text-muted" dir="ltr">
              {item.phone}
            </p>
          </div>
        </div>
        <ChevronLeft
          className={`h-5 w-5 text-text-muted ${isAr ? "rotate-180" : ""}`}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5 text-primary" />
          <span dir="ltr">
            {formatDate(item.createdAt, isAr ? "ar-SA" : "en-GB")}
          </span>
        </span>
      </div>
    </button>
  )
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading,
  onRowClick,
  pagination,
  onPageChange,
  emptyMessage,
}) => {
  const { t } = useTranslation("customers")

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: t("table.name"),
      headerIcon: User,
      cell: (customer) => (
        <span className="font-medium text-text-primary">{customer.name}</span>
      ),
    },
    {
      key: "phone",
      header: t("table.phone"),
      headerIcon: Phone,
      cell: (customer) => (
        <span dir="ltr" className="text-text-muted">
          {customer.phone}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: t("table.createdAt"),
      headerIcon: CalendarDays,
      cell: (customer) => (
        <span className="text-text-muted" dir="ltr">
          {formatDate(customer.createdAt)}
        </span>
      ),
    },
  ]

  const tablePagination = {
    total: pagination?.total ?? 0,
    page: pagination?.page ?? 1,
    lastPage: pagination?.totalPages ?? 0,
  }

  const MobileCard = (props: {
    item: Customer
    onViewDetails: () => void
    t: (key: string, options?: any) => string
    isAr: boolean
  }) => <CustomerMobileCard item={props.item} onViewDetails={props.onViewDetails} />

  return (
    <DataTable<Customer>
      data={customers}
      columns={columns}
      loading={loading}
      pagination={tablePagination}
      onPageChange={onPageChange}
      getRowId={(customer) => customer.id}
      onRowClick={onRowClick}
      rowActions
      mobileCardComponent={MobileCard}
      emptyMessage={emptyMessage}
    />
  )
}

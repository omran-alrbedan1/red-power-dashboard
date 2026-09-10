import { useTranslation } from "react-i18next"
import { User, Phone, CalendarDays, ChevronLeft } from "lucide-react"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/formatter"
import type { Customer } from "../types/customer.types"

interface CustomerTableProps {
  customers: Customer[]
  loading?: boolean
  onRowClick: (customer: Customer) => void
  emptyMessage?: string
  page: number
  total: number
  totalPages: number
  perPage: number
  onPageChange: (page: number) => void
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
      className="w-full rounded-lg border border-border bg-card p-4 text-start shadow-sm transition-colors hover:bg-muted/30"
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
            <p className="text-xs text-muted-foreground" dir="ltr">
              {item.phone}
            </p>
          </div>
        </div>
        <ChevronLeft
          className={`h-5 w-5 text-muted-foreground ${isAr ? "rotate-180" : ""}`}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5 text-primary" />
          {formatDate(item.createdAt, isAr ? "ar-SA" : "en-GB")}
        </span>
      </div>
    </button>
  )
}

export const CustomerTable: React.FC<CustomerTableProps> = ({
  customers,
  loading,
  onRowClick,
  emptyMessage,
  page,
  total,
  totalPages,
  perPage,
  onPageChange,
}) => {
  const { t } = useTranslation("customers")

  const columns: Column<Customer>[] = [
    {
      key: "status",
      header: t("table.status"),
      cell: (customer) => <Badge variant={customer.isActive ? "default" : "secondary"}>{t(customer.isActive ? "active" : "inactive")}</Badge>,
    },
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
        <span dir="ltr" className="text-muted-foreground">
          {customer.phone}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: t("table.createdAt"),
      headerIcon: CalendarDays,
      cell: (customer) => (
        <span className="text-muted-foreground">
          {formatDate(customer.createdAt)}
        </span>
      ),
    },
  ]

  const pagination = { total, page, lastPage: totalPages, perPage }

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
      pagination={pagination}
      onPageChange={onPageChange}
      getRowId={(customer) => customer.id}
      onRowClick={onRowClick}
      mobileCardComponent={MobileCard}
      emptyMessage={emptyMessage}
    />
  )
}

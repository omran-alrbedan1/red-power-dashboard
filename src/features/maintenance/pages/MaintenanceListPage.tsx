import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Wrench, Plus, FileText, User, Car, CalendarDays } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/shared/custom/DataTable"
import { CustomFilter } from "@/components/shared/custom/CustomFilter"
import { EmptyState } from "@/components/shared/states"
import ErrorState from "@/components/shared/states/ErrorState"
import { formatDate } from "@/lib/formatter"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { useMaintenanceCards } from "../hooks/useMaintenanceCards"
import { MaintenanceStatusBadge } from "../components/StatusBadge"
import {
  maintenanceFilterDefaultValues,
  maintenanceFilterFields,
  type MaintenanceFilterValues,
} from "../configs/maintenance-filter.config"
import type { MaintenanceCardListRow } from "../types/maintenance-detail.types"

const PAGE_LIMIT = 10

interface MobileCardProps {
  item: MaintenanceCardListRow
  onViewDetails: () => void
}

const MaintenanceMobileCard: React.FC<MobileCardProps> = ({
  item,
  onViewDetails,
}) => {
  const { i18n } = useTranslation("maintenance")
  const isAr = i18n.language === "ar"

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
        <MaintenanceStatusBadge status={item.status} />
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
          <span dir="ltr">
            {formatDate(item.receivedAt, isAr ? "ar-SA" : "en-GB")}
          </span>
        </p>
      </div>
    </button>
  )
}

const MaintenanceListPage: React.FC = () => {
  const { t, i18n } = useTranslation("maintenance")
  const navigate = useNavigate()
  const {
    values: filters,
    page,
    apply,
    setPage,
    reset,
    hasActive,
  } = useUrlFilters<MaintenanceFilterValues>({
    defaults: maintenanceFilterDefaultValues,
    dateRangeKeys: ["receivedAt"],
  })

  const range = filters?.receivedAt
  const cardsQuery = useMaintenanceCards({
    page,
    limit: PAGE_LIMIT,
    ...(filters?.search?.trim() ? { search: filters.search.trim() } : {}),
    ...(filters?.status ? { status: filters.status as MaintenanceCardListRow["status"] } : {}),
    ...(range?.from ? { receivedFrom: range.from.toISOString() } : {}),
    ...(range?.to ? { receivedTo: new Date(range.to.getTime() + 86400000).toISOString() } : {}),
  })

  const cards = cardsQuery.data?.items ?? []
  const meta = cardsQuery.data?.meta

  const columns: Column<MaintenanceCardListRow>[] = [
    {
      key: "cardNumber",
      header: t("receiptNumber"),
      headerIcon: FileText,
      cell: (c) => (
        <span className="font-medium text-text-primary" dir="ltr">
          {c.cardNumber}
        </span>
      ),
    },
    {
      key: "customer",
      header: t("list.customer"),
      headerIcon: User,
      cell: (c) => c.customer.name,
    },
    {
      key: "vehicle",
      header: t("list.vehicle"),
      headerIcon: Car,
      cell: (c) => (
        <span>
          {c.vehicle.make} {c.vehicle.model}
          <span className="text-text-muted" dir="ltr">
            {" "}({c.vehicle.plateNumber})
          </span>
        </span>
      ),
    },
    {
      key: "status",
      header: t("status"),
      headerIcon: Wrench,
      cell: (c) => <MaintenanceStatusBadge status={c.status} />,
    },
    {
      key: "receivedAt",
      header: t("receivedAt"),
      headerIcon: CalendarDays,
      cell: (c) => (
        <span className="text-text-muted" dir="ltr">
          {formatDate(c.receivedAt, i18n.language === "ar" ? "ar-SA" : "en-GB")}
        </span>
      ),
    },
  ]

  const pagination = {
    total: meta?.total ?? 0,
    page: meta?.page ?? 1,
    lastPage: meta?.totalPages ?? 1,
    perPage: meta?.limit ?? PAGE_LIMIT,
  }

  const MobileCard = (props: {
    item: MaintenanceCardListRow
    onViewDetails: () => void
    t: (key: string, options?: any) => string
    isAr: boolean
  }) => (
    <MaintenanceMobileCard
      item={props.item}
      onViewDetails={props.onViewDetails}
    />
  )

  if (cardsQuery.isError) {
    return <ErrorState variant="default" retry={() => cardsQuery.refetch()} />
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        rightContent={
          <Button onClick={() => navigate("/maintenance/new")} className="gap-1.5">
            <Plus className="h-4 w-4" />
            {t("addCard")}
          </Button>
        }
      />

      <CustomFilter<MaintenanceFilterValues>
        filters={maintenanceFilterFields(t)}
        onApplyFilters={apply}
        onResetFilters={reset}
        defaultValues={maintenanceFilterDefaultValues}
        initialFilters={filters}
        isLoading={cardsQuery.isFetching}
        title={t("filter.title")}
      />

      {cards.length === 0 && !cardsQuery.isLoading ? (
        <EmptyState
          icon={Wrench}
          title={hasActive ? t("list.noResults") : t("empty")}
          description={t("subtitle")}
          primaryAction={
            hasActive
              ? undefined
              : { label: t("addCard"), icon: Plus, onClick: () => navigate("/maintenance/new") }
          }
        />
      ) : (
        <DataTable<MaintenanceCardListRow>
          data={cards}
          columns={columns}
          loading={cardsQuery.isLoading}
          pagination={pagination}
          onPageChange={setPage}
          getRowId={(c) => c.id}
          onRowClick={(c) => navigate(`/maintenance/${c.id}`)}
          rowActions
          mobileCardComponent={MobileCard}
          emptyMessage={t("list.noResults")}
        />
      )}
    </div>
  )
}

export default MaintenanceListPage
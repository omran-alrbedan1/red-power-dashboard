import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Wrench, Plus } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Button } from "@/components/ui/button"
import { CustomFilter } from "@/components/shared/custom/CustomFilter"
import ErrorState from "@/components/shared/states/ErrorState"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { useMaintenanceCards } from "../hooks/useMaintenanceCards"
import { MaintenanceTable } from "../components/MaintenanceTable"
import {
  maintenanceFilterDefaultValues,
  maintenanceFilterFields,
  type MaintenanceFilterValues,
} from "../configs/maintenance-filter.config"
import type { MaintenanceCardListRow } from "../types/maintenance-detail.types"
import { images } from "@/constants/images"

const PAGE_LIMIT = 10

const MaintenanceListPage: React.FC = () => {
  const { t } = useTranslation("maintenance")
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

  const pagination = {
    total: meta?.total ?? 0,
    page: meta?.page ?? 1,
    totalPages: meta?.totalPages ?? 1,
    perPage: meta?.limit ?? PAGE_LIMIT,
  }

  if (cardsQuery.isError) {
    return <ErrorState variant="default" retry={() => cardsQuery.refetch()} />
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        backgroundImage={images.maintenanceHero}
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

      <MaintenanceTable
        cards={cards}
        loading={cardsQuery.isLoading}
        onRowClick={(card) => navigate(`/maintenance/${card.id}`)}
        pagination={pagination}
        onPageChange={setPage}
        emptyMessage={t("list.noResults")}
        emptyState={{
          icon: Wrench,
          title: hasActive ? t("list.noResults") : t("empty"),
          description: t("subtitle"),
          primaryAction: hasActive
            ? undefined
            : { label: t("addCard"), icon: Plus, onClick: () => navigate("/maintenance/new") },
        }}
      />
    </div>
  )
}

export default MaintenanceListPage
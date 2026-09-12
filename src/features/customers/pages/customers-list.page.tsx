import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Users, Plus } from "lucide-react"
import PageHeader from "@/components/shared/headers/PageHeader"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/states"
import ErrorState from "@/components/shared/states/ErrorState"
import { CustomerFilter } from "../components/customer-filter"
import { CustomerTable } from "../components/customer-table"
import { useCustomers } from "../hooks/useCustomers"
import type { CustomerFilterValues } from "../configs/customer-filter.config"
import type { Customer } from "../types/customer.types"

const isEmptyFilter = (filters: CustomerFilterValues) =>
  !Object.values(filters).some((v) => v.trim() !== "")

const CustomersListPage: React.FC = () => {
  const { t } = useTranslation("customers")
  const navigate = useNavigate()
  const [activeFilters, setActiveFilters] = useState<CustomerFilterValues>()
  const [page, setPage] = useState(1)
  const limit = 20

  const appliedFilters = useMemo(
    () =>
      activeFilters && !isEmptyFilter(activeFilters)
        ? activeFilters
        : undefined,
    [activeFilters],
  )

  const customersQuery = useCustomers(page, limit, appliedFilters)

  const customers = customersQuery.data?.items ?? []

  const handleRowClick = (customer: Customer) =>
    navigate(`/customers/${customer.id}`)

  const handleApply = (values: CustomerFilterValues) => { setPage(1); setActiveFilters(values) }

  const handleReset = () => { setPage(1); setActiveFilters(undefined) }

  if (customersQuery.isError) {
    return (
      <ErrorState
        variant="default"
        retry={() => {
          customersQuery.refetch()
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("title")}
        description={t("subtitle")}
        rightContent={
          <Button onClick={() => navigate("/customers/new")} className="gap-1.5">
            <Plus className="h-4 w-4" />
            {t("addCustomer")}
          </Button>
        }
      />

      <CustomerFilter
        onApply={handleApply}
        onReset={handleReset}
        isLoading={customersQuery.isFetching}
      />

      {customers.length === 0 ? (
        <EmptyState
          icon={Users}
          title={
            appliedFilters ? t("noResults") : t("empty")
          }
          description={t("subtitle")}
          primaryAction={
            appliedFilters
              ? undefined
              : {
                  label: t("addCustomer"),
                  icon: Plus,
                  onClick: () => navigate("/customers/new"),
                }
          }
        />
      ) : (
        <CustomerTable
          customers={customers}
          loading={customersQuery.isLoading}
          onRowClick={handleRowClick}
          pagination={customersQuery.data?.meta}
          onPageChange={setPage}
          emptyMessage={t("noResults")}
        />
      )}
    </div>
  )
}

export default CustomersListPage

import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import {  Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { CustomerFilter } from "../components/CustomerFilter"
import { CustomerTable } from "../components/CustomerTable"
import { useCustomers } from "../hooks/useCustomers"
import { customerFilterDefaultValues } from "../configs/customer-filter.config"
import type { Customer } from "../types/customer.types"
import { images } from "@/constants/images"

const CustomersListPage: React.FC = () => {
  const { t } = useTranslation("customers")
  const navigate = useNavigate()
  const { values: filters, page, apply, setPage, reset, hasActive } = useUrlFilters({
    defaults: customerFilterDefaultValues,
  })
  const limit = 20

  const customersQuery = useCustomers(
    page,
    limit,
    hasActive ? filters : undefined,
  )

  const customers = customersQuery.data?.items ?? []

  const handleRowClick = (customer: Customer) =>
    navigate(`/customers/${customer.id}`)

  if (customersQuery.isError) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader
          title={t("title", "Customers")}
          description={t(
            "subtitle",
            "Manage customer profiles and their vehicles",
          )}
          backgroundImage={images.customersHero}
          showDateTime
        />
        <ErrorState
          variant="default"
          retry={() => {
            customersQuery.refetch()
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("title", "Customers")}
        description={t(
          "subtitle",
          "Manage customer profiles and their vehicles",
        )}
        backgroundImage={images.customersHero}
        showDateTime
        rightContent={
          <Button
            onClick={() => navigate("/customers/new")}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("addCustomer")}
          </Button>
        }
      />

      <CustomerFilter
        onApply={apply}
        onReset={reset}
        initialFilters={filters}
        isLoading={customersQuery.isFetching}
      />

      <CustomerTable
        customers={customers}
        loading={customersQuery.isLoading}
        onRowClick={handleRowClick}
        pagination={customersQuery.data?.meta}
        onPageChange={setPage}
        emptyMessage={t("noResults")}
        emptyState={{
          imageUrl: images.emptyCustomers,
          title: hasActive ? t("noResults") : t("empty"),
          description: t("subtitle"),
          primaryAction: hasActive
            ? undefined
            : {
                label: t("addCustomer"),
                icon: Plus,
                onClick: () => navigate("/customers/new"),
              },
        }}
      />
    </div>
  )
}

export default CustomersListPage

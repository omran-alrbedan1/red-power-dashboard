import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Plus, UserRoundCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import PageHeader from "@/components/shared/headers/PageHeader"
import ErrorState from "@/components/shared/states/ErrorState"
import { useUrlFilters } from "@/hooks/useUrlFilters"
import { images } from "@/constants/images"
import { EmployeeFilters } from "../components/EmployeeFilters"
import { EmployeeTable } from "../components/EmployeeTable"
import { EmployeeStatusDialog } from "../components/EmployeeStatusDialog"
import {
  useEmployees,
  useActivateEmployee,
  useDeactivateEmployee,
} from "../hooks/useEmployees"
import {
  employeeFilterDefaultValues,
  type EmployeeFilterValues,
} from "../configs/employee-filter.config"
import type { Employee } from "../types/employee.types"

type EmployeeStatusMode = "activate" | "deactivate"

interface StatusTarget {
  employee: Employee
  mode: EmployeeStatusMode
}

const PAGE_LIMIT = 20

const EmployeesPage: React.FC = () => {
  const { t } = useTranslation("employees")
  const navigate = useNavigate()
  const { values: filters, page, apply, setPage, reset, hasActive } =
    useUrlFilters<EmployeeFilterValues>({
      defaults: employeeFilterDefaultValues,
    })

  const [statusTarget, setStatusTarget] = useState<StatusTarget | null>(null)

  const employeesQuery = useEmployees(
    page,
    PAGE_LIMIT,
    hasActive ? filters : undefined,
  )
  const activateEmployee = useActivateEmployee()
  const deactivateEmployee = useDeactivateEmployee()

  const employees = employeesQuery.data?.items ?? []
  const meta = employeesQuery.data?.meta

  const pagination = {
    total: meta?.total ?? 0,
    page: meta?.page ?? 1,
    totalPages: meta?.totalPages ?? 1,
    perPage: meta?.limit ?? PAGE_LIMIT,
  }

  const statusPending = activateEmployee.isPending || deactivateEmployee.isPending

  const handleToggleStatus = (employee: Employee, mode: EmployeeStatusMode) => {
    setStatusTarget({ employee, mode })
  }

  const handleStatusConfirm = () => {
    if (!statusTarget) return

    const { employee, mode } = statusTarget
    const mutation = mode === "activate" ? activateEmployee : deactivateEmployee

    mutation.mutate(employee.id, {
      onSettled: () => setStatusTarget(null),
    })
  }

  if (employeesQuery.isError) {
    return (
      <div className="flex flex-col gap-4">
        <PageHeader
          title={t("title", "Employees")}
          description={t("subtitle", "Manage garage staff accounts")}
          backgroundImage={images.employeesHero}
          showDateTime
        />
        <ErrorState
          variant="default"
          title={t("messages.loadFailed", "Unable to load employees")}
          retry={() => employeesQuery.refetch()}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t("title", "Employees")}
        description={t("subtitle", "Manage garage staff accounts")}
          backgroundImage={images.employeesHero}
        showDateTime
        rightContent={
          <Button onClick={() => navigate("/employees/new")} className="gap-1.5">
            <Plus className="h-4 w-4" />
            {t("addEmployee", "Add Employee")}
          </Button>
        }
      />

      <EmployeeFilters
        onApply={apply}
        onReset={reset}
        initialFilters={filters}
        isLoading={employeesQuery.isFetching}
      />

      <EmployeeTable
        employees={employees}
        loading={employeesQuery.isLoading}
        onToggleStatus={handleToggleStatus}
        pagination={pagination}
        onPageChange={setPage}
        emptyMessage={t("noResults")}
        emptyState={{
          icon: UserRoundCog,
          title: hasActive ? t("noResults") : t("empty"),
          description: t("subtitle"),
          primaryAction: hasActive
            ? undefined
            : {
                label: t("addEmployee"),
                icon: Plus,
                onClick: () => navigate("/employees/new"),
              },
        }}
      />

      <EmployeeStatusDialog
        open={statusTarget !== null}
        mode={statusTarget?.mode ?? "activate"}
        employeeName={statusTarget?.employee ? `${statusTarget.employee.firstName} ${statusTarget.employee.lastName}` : ""}
        onConfirm={handleStatusConfirm}
        onClose={() => setStatusTarget(null)}
        isSubmitting={statusPending}
      />
    </div>
  )
}

export default EmployeesPage
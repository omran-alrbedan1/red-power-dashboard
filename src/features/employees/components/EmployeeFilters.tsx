import { useTranslation } from "react-i18next"
import { CustomFilter } from "@/components/shared/custom/CustomFilter"
import {
  employeeFilterDefaultValues,
  employeeFilterFields,
  type EmployeeFilterValues,
} from "../configs/employee-filter.config"

interface EmployeeFiltersProps {
  onApply: (values: EmployeeFilterValues) => void
  onReset: () => void
  isLoading?: boolean
  initialFilters?: Partial<EmployeeFilterValues>
}

export const EmployeeFilters: React.FC<EmployeeFiltersProps> = ({
  onApply,
  onReset,
  isLoading,
  initialFilters,
}) => {
  const { t } = useTranslation("employees")
  const { t: tCommon } = useTranslation()

  return (
    <CustomFilter<EmployeeFilterValues>
      filters={employeeFilterFields(t)}
      onApplyFilters={onApply}
      onResetFilters={onReset}
      defaultValues={employeeFilterDefaultValues}
      initialFilters={initialFilters}
      isLoading={isLoading}
      title={tCommon("common.filters")}
    />
  )
}
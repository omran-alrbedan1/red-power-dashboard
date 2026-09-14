import { useTranslation } from "react-i18next"
import { CustomFilter } from "@/components/shared/custom/CustomFilter"
import {
  maintenanceOptionFilterDefaultValues,
  maintenanceOptionFilterFields,
  type MaintenanceOptionFilterValues,
} from "../configs/maintenance-option-filter.config"

interface MaintenanceOptionFiltersProps {
  onApply: (values: MaintenanceOptionFilterValues) => void
  onReset: () => void
  isLoading?: boolean
  initialFilters?: Partial<MaintenanceOptionFilterValues>
}

export const MaintenanceOptionFilters: React.FC<MaintenanceOptionFiltersProps> = ({
  onApply,
  onReset,
  isLoading,
  initialFilters,
}) => {
  const { t } = useTranslation("maintenance-options")
  const { t: tCommon } = useTranslation()

  return (
    <CustomFilter<MaintenanceOptionFilterValues>
      filters={maintenanceOptionFilterFields(t)}
      onApplyFilters={onApply}
      onResetFilters={onReset}
      defaultValues={maintenanceOptionFilterDefaultValues}
      initialFilters={initialFilters}
      isLoading={isLoading}
      title={tCommon("common.filters")}
    />
  )
}